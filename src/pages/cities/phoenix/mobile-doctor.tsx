import React from 'react';
import CityServiceLandingPage, { CityServiceConfig } from '@/components/city/CityServiceLandingPage';

const config: CityServiceConfig = {
  city: 'Phoenix',
  state: 'AZ',
  stateFullName: 'Arizona',
  citySlug: 'phoenix',
  serviceSlug: 'mobile-doctor',
  serviceName: 'Mobile Doctor',
  phone: '(602) 755-0900',
  phoneHref: 'tel:+16027550900',
  canonicalUrl: 'https://vitalehealthconcierge.doctor/phoenix/mobile-doctor',

  metaTitle: 'Mobile Doctor in Phoenix, AZ | Same-Day Home Visits | Vitalé Health Concierge',
  metaDescription:
    'Need a mobile doctor in Phoenix today? Vitalé connects patients with independent licensed physicians for same-day home, hotel, and office visits across Phoenix, Scottsdale, and the surrounding metro. Available 24/7. Call now.',
  keywords:
    'house call doctor phoenix, mobile doctor phoenix, in home urgent care phoenix, mobile physician phoenix az, on call doctor phoenix, hotel doctor phoenix, biltmore phoenix mobile doctor, mobile doctor paradise valley, mobile doctor scottsdale, doctor at home phoenix, home visit doctor phoenix, same day doctor phoenix, same day doctor visit paradise valley, doctor to hotel room phoenix, in-home doctor phoenix, doctor comes to you phoenix, private doctor house call near me, mobile doctor near me phoenix az',

  h1: 'Mobile Doctor in Phoenix, AZ',

  heroSub:
    'We connect Phoenix patients with independent licensed physicians who come to your home, hotel, or office — same day when available. No waiting rooms. No clinics. A real coordinator dispatches the right provider to your door.',

  whatIsIncluded: [
    'Acute illness evaluation (cold, flu, infection, URI)',
    'Prescription management and medication adjustments',
    'Chronic disease check-in and monitoring',
    'Physical examination and vital signs assessment',
    'Lab work coordination and specimen collection',
    'Wound assessment and basic wound care',
    'Pre-travel and post-travel consultations',
    'Post-hospitalization follow-up visits',
    'Medication reconciliation and review',
    'Referral coordination to specialists',
  ],

  neighborhoods: [
    'Scottsdale',
    'Paradise Valley',
    'Tempe',
    'Mesa',
    'Gilbert',
    'Chandler',
    'Glendale',
    'Peoria',
    'Downtown Phoenix',
    'North Phoenix',
    'Ahwatukee',
    'Arcadia',
    'Biltmore',
    'Fountain Hills',
  ],

  faqs: [
    {
      q: 'What conditions can a mobile doctor treat at my home in Phoenix?',
      a: 'Independent physicians we coordinate with can evaluate and treat a wide range of non-emergency conditions including respiratory infections, UTIs, skin conditions, minor injuries, chronic disease flare-ups, and general illness. They can also perform physical examinations, review medications, and coordinate lab work. For emergencies, call 911.',
    },
    {
      q: 'Can a mobile doctor in Phoenix prescribe medication?',
      a: 'Yes. Independent licensed physicians can prescribe medications during a home visit, subject to their clinical judgment and applicable Arizona law. They will assess your condition and determine what, if any, prescriptions are appropriate.',
    },
    {
      q: 'How is a mobile doctor different from a telemedicine visit?',
      a: 'A mobile doctor physically comes to your location. They can perform a hands-on examination, take vital signs, collect specimens for lab work, administer medications, and address conditions that require an in-person assessment — none of which telemedicine can provide.',
    },
    {
      q: 'How much does a mobile doctor visit in Phoenix cost?',
      a: 'Vitalé charges a coordination fee that is separate from the physician\'s clinical charges. The provider sets their own rates, which we disclose to you before the visit. Most mobile physician visits in the Phoenix area operate on a private-pay basis. We are transparent about all costs before you commit.',
    },
    {
      q: 'How quickly can a mobile doctor reach me in Phoenix?',
      a: 'Response times depend on current provider availability and your specific location within the Phoenix metro. Same-day visits are frequently available when you call early in the day. Call us and we\'ll give you a realistic estimate based on current availability.',
    },
    {
      q: 'Do you send the same doctor each time?',
      a: 'We coordinate with a network of independent licensed physicians. While we cannot guarantee the same provider each visit, all physicians in our network are licensed, insured, and background-verified before we dispatch them.',
    },
    {
      q: 'Can a mobile doctor come to my hotel or resort in Scottsdale or Phoenix?',
      a: 'Yes. Hotel and resort visits are one of the most common requests we coordinate in the Phoenix metro. A physician can come directly to your room at any hotel or resort in the area.',
    },
    {
      q: 'Do you serve the Biltmore corridor, Arcadia, and Paradise Valley?',
      a: 'Yes. The Biltmore area, Arcadia, and Paradise Valley are all within our Phoenix-area coordination coverage. These neighborhoods are among our highest-demand zones for mobile physician visits. Call us with your address and we\'ll confirm same-day availability.',
    },
    {
      q: 'How is an in-home urgent care visit different from going to an urgent care clinic?',
      a: 'At an urgent care clinic, you drive there, check in, wait — often 60–120 minutes — and share a waiting room with other sick patients. A mobile physician visit happens at your home, hotel, or office. You don\'t move. The provider comes to you, on your schedule, with no waiting room exposure.',
    },
    {
      q: 'Do you provide emergency medical care?',
      a: 'No. If you have a medical emergency, call 911 or go to the nearest emergency department immediately. We coordinate non-emergency, scheduled, and same-day clinical visits only.',
    },
  ],
};

const PhoenixMobileDoctorPage: React.FC = () => <CityServiceLandingPage {...config} />;

export default PhoenixMobileDoctorPage;
