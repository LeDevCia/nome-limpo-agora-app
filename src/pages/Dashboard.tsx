import React, { useState, useEffect } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import Header from '@/components/Header';

import {
  CheckCircle,
  Clock,
  FileText,
  MessageSquare,
  CreditCard,
  Upload,
  AlertCircle,
  X
} from 'lucide-react';

interface UserMessage {
  id: string;
  user_id: string;
  admin_id: string | null;
  message: string;
  is_admin: boolean;
  created_at: string;
}

interface UserDocument {
  id: string;
  user_id: string;
  filename: string;
  file_url: string;
  file_type: string;
  file_size: number;
  created_at: string;
}

const Dashboard = () => {
  const { profile, isAuthenticated, isAdmin } = useAuth();
  const [documents, setDocuments] = useState<UserDocument[]>([]);
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();
  const [messages, setMessages] = useState<UserMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [filePreviews, setFilePreviews] = useState<{url: string, name: string, type: string, id: string}[]>([]);

  // Redirect admins to /admin and handle unauthenticated users
  if (!isAuthenticated || !profile) {
    return <Navigate to="/login" replace />;
  }
  if (isAdmin) {
    return <Navigate to="/admin" replace />;
  }

  useEffect(() => {
    if (profile?.id) {
      fetchDocuments();
      fetchMessages();
    }
  }, [profile]);

  useEffect(() => {
    return () => {
      filePreviews.forEach(preview => URL.revokeObjectURL(preview.url));
    };
  }, [filePreviews]);

  const fetchDocuments = async () => {
    try {
      const { data, error } = await supabase
        .from('user_documents')
        .select('*')
        .eq('user_id', profile.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching documents:', error);
        toast({
          title: 'Erro',
          description: 'Erro ao buscar documentos enviados',
          variant: 'destructive',
        });
        return;
      }

      setDocuments(data || []);
    } catch (error) {
      console.error('Error fetching documents:', error);
      toast({
        title: 'Erro',
        description: 'Erro ao buscar documentos enviados',
        variant: 'destructive',
      });
    }
  };

  const handleFileSelection = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const files = Array.from(event.target.files);
      setSelectedFiles(files);
      
      const newPreviews = files.map(file => ({
        url: URL.createObjectURL(file),
        name: file.name,
        type: file.type,
        id: Math.random().toString(36).substring(2, 9)
      }));
      setFilePreviews(newPreviews);
    }
  };

  const handleFileUpload = async (files: File[]) => {
    if (!files || files.length === 0 || !profile.id) return;

    setUploading(true);

    try {
      for (const file of files) {
        if (file.size > 5 * 1024 * 1024) {
          toast({
            title: 'Erro',
            description: `O arquivo ${file.name} excede o limite de 5MB`,
            variant: 'destructive',
          });
          continue;
        }

        const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'];
        if (!allowedTypes.includes(file.type)) {
          toast({
            title: 'Erro',
            description: `Apenas arquivos PDF, JPG e PNG são permitidos para ${file.name}`,
            variant: 'destructive',
          });
          continue;
        }

        const fileExt = file.name.split('.').pop();
        const fileName = `${profile.id}/${Date.now()}.${fileExt}`;

        const { error: uploadError } = await supabase.storage
          .from('documents')
          .upload(fileName, file);

        if (uploadError) {
          console.error('Error uploading file:', uploadError);
          toast({
            title: 'Erro',
            description: `Erro ao fazer upload do documento ${file.name}`,
            variant: 'destructive',
          });
          continue;
        }

        const { error: insertError } = await supabase
          .from('user_documents')
          .insert([{
            user_id: profile.id,
            filename: file.name,
            file_url: fileName,
            file_type: file.type,
            file_size: file.size
          }]);

        if (insertError) {
          console.error('Error inserting document:', insertError);
          toast({
            title: 'Erro',
            description: `Erro ao salvar o documento ${file.name}`,
            variant: 'destructive',
          });
          continue;
        }
      }

      toast({
        title: 'Sucesso',
        description: 'Documentos enviados com sucesso',
      });
      fetchDocuments();
    } catch (error: any) {
      console.error('Error during upload:', error);
      toast({
        title: 'Erro',
        description: 'Erro ao enviar documentos: ' + (error.message || 'Erro desconhecido'),
        variant: 'destructive',
      });
    } finally {
      setUploading(false);
      setSelectedFiles([]);
      setFilePreviews([]);
      const fileInput = document.getElementById('document-upload') as HTMLInputElement;
      if (fileInput) fileInput.value = '';
    }
  };

  const handleCancelUpload = () => {
    setSelectedFiles([]);
    setFilePreviews([]);
    const fileInput = document.getElementById('document-upload') as HTMLInputElement;
    if (fileInput) fileInput.value = '';
  };

  const removeFilePreview = (id: string) => {
    setFilePreviews(prev => {
      const newPreviews = prev.filter(p => p.id !== id);
      return newPreviews;
    });
    setSelectedFiles(prev => {
      const previewIndex = filePreviews.findIndex(p => p.id === id);
      return prev.filter((_, index) => index !== previewIndex);
    });
  };

  const fetchMessages = async () => {
    try {
      const { data, error } = await supabase
        .from('user_messages')
        .select('*')
        .eq('user_id', profile.id)
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
    if (!newMessage.trim() || !profile.id) return;

    try {
      const { error } = await supabase
        .from('user_messages')
        .insert([{
          user_id: profile.id,
          message: newMessage,
          is_admin: false
        }]);

      if (error) throw error;

      setNewMessage('');
      await fetchMessages();
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: 'Erro',
        description: 'Erro ao enviar mensagem',
        variant: 'destructive',
      });
    }
  };

  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'pendente':
        return {
          label: 'Aguardando Análise',
          color: 'bg-yellow-500',
          progress: 20,
          icon: <Clock className="w-5 h-5" />,
          description: 'Recebemos seus dados e iniciamos a análise do seu CPF.'
        };
      case 'em_analise':
        return {
          label: 'Analisando Débitos',
          color: 'bg-blue-500',
          progress: 50,
          icon: <FileText className="w-5 h-5" />,
          description: 'Nossa equipe está analisando seus débitos e buscando as melhores condições de negociação.'
        };
      case 'proposals_available':
        return {
          label: 'Propostas Disponíveis',
          color: 'bg-green-500',
          progress: 80,
          icon: <CreditCard className="w-5 h-5" />,
          description: 'Temos propostas de quitação! Verifique as opções disponíveis.'
        };
      case 'finalizado':
        return {
          label: 'Processo Concluído',
          color: 'bg-green-600',
          progress: 100,
          icon: <CheckCircle className="w-5 h-5" />,
          description: 'Parabéns! Seu nome foi limpo com sucesso. Confira os benefícios disponíveis.'
        };
      default:
        return {
          label: 'Status Desconhecido',
          color: 'bg-gray-500',
          progress: 0,
          icon: <AlertCircle className="w-5 h-5" />,
          description: 'Entre em contato conosco para verificar o status.'
        };
    }
  };

  const statusInfo = getStatusInfo(profile.status || 'pendente');

  const mockProposals = [
    {
      creditor: 'Banco XYZ',
      originalAmount: 'R$ 2.500,00',
      discountedAmount: 'R$ 750,00',
      discount: '70%',
      installments: '3x de R$ 250,00'
    },
    {
      creditor: 'Loja ABC',
      originalAmount: 'R$ 890,00',
      discountedAmount: 'R$ 267,00',
      discount: '70%',
      installments: 'À vista'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Olá, {profile.name?.split(' ')[0] || 'Usuário'}!
          </h1>
          <p className="text-gray-600">
            Acompanhe o progresso da limpeza do seu nome
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Status Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Status Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  {statusInfo.icon}
                  <span>Status do Processo</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Badge className={`${statusInfo.color} text-white`}>
                      {statusInfo.label}
                    </Badge>
                    <span className="text-sm text-gray-600">
                      {statusInfo.progress}% concluído
                    </span>
                  </div>

                  <Progress value={statusInfo.progress} className="w-full" />

                  <p className="text-gray-700">
                    {statusInfo.description}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Proposals Card (only show if available) */}
            {profile.status === 'proposals_available' && (
              <Card>
                <CardHeader>
                  <CardTitle>Propostas de Quitação</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {mockProposals.map((proposal, index) => (
                      <div key={index} className="border rounded-lg p-4 bg-green-50">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-semibold text-gray-900">{proposal.creditor}</h4>
                          <Badge className="bg-green-500 text-white">
                            {proposal.discount} OFF
                          </Badge>
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <p className="text-gray-600">Valor Original:</p>
                            <p className="font-semibold line-through text-red-600">
                              {proposal.originalAmount}
                            </p>
                          </div>
                          <div>
                            <p className="text-gray-600">Valor com Desconto:</p>
                            <p className="font-semibold text-green-600">
                              {proposal.discountedAmount}
                            </p>
                          </div>
                        </div>
                        <p className="text-sm text-gray-600 mt-2">
                          Condições: {proposal.installments}
                        </p>
                        <Button className="w-full mt-3 gradient-primary text-white">
                          Aceitar Proposta
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            <Card>
              <CardHeader>
                <CardTitle>Suas Informações</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="text-sm text-gray-600">Nome Completo</p>
                  <p className="font-medium">{profile.name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">CPF</p>
                  <p className="font-medium">{profile.document}</p>
                </div>

                <div>
                  <p className="text-sm text-gray-600">Data de Nascimento</p>
                  <p className="font-medium">{profile.birth_date}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">E-mail</p>
                  <p className="font-medium">{profile.email}</p>
                </div>

                <div>
                  <p className="text-sm text-gray-600">Telefone</p>
                  <p className="font-medium">{profile.phone}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Endereço</p>
                  <p className="font-medium">{profile.address}</p>
                </div>
              </CardContent>
            </Card>

            {/* Documents Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Upload className="w-5 h-5" />
                  <span>Documentos</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <label htmlFor="document-upload" className="block text-sm font-medium text-gray-700 mb-2">
                      Envie documentos adicionais (se solicitado)
                    </label>
                    <input
                      id="document-upload"
                      type="file"
                      multiple
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={handleFileSelection}
                      disabled={uploading}
                      className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Arquivos aceitos: PDF, JPG, PNG (máximo 5MB)
                    </p>
                  </div>

                  {/* File Previews */}
                  {filePreviews.length > 0 && (
                    <div className="mt-4 space-y-3">
                      <h4 className="text-sm font-medium text-gray-700">Arquivos selecionados:</h4>
                      <div className="space-y-2">
                        {filePreviews.map((preview, index) => (
                          <div key={preview.id} className="flex items-center p-2 border rounded-lg relative">
                            {preview.type.startsWith('image/') ? (
                              <img 
                                src={preview.url} 
                                alt={preview.name} 
                                className="w-12 h-12 object-cover rounded mr-3"
                              />
                            ) : (
                              <div className="w-12 h-12 bg-gray-100 flex items-center justify-center rounded mr-3">
                                <FileText className="w-6 h-6 text-gray-400" />
                              </div>
                            )}
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-gray-900 truncate">{preview.name}</p>
                              <p className="text-xs text-gray-500">
                                {preview.type.split('/')[1].toUpperCase()} • {(selectedFiles[index]?.size / 1024).toFixed(2)} KB
                              </p>
                            </div>
                            <button
                              onClick={() => removeFilePreview(preview.id)}
                              className="absolute top-1 right-1 p-1 rounded-full hover:bg-gray-100"
                            >
                              <X className="w-4 h-4 text-gray-500" />
                            </button>
                          </div>
                        ))}
                      </div>

                      <div className="flex justify-end space-x-2 pt-2">
                        <Button
                          variant="outline"
                          onClick={handleCancelUpload}
                          disabled={uploading}
                        >
                          Cancelar
                        </Button>
                        <Button
                          onClick={() => handleFileUpload(selectedFiles)}
                          disabled={uploading || selectedFiles.length === 0}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          {uploading ? (
                            <span className="flex items-center">
                              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                              </svg>
                              Enviando...
                            </span>
                          ) : (
                            `Enviar ${selectedFiles.length} arquivo(s)`
                          )}
                        </Button>
                      </div>
                    </div>
                  )}

                  {documents.length > 0 && (
                    <div className="border-t pt-4 mt-4">
                      <h4 className="text-sm font-medium text-gray-700 mb-2">
                        Documentos Enviados:
                      </h4>
                      <ul className="space-y-2">
                        {documents.map((doc) => (
                          <li key={doc.id} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                            <div className="flex items-center space-x-2">
                              <FileText className="w-4 h-4 text-green-500" />
                              <span className="text-sm text-gray-600 truncate max-w-[180px]">
                                {doc.filename || 'Documento sem nome'}
                              </span>
                            </div>
                            <span className="text-xs text-gray-500">
                              {new Date(doc.created_at).toLocaleDateString('pt-BR')}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Messages Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <MessageSquare className="w-5 h-5" />
                  <span>Mensagens</span>
                </CardTitle>
              </CardHeader>

              <CardContent className="flex flex-col space-y-4">
                <div className="flex flex-col gap-2 max-h-64 overflow-y-auto px-1">
                  {messages.length > 0 ? (
                    messages.map((msg) => {
                      const isAdmin = msg.is_admin;

                      return (
                        <div
                          key={msg.id}
                          className={`max-w-[80%] px-4 py-2 rounded-2xl text-sm shadow 
                          ${isAdmin ? 'self-start bg-gray-200 rounded-bl-none text-black' : 'self-end bg-green-100 rounded-br-none text-black'}`}
                        >
                          <div className="flex items-center justify-between mb-1 text-xs">
                            <span className={isAdmin ? 'text-blue-700 font-semibold' : 'text-green-700 font-semibold'}>
                              {isAdmin ? 'Admin' : 'Você'}
                            </span>
                            <span className="text-gray-500">
                              {new Date(msg.created_at).toLocaleTimeString('pt-BR', {
                                hour: '2-digit',
                                minute: '2-digit',
                              })}
                            </span>
                          </div>
                          <p>{msg.message}</p>
                        </div>
                      );
                    })
                  ) : (
                    <p className="text-sm text-gray-500 text-center py-4">Nenhuma mensagem ainda</p>
                  )}
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Digite sua mensagem..."
                    className="flex-1 border rounded-full px-4 py-2 text-sm"
                    onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                  />
                  <Button onClick={sendMessage} size="sm">
                    Enviar
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            

            {/* Next Steps */}
            {profile.status === 'finalizado' && (
              <Card className="border-green-200 bg-green-50">
                <CardHeader>
                  <CardTitle className="text-green-800">🎉 Parabéns!</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-green-700 text-sm mb-4">
                    Seu nome foi limpo com sucesso! Agora você pode acessar:
                  </p>
                  <Link to="/beneficios">
                    <Button className="w-full gradient-primary text-white">
                      Ver Oportunidades
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;