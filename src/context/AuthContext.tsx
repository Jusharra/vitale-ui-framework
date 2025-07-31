import React, { createContext, useContext, useMemo, memo, useCallback } from "react";
import { useAuthState } from '@/hooks/useAuthState';
import { useAuthActions } from '@/hooks/useAuthActions';
import { useSubscription } from '@/hooks/useSubscription';
import type { UserProfile, AuthState, MembershipTier, Subscription } from '@/types/auth';

interface AuthContextType extends AuthState {
  signIn: (email: string, password: string) => Promise<boolean>;
  signUp: (email: string, password: string, fullName: string) => Promise<boolean>;
  signOut: () => Promise<boolean>;
  updateProfile: (data: Partial<UserProfile>) => Promise<boolean>;
  refreshSubscription?: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Create a memoized version of the AuthProvider component
const AuthProviderComponent: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const {
    user,
    session,
    profile,
    isLoading,
  } = useAuthState();

  const {
    signIn,
    signUp,
    signOut,
    updateProfile: updateUserProfile
  } = useAuthActions();

  // Use subscription hook to get membership information
  const {
    subscription,
    isTrialing,
    isLoading: subscriptionLoading,
    refreshSubscription
  } = useSubscription(user?.id || null);
  
  // Determine user role and authentication status
  const userRole = profile?.role || null;
  const isAuthenticated = !!session;

  // Extract membership tier from subscription or profile
  const membershipTier: MembershipTier = 'premium';
  
  // Update profile wrapper - memoize to prevent recreation on every render
  const updateProfile = useCallback(async (data: Partial<UserProfile>) => {
    if (!user) return false;
    return await updateUserProfile(user.id, data);
  }, [user, updateUserProfile]);

  // Create a stable context value with complete dependency array
  const value = useMemo(() => ({
    user,
    session,
    profile,
    isLoading: isLoading || subscriptionLoading,
    userRole,
    isAuthenticated,
    membershipTier,
    subscription,
    isTrialing,
    signIn,
    signUp,
    signOut,
    updateProfile,
    refreshSubscription,
  }), [
    user, 
    session, 
    profile, 
    isLoading,
    subscriptionLoading,
    userRole,
    isAuthenticated,
    membershipTier,
    subscription,
    isTrialing,
    signIn,
    signUp,
    signOut,
    updateProfile,
    refreshSubscription,
  ]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Memoize the entire AuthProvider component to prevent unnecessary re-renders
export const AuthProvider = memo(AuthProviderComponent);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};