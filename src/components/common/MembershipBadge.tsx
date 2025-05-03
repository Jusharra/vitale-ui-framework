
import React from 'react';
import { cn } from '@/lib/utils';

type MembershipType = 'smart' | 'core' | 'vip';

interface MembershipBadgeProps {
  type: MembershipType;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const MembershipBadge: React.FC<MembershipBadgeProps> = ({ 
  type, 
  size = 'md',
  className 
}) => {
  const labels = {
    smart: 'Smart Access',
    core: 'Core Concierge',
    vip: 'VIP Executive'
  };

  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-sm px-3 py-1',
    lg: 'text-base px-4 py-1.5'
  };

  return (
    <span className={cn(
      'inline-flex items-center justify-center font-medium rounded-full',
      type === 'smart' && 'bg-membership-smart-bg text-membership-smart-text',
      type === 'core' && 'bg-membership-core-bg text-membership-core-text',
      type === 'vip' && 'bg-membership-vip-bg text-membership-vip-text',
      sizeClasses[size],
      className
    )}>
      {labels[type]}
    </span>
  );
};

export default MembershipBadge;
