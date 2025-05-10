
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { Session, User } from '@supabase/supabase-js';
import type { UserProfile, UserRole } from '@/types/auth';
import { useToast } from '@/hooks/use-toast';

export function useAuthState() {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  // Initialize auth state
  useEffect(() => {
    const initializeAuth = async () => {
      setIsLoading(true);
      
      // Set up the auth state listener first
      const { data: { subscription } } = supabase.auth.onAuthStateChange(
        async (event, currentSession) => {
          console.log("Auth state change event:", event);
          setSession(currentSession);
          setUser(currentSession?.user || null);
          
          // If user logged in or token refreshed, fetch their profile
          if (currentSession?.user && (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED')) {
            // Use setTimeout to avoid potential deadlocks
            setTimeout(() => fetchUserProfile(currentSession.user.id), 0);
          } else if (event === 'SIGNED_OUT') {
            setProfile(null);
          }
        }
      );
      
      // Check for existing session
      const { data: { session: currentSession } } = await supabase.auth.getSession();
      console.log("Initial session check:", currentSession ? "Session exists" : "No session");
      setSession(currentSession);
      setUser(currentSession?.user || null);
      
      if (currentSession?.user) {
        await fetchUserProfile(currentSession.user.id);
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
      // Try to get user data from profiles table
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
      
      if (error) {
        console.error("Error fetching profile:", error);
        // If we can't find the user in profiles table, create a basic profile
        const userProfile: UserProfile = {
          id: userId,
          email: user?.email || '',
          role: 'member' as UserRole
        };
        
        // Use user metadata if available
        if (user?.user_metadata?.full_name) {
          userProfile.full_name = user.user_metadata.full_name;
        }
        
        setProfile(userProfile);
        
        // Create a profile entry - this is a fallback
        try {
          await supabase.from('profiles').insert({
            id: userId,
            email: user?.email,
            full_name: user?.user_metadata?.full_name,
            role: 'member'
          });
        } catch (insertError) {
          console.error("Error creating profile:", insertError);
        }
      } else if (data) {
        // Construct profile from data with default role if needed
        const userProfile: UserProfile = {
          id: data.id,
          email: data.email || user?.email || '', 
          full_name: data.full_name,
          role: data.role || 'member' as UserRole
        };
        
        setProfile(userProfile);
      }
    } catch (error) {
      console.error("Error in fetchUserProfile:", error);
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
    fetchUserProfile,
  };
}
