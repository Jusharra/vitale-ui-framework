
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { Session, User } from '@supabase/supabase-js';
import type { UserProfile } from '@/types/auth';
import { useToast } from '@/hooks/use-toast';

export function useAuthState() {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isTrialing, setIsTrialing] = useState(false);
  const { toast } = useToast();

  // Initialize auth state
  useEffect(() => {
    const initializeAuth = async () => {
      setIsLoading(true);
      
      // Set up the auth state listener first
      const { data: { subscription } } = supabase.auth.onAuthStateChange(
        async (event, session) => {
          setSession(session);
          setUser(session?.user || null);
          
          // If user logged in or token refreshed, fetch their profile
          if (session?.user && (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED')) {
            // Use setTimeout to avoid potential deadlocks
            setTimeout(() => fetchUserProfile(session.user.id), 0);
          } else if (event === 'SIGNED_OUT') {
            setProfile(null);
          }
        }
      );
      
      // Check for existing session
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);
      setUser(session?.user || null);
      
      if (session?.user) {
        await fetchUserProfile(session.user.id);
      }
      
      setIsLoading(false);
      
      // Cleanup subscription
      return () => {
        subscription.unsubscribe();
      };
    };
    
    initializeAuth();
  }, []);

  // Fetch user profile data
  const fetchUserProfile = async (userId: string) => {
    try {
      // Fetch user data from our users table
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();
      
      if (userError) {
        throw userError;
      }
      
      if (userData) {
        const userProfile: UserProfile = {
          id: userData.id,
          email: userData.email,
          role: userData.role as UserProfile['role']
        };
        
        // Fetch additional profile info
        const { data: profileData } = await supabase
          .from('profiles')
          .select('full_name')
          .eq('id', userId)
          .single();
        
        if (profileData) {
          userProfile.full_name = profileData.full_name;
        }
        
        setProfile(userProfile);
        
        // We removed the trial fields from users table, 
        // so we're setting isTrialing to false by default
        setIsTrialing(false);
      }
    } catch (error) {
      console.error("Error fetching user profile:", error);
      toast({
        title: "Error",
        description: "Failed to load user profile data",
        variant: "destructive",
      });
    }
  };

  return {
    user,
    session,
    profile,
    isLoading,
    isTrialing,
    setProfile,
    fetchUserProfile,
  };
}
