import React from 'react';
import ServiceLandingPage, { ServicePageConfig } from '@/components/services/ServiceLandingPage';

const config: ServicePageConfig = {
  slug: 'private-nurse-coordination',
  serviceName: 'Private Nurse Coordination',
  canonicalUrl: 'https://vitalehealthconcierge.doctor/services/private-nurse-coordination',
  metaTitle: 'Private Nurse Near Me — Licensed RN at Your Location | Vitalé Health Concierge',
  metaDescription:
    'Vitalé coordinates private registered nurses for IV therapy, wound care, post-surgical monitoring, medication administration, and more — at your home, hotel, or office.',
  keywords:
    'private nurse near me, RN at home, registered nurse home visit, IV therapy at home, wound care nurse, post surgical nurse, private nurse coordination, in home nurse, concierge nurse',

  h1: 'A Private Registered Nurse, Dispatched to Your Location.',
  heroSub:
    'IV therapy. Wound care. Post-surgical monitoring. Medication administration. Vitalé coordinates independent licensed RNs for skilled nursing visits at your home, hotel, or place of recovery.',

  intro:
    'Private Nurse Coordination connects patients with independent registered nurses (RNs) for skilled clinical services at their location. Unlike basic caregiver or companion services, these are licensed professionals who can administer IV medications, assess wound healing, monitor vital signs post-surgery, and perform clinical interventions — all at your home, hotel, or office.',

  whoItIsFor: [
    {
      label: 'Post-Surgical Patient',
      headline: 'Home from the hospital but still need clinical monitoring.',
      description:
        'We coordinate a licensed RN to assess your recovery, manage surgical wounds, monitor for complications, and communicate concerns to your care team.',
    },
    {
      label: 'IV Therapy Patient',
      headline: 'Need an IV infusion at your location.',
      description:
        'IV hydration, vitamin infusions, antibiotic IV therapy — we connect you with an independent RN who administers the infusion at your home, hotel room, or office.',
    },
    {
      label: 'Executive Traveler',
      headline: 'Jet-lagged, dehydrated, or under the weather.',
      description:
        'We coordinate a licensed RN for an IV hydration session at your hotel room. Many guests are back on their feet within an hour of a visit.',
    },
    {
      label: 'Family Caregiver',
      headline: 'Parent needs skilled nursing care at home.',
      description:
        'We connect your parent with a licensed RN who provides skilled nursing services in their home — medication management, wound care, or recovery monitoring.',
    },
    {
      label: 'Chronic Condition Patient',
      headline: 'Need ongoing nursing support between clinical appointments.',
      description:
        'For patients managing complex conditions, we coordinate private nurse visits to fill the gap between physician appointments and inpatient care.',
    },
    {
      label: 'Aesthetic or Wellness Patient',
      headline: 'Seeking IV vitamin or wellness infusions.',
      description:
        'We coordinate licensed RNs for aesthetic and wellness IV therapy — vitamin C, NAD+, glutathione, and custom hydration protocols — at your preferred location.',
    },
  ],

  whatWeCoordinate: [
    'IV hydration and vitamin infusion (RN-administered)',
    'Antibiotic IV therapy at home',
    'Post-surgical wound care and dressing changes',
    'Vital sign monitoring and recovery assessment',
    'Medication administration (injections, IVs)',
    'Catheter care and management',
    'Foley catheter insertion and removal',
    'NG tube care',
    'Blood draws and lab specimen collection',
    'Patient and family nursing education',
    'Discharge follow-up nursing visits',
    'Skilled nursing assessment visits',
  ],

  faqs: [
    {
      q: 'What is the difference between a private nurse and a home health aide?',
      a: 'A private registered nurse (RN) is a licensed clinical professional who can perform skilled procedures: administer IV medications, assess wounds, monitor post-surgical status, and intervene clinically. A home health aide or caregiver provides non-clinical support like bathing, dressing, and companionship. We coordinate licensed RNs — not aides.',
    },
    {
      q: 'Can a private nurse administer IV therapy at my home?',
      a: 'Yes. IV therapy administration is one of the most commonly coordinated private nurse services. The nurse brings the supplies, administers the infusion at your home or hotel, and monitors you throughout the session.',
    },
    {
      q: 'Do you coordinate private nurses for post-surgical patients?',
      a: 'Yes. Post-surgical nursing visits are among the most common requests. We typically coordinate the first follow-up visit within 24–72 hours of discharge, depending on the procedure and your surgeon\'s instructions.',
    },
    {
      q: 'Can I schedule a standing nurse visit weekly or daily?',
      a: 'We can coordinate recurring nursing visits. Availability depends on market and provider scheduling. Call us to discuss your specific cadence and we\'ll identify a provider who can accommodate it.',
    },
    {
      q: 'What if the nurse identifies a complication during the visit?',
      a: 'The nurse operates independently and will communicate directly with your physician or care team. If a serious complication is identified, the nurse may recommend you proceed to an emergency department. We facilitate coordination, but clinical decisions rest with the provider.',
    },
    {
      q: 'Does the nurse bring all necessary supplies?',
      a: 'For most visits, the nurse brings all required clinical supplies. Certain items — such as prescription medications for IV infusion — may need to be arranged through a pharmacy in advance. We\'ll walk you through any supply requirements before your visit.',
    },
  ],

  relatedServices: [
    { name: 'Same-Day Healthcare Coordination', href: '/services/same-day-healthcare-coordination' },
    { name: 'Home Healthcare Coordination', href: '/services/home-healthcare-coordination' },
    { name: 'Mobile Lab Coordination', href: '/services/mobile-lab-coordination' },
  ],
};

const PrivateNursePage: React.FC = () => <ServiceLandingPage {...config} />;
export default PrivateNursePage;
