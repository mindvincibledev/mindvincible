import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Database } from '@/integrations/supabase/types';

export enum UserType {
  Admin = 0,
  Clinician = 1,
  Student = 2,
}

interface User {
  id: string;
  email: string;
  name: string;
  guardian1_phone?: string | null;
  guardian2_phone?: string | null;
  guardian1_name?: string | null;
  guardian2_name?: string | null;
  user_phone?: string | null;
  address?: string | null;
  user_type: UserType;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  session: boolean;
  signIn: (email: string, password: string) => Promise<User | undefined>;
  signUp: (userData: {
    email: string;
    password: string;
    name: string;
    guardian1_phone?: string;
    guardian2_phone?: string;
    guardian1_name?: string;
    guardian2_name?: string;
    user_phone?: string;
    address?: string;
    user_type?: UserType;
  }) => Promise<any>;
  signOut: () => Promise<void>;
  isAdmin: () => boolean;
  isClinician: () => boolean;
  isStudent: () => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState(false);
  const { toast } = useToast();

  // Check for stored session on initial load
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        fetchUser(session.user.id);
      }
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        fetchUser(session.user.id);
        setSession(true);
      } else {
        setUser(null);
        setSession(false);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const fetchUser = async (userId: string) => {
    const { data: userData, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) {
      console.error('Error fetching user:', error);
      return;
    }

    setUser(userData);
  };

  const signUp = async (userData: {
    email: string;
    password: string;
    name: string;
    guardian1_phone?: string;
    guardian2_phone?: string;
    guardian1_name?: string;
    guardian2_name?: string;
    user_phone?: string;
    address?: string;
  }) => {
    // The actual signup is now handled in the Register component
    // This method is kept for compatibility but just passes through
    return userData;
  };

  const signIn = async (email: string, password: string): Promise<User | undefined> => {
    const { data: { session }, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) throw error;
    if (!session?.user) throw new Error('No user returned from sign in');

    await fetchUser(session.user.id);
    setSession(true);
    return user;
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    
    setUser(null);
    setSession(false);
  };

  // Helper functions to check user type
  const isAdmin = () => user?.user_type === UserType.Admin;
  const isClinician = () => user?.user_type === UserType.Clinician;
  const isStudent = () => user?.user_type === UserType.Student;

  return (
    <AuthContext.Provider value={{ 
      user, 
      loading, 
      session, 
      signIn, 
      signUp, 
      signOut,
      isAdmin,
      isClinician,
      isStudent
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
