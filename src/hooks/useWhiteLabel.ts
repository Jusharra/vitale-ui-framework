
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';

export interface WhiteLabelBranding {
  isWhiteLabeled: boolean;
  partnerId: string | null;
  companyName: string;
  logo: string | null;
  primaryColor: string;
  secondaryColor: string;
  contactEmail: string | null;
  contactPhone: string | null;
  customDomain: string | null;
  subdomain: string | null;
}

const defaultBranding: WhiteLabelBranding = {
  isWhiteLabeled: false,
  partnerId: null,
  companyName: 'Vitale Platform',
  logo: null,
  primaryColor: '#0369a1', // Default primary blue color
  secondaryColor: '#06b6d4', // Default secondary teal color
  contactEmail: null,
  contactPhone: null,
  customDomain: null,
  subdomain: null
};

export const useWhiteLabel = () => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [branding, setBranding] = useState<WhiteLabelBranding>(defaultBranding);

  // Function to detect if we're on a custom domain or subdomain
  const detectCustomDomain = (): { customDomain: string | null, subdomain: string | null } => {
    try {
      const hostname = window.location.hostname;
      
      // Simple detection logic - can be made more sophisticated in production
      if (hostname === 'localhost' || hostname.includes('vitaleplatform.com')) {
        return { customDomain: null, subdomain: null };
      }
      
      // Check for subdomains
      const parts = hostname.split('.');
      if (parts.length > 2 && parts[1] === 'vitaleplatform') {
        return { customDomain: null, subdomain: parts[0] };
      }
      
      // Must be a custom domain
      return { customDomain: hostname, subdomain: null };
    } catch (e) {
      return { customDomain: null, subdomain: null };
    }
  };

  // Function to load white-label settings based on domain or user
  useEffect(() => {
    const loadWhiteLabelSettings = async () => {
      setIsLoading(true);
      
      try {
        // First check domain-based white-labeling
        const { customDomain, subdomain } = detectCustomDomain();
        
        let partnerData = null;
        let error = null;
        
        // If on custom domain or subdomain, load that partner's branding
        if (customDomain || subdomain) {
          let query = supabase.from('partners').select('*');
          
          if (customDomain) {
            const result = await query.eq('custom_domain', customDomain).eq('is_white_labeled', true).maybeSingle();
            partnerData = result.data;
            error = result.error;
          } else if (subdomain) {
            const result = await query.eq('subdomain', subdomain).eq('is_white_labeled', true).maybeSingle();
            partnerData = result.data;
            error = result.error;
          }
        }
        
        // If no domain match but user is a partner, load their branding
        if (!partnerData && !error && user) {
          const result = await supabase
            .from('partners')
            .select('*')
            .eq('id', user.id)
            .eq('is_white_labeled', true)
            .maybeSingle();
          
          if (!result.error && result.data) {
            partnerData = result.data;
          }
        }
        
        // If we found white-label data, set it
        if (partnerData) {
          const brandingData = partnerData.branding || {};
          
          setBranding({
            isWhiteLabeled: true,
            partnerId: partnerData.id,
            companyName: partnerData.practice_name || brandingData.companyName || defaultBranding.companyName,
            logo: brandingData.logo || defaultBranding.logo,
            primaryColor: brandingData.primaryColor || defaultBranding.primaryColor,
            secondaryColor: brandingData.secondaryColor || defaultBranding.secondaryColor,
            contactEmail: partnerData.email || brandingData.contactEmail,
            contactPhone: partnerData.phone || brandingData.contactPhone,
            customDomain: partnerData.custom_domain || null,
            subdomain: partnerData.subdomain || null
          });
        } else {
          // Reset to default if no white-labeling is found
          setBranding(defaultBranding);
        }
      } catch (e) {
        console.error('Error loading white-label settings:', e);
        setBranding(defaultBranding);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadWhiteLabelSettings();
  }, [user]);

  // Generate CSS variables for theme colors
  const cssVariables = {
    '--primary': branding.primaryColor,
    '--secondary': branding.secondaryColor,
  } as React.CSSProperties;

  return {
    isLoading,
    branding,
    cssVariables,
    isWhiteLabeled: branding.isWhiteLabeled
  };
};
