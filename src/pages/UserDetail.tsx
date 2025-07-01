import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import {
  ArrowLeft,
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  FileText,
  CreditCard,
  Download,
  Eye,
  MessageSquare
} from 'lucide-react';
import Header from '@/components/Header';
import { UserProfile, Debt } from '@/types';

interface UserDocument {
  id: string;
  user_id: string;
  filename: string;
  file_url: string;
  file_type: string;
  file_size: number;
  created_at: string;
}

interface UserMessage {
  id: string;
  user_id: string;
  admin_id: string | null;
  message: string;
  is_admin: boolean;
  created_at: string;
}

const UserDetail = () => {
  const { userId } = useParams();
  const { isAuthenticated, isAdmin, loading, profile } = useAuth();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [debts, setDebts] = useState<Debt[]>([]);
  const [documents, setDocuments] = useState<UserDocument[]>([]);
  const [previewUrls, setPreviewUrls] = useState<{ [key: string]: string }>({});
  const [messages, setMessages] = useState<UserMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
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
      fetchMessages();

      const channel = supabase
        .channel('user_messages')
        .on('postgres_changes', {
          event: 'INSERT',
          schema: 'public',
          table: 'user_messages',
          filter: `user_id=eq.${userId}`
        }, () => {
          fetchMessages();
        })
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [isAuthenticated, isAdmin, loading, userId, navigate]);

  const fetchUserData = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) throw error;

      setUser(data);
      fetchUserDocuments(data.email);
    } catch (error) {
      console.error('Error fetching user:', error);
      toast({
        title: 'Erro',
        description: 'Erro ao carregar dados do usuário',
        variant: 'destructive',
      });
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

      if (error) throw error;

      setDebts(data || []);
    } catch (error) {
      console.error('Error fetching debts:', error);
      toast({
        title: 'Erro',
        description: 'Erro ao carregar dívidas',
        variant: 'destructive',
      });
    }
  };

  const fetchUserDocuments = async (email: string) => {
    try {
      const { data, error } = await supabase
        .from('user_documents')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      setDocuments(data || []);
    } catch (error) {
      console.error('Error fetching documents:', error);
      toast({
        title: 'Erro',
        description: 'Erro ao carregar documentos',
        variant: 'destructive',
      });
    }
  };

  const fetchMessages = async () => {
    try {
      const { data, error } = await supabase
        .from('user_messages')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: true });

      if (error) throw error;

      setMessages(data || []);
    } catch (error) {
      console.error('Error fetching messages:', error);
      toast({
        title: 'Erro',
        description: 'Erro ao carregar mensagens',
        variant: 'destructive',
      });
    }
  };

  const sendMessage = async () => {
    try {
      const { error } = await supabase
        .from('user_messages')
        .insert([{
          user_id: userId,        // ID do usuário destinatário
          message: newMessage,
          is_admin: true,         // Mensagem enviada por admin
          admin_id: profile.id     // ID do admin remetente
        }]);

      if (error) throw error;

      setNewMessage('');
      await fetchMessages();
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const fetchPreviewUrl = async (fileUrl: string, documentId: string) => {
    try {
      const { data, error } = await supabase.storage
        .from('documents')
        .createSignedUrl(fileUrl, 60);

      if (error) throw error;

      setPreviewUrls((prev) => ({ ...prev, [documentId]: data.signedUrl }));
    } catch (error) {
      console.error('Error fetching preview URL:', error);
      toast({
        title: 'Erro',
        description: 'Erro ao carregar pré-visualização',
        variant: 'destructive',
      });
    }
  };

  const handleDownloadDocument = async (fileUrl: string, filename: string) => {
    try {
      const { data, error } = await supabase.storage
        .from('documents')
        .download(fileUrl);

      if (error) throw error;

      const url = window.URL.createObjectURL(data);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading document:', error);
      toast({
        title: 'Erro',
        description: 'Erro ao baixar documento',
        variant: 'destructive',
      });
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

  const isImage = (fileType: string) => {
    return fileType.startsWith('image/');
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
                <span>{user.document ? user.document.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4') : '-'}</span>
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



          {/* Messages Card */}
          <Card className="shadow-lg rounded-lg overflow-hidden">

            {/* WhatsApp-style header with green background */}
            <CardHeader className="bg-[#075E54] text-white p-3">
              <CardTitle className="text-lg font-semibold">
                {user.name.split(' ')[0]}
              </CardTitle>
            </CardHeader>

            <CardContent className="p-0 bg-[#E5E5E5]">
              {/* Chat area with WhatsApp's light gray background */}
              <div className="h-64 overflow-y-auto space-y-2 p-3 bg-[#E5E5E5]">
                {messages.length > 0 ? (
                  messages.map((msg) => {
                    const isAdmin = msg.is_admin;

                    return (
                      <div
                        key={msg.id}
                        className={`flex ${isAdmin ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`relative max-w-[70%] rounded-lg px-3 py-2 shadow-sm ${isAdmin
                              ? 'bg-[#DCF8C6] text-gray-900' // Sent message (green)
                              : 'bg-white text-gray-900' // Received message (white)
                            }`}
                          style={{
                            borderRadius: isAdmin
                              ? '10px 10px 0 10px' // Tail effect for sent messages
                              : '10px 10px 10px 0', // Tail effect for received messages
                          }}
                        >
                          {/* Sender name (optional, hidden for admin) */}
                          {!isAdmin && (
                            <div className="text-xs font-semibold text-[#075E54] mb-1">
                              {user.name.split(' ')[0]}
                            </div>
                          )}
                          {/* Message content */}
                          <div className="text-sm break-words">{msg.message}</div>
                          {/* Timestamp */}
                          <div className="text-[10px] text-gray-500 text-right mt-1">
                            {new Date(msg.created_at).toLocaleTimeString('pt-BR', {
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </div>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="h-full flex items-center justify-center">
                    <p className="text-sm text-gray-500">
                      Nenhuma mensagem ainda. Inicie a conversa!
                    </p>
                  </div>
                )}
              </div>

              {/* Input area with WhatsApp-style rounded input and send button */}
              <div className="flex items-center gap-2 bg-[#E5E5E5] p-2">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Mensagem"
                  className="flex-1 bg-white rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#25D366] placeholder-gray-500"
                  onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                />
                <Button
                  onClick={sendMessage}
                  size="icon"
                  disabled={!newMessage.trim()}
                  className="bg-[#25D366] hover:bg-[#20B859] rounded-full w-10 h-10 flex items-center justify-center"
                >
                  {/* Paper plane icon for send button */}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="white"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="w-5 h-5"
                  >
                    <line x1="22" y1="2" x2="11" y2="13" />
                    <polygon points="22 2 15 22 11 13 2 9 22 2" />
                  </svg>
                </Button>
              </div>
            </CardContent>
          </Card>


          {/* Documents */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="w-5 h-5 mr-2" />
                Documentos Enviados
              </CardTitle>
            </CardHeader>
            <CardContent>
              {documents.length > 0 ? (
                <div className="space-y-4">
                  {documents.map((doc) => (
                    <div key={doc.id} className="border rounded-lg p-4 bg-gray-50">
                      <div className="flex justify-between items-start mb-2">
                        <p className="text-sm text-gray-600">
                          {doc.filename}
                        </p>
                        <span className="text-xs text-gray-500">
                          {new Date(doc.created_at).toLocaleDateString('pt-BR')}
                        </span>
                      </div>
                      <div className="flex items-center text-sm text-gray-500 mb-2">
                        <span className="mr-2">{doc.file_type}</span>
                        <span>{(doc.file_size / 1024).toFixed(2)} KB</span>
                      </div>
                      <div className="mt-2 flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => fetchPreviewUrl(doc.file_url, doc.id)}
                        >
                          <Eye className="w-4 h-4 mr-2" />
                          Visualizar
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDownloadDocument(doc.file_url, doc.filename)}
                        >
                          <Download className="w-4 h-4 mr-2" />
                          Baixar
                        </Button>
                      </div>
                      {previewUrls[doc.id] && (
                        <div className="mt-4">
                          {isImage(doc.file_type) ? (
                            <img
                              src={previewUrls[doc.id]}
                              alt={doc.filename}
                              className="max-w-full h-auto rounded-md"
                              style={{ maxHeight: '300px' }}
                            />
                          ) : (
                            <a
                              href={previewUrls[doc.id]}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:underline"
                            >
                              Abrir arquivo em nova aba
                            </a>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <FileText className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p>Nenhum documento enviado</p>
                </div>
              )}
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