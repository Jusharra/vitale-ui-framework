import React from 'react';
import { Link } from 'react-router-dom';
import { Phone, AlertTriangle } from 'lucide-react';

const PHONE_NUMBER = '(888) 400-2273';
const PHONE_HREF = 'tel:+18884002273';

const SERVICES = [
  { name: 'Same-Day Healthcare', href: '/services/same-day-healthcare-coordination' },
  { name: 'Mobile Doctor', href: '/services/mobile-doctor-coordination' },
  { name: 'Private Nurse', href: '/services/private-nurse-coordination' },
  { name: 'Home Healthcare', href: '/services/home-healthcare-coordination' },
  { name: 'Senior Care Navigation', href: '/services/senior-care-navigation' },
  { name: 'Concierge Coordination', href: '/services/concierge-healthcare-coordination' },
  { name: 'Medical Transportation', href: '/services/medical-transportation-coordination' },
  { name: 'Mobile Lab', href: '/services/mobile-lab-coordination' },
];

const CITIES = [
  { name: 'Phoenix, AZ', href: '/phoenix' },
  { name: 'Scottsdale, AZ', href: '/scottsdale' },
  { name: 'Dallas, TX', href: '/dallas' },
  { name: 'Fort Worth, TX', href: '/fort-worth' },
  { name: 'Tampa, FL', href: '/' },
  { name: 'Naples, FL', href: '/' },
  { name: 'Nashville, TN', href: '/' },
  { name: 'Charlotte, NC', href: '/' },
];

const COMPANY = [
  { name: 'About', href: '/about' },
  { name: 'Services', href: '/services' },

  { name: 'For Providers', href: '/partners' },
  { name: 'Contact', href: '/contact' },
  { name: 'Member Login', href: '/auth' },
];

const Footer: React.FC = () => {
  return (
    <footer className="bg-[hsl(var(--brand-ink))] text-white">
      {/* ── MAIN GRID ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">

          {/* Brand + CTA */}
          <div className="lg:col-span-1 space-y-5">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-white/40 mb-1">
                Healthcare Coordination Platform
              </p>
              <span className="text-xl font-bold font-playfair leading-tight">
                Vitalé Health Concierge
              </span>
            </div>
            <p className="text-sm text-white/60 leading-relaxed">
              We connect patients with independent licensed healthcare professionals — same day when available. AZ · TX · FL · TN · NC.
            </p>
            <div className="space-y-3 pt-1">
              <a
                href={PHONE_HREF}
                className="flex items-center gap-2.5 bg-[hsl(var(--brand-gold))] text-[hsl(var(--brand-ink))] font-bold text-sm px-5 py-3 rounded-xl hover:brightness-110 transition-all w-fit"
              >
                <Phone className="h-4 w-4" />
                {PHONE_NUMBER}
              </a>
              <p className="text-xs text-white/40">
                Available 24/7 · Real coordinator answers
              </p>
            </div>
          </div>

          {/* Services */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-widest text-white/40">Services</h3>
            <ul className="space-y-2.5">
              {SERVICES.map(({ name, href }) => (
                <li key={href}>
                  <Link
                    to={href}
                    className="text-sm text-white/60 hover:text-white transition-colors"
                  >
                    {name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Cities */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-widest text-white/40">Our Markets</h3>
            <ul className="space-y-2.5">
              {CITIES.map(({ name, href }) => (
                <li key={name}>
                  <Link
                    to={href}
                    className="text-sm text-white/60 hover:text-white transition-colors"
                  >
                    {name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-widest text-white/40">Company</h3>
            <ul className="space-y-2.5">
              {COMPANY.map(({ name, href }) => (
                <li key={href}>
                  <Link
                    to={href}
                    className="text-sm text-white/60 hover:text-white transition-colors"
                  >
                    {name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* ── TRUST STRIP ── */}
        <div className="mt-12 pt-6 border-t border-white/10 flex flex-wrap gap-x-8 gap-y-2 text-xs text-white/40 font-medium uppercase tracking-wider">
          <span>Licensed &amp; Verified Providers</span>
          <span>24/7 Coordination</span>
          <span>Cash-Pay · Private-Pay</span>
          <span>Non-Emergency Services Only</span>
          <span>AZ · TX · FL · TN · NC</span>
        </div>

        {/* ── BOTTOM BAR ── */}
        <div className="mt-8 pt-6 border-t border-white/10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="space-y-2">
            <p className="text-xs text-white/40">
              © {new Date().getFullYear()} Vitalé Health Concierge. All rights reserved.
            </p>
            <div className="flex items-start gap-1.5 text-xs text-white/30">
              <AlertTriangle className="h-3 w-3 shrink-0 mt-0.5" />
              <span>
                Vitalé is a coordination platform, not a clinical provider. For medical emergencies, call 911 or go to your nearest emergency department.
              </span>
            </div>
          </div>
          <div className="flex gap-5 shrink-0">
            <Link to="/privacy" className="text-xs text-white/40 hover:text-white transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="text-xs text-white/40 hover:text-white transition-colors">Terms of Service</Link>
            <Link to="/accessibility" className="text-xs text-white/40 hover:text-white transition-colors">Accessibility</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
