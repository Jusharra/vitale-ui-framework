
import type { Session, User } from "@supabase/supabase-js";

export type MembershipTier = "smart" | "core" | "vip";
export type UserRole = "member" | "professional" | "admin";

export type UserProfile = {
  id: string;
  email: string;
  full_name?: string;
  role: UserRole;
  membership_tier: MembershipTier;
  trial_status?: string;
  trial_end_date?: string;
};

export type Subscription = {
  id: string;
  status: string;
  tier: MembershipTier;
  current_period_end: number;
  cancel_at_period_end: boolean;
  cancel_at?: number;
  trial_end?: number;
  interval?: 'month' | 'year';
};

export interface AuthState {
  user: User | null;
  session: Session | null;
  profile: UserProfile | null;
  isLoading: boolean;
  userRole: UserRole | null;
  membershipTier: MembershipTier | null;
  isAuthenticated: boolean;
  isTrialing: boolean;
  subscription: Subscription | null;
}
