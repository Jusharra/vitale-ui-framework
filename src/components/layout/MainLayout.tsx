import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Menu, X } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import Footer from './Footer';

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isAuthenticated, signOut } = useAuth();
  const location = useLocation();
  const navigate = (path: string) => window.location.href = path;

  const menuItems = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Services', path: '/services' },
    { name: 'Financing', path: '/financing' },
    { name: 'Membership', path: '/membership' },

    { name: 'Partners', path: '/partners' },

    { name: 'Contact', path: '/contact' },
  ];

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const handleDashboardClick = () => {
    if (isAuthenticated) {
      window.location.href = '/dashboard';
    } else {
      window.location.href = '/auth';
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <header className="py-4 px-6 md:px-8 bg-transparent backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border/40">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center">
            <h1 className="text-xl md:text-2xl font-bold font-playfair tracking-tight">Vitalé Health Concierge</h1>
          </div>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            {menuItems.map((item, index) => (
              <Link 
                key={index} 
                to={item.path} 
                className={`text-muted-foreground hover:text-primary transition-colors ${
                  location.pathname === item.path ? 'text-primary font-medium' : ''
                }`}
              >
                {item.name}
              </Link>
            ))}
          </nav>
          
          <div className="flex items-center gap-4">
            {isAuthenticated ? (
              <div className="flex gap-2">
                <Button onClick={() => navigate('/dashboard')}>Dashboard</Button>
                <Button variant="outline" onClick={signOut}>Sign Out</Button>
              </div>
            ) : (
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => navigate('/auth')}>Member Login</Button>
              </div>
            )}
            
            {/* Mobile menu button */}
            <button 
              className="md:hidden p-2 rounded-md text-muted-foreground hover:text-primary hover:bg-muted/50"
              onClick={toggleMobileMenu}
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
        
        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-4 py-2 border-t">
            <div className="container mx-auto flex flex-col space-y-2">
              {menuItems.map((item, index) => (
                <Link 
                  key={index} 
                  to={item.path} 
                  className={`px-4 py-2 rounded-md ${
                    location.pathname === item.path 
                      ? 'bg-muted text-primary font-medium' 
                      : 'text-muted-foreground hover:bg-muted/50'
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
        )}
      </header>
      
      <main className="flex-1">
        {children}
      </main>
      
      <Footer />
    </div>
  );
};

export default MainLayout;