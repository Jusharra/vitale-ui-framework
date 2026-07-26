import React from 'react';
import CityLandingPage, { CityConfig } from '@/components/city/CityLandingPage';

const config: CityConfig = {
  city: 'Scottsdale',
  state: 'AZ',
  stateFullName: 'Arizona',
  slug: 'scottsdale',
  phone: '(480) 400-2273',
  phoneHref: 'tel:+14804002273',
  canonicalUrl: 'https://vitalehealthconcierge.doctor/scottsdale',

  metaTitle: 'Private Doctor in Scottsdale, AZ — 60-Minute Dispatch | Vitalé Health Concierge',
  metaDescription:
    'Private healthcare dispatched to your door in Scottsdale in 60 minutes or less. Board-certified MDs, NPs, and RNs for home, resort, and hotel visits across Scottsdale, Paradise Valley, and North Scottsdale — cash-pay, flat-rate pricing. Available 24/7.',
  keywords:
    'house call doctor scottsdale, mobile doctor scottsdale, on call doctor scottsdale, doctor to hotel room scottsdale, same day doctor visit paradise valley, private physician paradise valley, dc ranch private urgent care, concierge medicine north scottsdale, concierge doctor scottsdale, in home migraine relief injection scottsdale, at home lab draw scottsdale, same day doctor scottsdale az, resort doctor scottsdale, hotel doctor scottsdale, cash pay doctor scottsdale, 60 minute doctor scottsdale, doctor at home scottsdale, private doctor scottsdale, mobile physician scottsdale az',

  h1: 'Private Healthcare Dispatched to Your Door in 60 Minutes or Less',
  dispatchTime: '38 minutes',

  heroSub:
    'No waiting rooms. No insurance bureaucracy. A board-certified medical provider at your Scottsdale home, resort, or hotel — including Paradise Valley, North Scottsdale, and DC Ranch — today.',

  primaryService: 'Same-Day Mobile Doctor Visits',

  services: [
    'Same-Day Mobile Doctor Visits',
    'Hotel & Resort Room Visits',
    'Mobile Blood Draws',
    'IV Hydration Therapy',
    'Post-Surgical Nursing Visits',
    'Medication Administration',
    'Wellness Visits',
    'Home Wound Care',
    'Nurse Practitioners',
    'Registered Nurses',
  ],

  neighborhoods: [
    'Old Town Scottsdale',
    'North Scottsdale',
    'Gainey Ranch',
    'McCormick Ranch',
    'DC Ranch',
    'Troon',
    'Kierland',
    'Pinnacle Peak',
    'Paradise Valley',
    'Carefree',
    'Cave Creek',
    'Fountain Hills',
    'Arcadia',
    'Grayhawk',
  ],

  faqs: [
    {
      q: 'Can I get a doctor to come to my resort or hotel in Scottsdale?',
      a: 'Yes. We coordinate hotel and resort room visits across Scottsdale, including luxury resorts on Frank Lloyd Wright Boulevard and in the North Scottsdale corridor. A provider can come directly to your room.',
    },
    {
      q: 'Do you serve Paradise Valley?',
      a: 'Yes. Paradise Valley is within our coordination coverage area. Whether you need a home visit or nursing care, call us and we will identify the nearest available provider.',
    },
    {
      q: 'How quickly can a provider reach me in Scottsdale?',
      a: 'In Scottsdale and North Scottsdale, same-day visits are frequently available. Call early in the day for the best chance of same-day service. Response times depend on current provider availability.',
    },
    {
      q: 'Do you coordinate IV hydration in Scottsdale?',
      a: 'Yes. IV hydration therapy is one of the most requested services in Scottsdale, particularly for visitors and guests recovering from outdoor activities or travel. We coordinate licensed RNs who deliver this service to your location.',
    },
    {
      q: 'Do you coordinate mobile doctors for North Scottsdale, Kierland, and DC Ranch?',
      a: 'Yes. We coordinate physician and nurse visits throughout North Scottsdale — including Kierland, DC Ranch, Troon, Grayhawk, and surrounding neighborhoods. These are among our most frequently served areas in the Scottsdale market.',
    },
    {
      q: 'What is the difference between concierge medicine and what Vitalé does?',
      a: 'Concierge medicine typically involves a direct retainer relationship between a patient and a single physician — annual fees, exclusive access. Vitalé is a coordination platform: you call us when you need care, we connect you with an independent licensed provider, and you pay per visit. No membership required, no annual commitment.',
    },
    {
      q: 'Can you coordinate in-home migraine or injection treatments in Scottsdale?',
      a: 'In some cases, yes. Independent nurse practitioners and physicians in our network can administer certain injections and perform clinical assessments at your home or hotel. Describe your specific need when you call and we\'ll identify the appropriate provider type.',
    },
    {
      q: 'Do you accept insurance in Scottsdale?',
      a: 'Services vary by provider. Many participating providers in the Scottsdale area offer private-pay options. We\'ll let you know what to expect before you commit to any service.',
    },
    {
      q: 'Is this service available for snowbirds and seasonal residents?',
      a: 'Absolutely. Many of our Scottsdale-area requests come from seasonal residents who need access to care without an established local physician. We can coordinate a visit the same day you call.',
    },
    {
      q: 'Do you provide emergency medical care?',
      a: 'No. If you have a medical emergency, call 911 or go to the nearest emergency department. We coordinate non-emergency, same-day, and scheduled clinical visits only.',
    },
  ],
};

const ScottsdalePage: React.FC = () => <CityLandingPage {...config} />;

export default ScottsdalePage;
