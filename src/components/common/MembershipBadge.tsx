
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
      'inline-flex items-center justify-center font-medium rounded-full',
      type === 'premium' && 'bg-gradient-to-r from-purple-600 to-blue-600 text-white',
      type === 'inactive' && 'bg-muted text-muted-foreground',
      sizeClasses[size],
      className
    )}>
      {labels[type]}
    </span>
  );
};

export default MembershipBadge;
