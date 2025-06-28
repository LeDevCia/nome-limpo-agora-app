
import React, { useState, useEffect } from 'react';
import { useParams, Navigate, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import Header from '@/components/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowLeft, 
  Plus, 
  Trash2, 
  Edit, 
  Save, 
  X,
  DollarSign,
  Building,
  Calendar,
  AlertCircle
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Debt {
  id: string;
  creditor: string;
  amount: number;
  status: string;
  created_at: string;
  user_id: string;
  cpf: string;
}

const UserDebtsManagement = () => {
  const { userId } = useParams<{ userId: string }>();
  const [searchParams] = useSearchParams();
  const userName = searchParams.get('name') || 'Usuário';
  const { isAuthenticated, isAdmin, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [debts, setDebts] = useState<Debt[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingDebt, setEditingDebt] = useState<string | null>(null);
  const [addingDebt, setAddingDebt] = useState(false);
  const [newDebt, setNewDebt] = useState({
    creditor: '',
    amount: '',
    status: 'pendente'
  });

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-600"></div>
      </div>
    );
  }

  if (!isAuthenticated || !isAdmin) {
    return <Navigate to="/login" replace />;
  }

  useEffect(() => {
    if (userId) {
      fetchDebts();
    }
  }, [userId]);

  const fetchDebts = async () => {
    if (!userId) return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('debts')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      setDebts(data || []);
    } catch (error) {
      console.error('Error fetching debts:', error);
      toast({
        title: "Erro",
        description: "Erro ao carregar dívidas",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const addDebt = async () => {
    if (!userId || !newDebt.creditor || !newDebt.amount) return;

    try {
      // Get user's CPF first
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('cpf')
        .eq('id', userId)
        .single();

      if (profileError) throw profileError;

      const { error } = await supabase
        .from('debts')
        .insert({
          user_id: userId,
          cpf: profile.cpf,
          creditor: newDebt.creditor,
          amount: parseFloat(newDebt.amount),
          status: newDebt.status
        });

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: "Dívida adicionada com sucesso!",
      });

      setNewDebt({ creditor: '', amount: '', status: 'pendente' });
      setAddingDebt(false);
      fetchDebts();
    } catch (error) {
      console.error('Error adding debt:', error);
      toast({
        title: "Erro",
        description: "Erro ao adicionar dívida",
        variant: "destructive"
      });
    }
  };

  const updateDebt = async (debtId: string, updates: Partial<Debt>) => {
    try {
      const { error } = await supabase
        .from('debts')
        .update(updates)
        .eq('id', debtId);

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: "Dívida atualizada com sucesso!",
      });

      setEditingDebt(null);
      fetchDebts();
    } catch (error) {
      console.error('Error updating debt:', error);
      toast({
        title: "Erro",
        description: "Erro ao atualizar dívida",
        variant: "destructive"
      });
    }
  };

  const deleteDebt = async (debtId: string) => {
    if (!confirm('Tem certeza que deseja excluir esta dívida?')) return;

    try {
      const { error } = await supabase
        .from('debts')
        .delete()
        .eq('id', debtId);

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: "Dívida excluída com sucesso!",
      });

      fetchDebts();
    } catch (error) {
      console.error('Error deleting debt:', error);
      toast({
        title: "Erro",
        description: "Erro ao excluir dívida",
        variant: "destructive"
      });
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const getStatusBadge = (status: string) => {
    const statusConfig: Record<string, { color: string; label: string }> = {
      pendente: { color: 'bg-yellow-100 text-yellow-800', label: 'Pendente' },
      atrasada: { color: 'bg-red-100 text-red-800', label: 'Atrasada' },
      em_negociacao: { color: 'bg-blue-100 text-blue-800', label: 'Em Negociação' },
      quitada: { color: 'bg-green-100 text-green-800', label: 'Quitada' }
    };

    const config = statusConfig[status] || { color: 'bg-gray-100 text-gray-800', label: status };
    return (
      <Badge className={config.color}>
        {config.label}
      </Badge>
    );
  };

  const totalDebts = debts.reduce((sum, debt) => sum + debt.amount, 0);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <Button
            onClick={() => navigate(`/admin/user/${userId}`)}
            variant="outline"
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar aos Detalhes do Usuário
          </Button>

          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Gerenciar Dívidas
              </h1>
              <p className="text-gray-600">
                Dívidas de {userName}
              </p>
            </div>

            <Button
              onClick={() => setAddingDebt(true)}
              className="mt-4 md:mt-0 bg-green-600 hover:bg-green-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              Adicionar Dívida
            </Button>
          </div>
        </div>

        {/* Resumo */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total de Dívidas</CardTitle>
              <Building className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{debts.length}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Valor Total</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{formatCurrency(totalDebts)}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Última Atualização</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {debts.length > 0 ? new Date(debts[0].created_at).toLocaleDateString('pt-BR') : 'N/A'}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Formulário de Nova Dívida */}
        {addingDebt && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Adicionar Nova Dívida</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Credor
                  </label>
                  <Input
                    type="text"
                    value={newDebt.creditor}
                    onChange={(e) => setNewDebt({ ...newDebt, creditor: e.target.value })}
                    placeholder="Nome do credor"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Valor
                  </label>
                  <Input
                    type="number"
                    step="0.01"
                    value={newDebt.amount}
                    onChange={(e) => setNewDebt({ ...newDebt, amount: e.target.value })}
                    placeholder="0.00"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Status
                  </label>
                  <select
                    value={newDebt.status}
                    onChange={(e) => setNewDebt({ ...newDebt, status: e.target.value })}
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    <option value="pendente">Pendente</option>
                    <option value="atrasada">Atrasada</option>
                    <option value="em_negociacao">Em Negociação</option>
                    <option value="quitada">Quitada</option>
                  </select>
                </div>
              </div>
              <div className="flex space-x-2">
                <Button onClick={addDebt} className="bg-green-600 hover:bg-green-700">
                  <Save className="w-4 h-4 mr-2" />
                  Salvar
                </Button>
                <Button
                  onClick={() => {
                    setAddingDebt(false);
                    setNewDebt({ creditor: '', amount: '', status: 'pendente' });
                  }}
                  variant="outline"
                >
                  <X className="w-4 h-4 mr-2" />
                  Cancelar
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Lista de Dívidas */}
        <Card>
          <CardHeader>
            <CardTitle>Dívidas Cadastradas</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
              </div>
            ) : debts.length === 0 ? (
              <div className="text-center py-8">
                <AlertCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhuma dívida cadastrada</h3>
                <p className="text-gray-600">Adicione a primeira dívida para este usuário.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {debts.map((debt) => (
                  <DebtCard
                    key={debt.id}
                    debt={debt}
                    isEditing={editingDebt === debt.id}
                    onEdit={() => setEditingDebt(debt.id)}
                    onCancelEdit={() => setEditingDebt(null)}
                    onUpdate={(updates) => updateDebt(debt.id, updates)}
                    onDelete={() => deleteDebt(debt.id)}
                    formatCurrency={formatCurrency}
                    getStatusBadge={getStatusBadge}
                  />
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

interface DebtCardProps {
  debt: Debt;
  isEditing: boolean;
  onEdit: () => void;
  onCancelEdit: () => void;
  onUpdate: (updates: Partial<Debt>) => void;
  onDelete: () => void;
  formatCurrency: (value: number) => string;
  getStatusBadge: (status: string) => JSX.Element;
}

const DebtCard: React.FC<DebtCardProps> = ({
  debt,
  isEditing,
  onEdit,
  onCancelEdit,
  onUpdate,
  onDelete,
  formatCurrency,
  getStatusBadge
}) => {
  const [editForm, setEditForm] = useState({
    creditor: debt.creditor,
    amount: debt.amount.toString(),
    status: debt.status
  });

  const handleSave = () => {
    onUpdate({
      creditor: editForm.creditor,
      amount: parseFloat(editForm.amount),
      status: editForm.status
    });
  };

  if (isEditing) {
    return (
      <div className="border rounded-lg p-4 bg-blue-50">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Credor
            </label>
            <Input
              type="text"
              value={editForm.creditor}
              onChange={(e) => setEditForm({ ...editForm, creditor: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Valor
            </label>
            <Input
              type="number"
              step="0.01"
              value={editForm.amount}
              onChange={(e) => setEditForm({ ...editForm, amount: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              value={editForm.status}
              onChange={(e) => setEditForm({ ...editForm, status: e.target.value })}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="pendente">Pendente</option>
              <option value="atrasada">Atrasada</option>
              <option value="em_negociacao">Em Negociação</option>
              <option value="quitada">Quitada</option>
            </select>
          </div>
        </div>
        <div className="flex space-x-2">
          <Button onClick={handleSave} size="sm" className="bg-green-600 hover:bg-green-700">
            <Save className="w-4 h-4 mr-2" />
            Salvar
          </Button>
          <Button onClick={onCancelEdit} variant="outline" size="sm">
            <X className="w-4 h-4 mr-2" />
            Cancelar
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="border rounded-lg p-4 hover:bg-gray-50">
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <div className="flex items-center space-x-4 mb-2">
            <h4 className="font-semibold text-lg">{debt.creditor}</h4>
            {getStatusBadge(debt.status)}
          </div>
          <div className="text-2xl font-bold text-red-600 mb-2">
            {formatCurrency(debt.amount)}
          </div>
          <p className="text-sm text-gray-600">
            Cadastrado em: {new Date(debt.created_at).toLocaleDateString('pt-BR')}
          </p>
        </div>
        <div className="flex space-x-2">
          <Button onClick={onEdit} variant="outline" size="sm">
            <Edit className="w-4 h-4" />
          </Button>
          <Button onClick={onDelete} variant="outline" size="sm" className="text-red-600 hover:text-red-700">
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default UserDebtsManagement;
