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
      
      try {
        // Check for existing session
        const { data: { session: currentSession }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error("Error getting session:", error);
          
          // If it's a refresh token error, clear the session
          if (error.message.includes("Invalid Refresh Token") || 
              error.message.includes("Refresh Token Not Found") ||
              error.message.includes("refresh_token_not_found")) {
            console.log("Invalid refresh token detected, clearing session");
            await supabase.auth.signOut();
            setSession(null);
            setUser(null);
            setProfile(null);
          }
        } else {
          console.log("Initial session check:", currentSession ? "Session exists" : "No session");
          setSession(currentSession);
          setUser(currentSession?.user || null);
          
          if (currentSession?.user) {
            await fetchUserProfile(currentSession.user.id);
          }
        }
      } catch (error) {
        console.error("Error during session initialization:", error);
        // Clear any potentially corrupted session data
        setSession(null);
        setUser(null);
        setProfile(null);
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
        .maybeSingle(); // Use maybeSingle instead of single to handle no rows case
      
      if (error) {
        console.error("Error fetching profile:", error);
        
        // If we can't find the user in profiles table, create a basic profile
        const userProfile: UserProfile = {
          id: userId,
          email: user?.email || '',
          full_name: user?.user_metadata?.full_name,
          role: 'member' as UserRole // Default role
        };
        
        setProfile(userProfile);
        
        // Create a profile entry - this is a fallback
        try {
          // Use RLS-compatible insert by ensuring the id matches the authenticated user
          const { error: insertError } = await supabase
            .from('profiles')
            .insert({
              id: userId,
              full_name: user?.user_metadata?.full_name || 'New User',
              role: 'member' // Default role
            });
            
          if (insertError) {
            console.error("Error creating profile:", insertError);
          }
        } catch (insertError) {
          console.error("Error creating profile:", insertError);
        }
      } else if (data) {
        // Construct profile from data
        const userProfile: UserProfile = {
          id: data.id,
          // Use the user's email from auth user object since it's not in profiles table
          email: user?.email || '', 
          full_name: data.full_name,
          // Get role directly from profiles table
          role: (data as any)?.role || 'member' as UserRole
        };
        
        setProfile(userProfile);
      } else {
        // No data and no error - create a new profile
        const userProfile: UserProfile = {
          id: userId,
          email: user?.email || '',
          full_name: user?.user_metadata?.full_name || 'New User',
          role: 'member' as UserRole
        };
        
        setProfile(userProfile);
        
        // Create a profile entry
        try {
          const { error: insertError } = await supabase
            .from('profiles')
            .insert({
              id: userId,
              full_name: user?.user_metadata?.full_name || 'New User',
              role: 'member'
            });
            
          if (insertError) {
            console.error("Error creating profile:", insertError);
          }
        } catch (insertError) {
          console.error("Error creating profile:", insertError);
        }
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