import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Phone, MessageSquare } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="py-12 px-4 sm:px-6 lg:px-8 bg-[hsl(var(--brand-ink))] text-[hsl(var(--background))]">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center mb-4">
              <span className="text-xl font-bold font-playfair">Vitalé Health Concierge</span>
            </div>
            <p className="text-muted-foreground/80 mb-6">
              Private, physician-backed concierge care. Discreet and immediate support for distinguished families.
            </p>
            <div className="flex gap-4">
              <Button variant="luxury" size="sm" className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                <span>Concierge Call</span>
              </Button>
              <Button variant="outline" size="sm" className="flex items-center gap-2">
                <MessageSquare className="h-4 w-4" />
                <span>Text Concierge</span>
              </Button>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Services</h3>
            <ul className="space-y-2">
              <li><Link to="/marketplace" className="text-gray-400 hover:text-white">In-Home Care</Link></li>
              <li><Link to="/marketplace" className="text-gray-400 hover:text-white">IV Therapy</Link></li>
              <li><Link to="/marketplace" className="text-gray-400 hover:text-white">Hospice Care</Link></li>
              <li><Link to="/marketplace" className="text-gray-400 hover:text-white">Assisted Living Communities</Link></li>
              <li><Link to="/marketplace" className="text-gray-400 hover:text-white">Wellness Programs</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Company</h3>
            <ul className="space-y-2">
              <li><Link to="/about" className="text-gray-400 hover:text-white">About Us</Link></li>
              <li><Link to="/blog" className="text-gray-400 hover:text-white">Blog</Link></li>
              <li><Link to="/careers" className="text-gray-400 hover:text-white">Careers</Link></li>
              <li><Link to="/contact" className="text-gray-400 hover:text-white">Contact</Link></li>
              <li><Link to="/partners" className="text-gray-400 hover:text-white">For Providers</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-border/30 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-muted-foreground/70">© {new Date().getFullYear()} Vitalé Health Concierge. All rights reserved.</p>
          <div className="flex gap-6 mt-4 md:mt-0">
            <Link to="/privacy" className="text-sm text-muted-foreground/80 hover:text-foreground">Privacy Policy</Link>
            <Link to="/terms" className="text-sm text-muted-foreground/80 hover:text-foreground">Terms of Service</Link>
            <Link to="/accessibility" className="text-sm text-muted-foreground/80 hover:text-foreground">Accessibility</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;