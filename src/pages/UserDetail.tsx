
import React, { useState, useEffect } from 'react';
import { useParams, Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import Header from '@/components/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, User, Phone, Mail, MapPin, Calendar, FileText, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface UserProfile {
  id: string;
  name: string;
  email: string;
  cpf: string;
  phone: string;
  status: 'pendente' | 'em_analise' | 'proposals_available' | 'finalizado' | 'cancelado';
  created_at: string;
  birth_date?: string;
  address?: string;
  city?: string;
  state?: string;
  zip_code?: string;
}

const UserDetail = () => {
  const { userId } = useParams<{ userId: string }>();
  const { isAuthenticated, isAdmin, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updatingStatus, setUpdatingStatus] = useState(false);

  if (authLoading) {
    return <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-600"></div>
    </div>;
  }

  if (!isAuthenticated || !isAdmin) {
    return <Navigate to="/login" replace />;
  }

  useEffect(() => {
    if (userId) {
      fetchUser();
    }
  }, [userId]);

  const fetchUser = async () => {
    if (!userId) return;
    
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          setError('Usuário não encontrado');
        } else {
          setError('Erro ao carregar dados do usuário');
        }
        return;
      }

      if (data) {
        const typedUser: UserProfile = {
          ...data,
          status: data.status as 'pendente' | 'em_analise' | 'proposals_available' | 'finalizado' | 'cancelado'
        };
        setUser(typedUser);
      }
    } catch (error) {
      console.error('Error fetching user:', error);
      setError('Erro ao carregar dados do usuário');
    } finally {
      setLoading(false);
    }
  };

  const updateUserStatus = async (newStatus: string) => {
    if (!userId) return;

    try {
      setUpdatingStatus(true);
      const { error } = await supabase
        .from('profiles')
        .update({ status: newStatus })
        .eq('id', userId);

      if (error) throw error;

      setUser(prev => prev ? { ...prev, status: newStatus as any } : null);
      
      toast({
        title: "Sucesso",
        description: "Status atualizado com sucesso!",
      });
    } catch (error) {
      console.error('Error updating status:', error);
      toast({
        title: "Erro",
        description: "Erro ao atualizar status",
        variant: "destructive"
      });
    } finally {
      setUpdatingStatus(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pendente: { color: 'bg-yellow-100 text-yellow-800', label: 'Pendente' },
      em_analise: { color: 'bg-blue-100 text-blue-800', label: 'Em Análise' },
      proposals_available: { color: 'bg-purple-100 text-purple-800', label: 'Propostas Disponíveis' },
      finalizado: { color: 'bg-green-100 text-green-800', label: 'Finalizado' },
      cancelado: { color: 'bg-red-100 text-red-800', label: 'Cancelado' }
    };
    
    const config = statusConfig[status as keyof typeof statusConfig];
    return (
      <Badge className={config?.color || 'bg-gray-100 text-gray-800'}>
        {config?.label || status}
      </Badge>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col items-center justify-center h-64 space-y-4">
            <AlertCircle className="w-16 h-16 text-red-500" />
            <h2 className="text-2xl font-bold text-gray-900">
              {error || 'Usuário não encontrado'}
            </h2>
            <Button onClick={() => navigate('/admin')} className="mt-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar ao Admin
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <Button 
            onClick={() => navigate('/admin')} 
            variant="outline" 
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar ao Admin
          </Button>
          
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Detalhes do Usuário
              </h1>
              <p className="text-gray-600">
                Visualização completa dos dados do usuário
              </p>
            </div>
            
            <div className="mt-4 md:mt-0">
              {getStatusBadge(user.status)}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Informações Pessoais */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <User className="w-5 h-5" />
                  <span>Informações Pessoais</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600">Nome Completo</label>
                    <p className="text-lg font-semibold text-gray-900">{user.name}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">CPF</label>
                    <p className="text-lg font-semibold text-gray-900">{user.cpf}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Email</label>
                    <p className="text-lg text-gray-900 flex items-center space-x-2">
                      <Mail className="w-4 h-4" />
                      <span>{user.email}</span>
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Telefone</label>
                    <p className="text-lg text-gray-900 flex items-center space-x-2">
                      <Phone className="w-4 h-4" />
                      <span>{user.phone}</span>
                    </p>
                  </div>
                  {user.birth_date && (
                    <div>
                      <label className="text-sm font-medium text-gray-600">Data de Nascimento</label>
                      <p className="text-lg text-gray-900 flex items-center space-x-2">
                        <Calendar className="w-4 h-4" />
                        <span>{new Date(user.birth_date).toLocaleDateString('pt-BR')}</span>
                      </p>
                    </div>
                  )}
                  <div>
                    <label className="text-sm font-medium text-gray-600">Data de Cadastro</label>
                    <p className="text-lg text-gray-900">
                      {new Date(user.created_at).toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Endereço */}
            {(user.address || user.city || user.state || user.zip_code) && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <MapPin className="w-5 h-5" />
                    <span>Endereço</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {user.address && (
                      <div className="md:col-span-2">
                        <label className="text-sm font-medium text-gray-600">Endereço</label>
                        <p className="text-lg text-gray-900">{user.address}</p>
                      </div>
                    )}
                    {user.city && (
                      <div>
                        <label className="text-sm font-medium text-gray-600">Cidade</label>
                        <p className="text-lg text-gray-900">{user.city}</p>
                      </div>
                    )}
                    {user.state && (
                      <div>
                        <label className="text-sm font-medium text-gray-600">Estado</label>
                        <p className="text-lg text-gray-900">{user.state}</p>
                      </div>
                    )}
                    {user.zip_code && (
                      <div>
                        <label className="text-sm font-medium text-gray-600">CEP</label>
                        <p className="text-lg text-gray-900">{user.zip_code}</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Documentos */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <FileText className="w-5 h-5" />
                  <span>Documentos</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Nenhum documento foi enviado ainda.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar - Ações */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Alterar Status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-600">Status Atual</label>
                  {getStatusBadge(user.status)}
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-600">Novo Status</label>
                  <select
                    value={user.status}
                    onChange={(e) => updateUserStatus(e.target.value)}
                    disabled={updatingStatus}
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    <option value="pendente">Pendente</option>
                    <option value="em_analise">Em Análise</option>
                    <option value="proposals_available">Propostas Disponíveis</option>
                    <option value="finalizado">Finalizado</option>
                    <option value="cancelado">Cancelado</option>
                  </select>
                </div>
                
                {updatingStatus && (
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-green-600"></div>
                    <span>Atualizando...</span>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Ações Rápidas */}
            <Card>
              <CardHeader>
                <CardTitle>Ações Rápidas</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <a href={`mailto:${user.email}`}>
                  <Button variant="outline" className="w-full flex items-center space-x-2">
                    <Mail className="w-4 h-4" />
                    <span>Enviar Email</span>
                  </Button>
                </a>
                
                <a 
                  href={`https://wa.me/55${user.phone.replace(/\D/g, '')}`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  <Button variant="outline" className="w-full flex items-center space-x-2">
                    <Phone className="w-4 h-4" />
                    <span>WhatsApp</span>
                  </Button>
                </a>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDetail;
