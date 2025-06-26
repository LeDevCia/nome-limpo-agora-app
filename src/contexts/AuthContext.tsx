
import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  cpf: string;
  phone: string;
  status: 'pending' | 'analyzing' | 'proposals_available' | 'completed';
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (userData: any) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const savedUser = localStorage.getItem('nomelimpo_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
      setIsAuthenticated(true);
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    // Simulate API call
    if (email && password) {
      const mockUser: User = {
        id: '1',
        name: 'João Silva',
        email,
        cpf: '123.456.789-00',
        phone: '(11) 99999-9999',
        status: 'analyzing'
      };
      setUser(mockUser);
      setIsAuthenticated(true);
      localStorage.setItem('nomelimpo_user', JSON.stringify(mockUser));
      return true;
    }
    return false;
  };

  const register = async (userData: any): Promise<boolean> => {
    // Simulate API call
    const mockUser: User = {
      id: Math.random().toString(),
      name: userData.name,
      email: userData.email,
      cpf: userData.cpf,
      phone: userData.phone,
      status: 'pending'
    };
    setUser(mockUser);
    setIsAuthenticated(true);
    localStorage.setItem('nomelimpo_user', JSON.stringify(mockUser));
    return true;
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('nomelimpo_user');
  };

  return (
    <AuthContext.Provider value={{
      user,
      login,
      register,
      logout,
      isAuthenticated
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
