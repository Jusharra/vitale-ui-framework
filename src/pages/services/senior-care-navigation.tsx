import React from 'react';
import ServiceLandingPage, { ServicePageConfig } from '@/components/services/ServiceLandingPage';

const config: ServicePageConfig = {
  slug: 'senior-care-navigation',
  serviceName: 'Senior Care Navigation',
  canonicalUrl: 'https://vitalehealthconcierge.doctor/services/senior-care-navigation',
  metaTitle: 'Senior Care Navigation — Help Arranging Care for Aging Parents | Vitalé Health Concierge',
  metaDescription:
    'Vitalé helps adult children coordinate care for aging parents — physician visits, skilled nursing, and care navigation — without waiting lists or referral cycles. Available in AZ, TX, FL, TN, and NC.',
  keywords:
    'help finding care for elderly parents, senior care navigation, care for aging parents, in home care elderly, elder care coordination, parent care management, geriatric care coordination, aging parent care help',

  h1: 'Coordinating Care for a Parent Shouldn\'t Fall Entirely on You.',
  heroSub:
    'Vitalé helps adult children navigate access to independent licensed physicians, nurses, and care providers for aging parents — whether you\'re local or managing from across the country.',

  intro:
    'Senior Care Navigation is built for the adult child — not the elderly person. You\'re the one making the calls, researching providers, managing logistics, and trying to ensure your parent gets appropriate care without a months-long wait or an exhausting referral cycle. Vitalé coordinates that access. We connect your parent with independent licensed healthcare professionals who deliver care in their home, and we keep you informed every step of the way.',

  whoItIsFor: [
    {
      label: 'Out-of-State Adult Child',
      headline: 'Mom is in Scottsdale. You\'re in Chicago.',
      description:
        'You can\'t be there in person, but you need to arrange a physician or nurse visit for your parent today. We coordinate on your behalf and communicate with you directly throughout the process.',
    },
    {
      label: 'Local Adult Child',
      headline: 'Dad needs more care than you can personally provide.',
      description:
        'You\'re nearby but managing a parent\'s healthcare access is overwhelming. We handle the provider coordination so you can focus on being present, not navigating logistics.',
    },
    {
      label: 'Post-Hospitalization Family',
      headline: 'Parent was just discharged. The discharge instructions are confusing.',
      description:
        'We coordinate a skilled nursing follow-up visit within 24–72 hours of discharge and help your family understand what care is needed in the days that follow.',
    },
    {
      label: 'Snowbird Family',
      headline: 'Parents are wintering in Arizona or Florida. Their regular doctor is back home.',
      description:
        'Seasonal residents often have no local care relationships. We connect them with an independent physician or nurse practitioner who evaluates them in their winter home.',
    },
    {
      label: 'Caregiver in Crisis',
      headline: 'Parent\'s condition changed suddenly. No one is returning calls.',
      description:
        'When you need a provider today — not in three weeks — we navigate our network to find the fastest available match for the situation.',
    },
    {
      label: 'Proactive Planner',
      headline: 'Parent is still independent but you want a backup plan.',
      description:
        'Some adult children contact us before a crisis to understand what\'s available and how fast. We\'ll walk you through our network capabilities in your parent\'s area so you\'re prepared.',
    },
  ],

  whatWeCoordinate: [
    'Physician home visit for an aging parent',
    'Nurse practitioner geriatric assessments',
    'Skilled nursing visits (medication, wound care, monitoring)',
    'Post-hospitalization follow-up coordination',
    'Medication management nursing visits',
    'Fall risk and safety assessments',
    'Mobile lab draws at the parent\'s home',
    'Remote family communication (with patient consent)',
    'Physical and occupational therapy coordination',
    'Coordination with the parent\'s primary care physician',
  ],

  faqs: [
    {
      q: 'Can I arrange care for my parent if I\'m not there in person?',
      a: 'Yes. We routinely coordinate care for adult children managing a parent\'s healthcare access remotely. We communicate with you directly and coordinate the provider visit to your parent\'s home. We\'ll keep you informed at each step.',
    },
    {
      q: 'What if my parent refuses to go to a doctor\'s office?',
      a: 'A home visit removes the transportation and logistical barrier entirely. Many older patients who resist going to a clinic are much more comfortable with a provider visiting them at home. We coordinate providers who specialize in in-home care.',
    },
    {
      q: 'My parent was just discharged from the hospital. How quickly can you coordinate follow-up?',
      a: 'Same-day or next-day post-discharge visits are often available in our primary markets. Call us as soon as your parent is discharged and we\'ll coordinate the fastest available match.',
    },
    {
      q: 'Do you help with finding a long-term care facility or assisted living?',
      a: 'That\'s outside our coordination scope. We focus on connecting patients with independent licensed healthcare professionals for clinical visits. For placement assistance, a certified geriatric care manager may be more appropriate.',
    },
    {
      q: 'Does the provider speak with me (the adult child) as well as my parent?',
      a: 'With the patient\'s consent, yes — many family members are on the call when we coordinate and the provider can communicate with family members directly. This is something to mention when you call us.',
    },
    {
      q: 'What if my parent has dementia or cognitive decline?',
      a: 'We coordinate with providers who have experience working with cognitively impaired patients. Mention this when you call and we\'ll identify an appropriate match. In some cases, a family member or caregiver will need to be present during the visit.',
    },
    {
      q: 'What markets do you serve for senior care coordination?',
      a: 'We coordinate in Phoenix, Scottsdale, Dallas, Fort Worth, Tampa, Naples, Boca Raton, Jacksonville, Nashville, and Charlotte. These markets have significant retiree and snowbird populations. Call us to confirm current availability in your parent\'s area.',
    },
  ],

  relatedServices: [
    { name: 'Home Healthcare Coordination', href: '/services/home-healthcare-coordination' },
    { name: 'Private Nurse Coordination', href: '/services/private-nurse-coordination' },
    { name: 'Mobile Doctor Coordination', href: '/services/mobile-doctor-coordination' },
  ],
};

const SeniorCarePage: React.FC = () => <ServiceLandingPage {...config} />;
export default SeniorCarePage;
