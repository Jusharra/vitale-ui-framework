import React from 'react';
import ServiceLandingPage, { ServicePageConfig } from '@/components/services/ServiceLandingPage';

const config: ServicePageConfig = {
  slug: 'mobile-lab-coordination',
  serviceName: 'Mobile Lab Coordination',
  canonicalUrl: 'https://vitalehealthconcierge.doctor/services/mobile-lab-coordination',
  metaTitle: 'Mobile Lab Near Me — Blood Draw at Your Home or Office | Vitalé Health Concierge',
  metaDescription:
    'Vitalé coordinates mobile phlebotomists and lab services for blood draws and lab specimen collection at your home, hotel, or office. Results forwarded to your physician.',
  keywords:
    'mobile lab near me, blood draw at home, mobile phlebotomy, phlebotomist at home, lab draw at home, mobile blood test, home blood draw, concierge lab, mobile specimen collection',

  h1: 'Skip the Lab. We Coordinate a Phlebotomist to You.',
  heroSub:
    'Vitalé connects you with independent licensed mobile phlebotomists who draw blood and collect lab specimens at your home, hotel, or office — and forward results directly to your physician.',

  intro:
    'Mobile Lab Coordination connects patients with independent mobile phlebotomists and specimen collection professionals for in-location blood draws and lab specimen collection. Instead of commuting to a lab, waiting in line, and navigating the results process — a trained professional comes to you, collects your specimens, and routes results through your preferred lab or directly to your physician.',

  whoItIsFor: [
    {
      label: 'Busy Professional',
      headline: 'Need routine labs done without losing a morning.',
      description:
        'We coordinate a phlebotomist to your home before work, or to your office during lunch. No commute, no waiting room, no disruption to your day.',
    },
    {
      label: 'Executive Traveler',
      headline: 'In town for business and need labs ordered by your physician.',
      description:
        'We coordinate a mobile draw to your hotel room. Results forwarded directly to your ordering physician back home.',
    },
    {
      label: 'Elderly or Mobility-Limited Patient',
      headline: 'Getting to a lab is difficult or uncomfortable.',
      description:
        'For elderly patients or those with mobility limitations, a mobile phlebotomy visit removes the logistical burden of lab trips entirely.',
    },
    {
      label: 'Concierge or Direct-Care Patient',
      headline: 'Your physician ordered labs and needs results quickly.',
      description:
        'We coordinate mobile phlebotomy for patients whose physicians have ordered stat or routine labs and want results without sending their patient to a commercial lab facility.',
    },
    {
      label: 'Chronically Ill Patient',
      headline: 'Need regular lab monitoring without regular facility visits.',
      description:
        'For patients who require frequent lab panels — thyroid monitoring, INR, HbA1c — we coordinate recurring mobile phlebotomy visits to eliminate repeated lab trips.',
    },
    {
      label: 'Family Caregiver',
      headline: 'Parent\'s physician ordered labs but parent can\'t travel.',
      description:
        'We coordinate the phlebotomy visit to your parent\'s home and ensure results reach the ordering physician through the agreed lab routing.',
    },
  ],

  whatWeCoordinate: [
    'Mobile blood draws (venipuncture) at home, hotel, or office',
    'Standard and comprehensive metabolic panels',
    'Complete blood count (CBC)',
    'Lipid panels and cardiac markers',
    'Thyroid function tests',
    'HbA1c and glucose monitoring',
    'INR / PT monitoring (anticoagulation)',
    'Hormone panels',
    'Infectious disease panels',
    'STI / STD testing (discreet, at-location)',
    'Urine specimen collection coordination',
    'Lab result routing to your physician or lab of choice',
  ],

  faqs: [
    {
      q: 'Who is the mobile phlebotomist?',
      a: 'The phlebotomist is an independent licensed professional in our network — certified in phlebotomy and trained in mobile collection procedures. They are not Vitalé employees; they are independent contractors who we connect to your request.',
    },
    {
      q: 'Where do the specimens get processed?',
      a: 'Specimens are routed to the lab specified by your ordering physician, or to a lab of your choice. Common options include Quest Diagnostics, LabCorp, and local independent labs. We\'ll coordinate the routing when we confirm your appointment.',
    },
    {
      q: 'Can you collect specimens for a physician who ordered labs?',
      a: 'Yes. Most mobile lab requests are initiated because a physician ordered labs and the patient prefers not to go to a lab facility. We coordinate the collection and route specimens to the ordering physician\'s preferred lab.',
    },
    {
      q: 'Do I need a physician order for a mobile blood draw?',
      a: 'For most diagnostic panels, a physician order is required for the lab to process specimens. For some direct-to-consumer tests, an order may not be needed. Tell us what you need and we\'ll clarify what\'s required.',
    },
    {
      q: 'Can you coordinate same-day mobile phlebotomy?',
      a: 'Same-day collection is often available with enough lead time in the morning. Call us before 10 a.m. for the best chance of same-day service. We\'ll confirm current availability when you call.',
    },
    {
      q: 'How are results delivered?',
      a: 'Results are delivered directly from the processing lab to your physician\'s office — the same way they would be if you went to the lab in person. If you\'re requesting direct-to-consumer tests, results go to the email or portal associated with the order.',
    },
  ],

  relatedServices: [
    { name: 'Same-Day Healthcare Coordination', href: '/services/same-day-healthcare-coordination' },
    { name: 'Private Nurse Coordination', href: '/services/private-nurse-coordination' },
    { name: 'Mobile Doctor Coordination', href: '/services/mobile-doctor-coordination' },
  ],
};

const MobileLabPage: React.FC = () => <ServiceLandingPage {...config} />;
export default MobileLabPage;
