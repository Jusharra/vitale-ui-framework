import React from 'react';
import ServiceLandingPage, { ServicePageConfig } from '@/components/services/ServiceLandingPage';

const config: ServicePageConfig = {
  slug: 'concierge-healthcare-coordination',
  serviceName: 'Concierge Healthcare Coordination',
  canonicalUrl: 'https://vitalehealthconcierge.doctor/services/concierge-healthcare-coordination',
  metaTitle: 'Concierge Doctor Near Me — Private Healthcare Coordination | Vitalé Health Concierge',
  metaDescription:
    'Vitalé coordinates white-glove private healthcare access for executives, high-net-worth individuals, and VIP guests. Discreet. Fast. Flat-rate. Available in AZ, TX, FL, TN, and NC.',
  keywords:
    'concierge doctor near me, concierge healthcare, private doctor concierge, VIP healthcare, executive healthcare, luxury healthcare coordination, private physician access, concierge medicine coordination',

  h1: 'Private Healthcare Access. Discreet. Fast. Coordinated.',
  heroSub:
    'For executives, high-net-worth individuals, and VIP guests who expect a seamless experience from first call to provider arrival. Vitalé coordinates concierge-level healthcare access with zero friction.',

  intro:
    'Concierge Healthcare Coordination is Vitalé\'s premium access tier — designed for patients who value discretion, speed, and a seamless experience above all else. We coordinate independent licensed physicians, nurse practitioners, and specialists who deliver care at your preferred location, on your schedule, with the professionalism and confidentiality you expect. No referral cycles. No waiting rooms. No administrative friction.',

  whoItIsFor: [
    {
      label: 'C-Suite Executive',
      headline: 'Your time is worth more than a waiting room.',
      description:
        'We coordinate a physician to your office, hotel, or residence at a time that fits your schedule. Same-day availability in primary markets. No hold queues.',
    },
    {
      label: 'High-Net-Worth Individual',
      headline: 'Expecting a clinical experience that matches your lifestyle.',
      description:
        'We connect you with providers who operate with professionalism, punctuality, and discretion. Flat-rate pricing. No surprise charges.',
    },
    {
      label: 'VIP Hotel Guest',
      headline: 'Staying at a luxury resort and need a provider now.',
      description:
        'We coordinate physician and nurse visits directly to your suite at major resort properties in Scottsdale, Phoenix, Naples, Boca Raton, and our other service markets.',
    },
    {
      label: 'Professional Athlete or Entertainer',
      headline: 'Need clinical care with zero media exposure.',
      description:
        'We coordinate private visits with absolute discretion. Providers in our network understand the confidentiality requirements of high-profile patients.',
    },
    {
      label: 'Family Office or Personal Assistant',
      headline: 'Coordinating healthcare access for a principal.',
      description:
        'Family offices and personal assistants use Vitalé to arrange healthcare for their principals without navigating phone trees, wait lists, or uncertain timelines.',
    },
    {
      label: 'International Traveler',
      headline: 'Visiting the US and unfamiliar with the healthcare system.',
      description:
        'We coordinate private-pay physician access for international visitors who don\'t have US insurance and need to skip the system entirely.',
    },
  ],

  whatWeCoordinate: [
    'Same-day physician visits at hotels, residences, or offices',
    'Nurse practitioner visits for evaluations and treatment',
    'IV therapy and wellness infusions (RN-administered)',
    'Mobile lab draws and diagnostics',
    'Executive health screenings (coordination)',
    'Travel medicine consultations',
    'Resort and hotel room physician visits',
    'Post-procedure nursing visits',
    'Discreet coordination with no public-facing records',
    'Direct communication with your personal assistant or family office',
  ],

  faqs: [
    {
      q: 'How is concierge coordination different from your standard service?',
      a: 'Concierge Healthcare Coordination prioritizes speed, discretion, and provider match quality. We identify providers with experience in high-expectation environments, confirm all logistics before dispatch, and provide a white-glove coordination experience from first call to provider departure.',
    },
    {
      q: 'Can my assistant or family office make the request on my behalf?',
      a: 'Absolutely. We regularly coordinate through assistants, chiefs of staff, and family offices. They call us, describe the principal\'s need and location, and we handle the rest. The assistant stays in the loop throughout.',
    },
    {
      q: 'Do the providers sign NDAs?',
      a: 'We cannot speak to individual provider contractual arrangements. For explicit confidentiality requirements, raise this when you call — we can identify providers who are accustomed to high-discretion engagements and can accommodate specific agreements.',
    },
    {
      q: 'Can you coordinate care at a private residence with a security team present?',
      a: 'Yes. We\'ve coordinated visits in secured residences and hotel suites. Tell us about any access or security requirements when you call and we\'ll communicate them to the provider before arrival.',
    },
    {
      q: 'What is the pricing structure?',
      a: 'Vitalé charges a coordination fee. The independent provider charges a separate clinical visit fee. Both are disclosed before any service is confirmed. Flat-rate, no surprises.',
    },
    {
      q: 'Do you coordinate international patients visiting the US?',
      a: 'Yes. International visitors are among our most common concierge-level patients. We coordinate private-pay physician access regardless of insurance or residency status.',
    },
  ],

  relatedServices: [
    { name: 'Same-Day Healthcare Coordination', href: '/services/same-day-healthcare-coordination' },
    { name: 'Mobile Doctor Coordination', href: '/services/mobile-doctor-coordination' },
    { name: 'Private Nurse Coordination', href: '/services/private-nurse-coordination' },
  ],
};

const ConciergeHealthcarePage: React.FC = () => <ServiceLandingPage {...config} />;
export default ConciergeHealthcarePage;
