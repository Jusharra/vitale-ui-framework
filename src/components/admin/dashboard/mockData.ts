
import { SystemStats, MembershipTier, Activity, Alert, LeadStats, PartnerStats, RewardsStats, PromotionStats } from './types';

// Mock data
export const systemStats: SystemStats = {
  totalMembers: 2548,
  totalProfessionals: 164,
  activeSubscriptions: 1897,
  pendingApprovals: 12,
  revenue: {
    mtd: 145320,
    ytd: 1243789
  },
  newLeadsThisWeek: 38,
  referralConversions: 24
};

export const membershipBreakdown: MembershipTier[] = [
  { tier: "Smart Access", count: 1453, percentage: 57 },
  { tier: "Core Concierge", count: 782, percentage: 31 },
  { tier: "VIP Executive", count: 313, percentage: 12 }
];

export const recentActivities: Activity[] = [
  { id: 1, activity: "New professional registration", user: "Dr. Rebecca Chen", time: "1 hour ago" },
  { id: 2, activity: "Membership upgrade", user: "Thomas Wilson", time: "3 hours ago", from: "Smart", to: "Core" },
  { id: 3, activity: "New member registration", user: "Emily Johnson", time: "5 hours ago" },
  { id: 4, activity: "Membership cancellation", user: "Robert Davis", time: "Yesterday" }
];

export const systemAlerts: Alert[] = [
  { id: 1, type: "payment", message: "3 failed subscription payments require attention", severity: "high" },
  { id: 2, type: "partner", message: "5 partners inactive for more than 14 days", severity: "medium" },
  { id: 3, type: "symptom", message: "12 high-severity symptom reports awaiting triage", severity: "high" }
];

export const leadStats: LeadStats = {
  newLeads: 86,
  qualifiedLeads: 42,
  convertedLeads: 24,
  conversionRate: 27.9,
  sources: [
    { name: "Organic Search", count: 38, percentage: 44 },
    { name: "Referral", count: 24, percentage: 28 },
    { name: "Social Media", count: 12, percentage: 14 },
    { name: "Paid Ads", count: 12, percentage: 14 }
  ]
};

export const partnerStats: PartnerStats = {
  topPerformers: [
    { name: "Dr. Sarah Johnson", revenue: 12450, specialties: ["Cardiology"] },
    { name: "Dr. Michael Chen", revenue: 9780, specialties: ["Primary Care"] },
    { name: "Dr. Rebecca Miller", revenue: 8950, specialties: ["Neurology"] }
  ],
  totalRevenue: 145320,
  activePartners: 132
};

export const rewardsStats: RewardsStats = {
  totalIssued: 1245,
  totalRedeemed: 876,
  popularRewards: [
    { name: "Hotel Stay Voucher", claims: 245 },
    { name: "Premium Membership Discount", claims: 187 },
    { name: "Spa Treatment", claims: 156 }
  ]
};

export const promotionStats: PromotionStats = {
  totalActive: 14,
  clickThrough: 34.7,
  claimRate: 22.5,
  sources: [
    { name: "In-App", percentage: 65 },
    { name: "Email", percentage: 22 },
    { name: "SMS", percentage: 13 }
  ]
};
