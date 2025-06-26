
import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { 
  CheckCircle, 
  CreditCard, 
  Shield, 
  Users, 
  TrendingUp,
  Star,
  ArrowRight,
  Smartphone,
  DollarSign
} from 'lucide-react';

const Index = () => {
  useEffect(() => {
    // Scroll animation observer
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      },
      { threshold: 0.1 }
    );

    const animatedElements = document.querySelectorAll('.fade-in-scroll');
    animatedElements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  const benefits = [
    {
      icon: <CreditCard className="w-8 h-8 text-primary-600" />,
      title: "Crédito Liberado",
      description: "Acesso a cartões e empréstimos após limpeza do nome"
    },
    {
      icon: <Smartphone className="w-8 h-8 text-secondary-600" />,
      title: "Conta Digital",
      description: "Abertura de contas digitais em bancos parceiros"
    },
    {
      icon: <DollarSign className="w-8 h-8 text-accent-600" />,
      title: "Cashback",
      description: "Cartões com cashback e benefícios exclusivos"
    },
    {
      icon: <Shield className="w-8 h-8 text-primary-600" />,
      title: "Suporte Jurídico",
      description: "Assessoria especializada em recuperação de crédito"
    }
  ];

  const testimonials = [
    {
      name: "Maria Silva",
      text: "Em 30 dias meu nome estava limpo e consegui meu cartão aprovado!",
      rating: 5
    },
    {
      name: "João Santos",
      text: "Serviço excelente, suporte incrível. Recomendo para todos!",
      rating: 5
    },
    {
      name: "Ana Costa",
      text: "Finalmente consegui financiar minha casa própria. Muito obrigada!",
      rating: 5
    }
  ];

  const stats = [
    { number: "10.000+", label: "Clientes Satisfeitos" },
    { number: "95%", label: "Taxa de Sucesso" },
    { number: "30 dias", label: "Prazo Médio" },
    { number: "R$ 999", label: "Investimento Único" }
  ];

  return (
    <div className="min-h-screen">
      <Header />
      
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary-50 to-secondary-50 pt-20 pb-32 overflow-hidden">
        <div className="absolute inset-0 bg-white/80"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 animate-fade-in">
              Seu nome limpo de volta com quem{' '}
              <span className="text-gradient">entende!</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-700 mb-4 animate-fade-in" style={{animationDelay: '0.2s'}}>
              <strong className="text-primary-600">Nome sujo não combina com você!</strong>
            </p>
            
            <p className="text-lg text-gray-600 mb-8 animate-fade-in" style={{animationDelay: '0.4s'}}>
              Por apenas <span className="text-2xl font-bold text-accent-600">R$ 999,99</span>, 
              cuidamos da limpeza do seu nome e oferecemos oportunidades de crédito, 
              conta digital, cartão com cashback e muito mais.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in" style={{animationDelay: '0.6s'}}>
              <Link to="/cadastro">
                <Button size="lg" className="gradient-primary text-white px-8 py-4 text-lg font-semibold hover:scale-105 transition-transform">
                  Comece Agora <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <a href="https://wa.me/5511999999999?text=Olá! Quero saber como limpar meu nome." target="_blank" rel="noopener noreferrer">
                <Button variant="outline" size="lg" className="px-8 py-4 text-lg border-2 hover:bg-primary-50">
                  Falar no WhatsApp
                </Button>
              </a>
            </div>
          </div>
        </div>
        
        {/* Floating elements */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-primary-200 rounded-full opacity-20 animate-bounce-gentle"></div>
        <div className="absolute bottom-20 right-10 w-16 h-16 bg-secondary-200 rounded-full opacity-20 animate-bounce-gentle" style={{animationDelay: '1s'}}></div>
        <div className="absolute top-1/2 left-20 w-12 h-12 bg-accent-200 rounded-full opacity-20 animate-bounce-gentle" style={{animationDelay: '2s'}}></div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white relative -mt-16 z-20">
        <div className="container mx-auto px-4">
          <div className="bg-white rounded-2xl shadow-elevated p-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <div key={index} className="text-center fade-in-scroll">
                  <div className="text-3xl md:text-4xl font-bold text-gradient mb-2">
                    {stat.number}
                  </div>
                  <div className="text-gray-600 font-medium">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 fade-in-scroll">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Transforme sua vida financeira
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Recupere sua liberdade financeira e tenha acesso às melhores oportunidades do mercado
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => (
              <Card key={index} className="fade-in-scroll hover:shadow-elevated transition-all duration-300 hover:-translate-y-2">
                <CardContent className="p-6 text-center">
                  <div className="flex justify-center mb-4">
                    {benefit.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {benefit.title}
                  </h3>
                  <p className="text-gray-600">
                    {benefit.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 fade-in-scroll">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Como funciona
            </h2>
            <p className="text-xl text-gray-600">
              Processo simples e transparente para limpar seu nome
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center fade-in-scroll">
              <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
                1
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Cadastre-se</h3>
              <p className="text-gray-600">
                Preencha seus dados e autorize a consulta do seu CPF
              </p>
            </div>
            
            <div className="text-center fade-in-scroll">
              <div className="w-16 h-16 bg-gradient-secondary rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
                2
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Análise</h3>
              <p className="text-gray-600">
                Nossa equipe analisa sua situação e negocia suas dívidas
              </p>
            </div>
            
            <div className="text-center fade-in-scroll">
              <div className="w-16 h-16 bg-gradient-accent rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
                3
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Liberdade</h3>
              <p className="text-gray-600">
                Nome limpo e acesso a crédito, cartões e benefícios
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 fade-in-scroll">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Mais de 10.000 clientes satisfeitos
            </h2>
            <p className="text-xl text-gray-600">
              Veja o que nossos clientes têm a dizer
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="fade-in-scroll">
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-gray-700 mb-4 italic">
                    "{testimonial.text}"
                  </p>
                  <p className="font-semibold text-gray-900">
                    {testimonial.name}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary-600 to-secondary-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto fade-in-scroll">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Pague R$ 999,99 e tenha seu CPF limpo por especialistas
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Você merece crédito, você merece respeito. 
              Transforme sua situação com apoio jurídico e financeiro.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/cadastro">
                <Button size="lg" className="bg-white text-primary-600 hover:bg-gray-100 px-8 py-4 text-lg font-semibold">
                  Quero Limpar Meu Nome <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Link to="/beneficios">
                <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-primary-600 px-8 py-4 text-lg">
                  Ver Benefícios
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
