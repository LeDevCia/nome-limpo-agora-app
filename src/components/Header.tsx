import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import {
  LogOut,
  User,
  Settings,
  LayoutDashboard,
  Menu,
  X,
  Home,
} from 'lucide-react';
import Logo from './Logo';

const Header = () => {
  const { isAuthenticated, profile, isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    setMobileMenuOpen(false);
    navigate('/');
  };

  const handleLogoClick = () => {
    if (isAuthenticated) {
      navigate(isAdmin ? '/admin' : '/dashboard');
    } else {
      navigate('/');
    }
    setMobileMenuOpen(false);
  };

  const closeMobileMenu = () => setMobileMenuOpen(false);

  const getLinkClasses = (path) => {
    return location.pathname === path
      ? 'bg-gradient-to-r from-green-600 to-green-700 text-white'
      : 'bg-white text-green-700 hover:bg-green-700 hover:text-white transition-colors duration-200';
  };

  return (
    <header className="bg-white/95 backdrop-blur-sm shadow-sm border-b sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div onClick={handleLogoClick} className="cursor-pointer">
            <Logo />
          </div>

          {/* Desktop Navigation - APENAS para não autenticados */}
          {!isAuthenticated && (
            <nav className="hidden md:flex items-center space-x-6">
              <Link
                to="/"
                className={`font-medium flex items-center space-x-2 py-2 px-3 rounded-md ${getLinkClasses('/')}`}
                onClick={closeMobileMenu}
              >
                <Home className="w-4 h-4" />
                <span>Início</span>
              </Link>
              <Link
                to="/beneficios"
                className={`font-medium py-2 px-3 rounded-md ${getLinkClasses('/beneficios')}`}
                onClick={closeMobileMenu}
              >
                Benefícios
              </Link>
              <Link
                to="/contato"
                className={`font-medium py-2 px-3 rounded-md ${getLinkClasses('/contato')}`}
                onClick={closeMobileMenu}
              >
                Contato
              </Link>
            </nav>
          )}

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex items-center space-x-3">
            {isAuthenticated ? (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                className="flex items-center space-x-2 text-gray-600 hover:text-red-600"
              >
                <LogOut className="w-4 h-4" />
                <span>Sair</span>
              </Button>
            ) : (
              <>
                <Link to="/login">
                  <Button
                    variant="outline"
                    size="sm"
                    className={`border-green-200 shadow-lg ${getLinkClasses('/login')}`}
                  >
                    Entrar
                  </Button>
                </Link>
                <Link to="/cadastro">
                  <Button
                    size="sm"
                    className={`shadow-lg ${getLinkClasses('/cadastro')}`}
                  >
                    Cadastrar
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu - APENAS para não autenticados */}
        {mobileMenuOpen && !isAuthenticated && (
          <div className="md:hidden mt-4 pb-4 border-t border-gray-200">
            <div className="flex flex-col space-y-4 pt-4">
              <Link
                to="/"
                className={`font-medium flex items-center space-x-2 py-2 px-3 rounded-md ${getLinkClasses('/')}`}
                onClick={closeMobileMenu}
              >
                <Home className="w-4 h-4" />
                <span>Início</span>
              </Link>
              <Link
                to="/beneficios"
                className={`font-medium py-2 px-3 rounded-md ${getLinkClasses('/beneficios')}`}
                onClick={closeMobileMenu}
              >
                Benefícios
              </Link>
              <Link
                to="/contato"
                className={`font-medium py-2 px-3 rounded-md ${getLinkClasses('/contato')}`}
                onClick={closeMobileMenu}
              >
                Contato
              </Link>

              {/* Auth Section */}
              <div className="pt-4 border-t border-gray-200">
                <div className="flex flex-col space-y-3">
                  <Link to="/login" onClick={closeMobileMenu}>
                    <Button
                      variant="outline"
                      size="sm"
                      className={`w-full border-green-200  shadow-lg ${getLinkClasses('/login')}`}
                    >
                      Entrar
                    </Button>
                  </Link>
                  <Link to="/cadastro" onClick={closeMobileMenu}>
                    <Button
                      size="sm"
                      className={`w-full shadow-lg ${getLinkClasses('/cadastro')}`}
                    >
                      Cadastrar
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Mobile Menu para autenticados (apenas botão Sair) */}
        {mobileMenuOpen && isAuthenticated && (
          <div className="md:hidden mt-4 pb-4 border-t border-gray-200">
            <div className="flex flex-col space-y-4 pt-4">
              <div className="flex items-center space-x-2 text-gray-700">
                <User className="w-4 h-4" />
                <span className="font-medium">{profile?.name?.split(' ')[0] || 'Usuário'}</span>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
                className="flex items-center space-x-2 justify-center text-red-600 hover:text-red-700 border-red-200 hover:bg-red-50"
              >
                <LogOut className="w-4 h-4" />
                <span>Sair</span>
              </Button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;