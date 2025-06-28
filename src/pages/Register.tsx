import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import Header from '@/components/Header';
import { ArrowLeft, Shield, Lock } from 'lucide-react';

const Register = () => {
  const [formData, setFormData] = useState({
    personType: 'fisica' as 'fisica' | 'juridica',
    name: '',
    document: '',
    birthDate: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    password: '',
    confirmPassword: ''
  });
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [acceptedLGPD, setAcceptedLGPD] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { register } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const formatCPF = (value: string) => {
    return value
      .replace(/\D/g, '')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})/, '$1-$2')
      .replace(/(-\d{2})\d+?$/, '$1');
  };

  const formatCNPJ = (value: string) => {
    return value
      .replace(/\D/g, '')
      .replace(/(\d{2})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1/$2')
      .replace(/(\d{4})(\d{1,2})/, '$1-$2')
      .replace(/(-\d{2})\d+?$/, '$1');
  };

  const formatPhone = (value: string) => {
    return value
      .replace(/\D/g, '')
      .replace(/(\d{2})(\d)/, '($1) $2')
      .replace(/(\d{5})(\d)/, '$1-$2')
      .replace(/(-\d{4})\d+?$/, '$1');
  };

  const formatZipCode = (value: string) => {
    return value
      .replace(/\D/g, '')
      .replace(/(\d{5})(\d)/, '$1-$2')
      .replace(/(-\d{3})\d+?$/, '$1');
  };

  const handleDocumentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formData.personType === 'fisica' ? formatCPF(e.target.value) : formatCNPJ(e.target.value);
    setFormData(prev => ({ ...prev, document: formatted }));
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhone(e.target.value);
    setFormData(prev => ({ ...prev, phone: formatted }));
  };

  const handleZipCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatZipCode(e.target.value);
    setFormData(prev => ({ ...prev, zipCode: formatted }));
  };

  const handleLGPDChange = (checked: boolean | "indeterminate") => {
    setAcceptedLGPD(checked === true);
  };

  const handleTermsChange = (checked: boolean | "indeterminate") => {
    setAcceptedTerms(checked === true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!acceptedTerms || !acceptedLGPD) {
      toast({
        title: "Erro no cadastro",
        description: "Você deve aceitar os termos e a política de privacidade para continuar.",
        variant: "destructive"
      });
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Erro no cadastro",
        description: "As senhas não coincidem.",
        variant: "destructive"
      });
      return;
    }

    // Validate document length (CPF: 11 digits, CNPJ: 14 digits)
    const cleanDocument = formData.document.replace(/\D/g, '');
    if (formData.personType === 'fisica' && cleanDocument.length !== 11) {
      toast({
        title: "Erro no cadastro",
        description: "O CPF deve conter 11 dígitos.",
        variant: "destructive"
      });
      return;
    }
    if (formData.personType === 'juridica' && cleanDocument.length !== 14) {
      toast({
        title: "Erro no cadastro",
        description: "O CNPJ deve conter 14 dígitos.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);

    try {
      const result = await register({ ...formData, document: cleanDocument });
      if (result.success) {
        toast({
          title: "Cadastro realizado com sucesso!",
          description: "Bem-vindo ao Nome Limpo Agora. Sua análise será iniciada em breve.",
        });
        navigate('/dashboard');
      } else {
        toast({
          title: "Erro no cadastro",
          description: result.error || "Ocorreu um erro ao realizar o cadastro.",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Erro no cadastro",
        description: "Ocorreu um erro ao realizar o cadastro. Tente novamente.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="mb-6">
            <Link to="/" className="inline-flex items-center text-green-600 hover:text-green-700 mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar ao início
            </Link>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Cadastre-se no Nome Limpo Agora
            </h1>
            <p className="text-gray-600">
              Preencha seus dados para começar a limpar seu nome por apenas R$ 999,99
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Shield className="w-5 h-5 text-green-600" />
                <span>Seus dados estão seguros</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <Label htmlFor="personType">Tipo de Pessoa *</Label>
                  <select
                    id="personType"
                    name="personType"
                    value={formData.personType}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    required
                  >
                    <option value="fisica">Pessoa Física</option>
                    <option value="juridica">Pessoa Jurídica</option>
                  </select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">{formData.personType === 'fisica' ? 'Nome Completo' : 'Razão Social'} *</Label>
                    <Input
                      id="name"
                      name="name"
                      type="text"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      placeholder={formData.personType === 'fisica' ? 'Digite seu nome completo' : 'Digite a razão social'}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="document">{formData.personType === 'fisica' ? 'CPF' : 'CNPJ'} *</Label>
                    <Input
                      id="document"
                      name="document"
                      type="text"
                      required
                      value={formData.document}
                      onChange={handleDocumentChange}
                      placeholder={formData.personType === 'fisica' ? '000.000.000-00' : '00.000.000/0000-00'}
                      maxLength={formData.personType === 'fisica' ? 14 : 18}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="birthDate">{formData.personType === 'fisica' ? 'Data de Nascimento' : 'Data de Fundação'} *</Label>
                    <Input
                      id="birthDate"
                      name="birthDate"
                      type="date"
                      required
                      value={formData.birthDate}
                      onChange={handleChange}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="phone">WhatsApp *</Label>
                    <Input
                      id="phone"
                      name="phone"
                      type="text"
                      required
                      value={formData.phone}
                      onChange={handlePhoneChange}
                      placeholder="(11) 99999-9999"
                      maxLength={15}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="email">E-mail *</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="seu@email.com"
                  />
                </div>

                <div>
                  <Label htmlFor="address">Endereço Completo *</Label>
                  <Input
                    id="address"
                    name="address"
                    type="text"
                    required
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="Rua, número, bairro"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="city">Cidade *</Label>
                    <Input
                      id="city"
                      name="city"
                      type="text"
                      required
                      value={formData.city}
                      onChange={handleChange}
                      placeholder="Sua cidade"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="state">Estado *</Label>
                    <Input
                      id="state"
                      name="state"
                      type="text"
                      required
                      value={formData.state}
                      onChange={handleChange}
                      placeholder="SP"
                      maxLength={2}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="zipCode">CEP *</Label>
                    <Input
                      id="zipCode"
                      name="zipCode"
                      type="text"
                      required
                      value={formData.zipCode}
                      onChange={handleZipCodeChange}
                      placeholder="00000-000"
                      maxLength={9}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="password">Senha *</Label>
                    <Input
                      id="password"
                      name="password"
                      type="password"
                      required
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Mínimo 6 caracteres"
                      minLength={6}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="confirmPassword">Confirmar Senha *</Label>
                    <Input
                      id="confirmPassword"
                      name="confirmPassword"
                      type="password"
                      required
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      placeholder="Digite a senha novamente"
                      minLength={6}
                    />
                  </div>
                </div>

                {/* LGPD Section */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 space-y-4">
                  <div className="flex items-start space-x-3">
                    <Lock className="w-5 h-5 text-blue-600 mt-0.5" />
                    <div>
                      <h3 className="font-semibold text-blue-900 mb-2">
                        Proteção de Dados (LGPD)
                      </h3>
                      <p className="text-sm text-blue-800 leading-relaxed">
                        Seus dados pessoais serão utilizados exclusivamente para consulta do {formData.personType === 'fisica' ? 'CPF' : 'CNPJ'}, 
                        análise da situação financeira e negociação de débitos. Não compartilhamos 
                        suas informações com terceiros sem autorização prévia.
                      </p>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-start space-x-2">
                      <Checkbox 
                        id="lgpd" 
                        checked={acceptedLGPD}
                        onCheckedChange={handleLGPDChange}
                        className="mt-1"
                      />
                      <Label htmlFor="lgpd" className="text-sm text-blue-800 leading-relaxed">
                        Autorizo a consulta do meu {formData.personType === 'fisica' ? 'CPF' : 'CNPJ'} e o uso dos meus dados para análise financeira 
                        e negociação de débitos, conforme descrito na{' '}
                        <Link to="/privacidade" className="text-blue-600 hover:underline font-medium">
                          Política de Privacidade
                        </Link>
                      </Label>
                    </div>
                    
                    <div className="flex items-start space-x-2">
                      <Checkbox 
                        id="terms" 
                        checked={acceptedTerms}
                        onCheckedChange={handleTermsChange}
                        className="mt-1"
                      />
                      <Label htmlFor="terms" className="text-sm text-blue-800 leading-relaxed">
                        Li e aceito os{' '}
                        <Link to="/termos" className="text-blue-600 hover:underline font-medium">
                          Termos de Uso
                        </Link>
                        {' '}e estou ciente de que este serviço não garante concessão de crédito
                      </Label>
                    </div>
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white py-3 text-lg font-semibold shadow-lg"
                  disabled={isLoading || !acceptedTerms || !acceptedLGPD}
                >
                  {isLoading ? 'Cadastrando...' : 'Quero Limpar Meu Nome - R$ 999,99'}
                </Button>

                <div className="text-center">
                  <p className="text-gray-600">
                    Já tem cadastro?{' '}
                    <Link to="/login" className="text-green-600 hover:text-green-700 font-medium">
                      Entre aqui
                    </Link>
                  </p>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Register;