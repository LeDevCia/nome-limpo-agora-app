
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { LogOut, User, Settings, MessageSquare, Phone, Home, LayoutDashboard, Menu, X } from 'lucide-react';
import Logo from './Logo';

const Header = () => {
  const { isAuthenticated, profile, isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    setMobileMenuOpen(false);
    navigate('/');
  };

  const handleLogoClick = () => {
    if (isAuthenticated) {
      if (isAdmin) {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
    } else {
      navigate('/');
    }
    setMobileMenuOpen(false);
  };

  const closeMobileMenu = () => setMobileMenuOpen(false);

  return (
    <header className="bg-white/95 backdrop-blur-sm shadow-sm border-b sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div onClick={handleLogoClick} className="cursor-pointer">
            <Logo />
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            {isAuthenticated ? (
              <>
                {isAdmin && (
                  <Link to="/admin" className="text-gray-700 hover:text-green-600 transition-colors font-medium flex items-center space-x-1">
                    <Settings className="w-4 h-4" />
                    <span>Admin</span>
                  </Link>
                )}
                {/* Esconder Benefícios e Contato para admins */}
                {!isAdmin && (
                  <>
                    <Link to="/beneficios" className="text-gray-700 hover:text-green-600 transition-colors font-medium">
                      Benefícios
                    </Link>
                    <Link to="/contato" className="text-gray-700 hover:text-green-600 transition-colors font-medium">
                      Contato
                    </Link>
                  </>
                )}
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

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex items-center space-x-3">
            {isAuthenticated ? (
              <div className="flex items-center space-x-3">
                
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

          {/* Mobile Menu Button */}
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

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t border-gray-200">
            <div className="flex flex-col space-y-4 pt-4">
              {/* Navigation Links */}
              {isAuthenticated ? (
                <>
                  <Link 
                    to="/dashboard" 
                    className="text-gray-700 hover:text-green-600 transition-colors font-medium flex items-center space-x-2 py-2"
                    onClick={closeMobileMenu}
                  >
                    <LayoutDashboard className="w-4 h-4" />
                    
                  </Link>
                  {isAdmin && (
                    <Link 
                      to="/admin" 
                      className="text-gray-700 hover:text-green-600 transition-colors font-medium flex items-center space-x-2 py-2"
                      onClick={closeMobileMenu}
                    >
                      <Settings className="w-4 h-4" />
                      <span>Admin</span>
                    </Link>
                  )}
                  {/* Esconder Benefícios e Contato para admins */}
                  {!isAdmin && (
                    <>
                      <Link 
                        to="/beneficios" 
                        className="text-gray-700 hover:text-green-600 transition-colors font-medium py-2"
                        onClick={closeMobileMenu}
                      >
                        Benefícios
                      </Link>
                      <Link 
                        to="/contato" 
                        className="text-gray-700 hover:text-green-600 transition-colors font-medium py-2"
                        onClick={closeMobileMenu}
                      >
                        Contato
                      </Link>
                    </>
                  )}
                </>
              ) : (
                <>
                  <Link 
                    to="/" 
                    className="text-gray-700 hover:text-green-600 transition-colors font-medium flex items-center space-x-2 py-2"
                    onClick={closeMobileMenu}
                  >
                    <Home className="w-4 h-4" />
                    <span>Início</span>
                  </Link>
                  <Link 
                    to="/beneficios" 
                    className="text-gray-700 hover:text-green-600 transition-colors font-medium py-2"
                    onClick={closeMobileMenu}
                  >
                    Benefícios
                  </Link>
                  <Link 
                    to="/contato" 
                    className="text-gray-700 hover:text-green-600 transition-colors font-medium py-2"
                    onClick={closeMobileMenu}
                  >
                    Contato
                  </Link>
                </>
              )}

              {/* Auth Buttons */}
              <div className="pt-4 border-t border-gray-200">
                {isAuthenticated ? (
                  <div className="flex flex-col space-y-3">
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
                ) : (
                  <div className="flex flex-col space-y-3">
                    <Link to="/login" onClick={closeMobileMenu}>
                      <Button variant="outline" size="sm" className="w-full border-green-200 text-green-700 hover:bg-green-50">
                        Entrar
                      </Button>
                    </Link>
                    <Link to="/cadastro" onClick={closeMobileMenu}>
                      <Button size="sm" className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white shadow-lg">
                        Cadastrar
                      </Button>
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
