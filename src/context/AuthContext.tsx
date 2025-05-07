
import React, { createContext, useContext, useMemo, memo, useCallback } from "react";
import { useAuthState } from '@/hooks/useAuthState';
import { useAuthActions } from '@/hooks/useAuthActions';
import type { UserProfile, AuthState, UserRole } from '@/types/auth';

interface AuthContextType extends AuthState {
  signIn: (email: string, password: string) => Promise<boolean>;
  signUp: (email: string, password: string, fullName: string) => Promise<boolean>;
  signOut: () => Promise<boolean>;
  updateProfile: (data: Partial<UserProfile>) => Promise<boolean>;
  refreshSubscription: () => Promise<void>;
  hasToolAccess: (toolName: string) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Create a memoized version of the AuthProvider component
const AuthProviderComponent: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const {
    user,
    session,
    profile,
    isLoading,
    isTrialing: authIsTrialing
  } = useAuthState();

  const {
    signIn,
    signUp,
    signOut,
    updateProfile: updateUserProfile
  } = useAuthActions();
  
  // Placeholder values since auth is removed
  const isTrialing = false;
  const subscription = null;
  const membershipTier = null;

  // Update profile wrapper - memoize to prevent recreation on every render
  const updateProfile = useCallback(async (data: Partial<UserProfile>) => {
    return false; // Authentication removed
  }, []);

  // Cache the tool access check with user ID - memoize for performance
  const checkToolAccess = useCallback(async (toolName: string): Promise<boolean> => {
    return false; // Authentication removed
  }, []);

  // Placeholder for refresh subscription
  const refreshSubscription = useCallback(async () => {
    console.log('Subscription refresh functionality removed');
  }, []);

  // Create a stable context value with more complete dependency array
  const value = useMemo(() => ({
    user,
    session,
    profile,
    isLoading,
    userRole: null as UserRole | null,
    isAuthenticated: false,
    isTrialing,
    subscription,
    membershipTier,
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
    signIn,
    signUp,
    signOut,
    updateProfile,
    checkToolAccess,
    refreshSubscription
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
