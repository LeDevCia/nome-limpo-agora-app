
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { User, LogOut, Menu, X } from 'lucide-react';
import Logo from './Logo';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

const Header = () => {
  const { isAuthenticated, isAdmin, logout, profile, getRedirectPath } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    setIsOpen(false);
    navigate('/');
  };

  const handleLogoClick = () => {
    const redirectPath = getRedirectPath();
    navigate(redirectPath);
  };

  const handleNavClick = (path: string) => {
    setIsOpen(false);
    navigate(path);
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
          
          {/* Desktop Navigation */}
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

          {/* Mobile Navigation */}
          <div className="md:hidden">
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80">
                <SheetHeader>
                  <SheetTitle>Menu</SheetTitle>
                  <SheetDescription>
                    Navegue pelas opções disponíveis
                  </SheetDescription>
                </SheetHeader>
                
                <div className="flex flex-col space-y-4 mt-6">
                  {!isAdmin && (
                    <>
                      <Button
                        variant="ghost"
                        className="justify-start"
                        onClick={() => handleNavClick('/beneficios')}
                      >
                        Benefícios
                      </Button>
                      <Button
                        variant="ghost"
                        className="justify-start"
                        onClick={() => handleNavClick('/contato')}
                      >
                        Contato
                      </Button>
                    </>
                  )}
                  
                  {isAuthenticated ? (
                    <div className="space-y-4 pt-4 border-t">
                      <div className="flex items-center space-x-2 px-3">
                        <User className="w-4 h-4 text-gray-600" />
                        <span className="text-gray-700">
                          {profile?.name?.split(' ')[0] || 'Usuário'}
                        </span>
                      </div>
                      <Button
                        variant="outline"
                        onClick={handleLogout}
                        className="w-full justify-start"
                      >
                        <LogOut className="w-4 h-4 mr-2" />
                        Sair
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4 pt-4 border-t">
                      <Button
                        variant="outline"
                        onClick={() => handleNavClick('/login')}
                        className="w-full justify-start"
                      >
                        Entrar
                      </Button>
                      <Button
                        onClick={() => handleNavClick('/cadastro')}
                        className="w-full justify-start gradient-primary text-white"
                      >
                        Cadastrar
                      </Button>
                    </div>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
