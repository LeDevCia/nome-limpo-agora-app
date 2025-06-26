
import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Shield, Lock, Eye, FileText } from 'lucide-react';

const Privacy = () => {
  return (
    <div className="min-h-screen">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <Shield className="w-16 h-16 text-primary-600 mx-auto mb-4" />
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Política de Privacidade
            </h1>
            <p className="text-xl text-gray-600">
              Última atualização: Janeiro de 2024
            </p>
          </div>

          <div className="prose prose-lg max-w-none space-y-8">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <div className="flex items-start space-x-3">
                <Lock className="w-6 h-6 text-blue-600 mt-1" />
                <div>
                  <h3 className="text-lg font-semibold text-blue-900 mb-2">
                    Compromisso com sua Privacidade
                  </h3>
                  <p className="text-blue-800">
                    O Nome Limpo Agora está comprometido com a proteção dos seus dados pessoais 
                    e o cumprimento integral da Lei Geral de Proteção de Dados (LGPD - Lei 13.709/2018).
                  </p>
                </div>
              </div>
            </div>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                <FileText className="w-6 h-6 mr-2 text-primary-600" />
                1. Dados Coletados
              </h2>
              <p className="text-gray-700 mb-4">
                Coletamos os seguintes dados pessoais:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                <li><strong>Dados de Identificação:</strong> Nome completo, CPF, RG, data de nascimento</li>
                <li><strong>Dados de Contato:</strong> E-mail, telefone, WhatsApp, endereço completo</li>
                <li><strong>Dados Financeiros:</strong> Informações sobre débitos e situação de crédito</li>
                <li><strong>Dados de Navegação:</strong> Endereço IP, cookies, logs de acesso</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                2. Finalidade do Tratamento
              </h2>
              <p className="text-gray-700 mb-4">
                Seus dados são utilizados exclusivamente para:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                <li>Consulta da situação do CPF nos órgãos de proteção ao crédito</li>
                <li>Análise da situação financeira e identificação de débitos</li>
                <li>Negociação com credores para quitação de dívidas</li>
                <li>Comunicação sobre o andamento do processo</li>
                <li>Oferecimento de produtos e serviços financeiros após regularização</li>
                <li>Cumprimento de obrigações legais e regulamentares</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                3. Base Legal
              </h2>
              <p className="text-gray-700 mb-4">
                O tratamento dos seus dados está fundamentado em:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                <li><strong>Consentimento:</strong> Você autoriza expressamente o uso dos dados</li>
                <li><strong>Execução de Contrato:</strong> Necessário para prestação do serviço contratado</li>
                <li><strong>Legítimo Interesse:</strong> Para oferecimento de produtos relacionados</li>
                <li><strong>Cumprimento Legal:</strong> Obrigações legais e regulamentares</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                4. Compartilhamento de Dados
              </h2>
              <p className="text-gray-700 mb-4">
                Seus dados podem ser compartilhados com:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                <li>Órgãos de proteção ao crédito (SPC, Serasa, etc.)</li>
                <li>Credores para negociação de débitos</li>
                <li>Instituições financeiras parceiras</li>
                <li>Prestadores de serviços terceirizados</li>
                <li>Autoridades governamentais, quando legalmente exigido</li>
              </ul>
              <p className="text-gray-700 mt-4">
                <strong>Importante:</strong> Nunca vendemos seus dados pessoais para terceiros.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                5. Segurança dos Dados
              </h2>
              <p className="text-gray-700 mb-4">
                Implementamos medidas técnicas e organizacionais para proteger seus dados:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                <li>Criptografia de dados sensíveis</li>
                <li>Controle de acesso restrito</li>
                <li>Monitoramento contínuo de segurança</li>
                <li>Backups seguros e regulares</li>
                <li>Treinamento da equipe sobre proteção de dados</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                <Eye className="w-6 h-6 mr-2 text-primary-600" />
                6. Seus Direitos
              </h2>
              <p className="text-gray-700 mb-4">
                Conforme a LGPD, você tem direito a:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                <li><strong>Confirmação:</strong> Saber se tratamos seus dados</li>
                <li><strong>Acesso:</strong> Obter cópia dos seus dados</li>
                <li><strong>Correção:</strong> Corrigir dados incompletos ou incorretos</li>
                <li><strong>Anonimização:</strong> Tornar os dados anônimos</li>
                <li><strong>Portabilidade:</strong> Transferir dados para outro fornecedor</li>
                <li><strong>Eliminação:</strong> Excluir dados desnecessários</li>
                <li><strong>Revogação:</strong> Retirar o consentimento a qualquer momento</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                7. Retenção de Dados
              </h2>
              <p className="text-gray-700">
                Seus dados são mantidos pelo tempo necessário para:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700 mt-4">
                <li>Cumprimento da finalidade para qual foram coletados</li>
                <li>Atendimento de obrigações legais (mínimo de 5 anos)</li>
                <li>Exercício regular de direitos em processos judiciais</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                8. Cookies e Tecnologias Similares
              </h2>
              <p className="text-gray-700 mb-4">
                Utilizamos cookies para:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                <li>Melhorar a experiência de navegação</li>
                <li>Personalizar conteúdo e ofertas</li>
                <li>Analisar o desempenho do site</li>
                <li>Facilitar o processo de login</li>
              </ul>
              <p className="text-gray-700 mt-4">
                Você pode gerenciar cookies através das configurações do seu navegador.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                9. Alterações na Política
              </h2>
              <p className="text-gray-700">
                Esta política pode ser atualizada periodicamente. Notificaremos sobre alterações 
                significativas através do e-mail cadastrado ou avisos no site.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                10. Contato e DPO
              </h2>
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                <p className="text-gray-700 mb-4">
                  Para exercer seus direitos ou esclarecer dúvidas sobre esta política, entre em contato:
                </p>
                <ul className="space-y-2 text-gray-700">
                  <li><strong>E-mail:</strong> privacidade@nomelimpoagora.com.br</li>
                  <li><strong>WhatsApp:</strong> (11) 99999-9999</li>
                  <li><strong>Endereço:</strong> Av. Paulista, 1000 - Sala 1001, São Paulo - SP</li>
                </ul>
                <p className="text-gray-600 text-sm mt-4">
                  Responderemos sua solicitação em até 15 dias úteis.
                </p>
              </div>
            </section>

            <div className="bg-amber-50 border border-amber-200 rounded-lg p-6 mt-8">
              <h3 className="text-lg font-semibold text-amber-900 mb-2">
                ⚠️ Aviso Importante
              </h3>
              <p className="text-amber-800 text-sm leading-relaxed">
                Este serviço não garante a concessão de crédito por instituições financeiras. 
                Nosso trabalho consiste em intermediar a regularização do CPF para facilitar 
                o acesso a oportunidades financeiras. O sucesso da limpeza do nome depende 
                de diversos fatores, incluindo a cooperação dos credores.
              </p>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Privacy;
