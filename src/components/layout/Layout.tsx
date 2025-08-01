import React, { ReactNode } from 'react';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import Footer from './Footer';
import { useAuth } from '@/context/AuthContext';
import { SidebarProvider } from '@/components/ui/sidebar';

interface LayoutProps {
  children: ReactNode;
  role?: 'member' | 'admin' | 'professional' | 'partner' | 'caregiver';
}

const Layout: React.FC<LayoutProps> = ({ children, role = 'member' }) => {
  const { user, userRole } = useAuth();
  
  // If a specific role is provided, use it; otherwise, use the user's role from auth context
  const effectiveRole = role || userRole || 'member';
  
  return (
    <SidebarProvider>
      <div className="h-screen flex flex-col bg-background w-full">
        <Navbar role={effectiveRole} />
        <div className="flex flex-1 overflow-hidden">
          {user && <Sidebar role={effectiveRole} />}
          <main className="flex-1 overflow-y-auto p-4 md:p-8 flex flex-col">
            <div className="container mx-auto flex-1">
              {children}
            </div>
            {user && <Footer />}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Layout;