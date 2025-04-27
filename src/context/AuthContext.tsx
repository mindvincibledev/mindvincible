
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export enum UserType {
  Admin = 0,
  Clinician = 1,
  Student = 2,
}

export interface User {
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
  signIn: (email: string, password: string) => Promise<User | null>;
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
    // Set up auth state listener FIRST to prevent missed events
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', event, session?.user?.id);
      if (session) {
        // For Google Sign In, we need to ensure the user exists in our users table
        if (event === 'SIGNED_IN') {
          const { data: existingUser, error: checkError } = await supabase
            .from('users')
            .select('*')
            .eq('id', session.user.id)
            .single();

          if (!existingUser && !checkError) {
            // Generate a random secure password for Google users
            // They won't need this password since they'll sign in via Google
            const randomPassword = Math.random().toString(36).slice(-12) + Math.random().toString(36).toUpperCase().slice(-12);
            
            // Create new user entry for Google authenticated users
            const { error: insertError } = await supabase
              .from('users')
              .insert({
                id: session.user.id,
                email: session.user.email,
                name: session.user.user_metadata.full_name || session.user.email?.split('@')[0],
                password: randomPassword, // Add the required password field
                user_type: UserType.Student // Default to Student type for Google auth
              });

            if (insertError) {
              console.error('Error creating user after Google auth:', insertError);
            }
          }
        }
        fetchUser(session.user.id);
        setSession(true);
      } else {
        setUser(null);
        setSession(false);
      }
    });

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log('Initial session check:', session?.user?.id);
      if (session) {
        fetchUser(session.user.id);
        setSession(true);
      } else {
        setLoading(false);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const fetchUser = async (userId: string) => {
    console.log('Fetching user data for:', userId);
    try {
      const { data: userData, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error fetching user:', error);
        setLoading(false);
        return;
      }

      console.log('User data fetched:', userData);
      setUser(userData);
      setLoading(false);
    } catch (err) {
      console.error('Exception in fetchUser:', err);
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
  }) => {
    try {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: userData.email,
        password: userData.password,
        options: {
          data: {
            name: userData.name,
            guardian1_name: userData.guardian1_name,
            guardian1_phone: userData.guardian1_phone,
            guardian2_name: userData.guardian2_name,
            guardian2_phone: userData.guardian2_phone,
            user_phone: userData.user_phone,
            address: userData.address,
          }
        }
      });

      if (authError) throw authError;
      return authData;
    } catch (error) {
      console.error('Error in signUp:', error);
      throw error;
    }
  };

  const signIn = async (email: string, password: string): Promise<User | null> => {
    try {
      console.log('Signing in with:', email);
      const { data: { session }, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) throw error;
      if (!session?.user) throw new Error('No user returned from sign in');

      console.log('Auth sign in successful, fetching user data');
      
      // Fetch the user data from the public.users table
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('id', session.user.id)
        .single();
        
      if (userError) {
        console.error('Error fetching user after sign in:', userError);
        throw new Error('Could not retrieve user data');
      }
      
      console.log('User data fetched after sign in:', userData);
      setUser(userData);
      setSession(true);
      return userData;
    } catch (error) {
      console.error('Error in signIn:', error);
      throw error;
    }
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
