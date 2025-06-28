
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, User, Mail, Phone, MapPin, Calendar, FileText, CreditCard } from 'lucide-react';
import Header from '@/components/Header';
import { UserProfile, Debt } from '@/types';

const UserDetail = () => {
  const { userId } = useParams();
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
        setUser({
          ...data,
          cpf: data.document || '',
        });
      }
    } catch (error) {
      console.error('Error fetching user:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchUserDebts = async () => {
    try {
      const { data, error } = await supabase
        .from('debts')
        .select('*')
        .eq('user_id', userId);

      if (error) {
        console.error('Error fetching debts:', error);
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
    }
  };

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
            onClick={() => navigate('/admin')}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar ao Painel
          </Button>
          
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {user.name}
              </h1>
              <p className="text-gray-600">
                Detalhes do usuário e gerenciamento
              </p>
            </div>
            <div className="flex space-x-3">
              <Button
                onClick={() => navigate(`/admin/user/${userId}/debts-management`)}
                className="bg-green-600 hover:bg-green-700"
              >
                <CreditCard className="w-4 h-4 mr-2" />
                Gerenciar Dívidas
              </Button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* User Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <User className="w-5 h-5 mr-2" />
                Informações Pessoais
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-medium">Status:</span>
                {getStatusBadge(user.status)}
              </div>
              
              <div className="flex items-center space-x-2">
                <Mail className="w-4 h-4 text-gray-500" />
                <span className="font-medium">Email:</span>
                <span>{user.email}</span>
              </div>
              
              <div className="flex items-center space-x-2">
                <FileText className="w-4 h-4 text-gray-500" />
                <span className="font-medium">CPF:</span>
                <span>{user.cpf ? user.cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4') : '-'}</span>
              </div>
              
              <div className="flex items-center space-x-2">
                <Phone className="w-4 h-4 text-gray-500" />
                <span className="font-medium">Telefone:</span>
                <span>{user.phone}</span>
              </div>
              
              <div className="flex items-center space-x-2">
                <Calendar className="w-4 h-4 text-gray-500" />
                <span className="font-medium">Data de Nascimento:</span>
                <span>{user.birth_date ? new Date(user.birth_date).toLocaleDateString('pt-BR') : '-'}</span>
              </div>
              
              <div className="flex items-start space-x-2">
                <MapPin className="w-4 h-4 text-gray-500 mt-1" />
                <div>
                  <span className="font-medium">Endereço:</span>
                  <div className="text-sm text-gray-600 mt-1">
                    <p>{user.address}</p>
                    <p>{user.city}, {user.state} - {user.zip_code}</p>
                  </div>
                </div>
              </div>
              
              <div className="pt-4 border-t">
                <div className="text-sm text-gray-500">
                  <p>Cadastrado em: {new Date(user.created_at).toLocaleDateString('pt-BR')}</p>
                  <p>Última atualização: {new Date(user.updated_at).toLocaleDateString('pt-BR')}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Debts Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <CreditCard className="w-5 h-5 mr-2" />
                Resumo de Dívidas
              </CardTitle>
            </CardHeader>
            <CardContent>
              {debts.length > 0 ? (
                <div className="space-y-4">
                  <div className="text-sm text-gray-600">
                    Total de dívidas: {debts.length}
                  </div>
                  <div className="text-sm text-gray-600">
                    Valor total: R$ {debts.reduce((sum, debt) => sum + (debt.amount || 0), 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </div>
                  
                  <div className="space-y-2">
                    {debts.slice(0, 3).map((debt) => (
                      <div key={debt.id} className="flex justify-between items-center p-3 bg-gray-50 rounded">
                        <div>
                          <p className="font-medium">{debt.creditor}</p>
                          <p className="text-sm text-gray-600">
                            R$ {debt.amount?.toLocaleString('pt-BR', { minimumFractionDigits: 2 }) || '0,00'}
                          </p>
                        </div>
                        <Badge variant="outline">{debt.status}</Badge>
                      </div>
                    ))}
                    
                    {debts.length > 3 && (
                      <p className="text-sm text-gray-500 text-center">
                        E mais {debts.length - 3} dívida(s)...
                      </p>
                    )}
                  </div>
                  
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => navigate(`/admin/user/${userId}/debts`)}
                  >
                    Ver Todas as Dívidas
                  </Button>
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <CreditCard className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p>Nenhuma dívida cadastrada</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default UserDetail;
