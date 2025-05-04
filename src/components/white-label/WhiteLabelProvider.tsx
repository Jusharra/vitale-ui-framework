
import React from 'react';
import { useWhiteLabel } from '@/hooks/useWhiteLabel';

interface WhiteLabelProviderProps {
  children: React.ReactNode;
}

const WhiteLabelProvider: React.FC<WhiteLabelProviderProps> = ({ children }) => {
  const { cssVariables, isWhiteLabeled, isLoading } = useWhiteLabel();
  
  // Apply CSS variables to the document root
  React.useEffect(() => {
    if (!isLoading && isWhiteLabeled) {
      const root = document.documentElement;
      
      Object.entries(cssVariables).forEach(([key, value]) => {
        if (value) {
          root.style.setProperty(key, value);
        }
      });
      
      // Clean up when component unmounts
      return () => {
        Object.keys(cssVariables).forEach(key => {
          root.style.removeProperty(key);
        });
      };
    }
  }, [cssVariables, isLoading, isWhiteLabeled]);
  
  return <>{children}</>;
};

export default WhiteLabelProvider;
