
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useNavigate, Link } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { Search, Eye, FileSearch, Users, Clock, BarChart3, CheckCircle, UserCheck, Mail, Phone, Trash2 } from 'lucide-react';
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
    cancelado: 0
  });
  
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (!loading && (!isAuthenticated || !isAdmin)) {
      navigate('/');
      return;
    }

    if (isAuthenticated && isAdmin) {
      fetchUsers();
      fetchMessages();
      fetchStats();
    }
  }, [isAuthenticated, isAdmin, loading, navigate]);

  const fetchUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching users:', error);
        toast({
          title: "Erro",
          description: "Erro ao carregar usuários",
          variant: "destructive"
        });
        return;
      }

      setUsers(data || []);
    } catch (error) {
      console.error('Error fetching users:', error);
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

      if (error) {
        console.error('Error fetching messages:', error);
        return;
      }

      setMessages(data || []);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const fetchStats = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('status');

      if (error) {
        console.error('Error fetching stats:', error);
        return;
      }

      const total = data?.length || 0;
      const pendente = data?.filter(user => user.status === 'pendente').length || 0;
      const em_analise = data?.filter(user => user.status === 'em_analise').length || 0;
      const proposals_available = data?.filter(user => user.status === 'proposals_available').length || 0;
      const finalizado = data?.filter(user => user.status === 'finalizado').length || 0;
      const cancelado = data?.filter(user => user.status === 'cancelado').length || 0;

      setStats({
        total,
        pendente,
        em_analise,
        proposals_available,
        finalizado,
        cancelado
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const updateUserStatus = async (userId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ status: newStatus })
        .eq('id', userId);

      if (error) {
        console.error('Error updating user status:', error);
        toast({
          title: "Erro",
          description: "Erro ao atualizar status do usuário",
          variant: "destructive"
        });
        return;
      }

      // Update local state
      setUsers(users.map(user => 
        user.id === userId ? { ...user, status: newStatus } : user
      ));

      // Update stats
      fetchStats();

      toast({
        title: "Sucesso",
        description: "Status do usuário atualizado com sucesso",
      });
    } catch (error) {
      console.error('Error updating user status:', error);
    }
  };

  const updateMessageStatus = async (messageId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('contact_messages')
        .update({ status: newStatus })
        .eq('id', messageId);

      if (error) {
        console.error('Error updating message status:', error);
        toast({
          title: "Erro",
          description: "Erro ao atualizar status da mensagem",
          variant: "destructive"
        });
        return;
      }

      // Update local state
      setMessages(messages.map(message => 
        message.id === messageId ? { ...message, status: newStatus } : message
      ));

      toast({
        title: "Sucesso",
        description: "Status da mensagem atualizado com sucesso",
      });
    } catch (error) {
      console.error('Error updating message status:', error);
    }
  };

  const analyzeUserDebts = async (userId: string, document: string) => {
    setAnalyzingUser(userId);
    
    try {
      // Simulate debt analysis
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast({
        title: "Análise Concluída",
        description: "Análise de dívidas realizada com sucesso",
      });
    } catch (error) {
      console.error('Error analyzing debts:', error);
      toast({
        title: "Erro",
        description: "Erro ao analisar dívidas",
        variant: "destructive"
      });
    } finally {
      setAnalyzingUser(null);
    }
  };

  const deleteUser = async (userId: string) => {
    if (!confirm('Tem certeza que deseja excluir este usuário? Esta ação não pode ser desfeita.')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('profiles')
        .delete()
        .eq('id', userId);

      if (error) {
        console.error('Error deleting user:', error);
        toast({
          title: "Erro",
          description: "Erro ao excluir usuário",
          variant: "destructive"
        });
        return;
      }

      // Update local state
      setUsers(users.filter(user => user.id !== userId));
      fetchStats();

      toast({
        title: "Sucesso",
        description: "Usuário excluído com sucesso",
      });
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.document.includes(searchTerm.replace(/\D/g, ''));
    
    const matchesStatus = statusFilter === 'all' || user.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string | null) => {
    const statusMap = {
      'pendente': { color: 'bg-yellow-100 text-yellow-800', text: 'Pendente' },
      'em_analise': { color: 'bg-blue-100 text-blue-800', text: 'Em Análise' },
      'proposals_available': { color: 'bg-purple-100 text-purple-800', text: 'Propostas Disponíveis' },
      'finalizado': { color: 'bg-green-100 text-green-800', text: 'Finalizado' },
      'cancelado': { color: 'bg-red-100 text-red-800', text: 'Cancelado' }
    };

    const statusInfo = statusMap[status as keyof typeof statusMap] || statusMap['pendente'];
    return <Badge className={statusInfo.color}>{statusInfo.text}</Badge>;
  };

  const getMessageStatusBadge = (status: string) => {
    const statusMap = {
      'novo': { color: 'bg-blue-100 text-blue-800', text: 'Novo' },
      'em_andamento': { color: 'bg-yellow-100 text-yellow-800', text: 'Em Andamento' },
      'respondido': { color: 'bg-green-100 text-green-800', text: 'Respondido' }
    };

    const statusInfo = statusMap[status as keyof typeof statusMap] || statusMap['novo'];
    return <Badge className={statusInfo.color}>{statusInfo.text}</Badge>;
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
