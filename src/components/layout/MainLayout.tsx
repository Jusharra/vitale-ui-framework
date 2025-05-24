import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Menu, X } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

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
    { name: 'Financing', path: '/financing' },
    { name: 'Membership', path: '/membership' },
    { name: 'Placements', path: '/placements' },
    { name: 'Partners', path: '/partners' },
    { name: 'Blog', path: '/blog' },
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
      <header className="py-4 px-6 md:px-8 bg-white shadow-sm">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center">
            <div className="bg-indigo-600 text-white font-bold text-xl px-3 py-1 rounded mr-2">VH</div>
            <h1 className="text-xl font-bold text-gray-800">Vitale Health Concierge</h1>
          </div>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            {menuItems.map((item, index) => (
              <Link 
                key={index} 
                to={item.path} 
                className={`text-gray-600 hover:text-indigo-600 transition-colors ${
                  location.pathname === item.path ? 'text-indigo-600 font-medium' : ''
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
              <Button onClick={() => navigate('/auth')}>Sign In</Button>
            )}
            
            {/* Mobile menu button */}
            <button 
              className="md:hidden p-2 rounded-md text-gray-600 hover:text-indigo-600 hover:bg-gray-100"
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
                      ? 'bg-indigo-50 text-indigo-600 font-medium' 
                      : 'text-gray-600 hover:bg-gray-50'
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
      
      <footer className="bg-gray-800 text-white py-8">
        <div className="container mx-auto px-6 md:px-8">
          <div className="flex flex-col md:flex-row justify-between">
            <div className="mb-6 md:mb-0">
              <div className="flex items-center">
                <div className="bg-white text-indigo-600 font-bold text-xl px-3 py-1 rounded mr-2">VH</div>
                <span className="text-xl font-bold">Vitale Health</span>
              </div>
              <p className="mt-2 text-gray-400 text-sm">Personalized healthcare at your fingertips</p>
            </div>
            <div className="grid grid-cols-2 gap-8 md:gap-20">
              <div>
                <h3 className="text-sm font-semibold uppercase tracking-wider">Membership</h3>
                <ul className="mt-4 space-y-2">
                  <li><Link to="/membership" className="text-gray-400 hover:text-white">Smart Access</Link></li>
                  <li><Link to="/membership" className="text-gray-400 hover:text-white">Core Concierge</Link></li>
                  <li><Link to="/membership" className="text-gray-400 hover:text-white">VIP Executive</Link></li>
                </ul>
              </div>
              <div>
                <h3 className="text-sm font-semibold uppercase tracking-wider">Support</h3>
                <ul className="mt-4 space-y-2">
                  <li><Link to="/contact" className="text-gray-400 hover:text-white">Contact</Link></li>
                  <li><Link to="/about" className="text-gray-400 hover:text-white">FAQ</Link></li>
                  <li><Link to="/about" className="text-gray-400 hover:text-white">Privacy</Link></li>
                </ul>
              </div>
            </div>
          </div>
          <div className="mt-8 border-t border-gray-700 pt-8 flex flex-col md:flex-row justify-between">
            <p className="text-gray-400 text-sm">© 2025 Vitale Health Concierge. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default MainLayout;