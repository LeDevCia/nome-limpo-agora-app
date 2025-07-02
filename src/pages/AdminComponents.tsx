import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { UserProfile } from '@/types';

interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  message: string;
  status: string;
  created_at: string;
}

interface Debt {
  id: string;
  cpf: string | null;
  cnpj: string | null;
  amount: number;
  creditor: string;
  due_date: string;
  status: string;
  description: string;
}

interface Stats {
  total: number;
  pendente: number;
  em_analise: number;
  proposals_available: number;
  finalizado: number;
  cancelado: number;
}

export const AdminComponents = () => {
  const { isAuthenticated, isAdmin, loading } = useAuth();
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [loadingData, setLoadingData] = useState(true);
  const [analyzingUser, setAnalyzingUser] = useState<string | null>(null);
  const [stats, setStats] = useState<Stats>({
    total: 0,
    pendente: 0,
    em_analise: 0,
    proposals_available: 0,
    finalizado: 0,
    cancelado: 0,
  });

  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate('/');
    } else if (!loading && isAuthenticated && isAdmin) {
      fetchUsers();
      fetchMessages();
      fetchStats();
    }
  }, [isAuthenticated, isAdmin, loading]);

  const fetchUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      setUsers(data || []);
    } catch (error) {
      console.error('Erro ao buscar usuários:', error);
      toast({ title: 'Erro', description: 'Erro ao carregar usuários', variant: 'destructive' });
    } finally {
      setLoadingData(false);
    }
  };

  const fetchMessages = async () => {
    try {
      const { data, error } = await supabase
        .from('contact_messages')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      setMessages(data || []);
    } catch (error) {
      console.error('Erro ao buscar mensagens:', error);
    }
  };

  const fetchStats = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('status');

      if (error) throw error;

      const total = data?.length || 0;
      const countBy = (status: string) => data?.filter(u => u.status === status).length || 0;

      setStats({
        total,
        pendente: countBy('pendente'),
        em_analise: countBy('em_analise'),
        proposals_available: countBy('proposals_available'),
        finalizado: countBy('finalizado'),
        cancelado: countBy('cancelado'),
      });
    } catch (error) {
      console.error('Erro ao buscar estatísticas:', error);
    }
  };

  const updateUserStatus = async (userId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ status: newStatus })
        .eq('id', userId);

      if (error) throw error;

      setUsers(users.map(u => (u.id === userId ? { ...u, status: newStatus } : u)));
      fetchStats();

      toast({ title: 'Sucesso', description: 'Status do usuário atualizado com sucesso' });
    } catch (error) {
      console.error('Erro ao atualizar status:', error);
      toast({ title: 'Erro', description: 'Erro ao atualizar status do usuário', variant: 'destructive' });
    }
  };

  const updateMessageStatus = async (messageId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('contact_messages')
        .update({ status: newStatus })
        .eq('id', messageId);

      if (error) throw error;

      setMessages(messages.map(m => (m.id === messageId ? { ...m, status: newStatus } : m)));

      toast({ title: 'Sucesso', description: 'Status da mensagem atualizado com sucesso' });
    } catch (error) {
      console.error('Erro ao atualizar mensagem:', error);
      toast({ title: 'Erro', description: 'Erro ao atualizar status da mensagem', variant: 'destructive' });
    }
  };

  const analyzeUserDebts = async (userId: string, document: string) => {
    setAnalyzingUser(userId);

    try {
      if (!document) throw new Error('Documento não fornecido');
      const normalized = document.replace(/\D/g, '');
      const isCpf = normalized.length === 11;
      const queryParam = isCpf ? `cpf=${normalized}` : `cnpj=${normalized}`;

      const response = await fetch(`http://localhost:3000/api/debts?${queryParam}`);
      const result = await response.json();

      if (!result.success) throw new Error(result.error || 'Erro na consulta');

      const debts: Debt[] = result.data;

      await supabase.from('debts').delete().eq('user_id', userId);

      await supabase.from('profiles').update({ status: 'em_analise' }).eq('id', userId);

      if (debts.length > 0) {
        await supabase.from('debts').insert(
          debts.map(d => ({
            user_id: userId,
            document: isCpf ? d.cpf : d.cnpj,
            amount: d.amount,
            creditor: d.creditor,
            due_date: new Date(d.due_date).toISOString().split('T')[0],
            status: d.status,
            created_at: new Date().toISOString(),
          }))
        );
      }

      setUsers(users.map(u => (u.id === userId ? { ...u, status: 'em_analise' } : u)));
      fetchStats();

      toast({ title: 'Análise Concluída', description: `Encontradas ${debts.length} dívidas.` });
      navigate(`/admin/user/${userId}`);
    } catch (error: any) {
      console.error('Erro na análise de dívidas:', error);
      toast({ title: 'Erro', description: error.message || 'Erro desconhecido', variant: 'destructive' });
    } finally {
      setAnalyzingUser(null);
    }
  };

  const deleteUser = async (userId: string) => {
    if (!confirm('Tem certeza que deseja excluir este usuário?')) return;

    try {
      const { error } = await supabase.from('profiles').delete().eq('id', userId);
      if (error) throw error;

      setUsers(users.filter(u => u.id !== userId));
      fetchStats();

      toast({ title: 'Sucesso', description: 'Usuário excluído com sucesso' });
    } catch (error) {
      console.error('Erro ao excluir usuário:', error);
      toast({ title: 'Erro', description: 'Erro ao excluir usuário', variant: 'destructive' });
    }
  };

  const filteredUsers = users.filter(user => {
    const matchText = searchTerm.toLowerCase();
    const matchDoc = searchTerm.replace(/\D/g, '');
    return (
      user.name?.toLowerCase().includes(matchText) ||
      user.email?.toLowerCase().includes(matchText) ||
      user.document?.includes(matchDoc)
    ) && (statusFilter === 'all' || user.status === statusFilter);
  });

  const getStatusBadge = (status: string | null) => {
    const map = {
      pendente: ['bg-yellow-100 text-yellow-800', 'Pendente'],
      em_analise: ['bg-blue-100 text-blue-800', 'Em Análise'],
      proposals_available: ['bg-purple-100 text-purple-800', 'Propostas Disponíveis'],
      finalizado: ['bg-green-100 text-green-800', 'Finalizado'],
      cancelado: ['bg-red-100 text-red-800', 'Cancelado']
    };
    const [cls, txt] = map[status as keyof typeof map] || map.pendente;
    return <Badge className={`px-2 py-1 text-xs font-medium ${cls}`}>{txt}</Badge>;
  };

  const getMessageStatusBadge = (status: string) => {
    const map = {
      novo: ['bg-blue-100 text-blue-800', 'Novo'],
      em_andamento: ['bg-yellow-100 text-yellow-800', 'Em Andamento'],
      respondido: ['bg-green-100 text-green-800', 'Respondido']
    };
    const [cls, txt] = map[status as keyof typeof map] || map.novo;
    return <Badge className={`px-2 py-1 text-xs font-medium ${cls}`}>{txt}</Badge>;
  };

  return {
    users,
    messages,
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
    loadingData,
    analyzingUser,
    stats,
    filteredUsers,
    updateUserStatus,
    updateMessageStatus,
    analyzeUserDebts,
    deleteUser,
    getStatusBadge,
    getMessageStatusBadge
  };
};
