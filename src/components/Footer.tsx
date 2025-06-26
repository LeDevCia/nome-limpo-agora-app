
import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-10 h-10 bg-gradient-primary rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-lg">NL</span>
              </div>
              <div>
                <h3 className="text-xl font-bold">Nome Limpo Agora</h3>
                <p className="text-sm text-gray-400">Nome sujo não combina com você!</p>
              </div>
            </div>
            <p className="text-gray-400 mb-4 max-w-md">
              Ajudamos você a recuperar seu crédito e ter acesso às melhores oportunidades do mercado financeiro.
              Transforme sua situação com nossa assessoria especializada.
            </p>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">Links Rápidos</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-400 hover:text-white transition-colors">
                  Início
                </Link>
              </li>
              <li>
                <Link to="/beneficios" className="text-gray-400 hover:text-white transition-colors">
                  Benefícios
                </Link>
              </li>
              <li>
                <Link to="/contato" className="text-gray-400 hover:text-white transition-colors">
                  Contato
                </Link>
              </li>
              <li>
                <Link to="/cadastro" className="text-gray-400 hover:text-white transition-colors">
                  Cadastrar
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">Legal</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/privacidade" className="text-gray-400 hover:text-white transition-colors">
                  Política de Privacidade
                </Link>
              </li>
              <li>
                <Link to="/termos" className="text-gray-400 hover:text-white transition-colors">
                  Termos de Uso
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © 2024 Nome Limpo Agora. Todos os direitos reservados.
            </p>
            <p className="text-gray-400 text-sm mt-2 md:mt-0">
              CNPJ: 00.000.000/0001-00
            </p>
          </div>
          
          <div className="mt-4 p-4 bg-gray-800 rounded-lg">
            <p className="text-xs text-gray-400 leading-relaxed">
              <strong className="text-white">AVISO IMPORTANTE:</strong> Este serviço não garante a concessão de crédito, 
              sendo destinado exclusivamente à intermediação para regularização de CPF e acesso a oportunidades financeiras. 
              Os dados coletados são utilizados conforme nossa Política de Privacidade e legislação vigente (LGPD).
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
