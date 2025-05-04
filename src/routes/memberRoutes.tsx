
import { RouteObject } from 'react-router-dom';
import Appointments from '@/pages/member/Appointments';
import HealthInsights from '@/pages/member/HealthInsights';
import HealthTools from '@/pages/member/HealthTools';
import Membership from '@/pages/member/Membership';
import Messages from '@/pages/member/Messages';
import Pharmacy from '@/pages/member/Pharmacy';
import Promotions from '@/pages/member/Promotions';
import PurchaseHistory from '@/pages/member/PurchaseHistory';
import Rewards from '@/pages/member/Rewards';
import ServiceBooking from '@/pages/member/ServiceBooking';
import ShareAndEarn from '@/pages/member/ShareAndEarn';
import SmartHealth from '@/pages/member/SmartHealth';
import Support from '@/pages/member/Support';
import Telehealth from '@/pages/member/Telehealth';
import Vacations from '@/pages/member/Vacations';
import Concierge from '@/pages/member/Concierge';
import MedicalTransport from '@/pages/member/MedicalTransport';
import SubscriptionSuccess from '@/pages/member/SubscriptionSuccess';
import GlobalSettingsPage from '@/pages/member/GlobalSettingsPage';
import MediaAssets from '@/pages/member/MediaAssets';

const memberRoutes: RouteObject[] = [
  {
    path: 'appointments',
    element: <Appointments />
  },
  {
    path: 'health-insights',
    element: <HealthInsights />
  },
  {
    path: 'health-tools',
    element: <HealthTools />
  },
  {
    path: 'membership',
    element: <Membership />
  },
  {
    path: 'messages',
    element: <Messages />
  },
  {
    path: 'pharmacy',
    element: <Pharmacy />
  },
  {
    path: 'promotions',
    element: <Promotions />
  },
  {
    path: 'purchase-history',
    element: <PurchaseHistory />
  },
  {
    path: 'rewards',
    element: <Rewards />
  },
  {
    path: 'service-booking',
    element: <ServiceBooking />
  },
  {
    path: 'share-and-earn',
    element: <ShareAndEarn />
  },
  {
    path: 'smart-health',
    element: <SmartHealth />
  },
  {
    path: 'support',
    element: <Support />
  },
  {
    path: 'telehealth',
    element: <Telehealth />
  },
  {
    path: 'vacations',
    element: <Vacations />
  },
  {
    path: 'concierge',
    element: <Concierge />
  },
  {
    path: 'medical-transport',
    element: <MedicalTransport />
  },
  {
    path: 'subscription-success',
    element: <SubscriptionSuccess />
  },
  {
    path: 'settings',
    element: <GlobalSettingsPage />
  },
  {
    path: 'media-assets',
    element: <MediaAssets />
  }
];

export default memberRoutes;
