
import React, { ReactNode } from 'react';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import { useAuth } from '@/context/AuthContext';
import { SidebarProvider } from '@/components/ui/sidebar';

interface LayoutProps {
  children: ReactNode;
  role?: 'member' | 'admin' | 'professional';
}

const Layout: React.FC<LayoutProps> = ({ children, role = 'member' }) => {
  const { user } = useAuth();
  
  return (
    <SidebarProvider>
      <div className="h-screen flex flex-col bg-background w-full">
        <Navbar role={role} />
        <div className="flex flex-1 overflow-hidden">
          {user && <Sidebar role={role} />}
          <main className="flex-1 overflow-y-auto p-4 md:p-8">
            <div className="container mx-auto">
              {children}
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Layout;
