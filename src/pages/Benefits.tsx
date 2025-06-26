
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { 
  CreditCard, 
  Smartphone, 
  DollarSign, 
  TrendingUp,
  Gift,
  Shield,
  Star,
  ArrowRight,
  CheckCircle
} from 'lucide-react';

const Benefits = () => {
  const creditCards = [
    {
      name: 'Cartão Digital Premium',
      limit: 'Até R$ 5.000',
      cashback: '5% em supermercados',
      annualFee: 'Anuidade grátis no 1º ano',
      benefits: ['Cashback em todas as compras', 'Sem anuidade', 'Aprovação facilitada']
    },
    {
      name: 'Cartão Reconstrução',
      limit: 'Até R$ 2.000',
      cashback: '2% em farmácias',
      annualFee: 'Sem anuidade',
      benefits: ['Ideal para recomeçar', 'Limite progressivo', 'App exclusivo']
    }
  ];

  const digitalAccounts = [
    {
      name: 'Banco Digital Verde',
      benefits: ['Conta gratuita', 'PIX ilimitado', 'Cartão de débito grátis'],
      highlight: 'Abertura em 5 minutos'
    },
    {
      name: 'FinTech Azul',
      benefits: ['Rendimento 100% CDI', 'Transferências grátis', 'Investimentos facilitados'],
      highlight: 'Sem taxa de manutenção'
    }
  ];

  const loanOffers = [
    {
      name: 'Empréstimo Pessoal',
      amount: 'Até R$ 15.000',
      rate: 'A partir de 2,9% a.m.',
      term: 'Até 36 meses'
    },
    {
      name: 'Crédito Consignado',
      amount: 'Até R$ 50.000',
      rate: 'A partir de 1,8% a.m.',
      term: 'Até 84 meses'
    }
  ];

  const partnersOffers = [
    {
      category: 'Educação',
      partner: 'Universidade Online',
      offer: '70% de desconto em cursos',
      validity: 'Válido por 6 meses'
    },
    {
      category: 'Saúde',
      partner: 'Rede de Clínicas',
      offer: '50% off em consultas',
      validity: 'Válido por 12 meses'
    },
    {
      category: 'Tecnologia',
      partner: 'Loja Tech',
      offer: '30% em smartphones',
      validity: 'Válido por 3 meses'
    }
  ];

  return (
    <div className="min-h-screen">
      <Header />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-600 to-secondary-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Seus Benefícios Exclusivos
          </h1>
          <p className="text-xl mb-8 opacity-90 max-w-3xl mx-auto">
            Após limpar seu nome, você terá acesso às melhores oportunidades do mercado financeiro
          </p>
          <Link to="/cadastro">
            <Button size="lg" className="bg-white text-primary-600 hover:bg-gray-100 px-8 py-4 text-lg font-semibold">
              Quero Ter Acesso <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Credit Cards Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <CreditCard className="w-12 h-12 text-primary-600 mx-auto mb-4" />
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Cartões de Crédito Exclusivos
            </h2>
            <p className="text-xl text-gray-600">
              Cartões com aprovação facilitada para quem limpou o nome
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {creditCards.map((card, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-xl">{card.name}</CardTitle>
                      <p className="text-primary-600 font-semibold">{card.limit}</p>
                    </div>
                    <Badge className="bg-accent-500 text-white">
                      {card.cashback}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <p className="text-sm text-gray-600">{card.annualFee}</p>
                    <ul className="space-y-2">
                      {card.benefits.map((benefit, i) => (
                        <li key={i} className="flex items-center space-x-2 text-sm">
                          <CheckCircle className="w-4 h-4 text-green-500" />
                          <span>{benefit}</span>
                        </li>
                      ))}
                    </ul>
                    <Button className="w-full mt-4 gradient-primary text-white">
                      Quero Ser Indicado
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Digital Accounts Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <Smartphone className="w-12 h-12 text-secondary-600 mx-auto mb-4" />
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Contas Digitais Parceiras
            </h2>
            <p className="text-xl text-gray-600">
              Bancos digitais com abertura facilitada
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {digitalAccounts.map((account, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-xl">{account.name}</CardTitle>
                    <Badge variant="outline" className="text-green-600 border-green-600">
                      {account.highlight}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 mb-4">
                    {account.benefits.map((benefit, i) => (
                      <li key={i} className="flex items-center space-x-2 text-sm">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <span>{benefit}</span>
                      </li>
                    ))}
                  </ul>
                  <Button className="w-full gradient-secondary text-white">
                    Abrir Conta
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Loans Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <DollarSign className="w-12 h-12 text-accent-600 mx-auto mb-4" />
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Empréstimos com Taxas Especiais
            </h2>
            <p className="text-xl text-gray-600">
              Crédito disponível após regularização do CPF
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {loanOffers.map((loan, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="text-xl">{loan.name}</CardTitle>
                  <p className="text-2xl font-bold text-accent-600">{loan.amount}</p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Taxa:</span>
                      <span className="font-semibold">{loan.rate}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Prazo:</span>
                      <span className="font-semibold">{loan.term}</span>
                    </div>
                  </div>
                  <Button className="w-full gradient-accent text-white">
                    Simular Empréstimo
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Partners Offers Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <Gift className="w-12 h-12 text-primary-600 mx-auto mb-4" />
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Descontos e Parcerias Exclusivas
            </h2>
            <p className="text-xl text-gray-600">
              Benefícios especiais em diversas categorias
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {partnersOffers.map((offer, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <Badge className="w-fit mb-2 bg-primary-100 text-primary-700">
                    {offer.category}
                  </Badge>
                  <CardTitle className="text-lg">{offer.partner}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold text-accent-600 mb-2">
                    {offer.offer}
                  </p>
                  <p className="text-sm text-gray-600 mb-4">{offer.validity}</p>
                  <Button variant="outline" className="w-full">
                    Resgatar Oferta
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-primary-600 to-secondary-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Pronto para ter acesso a todos esses benefícios?
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Limpe seu nome por R$ 999,99 e tenha acesso imediato a cartões, contas digitais, 
              empréstimos e muito mais!
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/cadastro">
                <Button size="lg" className="bg-white text-primary-600 hover:bg-gray-100 px-8 py-4 text-lg font-semibold">
                  Começar Agora <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <a href="https://wa.me/5511999999999?text=Quero saber mais sobre os benefícios do Nome Limpo Agora!" target="_blank" rel="noopener noreferrer">
                <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-primary-600 px-8 py-4 text-lg">
                  Falar no WhatsApp
                </Button>
              </a>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Benefits;
