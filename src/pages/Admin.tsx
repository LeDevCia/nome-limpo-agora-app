import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Link } from 'react-router-dom';
import { Search, Eye, FileSearch, Users, Clock, BarChart3, CheckCircle, UserCheck, Mail, Phone, Trash2 } from 'lucide-react';
import Header from '@/components/Header';
import { AdminComponents } from './AdminComponents';

const Admin = () => {
  const { isAuthenticated, isAdmin, loading } = useAuth();
  
  const {
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
  } = AdminComponents();

  if (loading || loadingData) {
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

  if (!isAuthenticated || !isAdmin) {
    return null;
  }

  // Função para formatar CPF ou CNPJ
  const formatDocument = (document: string) => {
    const cleaned = document.replace(/\D/g, '');
    if (cleaned.length === 11) {
      // Formatar CPF: 123.456.789-00
      return cleaned.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
    } else if (cleaned.length === 14) {
      // Formatar CNPJ: 12.345.678/0001-99
      return cleaned.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
    }
    return document;
  };

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
          <TabsList className="inline-flex h-10 items-center justify-center rounded-md bg-white p-1 text-green-800">
            <TabsTrigger
                value="users"
                className="px-3 py-1.5 text-sm font-medium rounded-sm transition-all
                    data-[state=active]:bg-green-700
                    data-[state=active]:text-white
                    data-[state=inactive]:text-green-700
                    data-[state=inactive]:hover:bg-green-200"
            >
              Usuários
            </TabsTrigger>
            <TabsTrigger
                value="messages"
                className="px-3 py-1.5 text-sm font-medium rounded-sm transition-all
                    data-[state=active]:bg-green-700
                    data-[state=active]:text-white
                    data-[state=inactive]:text-green-700
                    data-[state=inactive]:hover:bg-green-200"
            >
              Mensagens de Contato
            </TabsTrigger>
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
                          placeholder="Buscar por nome, CPF, CNPJ ou email..."
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
                            <TableHead>Documento</TableHead>
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
                                <TableCell>{user.document ? formatDocument(user.document) : '-'}</TableCell>
                                <TableCell>{user.email}</TableCell>
                                <TableCell>{user.phone}</TableCell>
                                <TableCell>{getStatusBadge(user.status)}</TableCell>
                                <TableCell>
                                  {new Date(user.created_at).toLocaleDateString('pt-BR')}
                                </TableCell>
                                <TableCell>
                                  <div className="flex space-x-2">
                                    <Link to={`/admin/user/${user.id}`}>
                                      <Button
                                          variant="outline"
                                          size="sm"
                                          className="text-green-600 hover:text-green-700"
                                      >
                                        <Eye className="h-4 w-4" />
                                      </Button>
                                    </Link>
                                    <select
                                        value={user.status || 'pendente'}
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
                                        onClick={() => analyzeUserDebts(user.id, user.document)}
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
