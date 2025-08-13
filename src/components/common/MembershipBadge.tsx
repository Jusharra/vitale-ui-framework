
import React from 'react';
import { cn } from '@/lib/utils';
import { MembershipTier } from '@/types/auth';

interface MembershipBadgeProps {
  type: MembershipTier;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const MembershipBadge: React.FC<MembershipBadgeProps> = ({ 
  type, 
  size = 'md',
  className 
}) => {
  const labels: Record<MembershipTier, string> = {
    premium: 'Premium Member',
    inactive: 'Inactive'
  };

  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-sm px-3 py-1',
    lg: 'text-base px-4 py-1.5'
  };

  return (
    <span className={cn(
      'inline-flex items-center justify-center font-medium rounded-full border',
      type === 'premium' && 'bg-[linear-gradient(120deg,_hsl(var(--brand-ink))_0%,_hsl(var(--brand-ink))_70%,_hsl(var(--brand-gold))_100%)] text-primary-foreground border-white/10',
      type === 'inactive' && 'bg-muted text-muted-foreground border-transparent',
      sizeClasses[size],
      className
    )}>
      {labels[type]}
    </span>
  );
};

export default MembershipBadge;
