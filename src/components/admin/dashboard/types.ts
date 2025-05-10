
export interface SystemStats {
  totalMembers: number;
  totalProfessionals: number;
  activeSubscriptions: number;
  pendingApprovals: number;
  revenue: {
    mtd: number;
    ytd: number;
  };
  newLeadsThisWeek: number;
  referralConversions: number;
}

export interface MembershipTier {
  tier: string;
  count: number;
  percentage: number;
}

export interface Activity {
  id: number;
  activity: string;
  user: string;
  time: string;
  from?: string;
  to?: string;
}

export interface Alert {
  id: number;
  type: 'payment' | 'partner' | 'symptom';
  message: string;
  severity: 'high' | 'medium' | 'low';
}

export interface LeadStats {
  newLeads: number;
  qualifiedLeads: number;
  convertedLeads: number;
  conversionRate: number;
  sources: {
    name: string;
    count: number;
    percentage: number;
  }[];
}

export interface PartnerStats {
  topPerformers: {
    name: string;
    revenue: number;
    specialties: string[];
  }[];
  totalRevenue: number;
  activePartners: number;
}

export interface RewardsStats {
  totalIssued: number;
  totalRedeemed: number;
  popularRewards: {
    name: string;
    claims: number;
  }[];
}

export interface PromotionStats {
  totalActive: number;
  clickThrough: number;
  claimRate: number;
  sources: {
    name: string;
    percentage: number;
  }[];
}

