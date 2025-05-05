
import React, { useEffect } from 'react';
import { useWhiteLabel } from '@/hooks/useWhiteLabel';

interface WhiteLabelProviderProps {
  children: React.ReactNode;
}

const WhiteLabelProvider: React.FC<WhiteLabelProviderProps> = ({ children }) => {
  const whiteLabelConfig = useWhiteLabel();
  const { primaryColor, secondaryColor, fontFamily, darkMode, isCustomDomain } = whiteLabelConfig;
  
  // Apply theme variables based on configuration
  useEffect(() => {
    if (isCustomDomain) {
      // Set CSS variables for theming
      if (primaryColor) {
        document.documentElement.style.setProperty('--primary', primaryColor);
      }
      
      if (secondaryColor) {
        document.documentElement.style.setProperty('--secondary', secondaryColor);
      }
      
      if (fontFamily) {
        document.documentElement.style.setProperty('--font-family', fontFamily);
        document.body.style.fontFamily = fontFamily;
      }
      
      // Handle dark mode toggle
      if (darkMode) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
  }, [primaryColor, secondaryColor, fontFamily, darkMode, isCustomDomain]);

  return <>{children}</>;
};

export default WhiteLabelProvider;
