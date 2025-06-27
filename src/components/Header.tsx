
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { LogOut, User, Settings, MessageSquare, Phone, Home, LayoutDashboard } from 'lucide-react';
import Logo from './Logo';

const Header = () => {
  const { isAuthenticated, profile, isAdmin, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <header className="bg-white/95 backdrop-blur-sm shadow-sm border-b sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Logo />

          <nav className="hidden md:flex items-center space-x-6">
            {isAuthenticated ? (
              <>
                <Link to="/dashboard" className="text-gray-700 hover:text-green-600 transition-colors font-medium flex items-center space-x-1">
                  <LayoutDashboard className="w-4 h-4" />
                  <span>Dashboard</span>
                </Link>
                {isAdmin && (
                  <>
                    <Link to="/admin" className="text-gray-700 hover:text-green-600 transition-colors font-medium flex items-center space-x-1">
                      <Settings className="w-4 h-4" />
                      <span>Admin</span>
                    </Link>
                    <Link to="/contato" className="text-gray-700 hover:text-green-600 transition-colors font-medium flex items-center space-x-1">
                      <MessageSquare className="w-4 h-4" />
                      <span>Mensagens</span>
                    </Link>
                  </>
                )}
                <Link to="/beneficios" className="text-gray-700 hover:text-green-600 transition-colors font-medium">
                  Benefícios
                </Link>
                <Link to="/contato" className="text-gray-700 hover:text-green-600 transition-colors font-medium">
                  Contato
                </Link>
              </>
            ) : (
              <>
                <Link to="/" className="text-gray-700 hover:text-green-600 transition-colors font-medium flex items-center space-x-1">
                  <Home className="w-4 h-4" />
                  <span>Início</span>
                </Link>
                <Link to="/beneficios" className="text-gray-700 hover:text-green-600 transition-colors font-medium">
                  Benefícios
                </Link>
                <Link to="/contato" className="text-gray-700 hover:text-green-600 transition-colors font-medium">
                  Contato
                </Link>
              </>
            )}
          </nav>

          <div className="flex items-center space-x-3">
            {isAuthenticated ? (
              <div className="flex items-center space-x-3">
                <Link to="/dashboard">
                  <Button variant="outline" size="sm" className="flex items-center space-x-2">
                    <User className="w-4 h-4" />
                    <span>{profile?.name?.split(' ')[0] || 'Usuário'}</span>
                  </Button>
                </Link>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLogout}
                  className="flex items-center space-x-2 text-gray-600 hover:text-red-600"
                >
                  <LogOut className="w-4 h-4" />
                </Button>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link to="/login">
                  <Button variant="outline" size="sm" className="border-green-200 text-green-700 hover:bg-green-50">
                    Entrar
                  </Button>
                </Link>
                <Link to="/cadastro">
                  <Button size="sm" className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white shadow-lg">
                    Cadastrar
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
