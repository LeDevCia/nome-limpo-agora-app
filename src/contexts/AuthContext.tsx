import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User, Session } from '@supabase/supabase-js';

interface UserProfile {
  id: string;
  name: string;
  document: string; // Changed from cpf to document to match database
  birth_date: string | null;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zip_code: string;
  person_type: string;
  status: string | null;
  is_admin: boolean | null;
  created_at: string;
  updated_at: string;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: UserProfile | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signUp: (email: string, password: string, userData: any) => Promise<{ error: any }>;
  signOut: () => Promise<{ error: any }>;
  login: (email: string, password: string) => Promise<{ error: any }>;
  logout: () => Promise<{ error: any }>;
  register: (userData: any) => Promise<{ success: boolean; error?: string }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.info('Auth state change:', event, session?.user ? { id: session.user.id, email: session.user.email } : 'No user');
        
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          setTimeout(() => {
            checkAdminStatus(session.user.id);
            fetchUserProfile(session.user.id);
          }, 0);
        } else {
          setIsAdmin(false);
          setProfile(null);
        }
        
        setLoading(false);
      }
    );

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.info('Initial session check:', session?.user ? { id: session.user.id, email: session.user.email } : 'No session');
      
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        checkAdminStatus(session.user.id);
        fetchUserProfile(session.user.id);
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

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching user profile:', error);
        return;
      }

      if (data) {
        setProfile(data); // Use data directly since document field is already correct
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  };

  const checkAdminStatus = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', userId)
        .eq('role', 'admin')
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error checking admin status:', error);
        setIsAdmin(false);
        return;
      }

      setIsAdmin(!!data);
    } catch (error) {
      console.error('Error checking admin status:', error);
      setIsAdmin(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (!error && data.user) {
      // Redirect based on role after login
      setTimeout(async () => {
        await checkAdminStatus(data.user.id);
        const isUserAdmin = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', data.user.id)
          .eq('role', 'admin')
          .single();
        
        if (isUserAdmin.data) {
          window.location.href = '/admin';
        } else {
          window.location.href = '/dashboard';
        }
      }, 100);
    }

    return { error };
  };

  const login = signIn;

  const signUp = async (email: string, password: string, userData: any) => {
    const redirectUrl = `${window.location.origin}/`;
    
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectUrl,
        data: {
          name: userData.name,
          document: userData.document, // Changed from cpf to document
          birthDate: userData.birthDate,
          phone: userData.phone,
          address: userData.address || '',
          city: userData.city || '',
          state: userData.state || '',
          zipCode: userData.zipCode || '',
          personType: userData.personType || 'fisica'
        }
      }
    });

    return { error };
  };

  const register = async (userData: any) => {
    try {
      const { error } = await signUp(userData.email, userData.password, userData);
      
      if (error) {
        return { success: false, error: error.message };
      }
      
      return { success: true };
    } catch (error) {
      return { success: false, error: 'Erro inesperado durante o cadastro' };
    }
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (!error) {
      setUser(null);
      setSession(null);
      setProfile(null);
      setIsAdmin(false);
      window.location.href = '/';
    }
    return { error };
  };

  const logout = signOut;

  const value = {
    user,
    session,
    profile,
    isAuthenticated: !!user,
    isAdmin,
    loading,
    signIn,
    signUp,
    signOut,
    login,
    logout,
    register,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
