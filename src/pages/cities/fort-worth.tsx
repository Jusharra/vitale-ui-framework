import React from 'react';
import CityLandingPage, { CityConfig } from '@/components/city/CityLandingPage';

const config: CityConfig = {
  city: 'Fort Worth',
  state: 'TX',
  stateFullName: 'Texas',
  slug: 'fort-worth',
  phone: '(817) 400-2273',
  phoneHref: 'tel:+18174002273',
  canonicalUrl: 'https://vitalehealthconcierge.doctor/fort-worth',

  metaTitle: 'Mobile Doctor & Private Nurse in Fort Worth, TX | Vitalé Health Concierge',
  metaDescription:
    'Need a mobile doctor or private nurse in Fort Worth today? Vitalé coordinates same-day access to independent licensed physicians and RNs for home, office, and hotel visits across Fort Worth, Southlake, Westlake, and the mid-cities. Call 24/7.',
  keywords:
    'mobile doctor fort worth, concierge doctor fort worth, same day doctor fort worth tx, private doctor fort worth, home visit doctor fort worth, mobile nurse fort worth, in-home nurse fort worth, iv therapy fort worth, concierge medicine fort worth tx, doctor at home fort worth',

  heroSub:
    'We coordinate same-day access to independent licensed physicians, nurse practitioners, and RNs for home, office, and hotel visits across Fort Worth, Southlake, Westlake, and the DFW mid-cities — available 24/7.',

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
    'Westover Hills',
    'Ridglea',
    'Southlake',
    'Westlake',
    'Colleyville',
    'Keller',
    'Grapevine',
    'Aledo',
    'Benbrook',
    'Lake Worth',
    'Roanoke',
    'Trophy Club',
    'Haslet',
    'Alliance',
  ],

  faqs: [
    {
      q: 'Can I get a doctor to come to my home in Fort Worth?',
      a: 'Yes. We coordinate requests with independent licensed physicians and nurse practitioners who offer home visits across Fort Worth, including Westover Hills, Ridglea, and surrounding neighborhoods.',
    },
    {
      q: 'Do you serve Southlake and Westlake?',
      a: 'Yes. Southlake and Westlake are within our coordination area. These communities are among the most actively served in the DFW metro for private healthcare coordination.',
    },
    {
      q: 'Do you cover the Fort Worth mid-cities like Grapevine and Colleyville?',
      a: 'Yes. We coordinate services throughout Grapevine, Colleyville, Keller, and surrounding mid-cities communities. Call us and we\'ll identify the nearest available provider.',
    },
    {
      q: 'How quickly can a provider reach me in Fort Worth?',
      a: 'Same-day visits are frequently available in Fort Worth and the mid-cities. Response times depend on current provider availability. Call early in the day for the best chance of same-day service.',
    },
    {
      q: 'Do you accept insurance in Fort Worth?',
      a: 'Services vary by provider. Many participating providers offer private-pay options. We will confirm costs before you commit to any service.',
    },
    {
      q: 'Can a provider come to my office or business in Fort Worth?',
      a: 'Yes. We coordinate workplace visits, including corporate offices, private suites, and executive campuses across Fort Worth, Alliance, and the mid-cities corridor.',
    },
    {
      q: 'Do you provide emergency medical care?',
      a: 'No. If you have a medical emergency, call 911 or go to the nearest emergency department immediately. We coordinate non-emergency visits only.',
    },
  ],
};

const FortWorthPage: React.FC = () => <CityLandingPage {...config} />;

export default FortWorthPage;
