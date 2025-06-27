
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { User, LogOut } from 'lucide-react';
import Logo from './Logo';

const Header = () => {
  const { isAuthenticated, isAdmin, logout, profile, getRedirectPath } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const handleLogoClick = () => {
    const redirectPath = getRedirectPath();
    navigate(redirectPath);
  };

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div 
            className="cursor-pointer" 
            onClick={handleLogoClick}
          >
            <Logo />
          </div>
          
          <nav className="hidden md:flex items-center space-x-6">
            {!isAdmin && (
              <>
                <Link to="/beneficios" className="text-gray-700 hover:text-green-600 transition-colors">
                  Benefícios
                </Link>
                <Link to="/contato" className="text-gray-700 hover:text-green-600 transition-colors">
                  Contato
                </Link>
              </>
            )}
            
            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <User className="w-4 h-4 text-gray-600" />
                  <span className="text-gray-700">
                    {profile?.name?.split(' ')[0] || 'Usuário'}
                  </span>
                </div>
                <Button
                  variant="outline"
                  onClick={handleLogout}
                  className="flex items-center space-x-2"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sair</span>
                </Button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link to="/login">
                  <Button variant="outline">Entrar</Button>
                </Link>
                <Link to="/cadastro">
                  <Button className="gradient-primary text-white">
                    Cadastrar
                  </Button>
                </Link>
              </div>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
