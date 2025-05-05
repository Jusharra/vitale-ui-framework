
import React from 'react';
import { useWhiteLabel } from '@/hooks/useWhiteLabel';

interface WhiteLabelBrandingProps {
  variant?: 'default' | 'small' | 'medium' | 'large';
  className?: string;
}

const WhiteLabelBranding: React.FC<WhiteLabelBrandingProps> = ({ 
  variant = 'default', 
  className = '' 
}) => {
  const whiteLabelConfig = useWhiteLabel();
  const { companyName, logoUrl, isCustomDomain } = whiteLabelConfig;

  // Size variants
  const sizeClasses = {
    default: 'h-8',
    small: 'h-6',
    medium: 'h-8',
    large: 'h-10'
  };

  // If not on a custom domain, return the default branding
  if (!isCustomDomain) {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <img src="/logo.svg" alt="Vitale Health" className={sizeClasses[variant]} />
        {variant !== 'small' && <span className="font-semibold text-lg">Vitale Health</span>}
      </div>
    );
  }

  // Return white-labeled branding for custom domains
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <img 
        src={logoUrl} 
        alt={companyName} 
        className={sizeClasses[variant]} 
      />
      {variant !== 'small' && (
        <span className="font-semibold text-lg">{companyName}</span>
      )}
    </div>
  );
};

export default WhiteLabelBranding;
