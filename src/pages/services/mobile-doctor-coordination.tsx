import React from 'react';
import ServiceLandingPage, { ServicePageConfig } from '@/components/services/ServiceLandingPage';

const config: ServicePageConfig = {
  slug: 'mobile-doctor-coordination',
  serviceName: 'Mobile Doctor Coordination',
  canonicalUrl: 'https://vitalehealthconcierge.doctor/services/mobile-doctor-coordination',
  metaTitle: 'Mobile Doctor Near Me — Physician at Your Door | Vitalé Health Concierge',
  metaDescription:
    'Vitalé coordinates board-certified mobile physicians and nurse practitioners for home, hotel, and office visits. No waiting room — a doctor comes to you. Available in AZ, TX, FL, TN, and NC.',
  keywords:
    'mobile doctor near me, doctor at home, physician house call, mobile physician, home doctor visit, hotel doctor, private doctor at home, house call doctor, mobile urgent care, doctor comes to you',

  h1: 'A Board-Certified Physician at Your Door. No Waiting Room.',
  heroSub:
    'Vitalé coordinates independent board-certified physicians and nurse practitioners for same-day and next-day visits to your home, hotel room, or office. We handle the logistics — you focus on getting better.',

  intro:
    'Mobile Doctor Coordination is the service patients turn to when they need a physician-level evaluation and they\'d rather not spend their day in a waiting room. We connect your request with an independent licensed physician (MD) or nurse practitioner (NP) in our network who conducts the visit at your chosen location — home, hotel, office, or anywhere else that works for you.',

  whoItIsFor: [
    {
      label: 'Executive Traveler',
      headline: 'In town for two days. Feeling off since yesterday.',
      description:
        'You can\'t afford a half-day detour. We coordinate a physician to your hotel — full evaluation, treatment plan, prescription if warranted — while you stay on schedule.',
    },
    {
      label: 'Busy Professional',
      headline: 'Need a doctor. Can\'t take a full day off.',
      description:
        'We schedule a physician visit to your home or office during a window that fits your calendar. No commute, no waiting, no lost work time.',
    },
    {
      label: 'Family Caregiver',
      headline: 'Parent is too frail or uncomfortable to travel to a clinic.',
      description:
        'We coordinate a physician who comes to your parent\'s home. Full evaluation in a familiar environment, without the logistics of a clinic visit.',
    },
    {
      label: 'Seasonal Resident',
      headline: 'No local PCP at your second home.',
      description:
        'You\'re in Arizona or Florida for the season and don\'t have an established physician. We connect you with a licensed provider who evaluates you where you are.',
    },
    {
      label: 'High-Risk Patient',
      headline: 'Immunocompromised. Prefer to avoid clinic exposure.',
      description:
        'For patients with elevated infection risk, a home physician visit eliminates the clinical waiting room entirely. We coordinate with providers who accommodate this need.',
    },
    {
      label: 'Post-Discharge Patient',
      headline: 'Just home from the hospital. Need a follow-up.',
      description:
        'We coordinate a physician follow-up visit at home within 48–72 hours of discharge for patients who need clinical monitoring before their next scheduled appointment.',
    },
  ],

  whatWeCoordinate: [
    'Board-certified physician (MD) home visits',
    'Nurse practitioner (NP) home and hotel visits',
    'Same-day illness and injury evaluations',
    'Prescription coordination (provider-dependent)',
    'Post-discharge follow-up visits',
    'Wellness and preventive visits',
    'Travel health consultations',
    'Hotel and resort physician visits',
    'Workplace and office physician visits',
    'Telehealth follow-up coordination',
  ],

  faqs: [
    {
      q: 'Can the physician prescribe medication?',
      a: 'Prescribing authority depends on the individual provider and your state\'s regulations. Many independent physicians in our network can write prescriptions. Mention this as a priority when you call and we\'ll identify an appropriate provider.',
    },
    {
      q: 'What is the difference between a mobile MD and a nurse practitioner?',
      a: 'An MD is a licensed physician with full independent prescribing authority. A nurse practitioner (NP) is an advanced practice registered nurse — also licensed to diagnose and treat independently in most states. Both can handle a wide range of non-emergency clinical needs. We\'ll help you identify the right level of care for your situation.',
    },
    {
      q: 'Can a mobile doctor visit a hotel room?',
      a: 'Yes. Hotel and resort room visits are among the most common requests we coordinate. The provider comes to your room directly — you don\'t need to go anywhere.',
    },
    {
      q: 'How is this different from urgent care?',
      a: 'Urgent care is a facility you travel to, with waiting rooms and shared clinical environments. A mobile doctor visit happens at your location — your home, hotel, or office — on your schedule.',
    },
    {
      q: 'What conditions can a mobile doctor evaluate?',
      a: 'Common requests include respiratory illness, minor infections, GI symptoms, minor injuries, skin conditions, medication review, and wellness checks. For life-threatening emergencies, call 911. Mobile physicians do not provide emergency services.',
    },
    {
      q: 'What markets have mobile doctor availability?',
      a: 'We coordinate mobile physician visits in Phoenix, Scottsdale, Dallas, Fort Worth, Tampa, Naples, Boca Raton, Jacksonville, Nashville, and Charlotte. Availability in each market depends on current provider capacity. Call us to confirm.',
    },
  ],

  relatedServices: [
    { name: 'Same-Day Healthcare Coordination', href: '/services/same-day-healthcare-coordination' },
    { name: 'Private Nurse Coordination', href: '/services/private-nurse-coordination' },
    { name: 'Concierge Healthcare Coordination', href: '/services/concierge-healthcare-coordination' },
    { name: 'Mobile Doctor in Phoenix', href: '/phoenix/mobile-doctor' },
  ],
};

const MobileDoctorPage: React.FC = () => <ServiceLandingPage {...config} />;
export default MobileDoctorPage;
