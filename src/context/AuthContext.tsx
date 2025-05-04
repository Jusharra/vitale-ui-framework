
import React, { createContext, useContext, useMemo } from "react";
import { useAuthState } from '@/hooks/useAuthState';
import { useAuthActions } from '@/hooks/useAuthActions';
import { useSubscription } from '@/hooks/useSubscription';
import { useToolAccess } from '@/hooks/useToolAccess';
import type { UserProfile, AuthState, UserRole, MembershipTier } from '@/types/auth';

interface AuthContextType extends AuthState {
  signIn: (email: string, password: string) => Promise<boolean>;
  signUp: (email: string, password: string, fullName: string) => Promise<boolean>;
  signOut: () => Promise<boolean>;
  updateProfile: (data: Partial<UserProfile>) => Promise<boolean>;
  refreshSubscription: () => Promise<void>;
  hasToolAccess: (toolName: string) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const {
    user,
    session,
    profile,
    isLoading,
    isTrialing: authIsTrialing,
    fetchUserProfile
  } = useAuthState();

  const { subscription, isTrialing: subscriptionIsTrialing, refreshSubscription } = 
    useSubscription(user?.id || null);
  
  const { hasToolAccess } = useToolAccess();
  
  const {
    signIn,
    signUp,
    signOut,
    updateProfile: updateUserProfile
  } = useAuthActions();
  
  // Combine trial status from both auth and subscription
  const isTrialing = authIsTrialing || subscriptionIsTrialing;

  // Update profile wrapper
  const updateProfile = async (data: Partial<UserProfile>) => {
    if (!user) return false;
    
    const success = await updateUserProfile(user.id, data);
    if (success) {
      await fetchUserProfile(user.id);
    }
    return success;
  };

  // Cache the tool access check with user ID
  const checkToolAccess = async (toolName: string): Promise<boolean> => {
    return hasToolAccess(user?.id || null, toolName);
  };

  // Create a stable context value with useMemo to prevent unnecessary re-renders
  const value = useMemo(() => ({
    user,
    session,
    profile,
    isLoading,
    userRole: profile?.role || null as UserRole | null,
    membershipTier: profile?.membership_tier || null as MembershipTier | null,
    isAuthenticated: !!user,
    isTrialing,
    subscription,
    signIn,
    signUp,
    signOut,
    updateProfile,
    hasToolAccess: checkToolAccess,
    refreshSubscription
  }), [
    user, 
    session, 
    profile, 
    isLoading, 
    isTrialing, 
    subscription,
    signIn,
    signUp,
    signOut
  ]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
