
import React, { ReactNode } from 'react';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import { useAuth } from '@/context/AuthContext';
import FloatingLanguageSelector from '@/components/i18n/FloatingLanguageSelector';

interface LayoutProps {
  children: ReactNode;
  role?: 'member' | 'admin' | 'professional';
}

const Layout: React.FC<LayoutProps> = ({ children, role = 'member' }) => {
  const { user } = useAuth();
  
  return (
    <div className="h-screen flex flex-col bg-background">
      <Navbar />
      <div className="flex flex-1 overflow-hidden">
        {user && <Sidebar role={role} />}
        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          <div className="container mx-auto">
            {children}
          </div>
        </main>
      </div>
      <FloatingLanguageSelector />
    </div>
  );
};

export default Layout;
