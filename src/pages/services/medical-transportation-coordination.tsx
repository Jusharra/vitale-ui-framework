import React from 'react';
import ServiceLandingPage, { ServicePageConfig } from '@/components/services/ServiceLandingPage';

const config: ServicePageConfig = {
  slug: 'medical-transportation-coordination',
  serviceName: 'Medical Transportation Coordination',
  canonicalUrl: 'https://vitalehealthconcierge.doctor/services/medical-transportation-coordination',
  metaTitle: 'Non-Emergency Medical Transportation Coordination | Vitalé Health Concierge',
  metaDescription:
    'Vitalé coordinates non-emergency medical transportation for appointments, hospital discharges, and facility transfers — licensed vehicles with trained operators. Private-pay, no wait lists.',
  keywords:
    'non emergency medical transportation, medical transport coordination, NEMT, hospital discharge transportation, wheelchair van, medical appointment transport, ambulatory transport, private medical transport',

  h1: 'Non-Emergency Medical Transportation, Coordinated.',
  heroSub:
    'When a ride-share isn\'t appropriate and an ambulance isn\'t necessary — Vitalé coordinates licensed non-emergency medical vehicles and trained operators for appointments, discharges, and transfers.',

  intro:
    'Medical Transportation Coordination connects patients with independent licensed non-emergency medical transport (NEMT) providers. These are not ride-shares — they are vehicles operated by trained personnel equipped to transport patients with mobility challenges, post-surgical restrictions, or clinical fragility who require more than a standard car ride but less than an emergency medical response.',

  whoItIsFor: [
    {
      label: 'Post-Surgical Patient',
      headline: 'Discharged from hospital but can\'t take a regular car.',
      description:
        'Post-surgical patients with mobility restrictions, large dressings, or medical equipment need a vehicle equipped for their condition. We coordinate the appropriate transport.',
    },
    {
      label: 'Family Caregiver',
      headline: 'Parent needs to get to an appointment but can\'t drive.',
      description:
        'We coordinate wheelchair van transport, ambulatory transport, and stretcher-capable vehicles for elderly or mobility-impaired patients who have medical appointments.',
    },
    {
      label: 'Facility-to-Facility Transfer',
      headline: 'Moving a patient from a hospital to a rehab or SNF.',
      description:
        'We coordinate inter-facility transfers between hospitals, rehabilitation centers, and skilled nursing facilities — non-emergency, private-pay, and on your timeline.',
    },
    {
      label: 'Chronic Condition Patient',
      headline: 'Need recurring transport to dialysis, infusion, or oncology.',
      description:
        'We can coordinate recurring transport schedules for patients with regular appointment needs — dialysis three times a week, weekly oncology, or similar.',
    },
    {
      label: 'Discharge Planner',
      headline: 'Hospital social worker or case manager arranging a discharge.',
      description:
        'We work with discharge planners and case managers to coordinate same-day or next-day transport for patients being discharged when standard NEMT services have a wait.',
    },
    {
      label: 'High-Risk Elderly Patient',
      headline: 'Cannot safely get in and out of a standard vehicle.',
      description:
        'We coordinate wheelchair-accessible vehicles and trained transport aides for patients who need physical assistance boarding and exiting the vehicle.',
    },
  ],

  whatWeCoordinate: [
    'Ambulatory (walking) patient transport',
    'Wheelchair van transport',
    'Stretcher-capable vehicle coordination',
    'Hospital discharge transport',
    'Facility-to-facility transfers',
    'Routine medical appointment transport',
    'Recurring transport schedules (dialysis, oncology)',
    'Bariatric transport (vehicle and equipment)',
    'Transport with trained medical attendant',
    'Airport-to-appointment transport (medical)',
  ],

  faqs: [
    {
      q: 'What is non-emergency medical transportation?',
      a: 'Non-emergency medical transportation (NEMT) is licensed patient transport for individuals who have a medical need for a specialized vehicle or trained operator — but whose condition is not immediately life-threatening. This includes wheelchair van transport, stretcher transport, and ambulatory transport for patients who can\'t safely use a ride-share.',
    },
    {
      q: 'How is this different from an ambulance?',
      a: 'Ambulances provide emergency medical care in transit and are dispatched by 911 for life-threatening situations. NEMT vehicles transport patients who are medically stable but have physical or clinical needs that standard vehicles can\'t accommodate. If your situation is a medical emergency, call 911.',
    },
    {
      q: 'Can you coordinate same-day transport?',
      a: 'Same-day transport is often available, especially for single-vehicle arrangements. Call us with as much lead time as possible — same-day is achievable in most markets, but scheduling ahead improves availability.',
    },
    {
      q: 'Do you coordinate transport for non-ambulatory patients on stretchers?',
      a: 'Yes. We can coordinate stretcher-capable vehicles for patients who cannot sit upright during transport. Mention this requirement when you call so we can identify the appropriate vehicle type.',
    },
    {
      q: 'Can you arrange recurring weekly transport?',
      a: 'Yes. We can set up recurring transport schedules for patients who need regular transport to dialysis, oncology, infusion centers, or other recurring appointments. Call us to discuss your schedule.',
    },
    {
      q: 'Does insurance cover NEMT?',
      a: 'Some insurance plans and Medicaid cover NEMT for qualifying patients. Vitalé coordinates private-pay transport — we do not bill insurance. For insurance-covered NEMT, contact your insurer directly. We serve patients who need faster access than insurance-covered options provide.',
    },
  ],

  relatedServices: [
    { name: 'Home Healthcare Coordination', href: '/services/home-healthcare-coordination' },
    { name: 'Senior Care Navigation', href: '/services/senior-care-navigation' },
    { name: 'Same-Day Healthcare Coordination', href: '/services/same-day-healthcare-coordination' },
  ],
};

const MedicalTransportPage: React.FC = () => <ServiceLandingPage {...config} />;
export default MedicalTransportPage;
