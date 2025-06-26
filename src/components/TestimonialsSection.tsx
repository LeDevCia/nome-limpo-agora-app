
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Star } from 'lucide-react';
import ScrollReveal from './ScrollReveal';

const TestimonialsSection = () => {
  const testimonials = [
    {
      name: "Maria S.",
      rating: 5,
      text: "Incrível! Em apenas 25 dias meu nome estava limpo. Consegui fazer o financiamento da casa própria!",
      location: "São Paulo - SP"
    },
    {
      name: "João M.",
      rating: 5,
      text: "Serviço excelente! A equipe me ajudou com tudo e conseguiu um desconto de 80% nas minhas dívidas.",
      location: "Rio de Janeiro - RJ"
    },
    {
      name: "Ana C.",
      rating: 5,
      text: "Recomendo! Processo simples e rápido. Finalmente consegui voltar a ter crédito no mercado.",
      location: "Belo Horizonte - MG"
    },
    {
      name: "Carlos R.",
      rating: 5,
      text: "Excelente custo-benefício! R$ 999 para limpar o nome foi o melhor investimento que fiz.",
      location: "Curitiba - PR"
    },
    {
      name: "Fernanda L.",
      rating: 5,
      text: "Equipe muito atenciosa! Explicaram tudo certinho e conseguiram negociar todas as minhas dívidas.",
      location: "Salvador - BA"
    },
    {
      name: "Roberto A.",
      rating: 5,
      text: "Superou minhas expectativas! Nome limpo em 20 dias e ainda consegui cartão de crédito aprovado.",
      location: "Brasília - DF"
    }
  ];

  return (
    <section className="py-16 bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4">
        <ScrollReveal direction="up" className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            O que nossos clientes dizem
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Mais de 1.250 pessoas já transformaram suas vidas com o Nome Limpo Agora
          </p>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <ScrollReveal
              key={index}
              direction="up"
              delay={index * 0.1}
              className="h-full"
            >
              <Card className="h-full hover:shadow-lg transition-shadow duration-300 border-green-100">
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    <div className="flex space-x-1">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star
                          key={i}
                          className="w-5 h-5 fill-yellow-400 text-yellow-400"
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-gray-700 mb-4 italic">
                    "{testimonial.text}"
                  </p>
                  <div className="border-t pt-4">
                    <p className="font-semibold text-gray-900">
                      {testimonial.name}
                    </p>
                    <p className="text-sm text-gray-500">
                      {testimonial.location}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
