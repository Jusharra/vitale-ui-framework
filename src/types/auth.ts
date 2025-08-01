import { User, Session } from '@supabase/supabase-js';

export type UserRole = 'member' | 'admin' | 'professional' | 'partner' | 'caregiver';

export interface UserProfile {
  id: string;
  email?: string;
  full_name?: string;
  role: UserRole;
  phone?: string;
  avatar_url?: string;
  // Caregiver-specific fields
  vetting_status?: 'pending' | 'approved' | 'rejected';
  directory_listing?: boolean;
  specialties?: string[];
  hourly_rate?: number;
  years_experience?: number;
  certifications?: string[];
  availability?: {
    days: string[];
    hours: string;
  };
  bio?: string;
}

export type MembershipTier = 'smart' | 'core' | 'vip';

export interface Subscription {
  id: string;
  status: string;
  tier: MembershipTier;
  current_period_end: string | number;
  cancel_at_period_end: boolean;
}

export interface AuthState {
  user: User | null;
  session: Session | null;
  profile: UserProfile | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  userRole: UserRole | null;
  membershipTier: MembershipTier | null;
  subscription: Subscription | null;
  isTrialing: boolean;
}