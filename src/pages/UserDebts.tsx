
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, CreditCard, Building } from 'lucide-react';
import Header from '@/components/Header';
import { UserProfile, Debt } from '@/types';

const UserDebts = () => {
  const { id } = useParams();
  const { isAuthenticated, isAdmin, loading } = useAuth();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [debts, setDebts] = useState<Debt[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (!loading && (!isAuthenticated || !isAdmin)) {
      navigate('/');
      return;
    }

    if (isAuthenticated && isAdmin && id) {
      fetchUserData();
      fetchUserDebts();
    }
  }, [isAuthenticated, isAdmin, loading, id, navigate]);

  const fetchUserData = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', id)
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
        setUser({
          ...data,
          cpf: data.document || '',
        });
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
        .eq('user_id', id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching debts:', error);
        toast({
          title: "Erro",
          description: "Erro ao carregar dívidas",
          variant: "destructive"
        });
        return;
      }

      // Map to ensure cpf field exists
      const debtsWithCpf = data?.map(debt => ({
        ...debt,
        cpf: debt.document || '',
      })) || [];

      setDebts(debtsWithCpf);
    } catch (error) {
      console.error('Error fetching debts:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusMap = {
      'pendente': { color: 'bg-yellow-100 text-yellow-800', text: 'Pendente' },
      'em_analise': { color: 'bg-blue-100 text-blue-800', text: 'Em Análise' },
      'negociando': { color: 'bg-purple-100 text-purple-800', text: 'Negociando' },
      'quitada': { color: 'bg-green-100 text-green-800', text: 'Quitada' },
      'cancelada': { color: 'bg-red-100 text-red-800', text: 'Cancelada' }
    };

    const statusInfo = statusMap[status as keyof typeof statusMap] || statusMap['pendente'];
    return <Badge className={statusInfo.color}>{statusInfo.text}</Badge>;
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

  const totalDebt = debts.reduce((sum, debt) => sum + (debt.amount || 0), 0);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => navigate(`/admin/user/${id}`)}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar aos Detalhes
          </Button>
          
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Dívidas de {user.name}
              </h1>
              <p className="text-gray-600">
                CPF: {user.cpf ? user.cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4') : '-'}
              </p>
            </div>
            <Button
              onClick={() => navigate(`/admin/user/${id}/debts-management`)}
              className="bg-green-600 hover:bg-green-700"
            >
              Gerenciar Dívidas
            </Button>
          </div>
        </div>

        {/* Summary Card */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <p className="text-sm font-medium text-gray-600">Total de Dívidas</p>
                <p className="text-2xl font-bold text-gray-900">{debts.length}</p>
              </div>
              <div className="text-center">
                <p className="text-sm font-medium text-gray-600">Valor Total</p>
                <p className="text-2xl font-bold text-red-600">
                  R$ {totalDebt.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </p>
              </div>
              <div className="text-center">
                <p className="text-sm font-medium text-gray-600">Status Geral</p>
                <p className="text-2xl font-bold text-blue-600">
                  {debts.filter(d => d.status === 'quitada').length} Quitadas
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Debts List */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <CreditCard className="w-5 h-5 mr-2" />
              Lista de Dívidas
            </CardTitle>
          </CardHeader>
          <CardContent>
            {debts.length > 0 ? (
              <div className="space-y-4">
                {debts.map((debt) => (
                  <div key={debt.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <Building className="w-8 h-8 text-gray-400" />
                        <div>
                          <h3 className="font-semibold text-lg">{debt.creditor}</h3>
                          <p className="text-sm text-gray-600">
                            Cadastrada em: {new Date(debt.created_at).toLocaleDateString('pt-BR')}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-red-600">
                          R$ {debt.amount?.toLocaleString('pt-BR', { minimumFractionDigits: 2 }) || '0,00'}
                        </p>
                        {getStatusBadge(debt.status || 'pendente')}
                      </div>
                    </div>
                    
                    {debt.cpf && (
                      <div className="text-sm text-gray-600">
                        <p>CPF: {debt.cpf}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <CreditCard className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhuma dívida encontrada</h3>
                <p className="text-gray-600">Este usuário não possui dívidas cadastradas.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default UserDebts;
