
import React, { createContext, useContext, useMemo, memo, useCallback } from "react";
import { useAuthState } from '@/hooks/useAuthState';
import { useAuthActions } from '@/hooks/useAuthActions';
import { useSubscription } from '@/hooks/useSubscription';
import { useToolAccess } from '@/hooks/useToolAccess';
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
  
  const {
    subscription,
    isTrialing,
    refreshSubscription
  } = useSubscription(user?.id || null);
  
  const { hasToolAccess: toolAccessCheck } = useToolAccess();

  // Determine user role and authentication status
  const userRole = profile?.role || null;
  const isAuthenticated = !!session;
  
  // Get membership tier from subscription or default to null
  const membershipTier = subscription?.tier || null;

  // Update profile wrapper - memoize to prevent recreation on every render
  const updateProfile = useCallback(async (data: Partial<UserProfile>) => {
    if (!user) return false;
    return await updateUserProfile(user.id, data);
  }, [user, updateUserProfile]);

  // Cache the tool access check with user ID - memoize for performance
  const checkToolAccess = useCallback(async (toolName: string): Promise<boolean> => {
    return await toolAccessCheck(user?.id || null, toolName);
  }, [user, toolAccessCheck]);

  // Create a stable context value with complete dependency array
  const value = useMemo(() => ({
    user,
    session,
    profile,
    isLoading,
    userRole,
    isAuthenticated,
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
    userRole,
    isAuthenticated,
    isTrialing, 
    subscription,
    membershipTier,
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
