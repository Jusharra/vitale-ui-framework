
import { User, Session } from '@supabase/supabase-js';

export type UserRole = 'member' | 'admin' | 'professional';

export interface UserProfile {
  id: string;
  email: string;
  full_name?: string;
  role: UserRole;
}

export interface Subscription {
  id: string;
  status: string;
  tier: string;
  current_period_end: string;
  cancel_at_period_end: boolean;
}

export interface AuthState {
  user: User | null;
  session: Session | null;
  profile: UserProfile | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isTrialing: boolean;
  userRole: UserRole | null;
  subscription: Subscription | null;
  membershipTier: string | null;
}
