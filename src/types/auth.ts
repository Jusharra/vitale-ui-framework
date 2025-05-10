
import { User, Session } from '@supabase/supabase-js';

export type UserRole = 'member' | 'admin' | 'professional';

export interface UserProfile {
  id: string;
  email: string;
  full_name?: string;
  role: UserRole;
}

export interface AuthState {
  user: User | null;
  session: Session | null;
  profile: UserProfile | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  userRole: UserRole | null;
}
