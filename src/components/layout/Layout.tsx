
import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import Sidebar from '@/components/layout/Sidebar';
import Navbar from '@/components/layout/Navbar';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import WhiteLabelProvider from '@/components/white-label/WhiteLabelProvider';
import LanguageProvider from '@/components/i18n/LanguageProvider';
import RegionalSettings from '@/components/common/RegionalSettings';
import LanguageSelector from '@/components/i18n/LanguageSelector';

interface LayoutProps {
  children: React.ReactNode;
  role?: 'member' | 'professional' | 'admin';
}

const Layout = ({ children, role = 'member' }: LayoutProps) => {
  const { user, isLoading } = useAuth();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const isMobile = useMediaQuery('(max-width: 768px)');
  
  useEffect(() => {
    // Close the sidebar when the route changes
    setIsSidebarOpen(false);
  }, [location.pathname]);
  
  if (isLoading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  return (
    <LanguageProvider>
      <WhiteLabelProvider>
        <div className="min-h-screen flex bg-background">
          <Sidebar role={role} />
          
          <div className="flex flex-col flex-1">
            <Navbar 
              onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} 
              isMobile={isMobile}
            />
            
            <main className="flex-1 p-4 md:p-6 overflow-auto">
              <div className="mb-4 flex flex-col-reverse md:flex-row md:items-center md:justify-between">
                {/* Page content and other elements */}
              </div>
              
              {children}
              
              {/* Global settings footer */}
              <div className="mt-8 pt-4 border-t">
                <div className="flex flex-wrap gap-4 justify-between items-center">
                  <LanguageSelector variant="minimal" />
                  
                  <div className="hidden md:block">
                    <RegionalSettings compact />
                  </div>
                </div>
              </div>
            </main>
          </div>
        </div>
      </WhiteLabelProvider>
    </LanguageProvider>
  );
};

export default Layout;
