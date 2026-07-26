import React from 'react';
import CityLandingPage, { CityConfig } from '@/components/city/CityLandingPage';

const config: CityConfig = {
  city: 'Dallas',
  state: 'TX',
  stateFullName: 'Texas',
  slug: 'dallas',
  phone: '(214) 400-2273',
  phoneHref: 'tel:+12144002273',
  canonicalUrl: 'https://vitalehealthconcierge.doctor/dallas',

  metaTitle: 'Mobile Doctor & Private Nurse in Dallas, TX | Vitalé Health Concierge',
  metaDescription:
    'Need a mobile doctor or private nurse in Dallas today? Vitalé coordinates same-day access to independent licensed physicians, NPs, and RNs for home, office, and hotel visits across Dallas, Highland Park, Plano, and the DFW metro. Call 24/7.',
  keywords:
    'mobile doctor dallas, concierge doctor dallas, same day doctor dallas tx, private doctor dallas, home visit doctor dallas, mobile nurse dallas, in-home nurse dallas, iv therapy dallas, concierge medicine dallas tx, doctor at home dallas, direct primary care dallas',

  heroSub:
    'We coordinate same-day access to independent licensed physicians, nurse practitioners, and RNs for home, office, and hotel visits across Dallas and the DFW metro — available 24/7.',

  primaryService: 'Same-Day Mobile Doctor Visits',

  services: [
    'Same-Day Mobile Doctor Visits',
    'Mobile Blood Draws',
    'Post-Surgical Nursing Visits',
    'IV Hydration Therapy',
    'Medication Administration',
    'Home Wound Care',
    'Wellness Visits',
    'Corporate & Office Visits',
    'Nurse Practitioners',
    'Registered Nurses',
  ],

  neighborhoods: [
    'Highland Park',
    'University Park',
    'Preston Hollow',
    'Uptown Dallas',
    'Lakewood',
    'Plano',
    'Frisco',
    'McKinney',
    'Allen',
    'Richardson',
    'Southlake',
    'Colleyville',
    'Addison',
    'Las Colinas',
  ],

  faqs: [
    {
      q: 'Can I get a doctor to come to my home in Dallas?',
      a: 'Yes. We coordinate requests with independent licensed physicians and nurse practitioners who offer home visits in the Dallas metro, including Highland Park, University Park, Preston Hollow, and Uptown.',
    },
    {
      q: 'Do you serve Plano, Frisco, and McKinney?',
      a: 'Yes. We coordinate services throughout the North Dallas suburbs including Plano, Frisco, McKinney, and Allen. Call us and we\'ll identify the nearest available provider in your area.',
    },
    {
      q: 'Can a provider come to my office or corporate suite in Dallas?',
      a: 'Yes. We coordinate corporate and executive office visits in Dallas, including Uptown, the Galleria corridor, and Las Colinas. Providers can come to your office, building lobby, or private suite.',
    },
    {
      q: 'How quickly can a provider reach me in Dallas?',
      a: 'In the Dallas metro, same-day visits are frequently available. Response times depend on current provider availability and your location. Call early in the day for the best same-day availability.',
    },
    {
      q: 'Do you accept insurance in Dallas?',
      a: 'Services vary by provider. Many participating providers offer private-pay options. We will confirm pricing expectations before you commit to any service.',
    },
    {
      q: 'Do you coordinate IV hydration therapy in Dallas?',
      a: 'Yes. IV hydration is a commonly requested service in Dallas. We coordinate licensed RNs who deliver IV therapy to your home, hotel, or office.',
    },
    {
      q: 'Do you provide emergency medical care?',
      a: 'No. If you have a medical emergency, call 911 or go to the nearest emergency department immediately. We coordinate non-emergency, same-day, and scheduled visits only.',
    },
  ],
};

const DallasPage: React.FC = () => <CityLandingPage {...config} />;

export default DallasPage;
