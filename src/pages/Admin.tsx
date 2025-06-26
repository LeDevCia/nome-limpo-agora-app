import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import Header from '@/components/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  Users, 
  UserCheck, 
  Clock, 
  CheckCircle, 
  Search,
  Trash2,
  BarChart3,
  MessageSquare,
  Phone,
  Mail,
  Eye,
  FileSearch
} from 'lucide-react';
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

interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  message: string;
  status: 'novo' | 'respondido' | 'em_andamento';
  created_at: string;
  admin_notes: string | null;
}

interface DashboardStats {
  total: number;
  pendente: number;
  em_analise: number;
  proposals_available: number;
  finalizado: number;
  cancelado: number;
}

const Admin = () => {
  const { isAuthenticated, isAdmin, loading } = useAuth();
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [stats, setStats] = useState<DashboardStats>({
    total: 0,
    pendente: 0,
    em_analise: 0,
    proposals_available: 0,
    finalizado: 0,
    cancelado: 0
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [loadingData, setLoadingData] = useState(true);
  const [analyzingUser, setAnalyzingUser] = useState<string | null>(null);
  const { toast } = useToast();

  if (loading) {
    return <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-600"></div>
    </div>;
  }

  if (!isAuthenticated || !isAdmin) {
    return <Navigate to="/login" replace />;
  }

  useEffect(() => {
    fetchUsers();
    fetchMessages();
  }, []);

  const fetchUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Type the data properly
      const typedUsers: UserProfile[] = (data || []).map(user => ({
        ...user,
        status: user.status as 'pendente' | 'em_analise' | 'proposals_available' | 'finalizado' | 'cancelado'
      }));

      setUsers(typedUsers);
      calculateStats(typedUsers);
    } catch (error) {
      console.error('Erro ao buscar usuários:', error);
      toast({
        title: "Erro",
        description: "Erro ao carregar dados dos usuários",
        variant: "destructive"
      });
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

      // Type the data properly with status casting
      const typedMessages: ContactMessage[] = (data || []).map(message => ({
        ...message,
        status: message.status as 'novo' | 'respondido' | 'em_andamento'
      }));

      setMessages(typedMessages);
    } catch (error) {
      console.error('Erro ao buscar mensagens:', error);
    }
  };

  const calculateStats = (userData: UserProfile[]) => {
    const stats = userData.reduce((acc, user) => {
      acc.total++;
      acc[user.status]++;
      return acc;
    }, {
      total: 0,
      pendente: 0,
      em_analise: 0,
      proposals_available: 0,
      finalizado: 0,
      cancelado: 0
    });
    
    setStats(stats);
  };

  const updateUserStatus = async (userId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ status: newStatus })
        .eq('id', userId);

      if (error) throw error;

      const updatedUsers = users.map(user => 
        user.id === userId ? { ...user, status: newStatus as any } : user
      );
      
      setUsers(updatedUsers);
      calculateStats(updatedUsers);
      
      toast({
        title: "Sucesso",
        description: "Status atualizado com sucesso!",
      });
    } catch (error) {
      console.error('Erro ao atualizar status:', error);
      toast({
        title: "Erro",
        description: "Erro ao atualizar status",
        variant: "destructive"
      });
    }
  };

  const analyzeUserDebts = async (userId: string, cpf: string) => {
    setAnalyzingUser(userId);
    
    try {
      // Aqui você implementará a chamada para a API de análise de dívidas
      // Por enquanto, simulo o processo
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast({
        title: "Análise Iniciada",
        description: `Análise de dívidas para CPF ${cpf} foi iniciada. Você receberá os resultados em breve.`,
      });
      
      // Atualizar status para "em_analise"
      await updateUserStatus(userId, 'em_analise');
      
    } catch (error) {
      console.error('Erro ao analisar dívidas:', error);
      toast({
        title: "Erro",
        description: "Erro ao iniciar análise de dívidas",
        variant: "destructive"
      });
    } finally {
      setAnalyzingUser(null);
    }
  };

  const deleteUser = async (userId: string) => {
    if (!confirm('Tem certeza que deseja excluir este usuário?')) return;

    try {
      const { error } = await supabase.auth.admin.deleteUser(userId);
      if (error) throw error;

      const updatedUsers = users.filter(user => user.id !== userId);
      setUsers(updatedUsers);
      calculateStats(updatedUsers);
      
      toast({
        title: "Sucesso",
        description: "Usuário excluído com sucesso!",
      });
    } catch (error) {
      console.error('Erro ao excluir usuário:', error);
      toast({
        title: "Erro",
        description: "Erro ao excluir usuário",
        variant: "destructive"
      });
    }
  };

  const updateMessageStatus = async (messageId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('contact_messages')
        .update({ status: newStatus })
        .eq('id', messageId);

      if (error) throw error;

      setMessages(messages.map(msg => 
        msg.id === messageId ? { ...msg, status: newStatus as any } : msg
      ));
      
      toast({
        title: "Sucesso",
        description: "Status da mensagem atualizado!",
      });
    } catch (error) {
      console.error('Erro ao atualizar mensagem:', error);
      toast({
        title: "Erro",
        description: "Erro ao atualizar mensagem",
        variant: "destructive"
      });
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

  const getMessageStatusBadge = (status: string) => {
    const statusConfig = {
      novo: { color: 'bg-blue-100 text-blue-800', label: 'Novo' },
      em_andamento: { color: 'bg-yellow-100 text-yellow-800', label: 'Em Andamento' },
      respondido: { color: 'bg-green-100 text-green-800', label: 'Respondido' }
    };
    
    const config = statusConfig[status as keyof typeof statusConfig];
    return (
      <Badge className={config?.color || 'bg-gray-100 text-gray-800'}>
        {config?.label || status}
      </Badge>
    );
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.cpf.includes(searchTerm) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || user.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Painel Administrativo
          </h1>
          <p className="text-gray-600">
            Gerencie usuários e acompanhe estatísticas
          </p>
        </div>

        {/* Dashboard Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total de Usuários</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pendentes</CardTitle>
              <Clock className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">{stats.pendente}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Em Análise</CardTitle>
              <BarChart3 className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{stats.em_analise}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Propostas</CardTitle>
              <Eye className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">{stats.proposals_available}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Finalizados</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{stats.finalizado}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Cancelados</CardTitle>
              <UserCheck className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{stats.cancelado}</div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="users" className="space-y-6">
          <TabsList>
            <TabsTrigger value="users">Usuários</TabsTrigger>
            <TabsTrigger value="messages">Mensagens de Contato</TabsTrigger>
          </TabsList>

          <TabsContent value="users" className="space-y-6">
            {/* Filters */}
            <Card>
              <CardHeader>
                <CardTitle>Filtros</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        placeholder="Buscar por nome, CPF ou email..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    <option value="all">Todos os Status</option>
                    <option value="pendente">Pendente</option>
                    <option value="em_analise">Em Análise</option>
                    <option value="proposals_available">Propostas Disponíveis</option>
                    <option value="finalizado">Finalizado</option>
                    <option value="cancelado">Cancelado</option>
                  </select>
                </div>
              </CardContent>
            </Card>

            {/* Users Table */}
            <Card>
              <CardHeader>
                <CardTitle>Usuários Cadastrados ({filteredUsers.length})</CardTitle>
              </CardHeader>
              <CardContent>
                {loadingData ? (
                  <div className="flex justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Nome</TableHead>
                          <TableHead>CPF</TableHead>
                          <TableHead>Email</TableHead>
                          <TableHead>Telefone</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Data Cadastro</TableHead>
                          <TableHead>Ações</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredUsers.map((user) => (
                          <TableRow key={user.id}>
                            <TableCell className="font-medium">{user.name}</TableCell>
                            <TableCell>{user.cpf}</TableCell>
                            <TableCell>{user.email}</TableCell>
                            <TableCell>{user.phone}</TableCell>
                            <TableCell>{getStatusBadge(user.status)}</TableCell>
                            <TableCell>
                              {new Date(user.created_at).toLocaleDateString('pt-BR')}
                            </TableCell>
                            <TableCell>
                              <div className="flex space-x-2">
                                <select
                                  value={user.status}
                                  onChange={(e) => updateUserStatus(user.id, e.target.value)}
                                  className="text-sm px-2 py-1 border rounded focus:outline-none focus:ring-1 focus:ring-green-500"
                                >
                                  <option value="pendente">Pendente</option>
                                  <option value="em_analise">Em Análise</option>
                                  <option value="proposals_available">Propostas Disponíveis</option>
                                  <option value="finalizado">Finalizado</option>
                                  <option value="cancelado">Cancelado</option>
                                </select>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => analyzeUserDebts(user.id, user.cpf)}
                                  disabled={analyzingUser === user.id}
                                  className="text-blue-600 hover:text-blue-700"
                                >
                                  {analyzingUser === user.id ? (
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                                  ) : (
                                    <FileSearch className="h-4 w-4" />
                                  )}
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => deleteUser(user.id)}
                                  className="text-red-600 hover:text-red-700"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="messages" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Mensagens de Contato ({messages.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Nome</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Telefone</TableHead>
                        <TableHead>Mensagem</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Data</TableHead>
                        <TableHead>Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {messages.map((message) => (
                        <TableRow key={message.id}>
                          <TableCell className="font-medium">{message.name}</TableCell>
                          <TableCell>{message.email}</TableCell>
                          <TableCell>{message.phone || 'N/A'}</TableCell>
                          <TableCell className="max-w-xs truncate" title={message.message}>
                            {message.message}
                          </TableCell>
                          <TableCell>{getMessageStatusBadge(message.status)}</TableCell>
                          <TableCell>
                            {new Date(message.created_at).toLocaleDateString('pt-BR')}
                          </TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              <select
                                value={message.status}
                                onChange={(e) => updateMessageStatus(message.id, e.target.value)}
                                className="text-sm px-2 py-1 border rounded focus:outline-none focus:ring-1 focus:ring-green-500"
                              >
                                <option value="novo">Novo</option>
                                <option value="em_andamento">Em Andamento</option>
                                <option value="respondido">Respondido</option>
                              </select>
                              <a href={`mailto:${message.email}`}>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="text-blue-600 hover:text-blue-700"
                                >
                                  <Mail className="h-4 w-4" />
                                </Button>
                              </a>
                              {message.phone && (
                                <a href={`https://wa.me/55${message.phone.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer">
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="text-green-600 hover:text-green-700"
                                  >
                                    <Phone className="h-4 w-4" />
                                  </Button>
                                </a>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Admin;
