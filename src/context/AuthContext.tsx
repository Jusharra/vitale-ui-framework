import React, { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Session, User } from "@supabase/supabase-js";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";

// Define types for our auth state and context
type MembershipTier = "smart" | "core" | "vip";
type UserRole = "member" | "professional" | "admin";

type AuthState = {
  user: User | null;
  session: Session | null;
  profile: UserProfile | null;
  isLoading: boolean;
  userRole: UserRole | null;
  membershipTier: MembershipTier | null;
  isAuthenticated: boolean;
  isTrialing: boolean;
  hasToolAccess: (toolName: string) => Promise<boolean>;
};

type UserProfile = {
  id: string;
  email: string;
  full_name?: string;
  role: UserRole;
  membership_tier: MembershipTier;
  trial_status?: string;
  trial_end_date?: string;
};

type AuthContextType = AuthState & {
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, fullName: string) => Promise<void>;
  signOut: () => Promise<void>;
  updateProfile: (data: Partial<UserProfile>) => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isTrialing, setIsTrialing] = useState(false);
  
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
          role: userData.role as UserRole,
          membership_tier: userData.membership_tier as MembershipTier,
          trial_status: userData.trial_status,
          trial_end_date: userData.trial_end_date,
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
        
        // Check if user is in trial period
        if (userData.trial_status === 'active' && userData.trial_end_date) {
          const trialEndDate = new Date(userData.trial_end_date);
          setIsTrialing(trialEndDate > new Date());
        } else {
          setIsTrialing(false);
        }
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
  
  // Check tool access based on membership tier
  const hasToolAccess = async (toolName: string): Promise<boolean> => {
    if (!profile) return false;
    
    try {
      const { data } = await supabase.rpc('check_tool_access', {
        user_id: profile.id,
        tool_name: toolName
      });
      
      return !!data;
    } catch (error) {
      console.error(`Error checking access for ${toolName}:`, error);
      return false;
    }
  };
  
  // Sign in with email and password
  const signIn = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email, password
      });
      
      if (error) throw error;
      
      navigate('/dashboard');
      toast({
        title: "Welcome back!",
        description: "You have successfully signed in",
      });
      
    } catch (error: any) {
      toast({
        title: "Sign in failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // Sign up with email and password
  const signUp = async (email: string, password: string, fullName: string) => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            role: 'member',
          },
        },
      });
      
      if (error) throw error;
      
      toast({
        title: "Account created",
        description: "Welcome to Vitale Health Concierge! Your 14-day trial has started.",
      });
      
      // Redirect to dashboard after signup
      navigate('/dashboard');
      
    } catch (error: any) {
      toast({
        title: "Sign up failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // Sign out
  const signOut = async () => {
    setIsLoading(true);
    try {
      await supabase.auth.signOut();
      navigate('/');
      toast({
        title: "Signed out",
        description: "You have been signed out successfully",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to sign out",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // Update user profile
  const updateProfile = async (data: Partial<UserProfile>) => {
    if (!user) return;
    
    try {
      // Update profiles table first
      if (data.full_name) {
        const { error: profileError } = await supabase
          .from('profiles')
          .update({ full_name: data.full_name })
          .eq('id', user.id);
          
        if (profileError) throw profileError;
      }
      
      // Then update users table if needed
      const userUpdates: any = {};
      
      if (data.role) userUpdates.role = data.role;
      if (data.membership_tier) userUpdates.membership_tier = data.membership_tier;
      
      if (Object.keys(userUpdates).length > 0) {
        const { error: userError } = await supabase
          .from('users')
          .update(userUpdates)
          .eq('id', user.id);
          
        if (userError) throw userError;
      }
      
      // Refresh profile
      await fetchUserProfile(user.id);
      
      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully",
      });
      
    } catch (error: any) {
      toast({
        title: "Update failed",
        description: error.message,
        variant: "destructive",
      });
    }
  };
  
  const value = {
    user,
    session,
    profile,
    isLoading,
    userRole: profile?.role || null,
    membershipTier: profile?.membership_tier || null,
    isAuthenticated: !!user,
    isTrialing,
    signIn,
    signUp,
    signOut,
    updateProfile,
    hasToolAccess
  };
  
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
