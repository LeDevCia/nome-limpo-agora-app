
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Plus, Edit, Trash2, CreditCard } from 'lucide-react';
import Header from '@/components/Header';
import { UserProfile, Debt } from '@/types';

const UserDebtsManagement = () => {
  const { userId } = useParams();
  const { isAuthenticated, isAdmin, loading } = useAuth();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [debts, setDebts] = useState<Debt[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingDebt, setEditingDebt] = useState<Debt | null>(null);
  const [formData, setFormData] = useState({
    creditor: '',
    amount: '',
    status: 'pendente'
  });
  
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (!loading && (!isAuthenticated || !isAdmin)) {
      navigate('/');
      return;
    }

    if (isAuthenticated && isAdmin && userId) {
      fetchUserData();
      fetchUserDebts();
    }
  }, [isAuthenticated, isAdmin, loading, userId, navigate]);

  const fetchUserData = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error fetching user:', error);
        toast({
          title: "Erro",
          description: "Erro ao carregar dados do usuário",
          variant: "destructive"
        });
        return;
      }

      if (data) {
        setUser(data);
      }
    } catch (error) {
      console.error('Error fetching user:', error);
    }
  };

  const fetchUserDebts = async () => {
    try {
      const { data, error } = await supabase
        .from('debts')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching debts:', error);
        return;
      }

      setDebts(data || []);
    } catch (error) {
      console.error('Error fetching debts:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const debtData = {
        user_id: userId,
        document: user?.document || '',
        creditor: formData.creditor,
        amount: parseFloat(formData.amount),
        status: formData.status
      };

      if (editingDebt) {
        const { error } = await supabase
          .from('debts')
          .update(debtData)
          .eq('id', editingDebt.id);

        if (error) {
          throw error;
        }

        toast({
          title: "Sucesso",
          description: "Dívida atualizada com sucesso!"
        });
      } else {
        const { error } = await supabase
          .from('debts')
          .insert([debtData]);

        if (error) {
          throw error;
        }

        toast({
          title: "Sucesso",
          description: "Dívida adicionada com sucesso!"
        });
      }

      setIsDialogOpen(false);
      setEditingDebt(null);
      setFormData({ creditor: '', amount: '', status: 'pendente' });
      fetchUserDebts();
    } catch (error) {
      console.error('Error saving debt:', error);
      toast({
        title: "Erro",
        description: "Erro ao salvar dívida",
        variant: "destructive"
      });
    }
  };

  const handleDelete = async (debtId: string) => {
    if (!confirm('Tem certeza que deseja excluir esta dívida?')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('debts')
        .delete()
        .eq('id', debtId);

      if (error) {
        throw error;
      }

      toast({
        title: "Sucesso",
        description: "Dívida excluída com sucesso!"
      });
      
      fetchUserDebts();
    } catch (error) {
      console.error('Error deleting debt:', error);
      toast({
        title: "Erro",
        description: "Erro ao excluir dívida",
        variant: "destructive"
      });
    }
  };

  const openEditDialog = (debt: Debt) => {
    setEditingDebt(debt);
    setFormData({
      creditor: debt.creditor,
      amount: debt.amount?.toString() || '',
      status: debt.status || 'pendente'
    });
    setIsDialogOpen(true);
  };

  const openAddDialog = () => {
    setEditingDebt(null);
    setFormData({ creditor: '', amount: '', status: 'pendente' });
    setIsDialogOpen(true);
  };

  if (loading || isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-center items-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Carregando...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !isAdmin || !user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => navigate(`/admin/user/${userId}`)}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar aos Detalhes
          </Button>
          
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Gerenciar Dívidas - {user.name}
              </h1>
              <p className="text-gray-600">
                CPF: {user.document ? user.document.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4') : '-'}
              </p>
            </div>
            
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={openAddDialog} className="bg-green-600 hover:bg-green-700">
                  <Plus className="w-4 h-4 mr-2" />
                  Adicionar Dívida
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>
                    {editingDebt ? 'Editar Dívida' : 'Adicionar Nova Dívida'}
                  </DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="creditor">Credor</Label>
                    <Input
                      id="creditor"
                      value={formData.creditor}
                      onChange={(e) => setFormData({...formData, creditor: e.target.value})}
                      placeholder="Nome do credor"
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="amount">Valor</Label>
                    <Input
                      id="amount"
                      type="number"
                      step="0.01"
                      value={formData.amount}
                      onChange={(e) => setFormData({...formData, amount: e.target.value})}
                      placeholder="0,00"
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="status">Status</Label>
                    <Select value={formData.status} onValueChange={(value) => setFormData({...formData, status: value})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pendente">Pendente</SelectItem>
                        <SelectItem value="em_analise">Em Análise</SelectItem>
                        <SelectItem value="negociando">Negociando</SelectItem>
                        <SelectItem value="quitada">Quitada</SelectItem>
                        <SelectItem value="cancelada">Cancelada</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="flex justify-end space-x-2">
                    <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                      Cancelar
                    </Button>
                    <Button type="submit">
                      {editingDebt ? 'Atualizar' : 'Adicionar'}
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <CreditCard className="w-5 h-5 mr-2" />
              Dívidas Cadastradas ({debts.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {debts.length > 0 ? (
              <div className="space-y-4">
                {debts.map((debt) => (
                  <div key={debt.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold text-lg">{debt.creditor}</h3>
                        <p className="text-2xl font-bold text-red-600">
                          R$ {debt.amount?.toLocaleString('pt-BR', { minimumFractionDigits: 2 }) || '0,00'}
                        </p>
                        <p className="text-sm text-gray-600">
                          Cadastrada em: {new Date(debt.created_at).toLocaleDateString('pt-BR')}
                        </p>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline">
                          {debt.status || 'pendente'}
                        </Badge>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openEditDialog(debt)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(debt.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <CreditCard className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhuma dívida cadastrada</h3>
                <p className="text-gray-600">Clique em "Adicionar Dívida" para começar.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default UserDebtsManagement;
