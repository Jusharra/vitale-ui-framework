import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Phone, MessageSquare } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center mb-4">
              <div className="bg-white text-indigo-600 font-bold text-xl px-3 py-1 rounded mr-2">VH</div>
              <span className="text-xl font-bold">Vitalé Health Concierge</span>
            </div>
            <p className="text-gray-400 mb-6">
              Premium healthcare services delivered with compassion and expertise. Serving families across California and Texas.
            </p>
            <div className="flex gap-4">
              <Button variant="outline" size="sm" className="flex items-center gap-2 text-indigo-700 border-gray-600 hover:bg-indigo-50">
                <Phone className="h-4 w-4" />
                <span>Call Us</span>
              </Button>
              <Button variant="outline" size="sm" className="flex items-center gap-2 text-indigo-700 border-gray-600 hover:bg-indigo-50">
                <MessageSquare className="h-4 w-4" />
                <span>Text Us</span>
              </Button>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Services</h3>
            <ul className="space-y-2">
              <li><Link to="/services/in-home-care" className="text-gray-400 hover:text-white">In-Home Care</Link></li>
              <li><Link to="/services/iv-therapy" className="text-gray-400 hover:text-white">IV Therapy</Link></li>
              <li><Link to="/services/hospice" className="text-gray-400 hover:text-white">Hospice Care</Link></li>
              <li><Link to="/placements" className="text-gray-400 hover:text-white">Assisted Living Communities</Link></li>
              <li><Link to="/services/wellness" className="text-gray-400 hover:text-white">Wellness Programs</Link></li>
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
        
        <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-gray-500">© {new Date().getFullYear()} Vitalé Health Concierge. All rights reserved.</p>
          <div className="flex gap-6 mt-4 md:mt-0">
            <Link to="/privacy" className="text-sm text-gray-500 hover:text-gray-400">Privacy Policy</Link>
            <Link to="/terms" className="text-sm text-gray-500 hover:text-gray-400">Terms of Service</Link>
            <Link to="/accessibility" className="text-sm text-gray-500 hover:text-gray-400">Accessibility</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;