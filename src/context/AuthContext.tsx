
import React, { createContext, useContext, useMemo, memo, useCallback } from "react";
import { useAuthState } from '@/hooks/useAuthState';
import { useAuthActions } from '@/hooks/useAuthActions';
import type { UserProfile, AuthState } from '@/types/auth';

interface AuthContextType extends Omit<AuthState, 'isTrialing' | 'subscription' | 'membershipTier'> {
  signIn: (email: string, password: string) => Promise<boolean>;
  signUp: (email: string, password: string, fullName: string) => Promise<boolean>;
  signOut: () => Promise<boolean>;
  updateProfile: (data: Partial<UserProfile>) => Promise<boolean>;
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
  
  // Determine user role and authentication status
  const userRole = profile?.role || null;
  const isAuthenticated = !!session;
  
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
    isLoading,
    userRole,
    isAuthenticated,
    signIn,
    signUp,
    signOut,
    updateProfile,
  }), [
    user, 
    session, 
    profile, 
    isLoading, 
    userRole,
    isAuthenticated,
    signIn,
    signUp,
    signOut,
    updateProfile,
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
