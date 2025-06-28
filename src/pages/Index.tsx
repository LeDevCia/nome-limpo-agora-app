import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Contador from '@/components/Contador';
import { UserPlus, SearchCheck, BadgeCheck } from 'lucide-react';


import {
  CreditCard,
  Shield,
  Smartphone,
  DollarSign,
  ArrowRight,
  Star
} from 'lucide-react';

const Index = () => {
  useEffect(() => {
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
    { number: 10000, label: "Clientes Satisfeitos", suffix: "+" },
    { number: 95, label: "Taxa de Sucesso", suffix: "%" },
    { number: 30, label: "Prazo Médio", suffix: " dias" },
    { number: 999.99, label: "Investimento Único", prefix: "R$ ", decimals: 2 }
  ];

  const steps = [
    {
      title: "Cadastre-se",
      description: "Preencha o formulário com seus dados e envie.",
      icon: <Smartphone className="w-12 h-12 text-primary-600" />
    },
    {
      title: "Análise",
      description: "Nossa equipe analisa sua situação e entra em contato.",
      icon: <Shield className="w-12 h-12 text-secondary-600" />
    },
    {
      title: "Liberdade",
      description: "Seu nome limpo e acesso a crédito em até 30 dias.",
      icon: <DollarSign className="w-12 h-12 text-accent-600" />
    }
  ];

  return (
      <div className="min-h-screen  bg-gray-50 text-gray-900">
        <Header />

        {/* Hero Section */}
        <section className="relative bg-gradient-to-br from-primary-50 to-secondary-500 pt-20 pb-32 overflow-hidden">
          <div className="absolute inset-0 bg-white/80"></div>
          <div className="container mx-auto px-4 relative z-10">
            <div className="text-center max-w-4xl mx-auto">
              <h1 data-aos="fade-right" className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
                Seu nome limpo de volta com quem <span className="text-gradient">entende!</span>
              </h1>
              <p data-aos="fade-left" data-aos-delay="200" className="text-xl md:text-2xl text-gray-700 mb-4">
                <strong className="text-primary-600">Nome sujo não combina com você!</strong>
              </p>
              <p data-aos="fade-right" data-aos-delay="300" className="text-lg text-gray-600 mb-8">
                Por apenas <span className="text-2xl font-bold text-accent-600">R$ 999,99</span>, cuidamos da limpeza do seu nome e oferecemos oportunidades de crédito, conta digital, cartão com cashback e muito mais.
              </p>
              <div data-aos="fade-up" data-aos-delay="500" className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/cadastro">
                  <Button variant='outline' size="lg" className="bg-green-500 text-white  hover:border-green-500 hover:text-white  px-8 py-4 text-lg font-semibold">
                    Comece Agora <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </Link>
                <a href="https://wa.me/5511999999999?text=Olá! Quero saber como limpar meu nome." target="_blank" rel="noopener noreferrer">
                  <Button variant='outline' size="lg" className="bg-green-500 text-white  hover:border-green-500 hover:text-white  px-8 py-4 text-lg font-semibold">
                    Falar no WhatsApp
                  </Button>
                </a>
              </div>
            </div>
          </div>
          <div className="container mx-auto px-4 pt-20">
            <div className="bg-white rounded-2xl shadow-elevated p-8">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                {stats.map((stat, index) => (
                    <div key={index} className="text-center fade-in-scroll">
                      <div className="text-3xl md:text-4xl font-bold text-gradient mb-2">
                        <Contador
                            end={stat.number}
                            prefix={stat.prefix}
                            suffix={stat.suffix}
                            decimals={stat.decimals}
                        />

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
            <div className="text-center mb-16" data-aos="fade-down" data-aos-duration="800" data-aos-easing="ease-out-cubic">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Transforme sua vida financeira
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Recupere sua liberdade financeira e tenha acesso às melhores oportunidades do mercado
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {benefits.map((benefit, index) => (
                  <Card
                      key={index}
                      data-aos="zoom-in"
                      data-aos-delay={index * 100}
                      data-aos-duration="700"
                      data-aos-easing="ease-in-out"
                      className="hover:shadow-elevated transition-all duration-300 hover:-translate-y-2"
                  >
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
            <div
                className="text-center mb-16"
                data-aos="fade-down"
                data-aos-duration="800"
                data-aos-easing="ease-out-cubic"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Como funciona
              </h2>
              <p className="text-xl text-gray-600">
                Processo simples e transparente para limpar seu nome
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              {[
                {
                  title: 'Cadastre-se',
                  desc: 'Preencha seus dados e autorize a consulta do seu CPF',
                  icon: <UserPlus className="w-10 h-10 text-primary-600 mb-3 mx-auto" />
                },
                {
                  title: 'Análise',
                  desc: 'Nossa equipe analisa sua situação e negocia suas dívidas',
                  icon: <SearchCheck className="w-10 h-10 text-secondary-600 mb-3 mx-auto" />
                },
                {
                  title: 'Liberdade',
                  desc: 'Nome limpo e acesso a crédito, cartões e benefícios',
                  icon: <BadgeCheck className="w-10 h-10 text-accent-600 mb-3 mx-auto" />
                }
              ].map((step, i) => {
                const bgGradients = [
                  'bg-gradient-to-r from-primary-500 to-primary-700',
                  'bg-gradient-to-r from-secondary-500 to-secondary-700',
                  'bg-gradient-to-r from-accent-500 to-accent-700'
                ];

                return (
                    <Card
                        key={i}
                        data-aos="fade-up"
                        data-aos-delay={i * 100}
                        data-aos-duration="700"
                        data-aos-easing="ease-in-out"
                        className="shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
                    >
                      <CardContent className="flex justify-center p-4 text-center flex-col items-center">
                        <div className='flex justify-between items-center gap-4 p-4 '>
                          <div
                              className={`w-16 h-16 ${bgGradients[i]} rounded-full flex items-center justify-center text-white text-2xl font-bold`}
                          >
                            {i + 1}
                          </div>
                          <div className='flex justify-center items-center mt-2'>
                            {step.icon}
                          </div>
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">
                          {step.title}
                        </h3>
                        <p className="text-gray-600">{step.desc}</p>
                      </CardContent>
                    </Card>
                );
              })}
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
                  <Button variant='outline' size="lg" className=" border-white text-primary-600 hover:bg-green-500 hover:text-white px-8 py-4 text-lg font-semibold">
                    Quero Limpar Meu Nome <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </Link>
                <Link to="/beneficios">
                  <Button variant="outline" size="lg" className="border-white text-primary-600 hover:bg-green-500 hover:text-white px-8 py-4 text-lg font-semibold">
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
