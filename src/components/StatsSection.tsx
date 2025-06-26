
import React from 'react';
import AnimatedCounter from './AnimatedCounter';
import ScrollReveal from './ScrollReveal';

const StatsSection = () => {
  return (
    <section className="py-16 bg-gradient-to-r from-green-600 to-green-700">
      <div className="container mx-auto px-4">
        <ScrollReveal direction="up" className="text-center mb-12">
          <h2 className="text-4xl font-bold text-white mb-4">
            Resultados que falam por si
          </h2>
          <p className="text-xl text-green-100 max-w-2xl mx-auto">
            Números reais de uma empresa que transforma vidas
          </p>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <ScrollReveal direction="up" delay={0.1} className="text-center">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
              <div className="text-4xl font-bold text-white mb-2">
                <AnimatedCounter end={1250} suffix="+" />
              </div>
              <p className="text-green-100 text-lg font-medium">
                Clientes Satisfeitos
              </p>
            </div>
          </ScrollReveal>

          <ScrollReveal direction="up" delay={0.2} className="text-center">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
              <div className="text-4xl font-bold text-white mb-2">
                <AnimatedCounter end={97} suffix="%" />
              </div>
              <p className="text-green-100 text-lg font-medium">
                Taxa de Sucesso
              </p>
            </div>
          </ScrollReveal>

          <ScrollReveal direction="up" delay={0.3} className="text-center">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
              <div className="text-4xl font-bold text-white mb-2">
                <AnimatedCounter end={30} suffix=" dias" />
              </div>
              <p className="text-green-100 text-lg font-medium">
                Prazo Médio
              </p>
            </div>
          </ScrollReveal>

          <ScrollReveal direction="up" delay={0.4} className="text-center">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
              <div className="text-4xl font-bold text-white mb-2">
                R$ <AnimatedCounter end={999} suffix=",99" />
              </div>
              <p className="text-green-100 text-lg font-medium">
                Investimento Único
              </p>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
