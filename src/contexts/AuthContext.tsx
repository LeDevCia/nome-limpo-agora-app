
import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User, Session } from '@supabase/supabase-js';
import { useNavigate } from 'react-router-dom';

interface UserProfile {
  id: string;
  name: string;
  email: string;
  cpf: string;
  phone: string;
  status: 'pendente' | 'em_analise' | 'proposals_available' | 'finalizado' | 'cancelado';
  created_at: string;
  birth_date?: string;
  address?: string;
  city?: string;
  state?: string;
  zip_code?: string;
}

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  session: Session | null;
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (userData: any) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  isAuthenticated: boolean;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  const ADMIN_USER_ID = '5a905d9e-bff6-4bcb-96de-9a773a203975';

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
        async (event, session) => {
          console.log('Auth state change:', event, session?.user?.id);
          setSession(session);
          setUser(session?.user ?? null);
          setIsAuthenticated(!!session);

          if (session?.user) {
            setTimeout(async () => {
              await fetchUserProfile(session.user.id);
              const adminStatus = await checkAdminRole(session.user.id);

              // Redirecionar baseado no papel do usuário apenas no login
              if (event === 'SIGNED_IN') {
                console.log('User signed in, admin status:', adminStatus);

                const currentPath = window.location.pathname;

                if (adminStatus && currentPath !== '/admin') {
                  console.log('Redirecting admin to /admin');
                  window.location.href = '/admin';
                } else if (!adminStatus && currentPath !== '/dashboard') {
                  console.log('Redirecting user to /dashboard');
                  window.location.href = '/dashboard';
                }
              }

            }, 0);
          } else {
            setProfile(null);
            setIsAdmin(false);
          }
          setLoading(false);
        }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log('Initial session check:', session?.user?.id);
      setSession(session);
      setUser(session?.user ?? null);
      setIsAuthenticated(!!session);

      if (session?.user) {
        setTimeout(async () => {
          await fetchUserProfile(session.user.id);
          await checkAdminRole(session.user.id);
        }, 0);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchUserProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', userId)
          .single();

      if (error) {
        console.error('Error fetching profile:', error);
        return;
      }

      if (data) {
        const typedProfile: UserProfile = {
          ...data,
          status: data.status as 'pendente' | 'em_analise' | 'proposals_available' | 'finalizado' | 'cancelado'
        };
        setProfile(typedProfile);
        console.log('Profile loaded:', typedProfile);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  const checkAdminRole = async (userId: string): Promise<boolean> => {
    try {
      console.log('Checking admin role for user:', userId);

      // Verificar se é o usuário admin fixo
      if (userId === ADMIN_USER_ID) {
        console.log('User is fixed admin');
        setIsAdmin(true);
        return true;
      }

      // Verificar role na tabela user_roles
      const { data, error } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', userId)
          .eq('role', 'admin')
          .single();

      if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
        console.error('Error checking admin role:', error);
      }

      const adminStatus = !!data;
      console.log('Admin status from database:', adminStatus);
      setIsAdmin(adminStatus);
      return adminStatus;
    } catch (error) {
      console.error('Error checking admin role:', error);
      setIsAdmin(false);
      return false;
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (error) {
      return { success: false, error: 'Erro ao fazer login' };
    }
  };

  const register = async (userData: any) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email: userData.email,
        password: userData.password,
        options: {
          emailRedirectTo: `${window.location.origin}/`,
          data: {
            name: userData.name,
            cpf: userData.cpf,
            birthDate: userData.birthDate,
            phone: userData.phone,
            address: userData.address,
            city: userData.city,
            state: userData.state,
            zipCode: userData.zipCode,
          }
        }
      });

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (error) {
      return { success: false, error: 'Erro ao criar cadastro' };
    }
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
    setProfile(null);
    setIsAdmin(false);
    setIsAuthenticated(false);
  };

  return (
      <AuthContext.Provider value={{
        user,
        profile,
        session,
        isAdmin,
        login,
        register,
        logout,
        isAuthenticated,
        loading
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
