import React from 'react';
import ServiceLandingPage, { ServicePageConfig } from '@/components/services/ServiceLandingPage';

const config: ServicePageConfig = {
  slug: 'home-healthcare-coordination',
  serviceName: 'Home Healthcare Coordination',
  canonicalUrl: 'https://vitalehealthconcierge.doctor/services/home-healthcare-coordination',
  metaTitle: 'Home Healthcare Coordination — In-Home Clinical Support | Vitalé Health Concierge',
  metaDescription:
    'Vitalé coordinates skilled in-home healthcare for patients recovering at home — nursing visits, physician follow-ups, physical therapy coordination, and more. Private-pay, no agency wait lists.',
  keywords:
    'home healthcare coordination, in home healthcare, skilled nursing at home, private home health, home health coordination, in home medical care, private pay home health, skilled home nursing',

  h1: 'In-Home Healthcare, Coordinated for Your Situation.',
  heroSub:
    'For patients who need skilled clinical support at home — recovering from surgery, managing a chronic condition, or transitioning out of a facility — Vitalé connects you with independent licensed healthcare professionals who come to you.',

  intro:
    'Home Healthcare Coordination is for patients who need ongoing or recurring clinical support in their home environment — not a one-time visit. We navigate our network of independent licensed professionals to connect you with skilled nurses, physicians, and allied health providers who deliver care at your residence, on a schedule that matches your clinical needs.',

  whoItIsFor: [
    {
      label: 'Post-Surgical Recovery',
      headline: 'Home from the hospital. Need ongoing monitoring.',
      description:
        'We coordinate recurring skilled nursing visits to monitor recovery, manage wounds, administer medications, and communicate with your surgical team.',
    },
    {
      label: 'Chronic Condition Management',
      headline: 'Managing a complex condition that needs regular attention.',
      description:
        'For patients with diabetes, heart failure, COPD, or other chronic conditions requiring skilled monitoring, we coordinate in-home visits between physician appointments.',
    },
    {
      label: 'Family Caregiver',
      headline: 'Arranging in-home clinical support for a parent.',
      description:
        'We help adult children coordinate skilled nursing and medical visits for aging parents — including remote coordination if you live out of state.',
    },
    {
      label: 'High-Net-Worth Patient',
      headline: 'Prefer clinical care in your own environment.',
      description:
        'For patients who value privacy, comfort, and discretion, in-home healthcare eliminates the clinical environment entirely. We coordinate providers who operate with white-glove professionalism.',
    },
    {
      label: 'Facility Discharge Patient',
      headline: 'Transitioning from a rehab facility to home.',
      description:
        'We bridge the gap between facility discharge and your next outpatient appointment — coordinating skilled nursing and physician follow-up visits during the transition period.',
    },
    {
      label: 'Palliative Support',
      headline: 'Family navigating comfort-focused care at home.',
      description:
        'We help families navigate access to palliative support providers who can deliver compassionate, dignity-focused care in a home setting.',
    },
  ],

  whatWeCoordinate: [
    'Recurring skilled nursing visits (RN)',
    'Physician home follow-up visits',
    'Wound care and dressing changes',
    'IV medication and infusion administration',
    'Vital sign and condition monitoring',
    'Medication management and reconciliation',
    'Patient and caregiver education',
    'Physical therapy provider coordination',
    'Occupational therapy provider coordination',
    'Speech therapy provider coordination',
    'Lab draws at home (mobile phlebotomy)',
    'Care plan communication with your physician',
  ],

  faqs: [
    {
      q: 'How is this different from a home health agency?',
      a: 'Traditional home health agencies work on referral cycles tied to insurance authorization, which can take days or weeks. Vitalé coordinates private-pay home healthcare — faster access, no authorization delays, and no insurance requirement. The tradeoff is that services are out-of-pocket.',
    },
    {
      q: 'Can you coordinate daily nursing visits?',
      a: 'We can coordinate daily, weekly, or custom-frequency nursing schedules depending on your clinical need. Availability varies by market and provider. Call us to discuss your cadence.',
    },
    {
      q: 'Do you coordinate physical therapy at home?',
      a: 'We can connect patients with independent physical therapists who offer in-home services. Availability depends on your location and clinical indication. Call us to check current availability.',
    },
    {
      q: 'Can you coordinate care for a patient in an assisted living facility?',
      a: 'In some cases, yes — providers can visit patients in assisted living facilities that permit outside clinical visitors. We\'ll clarify what\'s feasible for your specific situation before committing.',
    },
    {
      q: 'Does the coordinated provider communicate with my primary care physician?',
      a: 'The independent provider you\'re connected with will handle clinical communication. Vitalé can help facilitate introductions and share visit summaries when authorized, but the clinical relationship is between you and the provider.',
    },
    {
      q: 'Is this covered by Medicare or insurance?',
      a: 'No. Vitalé coordinates private-pay home healthcare. We do not bill Medicare, Medicaid, or commercial insurance. Some providers may provide documentation for possible superbill submission — ask when we coordinate your request.',
    },
  ],

  relatedServices: [
    { name: 'Private Nurse Coordination', href: '/services/private-nurse-coordination' },
    { name: 'Senior Care Navigation', href: '/services/senior-care-navigation' },
    { name: 'Same-Day Healthcare Coordination', href: '/services/same-day-healthcare-coordination' },
  ],
};

const HomeHealthcarePage: React.FC = () => <ServiceLandingPage {...config} />;
export default HomeHealthcarePage;
