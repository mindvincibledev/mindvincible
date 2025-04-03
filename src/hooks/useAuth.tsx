
import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

type AuthContextType = {
  user: User | null;
  session: Session | null;
  loading: boolean;
  error: string | null;
  login: (identifier: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        
        // If there's a session, fetch user data after a small delay
        if (session?.user) {
          setTimeout(() => {
            fetchUserData(session.user.id);
          }, 0);
        }
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        fetchUserData(session.user.id);
      }
      
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Fetch additional user data if needed
  const fetchUserData = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();
        
      if (error) {
        console.error('Error fetching user data:', error);
      } else if (data) {
        console.log('User data:', data);
        // You can set additional user data here if needed
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  // Login with email or username
  const login = async (identifier: string, password: string) => {
    setLoading(true);
    setError(null);
    
    try {
      // Check if identifier is an email
      const isEmail = identifier.includes('@');
      
      if (isEmail) {
        // Login with email
        const { data, error } = await supabase.auth.signInWithPassword({
          email: identifier,
          password,
        });

        if (error) throw error;
        
        // Navigate to the moods page on successful login
        navigate('/mood-entry');
        
      } else {
        // Login with username
        // First find the email associated with the username
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('email')
          .eq('username', identifier)
          .single();
          
        if (userError) {
          throw new Error("Username not found");
        }
        
        // Then login with the email
        const { data, error } = await supabase.auth.signInWithPassword({
          email: userData.email as string,
          password,
        });
        
        if (error) throw error;
        
        // Navigate to the moods page on successful login
        navigate('/mood-entry');
      }
      
    } catch (error: any) {
      setError(error.message);
      toast({
        title: "Login failed",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  // Logout
  const logout = async () => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      setUser(null);
      setSession(null);
      navigate('/login');
      
    } catch (error: any) {
      setError(error.message);
      toast({
        title: "Logout failed",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, session, loading, error, login, logout }}>
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
