
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
  signIn: (email: string, password: string) => Promise<User>;
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
  }) => Promise<void>;
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

  // Check for stored user on initial load
  useEffect(() => {
    const storedUser = localStorage.getItem('mindvincible_user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
        setSession(true);
      } catch (error) {
        console.error('Failed to parse stored user data', error);
        localStorage.removeItem('mindvincible_user');
        setSession(false);
      }
    }
    setLoading(false);
  }, []);

  const signIn = async (email: string, password: string): Promise<User> => {
    try {
      setLoading(true);
      
      // Find user with matching email and password
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('email', email)
        .eq('password', password)
        .single();
      
      if (userError || !userData) {
        throw new Error('Invalid email or password');
      }
      
      const userObject = userData as User;
      
      setUser(userObject);
      setSession(true);
      localStorage.setItem('mindvincible_user', JSON.stringify(userObject));
      
      toast({
        title: "Success!",
        description: "You've been signed in.",
      });
      
      return userObject;
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Authentication error",
        description: error.message || "Failed to sign in. Please try again.",
      });
      throw error;
    } finally {
      setLoading(false);
    }
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
    user_type?: UserType;
  }) => {
    try {
      setLoading(true);
      
      const { data: existingUser, error: checkError } = await supabase
        .from('users')
        .select('id')
        .eq('email', userData.email)
        .maybeSingle();
      
      if (existingUser) {
        throw new Error('User with this email already exists');
      }
      
      const { data: newUser, error: insertError } = await supabase
        .from('users')
        .insert({
          email: userData.email,
          name: userData.name,
          password: userData.password,
          guardian1_phone: userData.guardian1_phone || null,
          guardian2_phone: userData.guardian2_phone || null,
          guardian1_name: userData.guardian1_name || null,
          guardian2_name: userData.guardian2_name || null,
          user_phone: userData.user_phone || null,
          address: userData.address || null,
          user_type: userData.user_type || UserType.Student,
        } as Database['public']['Tables']['users']['Insert'])
        .select()
        .single();
        
      if (insertError) {
        console.error('Insert error:', insertError);
        throw new Error('Failed to create account. Please try again.');
      }
      
      setUser(newUser as User);
      setSession(true);
      localStorage.setItem('mindvincible_user', JSON.stringify(newUser));
      
      toast({
        title: "Account created!",
        description: "Welcome to M(in)dvincible! You've been signed in.",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Registration failed",
        description: error.message || "Failed to create account. Please try again.",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setLoading(true);
      setUser(null);
      setSession(false);
      localStorage.removeItem('mindvincible_user');
      
      toast({
        title: "Signed out",
        description: "You've been successfully signed out.",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error signing out",
        description: error.message || "Failed to sign out. Please try again.",
      });
    } finally {
      setLoading(false);
    }
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
