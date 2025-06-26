
import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { FileText, AlertCircle, Shield } from 'lucide-react';

const Terms = () => {
  return (
    <div className="min-h-screen">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <FileText className="w-16 h-16 text-primary-600 mx-auto mb-4" />
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Termos de Uso
            </h1>
            <p className="text-xl text-gray-600">
              Última atualização: Janeiro de 2024
            </p>
          </div>

          <div className="prose prose-lg max-w-none space-y-8">
            <div className="bg-red-50 border border-red-200 rounded-lg p-6">
              <div className="flex items-start space-x-3">
                <AlertCircle className="w-6 h-6 text-red-600 mt-1" />
                <div>
                  <h3 className="text-lg font-semibold text-red-900 mb-2">
                    Aviso Importante
                  </h3>
                  <p className="text-red-800">
                    Este serviço <strong>NÃO GARANTE</strong> a concessão de crédito por instituições financeiras. 
                    Nosso trabalho consiste em intermediar a regularização do CPF para facilitar o acesso a oportunidades.
                  </p>
                </div>
              </div>
            </div>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                1. Definições e Aceite
              </h2>
              <p className="text-gray-700 mb-4">
                Ao utilizar os serviços do <strong>Nome Limpo Agora</strong>, você concorda integralmente 
                com estes Termos de Uso. Caso não concorde, não utilize nossos serviços.
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                <li><strong>"Plataforma":</strong> Site e aplicativo Nome Limpo Agora</li>
                <li><strong>"Serviços":</strong> Assessoria para regularização de CPF</li>
                <li><strong>"Usuário/Cliente":</strong> Pessoa que contrata nossos serviços</li>
                <li><strong>"Empresa":</strong> Nome Limpo Agora LTDA</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                2. Descrição dos Serviços
              </h2>
              <p className="text-gray-700 mb-4">
                Oferecemos assessoria especializada para:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                <li>Consulta da situação do CPF nos órgãos de proteção ao crédito</li>
                <li>Análise detalhada dos débitos pendentes</li>
                <li>Negociação com credores para obtenção de descontos</li>
                <li>Intermediação do processo de quitação</li>
                <li>Orientação sobre melhores práticas financeiras</li>
                <li>Indicação para produtos financeiros após regularização</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                3. Valor e Forma de Pagamento
              </h2>
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                <p className="text-green-800 font-semibold">
                  Valor único: R$ 999,99 (novecentos e noventa e nove reais e noventa e nove centavos)
                </p>
              </div>
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                <li>Pagamento à vista ou parcelado (conforme disponibilidade)</li>
                <li>Cobrança única, sem mensalidades</li>
                <li>Valor não reembolsável após início dos trabalhos</li>
                <li>Preços sujeitos a alteração sem aviso prévio</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                4. Obrigações do Cliente
              </h2>
              <p className="text-gray-700 mb-4">
                Ao contratar nossos serviços, você se compromete a:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                <li>Fornecer informações verdadeiras e atualizadas</li>
                <li>Autorizar consulta ao CPF nos órgãos competentes</li>
                <li>Enviar documentos solicitados dentro dos prazos</li>
                <li>Responder prontamente às comunicações</li>
                <li>Efetuar pagamentos conforme orientação</li>
                <li>Não utilizar informações para fins ilícitos</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                5. Obrigações da Empresa
              </h2>
              <p className="text-gray-700 mb-4">
                Comprometemo-nos a:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                <li>Prestar assessoria especializada e profissional</li>
                <li>Manter sigilo absoluto sobre suas informações</li>
                <li>Negociar com credores em busca dos melhores acordos</li>
                <li>Informar regularmente sobre o andamento do processo</li>
                <li>Respeitar prazos acordados</li>
                <li>Cumprir a legislação de proteção de dados</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                6. Limitações e Exclusões de Responsabilidade
              </h2>
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
                <p className="text-yellow-800 font-semibold">
                  ⚠️ ATENÇÃO: Não garantimos resultados específicos
                </p>
              </div>
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                <li>Não garantimos aprovação de crédito após limpeza do nome</li>
                <li>Não controlamos decisões de instituições financeiras</li>
                <li>Sucesso da negociação depende da colaboração dos credores</li>
                <li>Prazos podem variar conforme complexidade do caso</li>
                <li>Não nos responsabilizamos por informações incorretas fornecidas</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                7. Prazo de Execução
              </h2>
              <p className="text-gray-700 mb-4">
                O prazo estimado para conclusão dos trabalhos é de <strong>30 a 60 dias úteis</strong>, 
                podendo variar conforme:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                <li>Quantidade e complexidade dos débitos</li>
                <li>Resposta dos credores às negociações</li>
                <li>Documentação necessária</li>
                <li>Cooperação do cliente</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                8. Direito de Arrependimento
              </h2>
              <p className="text-gray-700 mb-4">
                Conforme o Código de Defesa do Consumidor, você tem direito de arrependimento:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                <li><strong>Prazo:</strong> 7 dias corridos após a contratação</li>
                <li><strong>Reembolso:</strong> 100% do valor pago</li>
                <li><strong>Condição:</strong> Desde que não tenha iniciado negociações</li>
                <li><strong>Como exercer:</strong> Contato via WhatsApp ou e-mail</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                9. Cancelamento e Rescisão
              </h2>
              <p className="text-gray-700 mb-4">
                O contrato pode ser rescindido:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                <li><strong>Pelo cliente:</strong> A qualquer momento, sem reembolso após 7 dias</li>
                <li><strong>Pela empresa:</strong> Em caso de descumprimento dos termos</li>
                <li><strong>Mútuo acordo:</strong> Condições a serem negociadas</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                10. Propriedade Intelectual
              </h2>
              <p className="text-gray-700">
                Todo conteúdo da plataforma (textos, imagens, logos, etc.) é de propriedade 
                exclusiva do Nome Limpo Agora, protegido por direitos autorais.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                11. Modificações dos Termos
              </h2>
              <p className="text-gray-700">
                Reservamo-nos o direito de alterar estes termos a qualquer momento. 
                Alterações significativas serão comunicadas com antecedência de 30 dias.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                12. Lei Aplicável e Foro
              </h2>
              <p className="text-gray-700">
                Estes termos são regidos pela legislação brasileira. Fica eleito o 
                foro da comarca de São Paulo - SP para dirimir questões decorrentes deste contrato.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                <Shield className="w-6 h-6 mr-2 text-primary-600" />
                13. Contato
              </h2>
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                <p className="text-gray-700 mb-4">
                  Dúvidas sobre estes termos? Entre em contato:
                </p>
                <ul className="space-y-2 text-gray-700">
                  <li><strong>E-mail:</strong> juridico@nomelimpoagora.com.br</li>
                  <li><strong>WhatsApp:</strong> (11) 99999-9999</li>
                  <li><strong>Endereço:</strong> Av. Paulista, 1000 - Sala 1001, São Paulo - SP</li>
                  <li><strong>CNPJ:</strong> 00.000.000/0001-00</li>
                </ul>
              </div>
            </section>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mt-8">
              <h3 className="text-lg font-semibold text-blue-900 mb-2">
                ✅ Ao Continuar, Você Declara:
              </h3>
              <ul className="text-blue-800 text-sm space-y-1">
                <li>• Ter lido e compreendido estes Termos de Uso</li>
                <li>• Concordar integralmente com todas as cláusulas</li>
                <li>• Estar ciente das limitações e exclusões de responsabilidade</li>
                <li>• Autorizar o tratamento dos seus dados conforme a Política de Privacidade</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Terms;
