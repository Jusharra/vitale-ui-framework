import React from 'react';
import CityLandingPage, { CityConfig } from '@/components/city/CityLandingPage';

const config: CityConfig = {
  city: 'Phoenix',
  state: 'AZ',
  stateFullName: 'Arizona',
  slug: 'phoenix',
  phone: '(602) 755-0900',
  phoneHref: 'tel:+16027550900',
  canonicalUrl: 'https://vitalehealthconcierge.doctor/phoenix',

  metaTitle: 'Private Doctor in Phoenix, AZ — 60-Minute Dispatch | Vitalé Health Concierge',
  metaDescription:
    'Private healthcare dispatched to your door in Phoenix in 60 minutes or less. Board-certified MDs, NPs, and RNs for home, hotel, and office visits — cash-pay, no waiting rooms, flat-rate pricing. Available 24/7.',
  keywords:
    'house call doctor phoenix, mobile doctor phoenix, in home urgent care phoenix, same day doctor phoenix az, hotel doctor phoenix, biltmore phoenix mobile doctor, mobile physician phoenix az, doctor at home phoenix, concierge doctor phoenix, private doctor phoenix, private nurse phoenix, in-home doctor phoenix, cash pay doctor phoenix, 60 minute doctor phoenix, same day iv hydration therapy phoenix, at home lab draw phoenix, on call doctor phoenix, physician house call near me',

  h1: 'Private Healthcare Dispatched to Your Door in 60 Minutes or Less',
  dispatchTime: '42 minutes',

  heroSub:
    'No waiting rooms. No insurance bureaucracy. A board-certified medical provider at your home, hotel, or office in Phoenix & Scottsdale — today.',

  primaryService: 'Same-Day Mobile Doctor Visits',

  services: [
    'Same-Day Mobile Doctor Visits',
    'Mobile Blood Draws',
    'Post-Surgical Nursing Visits',
    'IV Hydration Therapy',
    'Medication Administration',
    'Home Wound Care',
    'Wellness Visits',
    'Hotel & Resort Visits',
    'Nurse Practitioners',
    'Registered Nurses',
  ],

  serviceLinks: [
    { label: 'Mobile Doctor in Phoenix', href: '/phoenix/mobile-doctor' },
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
      q: 'Can I get a doctor to come to my home in Phoenix?',
      a: 'Yes. We coordinate requests with independent licensed physicians and nurse practitioners who offer home visits in the Phoenix metro. Call us and we\'ll identify the nearest available provider.',
    },
    {
      q: 'Do you serve Scottsdale and Paradise Valley?',
      a: 'Yes. We coordinate services throughout Scottsdale, Paradise Valley, and the broader Phoenix metro area. If you\'re at a resort or hotel in Scottsdale, we can coordinate a provider visit directly to your room.',
    },
    {
      q: 'How quickly can a provider reach me in Phoenix?',
      a: 'Response times depend on provider availability and your specific location. In the Phoenix metro, same-day visits are frequently available. Call us early in the day for the best chance of same-day service.',
    },
    {
      q: 'Do you accept insurance in Phoenix?',
      a: 'Services vary by provider. Many participating providers offer private-pay options. We\'ll let you know what to expect when we coordinate your request — before you commit.',
    },
    {
      q: 'Can a doctor come to my hotel room in Phoenix?',
      a: 'Yes. Hotel room physician visits are one of the most common requests we coordinate in Phoenix. Whether you\'re at a convention center hotel downtown, a resort in North Phoenix, or a property near the Biltmore — we coordinate an independent licensed physician directly to your room.',
    },
    {
      q: 'Do you coordinate IV hydration therapy in Phoenix?',
      a: 'Yes. Same-day IV hydration therapy is among the most requested services in the Phoenix metro. We coordinate independent registered nurses who bring supplies and administer IV fluids, vitamins, and hydration protocols at your home, hotel, or office.',
    },
    {
      q: 'Do you serve the Biltmore area and North Phoenix?',
      a: 'Yes. We coordinate mobile physician and nursing visits throughout the Phoenix metro including the Biltmore corridor, Arcadia, Paradise Valley, North Phoenix, and surrounding areas. Call us with your location and we\'ll confirm available provider coverage.',
    },
    {
      q: 'Can a nurse come to my hotel in Phoenix or Scottsdale?',
      a: 'Yes. We coordinate hotel and resort visits for guests across the Phoenix metro, including Scottsdale resorts. Services like IV hydration, wellness visits, and nursing care can often be delivered to your room.',
    },
    {
      q: 'Do you provide emergency medical care in Phoenix?',
      a: 'No. If you have a medical emergency, call 911 or go to the nearest emergency department immediately. We coordinate non-emergency, scheduled, and same-day wellness and clinical visits only.',
    },
    {
      q: 'What is the coordination fee?',
      a: 'Vitalé charges a coordination fee that is separate from the provider\'s clinical charges. The provider sets their own rates. We are transparent about all costs before you commit to any service.',
    },
  ],
};

const PhoenixPage: React.FC = () => <CityLandingPage {...config} />;

export default PhoenixPage;
