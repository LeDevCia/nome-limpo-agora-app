
import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User, Session } from '@supabase/supabase-js';
import { useNavigate } from 'react-router-dom';

interface UserProfile {
  id: string;
  name: string;
  document: string;
  birth_date: string | null;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zip_code: string;
  person_type: string;
  status: string | null;
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
  const navigate = useNavigate();

  useEffect(() => {
    let isMounted = true;

    const fetchSessionAndProfile = async () => {
      try {
        setLoading(true);
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();

        if (!session) {
          if (isMounted) {
            setSession(null);
            setUser(null);
            setProfile(null);
            setIsAdmin(false);
          }
          return;
        }

        if (sessionError) {
          if (isMounted) {
            setSession(null);
            setUser(null);
            setProfile(null);
            setIsAdmin(false);
          }
          return;
        }

        const currentUser = session.user;
        if (!currentUser) return;

        if (isMounted) {
          setSession(session);
          setUser(currentUser);
        }

        const { data: userData, error: userError } = await supabase.auth.getUser();
        const isSuperAdmin = userData?.user?.user_metadata?.is_super_admin === true;
        
        if (isMounted) {
          setIsAdmin(isSuperAdmin);
        }

        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', currentUser.id)
          .single();

        if (isMounted) {
          setProfile(profileData || null);
        }

      } catch (error) {
        // Silent error handling
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchSessionAndProfile();

    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!isMounted) return;

      if (event === 'SIGNED_OUT') {
        setSession(null);
        setUser(null);
        setProfile(null);
        setIsAdmin(false);
        navigate('/', { replace: true });
      }

      if (event === 'SIGNED_IN' && session) {
        setSession(session);
        setUser(session.user);

        // Check if user is admin
        const { data: userData } = await supabase.auth.getUser();
        const isSuperAdmin = userData?.user?.user_metadata?.is_super_admin === true;
        setIsAdmin(isSuperAdmin);

        // Get profile data
        const { data: profileData } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();

        setProfile(profileData || null);

        // Navigate based on admin status
        navigate(isSuperAdmin ? '/admin' : '/dashboard', { replace: true });
      }
    });

    return () => {
      isMounted = false;
      authListener.subscription.unsubscribe();
    };
  }, [navigate]);

  const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });

    if (!error && data.user) {
      // Don't navigate here - let the auth state change handler do it
      setSession(data.session);
      setUser(data.user);

      const { data: userData } = await supabase.auth.getUser();
      const isSuperAdmin = userData?.user?.user_metadata?.is_super_admin === true;
      setIsAdmin(isSuperAdmin);

      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', data.user.id)
        .single();

      setProfile(profileData || null);
      
      // Navigate immediately after setting state
      navigate(isSuperAdmin ? '/admin' : '/dashboard', { replace: true });
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
          document: userData.document,
          birth_date: userData.birthDate,
          phone: userData.phone,
          address: userData.address || '',
          city: userData.city || '',
          state: userData.state || '',
          zip_code: userData.zipCode || '',
          person_type: userData.personType || 'fisica'
        }
      }
    });

    return { error };
  };

  const register = async (userData: any) => {
    try {
      const { error } = await signUp(userData.email, userData.password, userData);
      return error ? { success: false, error: error.message } : { success: true };
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
      navigate('/', { replace: true });
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
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
}
