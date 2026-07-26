import React from 'react';
import ServiceLandingPage, { ServicePageConfig } from '@/components/services/ServiceLandingPage';

const config: ServicePageConfig = {
  slug: 'same-day-healthcare-coordination',
  serviceName: 'Same-Day Healthcare Coordination',
  canonicalUrl: 'https://vitalehealthconcierge.doctor/services/same-day-healthcare-coordination',
  metaTitle: 'Same-Day Healthcare Coordination — Provider Today | Vitalé Health Concierge',
  metaDescription:
    'Need a doctor or nurse today? Vitalé coordinates same-day access to independent licensed healthcare professionals for home, hotel, and office visits. Cash-pay, no waiting room, 24/7.',
  keywords:
    'same day doctor near me, same day healthcare, doctor today, urgent care alternative, private doctor same day, mobile doctor same day, nurse today, physician same day visit, healthcare coordination same day',

  h1: 'Need a Provider Today? We\'ll Coordinate One.',
  heroSub:
    'Vitalé connects you with an independent licensed healthcare professional — physician, NP, or RN — for same-day visits to your home, hotel, or office. No waiting rooms. No hold queues.',

  intro:
    'Same-Day Healthcare Coordination is Vitalé\'s core service. When you need clinical care now — not next week, not after a three-hour urgent care wait — we navigate our network to identify the nearest available licensed provider who fits your need and dispatches to your location. We coordinate the access. The provider delivers the care.',

  whoItIsFor: [
    {
      label: 'Executive Traveler',
      headline: 'In town for business. Got sick overnight.',
      description:
        'You\'re at a hotel and can\'t afford to lose a half day in urgent care. We coordinate a provider to your room — often within 60 minutes.',
    },
    {
      label: 'Busy Professional',
      headline: 'Can\'t spend three hours in an urgent care.',
      description:
        'You\'re not sick enough for the ER but you need a diagnosis and treatment today. We navigate to a provider who comes to you on your schedule.',
    },
    {
      label: 'Family Caregiver',
      headline: 'Parent needs to be seen — today.',
      description:
        'Whether you\'re local or managing remotely, we coordinate same-day access so a parent or family member gets evaluated without the waiting room ordeal.',
    },
    {
      label: 'Seasonal Resident',
      headline: 'Second home. No local doctor.',
      description:
        'You\'re in Arizona, Florida, or Texas for the season and don\'t have an established physician. We coordinate a same-day visit without requiring an existing relationship.',
    },
    {
      label: 'Visitor or Tourist',
      headline: 'Got sick while traveling.',
      description:
        'You\'re visiting from out of state or out of country and need immediate access to care. We can coordinate a licensed provider to your hotel or rental property.',
    },
    {
      label: 'Recovery Patient',
      headline: 'Feeling off after a procedure.',
      description:
        'You had a procedure recently and something doesn\'t feel right. We can coordinate a post-surgical check-in visit from a licensed provider today.',
    },
  ],

  whatWeCoordinate: [
    'Same-day physician (MD) visits at your location',
    'Same-day nurse practitioner visits',
    'Same-day registered nurse visits',
    'Urgent wellness and illness evaluations',
    'Prescription coordination (provider-dependent)',
    'IV hydration and vitamin infusion (RN)',
    'Mobile blood draw and lab coordination',
    'Post-surgical same-day nursing checks',
    'Hotel and resort room visits',
    'Office and workplace visits',
  ],

  faqs: [
    {
      q: 'How quickly can you coordinate a provider?',
      a: 'Response times vary by market and current provider availability. In Phoenix and Scottsdale, same-day coordination is frequently completed within 60 minutes of your call when you reach us early in the day. In other markets, same-day service is often available but may take longer. We\'ll tell you the estimated window before you commit.',
    },
    {
      q: 'Is this the same as urgent care?',
      a: 'No. Urgent care is a physical facility you go to. Vitalé coordinates a provider who comes to your location. The provider is an independent licensed professional — not a Vitalé employee — who delivers care at your home, hotel, or office.',
    },
    {
      q: 'What types of conditions do you coordinate care for?',
      a: 'Non-emergency clinical needs: illness evaluation, respiratory symptoms, minor injuries, post-surgical monitoring, IV hydration, medication questions, wellness checks, and similar. We do not coordinate emergency care. If you have a life-threatening emergency, call 911.',
    },
    {
      q: 'Do you accept insurance?',
      a: 'Most providers in our network are private-pay only. Some may offer superbills for potential out-of-network reimbursement. We\'ll clarify payment expectations before you commit to any service.',
    },
    {
      q: 'What markets do you serve?',
      a: 'We coordinate same-day care in Phoenix, Scottsdale, Dallas, Fort Worth, Tampa, Naples, Boca Raton, Jacksonville, Nashville, and Charlotte, with additional markets expanding. Call us and we\'ll confirm current availability in your area.',
    },
    {
      q: 'What is the coordination fee?',
      a: 'Vitalé charges a coordination fee that is separate from the provider\'s clinical visit fee. Both are disclosed before you confirm any service. There are no hidden charges.',
    },
    {
      q: 'Can you coordinate care for a child?',
      a: 'Some providers in our network see pediatric patients. When you call, tell us the patient\'s age and we will identify an appropriate provider. We cannot guarantee pediatric availability in all markets.',
    },
  ],

  relatedServices: [
    { name: 'Mobile Doctor Coordination', href: '/services/mobile-doctor-coordination' },
    { name: 'Private Nurse Coordination', href: '/services/private-nurse-coordination' },
    { name: 'Mobile Lab Coordination', href: '/services/mobile-lab-coordination' },
  ],
};

const SameDayPage: React.FC = () => <ServiceLandingPage {...config} />;
export default SameDayPage;
