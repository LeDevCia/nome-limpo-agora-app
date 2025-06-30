
import React, { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import Header from '@/components/Header';
import { 
  CheckCircle, 
  Clock, 
  FileText, 
  MessageSquare, 
  CreditCard,
  Upload,
  AlertCircle
} from 'lucide-react';

const Dashboard = () => {
  const { profile, isAuthenticated } = useAuth();
  const [uploadedDocs, setUploadedDocs] = useState<string[]>([]);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

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

  const statusInfo = getStatusInfo(profile?.status || 'pendente');

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const newFiles = Array.from(files).map(file => file.name);
      setUploadedDocs(prev => [...prev, ...newFiles]);
    }
  };

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
            Olá, {profile?.name?.split(' ')[0] || 'Usuário'}!
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
            {profile?.status === 'proposals_available' && (
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
                      onChange={handleFileUpload}
                      className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100"
                    />
                  </div>
                  
                  {uploadedDocs.length > 0 && (
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-2">
                        Documentos Enviados:
                      </h4>
                      <ul className="space-y-1">
                        {uploadedDocs.map((doc, index) => (
                          <li key={index} className="flex items-center space-x-2 text-sm text-gray-600">
                            <CheckCircle className="w-4 h-4 text-green-500" />
                            <span>{doc}</span>
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
            {/* User Info Card */}
            <Card>
              <CardHeader>
                <CardTitle>Suas Informações</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="text-sm text-gray-600">CPF</p>
                  <p className="font-medium">{profile?.document}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">E-mail</p>
                  <p className="font-medium">{profile?.email}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">WhatsApp</p>
                  <p className="font-medium">{profile?.phone}</p>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Ações Rápidas</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <a 
                  href="https://wa.me/5511999999999?text=Olá! Preciso de ajuda com meu processo no Nome Limpo Agora."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block"
                >
                  <Button variant="outline" className="w-full flex items-center space-x-2">
                    <MessageSquare className="w-4 h-4" />
                    <span>Falar no WhatsApp</span>
                  </Button>
                </a>
                
                <Link to="/beneficios">
                  <Button variant="outline" className="w-full flex items-center space-x-2">
                    <CreditCard className="w-4 h-4" />
                    <span>Ver Benefícios</span>
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Next Steps */}
            {profile?.status === 'finalizado' && (
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
