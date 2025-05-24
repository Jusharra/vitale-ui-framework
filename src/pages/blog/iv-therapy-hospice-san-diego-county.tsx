import React from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Helmet } from 'react-helmet';

const SanDiegoCountyBlog = () => {
  return (
    <MainLayout>
      <Helmet>
        <title>Concierge Wellness Services – San Diego County</title>
        <meta name="description" content="Book luxury in-home IV therapy & end-of-life care in San Diego County. Mobile nurses. Membership plans. Trusted by families in La Jolla, Rancho Santa Fe, and Del Mar." />
        <meta property="og:title" content="Concierge IV Therapy & Private Hospice Care in San Diego County" />
        <meta property="og:description" content="Book luxury in-home IV therapy & end-of-life care in San Diego County. Mobile nurses. Membership plans. Trusted by families in La Jolla, Rancho Santa Fe, and Del Mar." />
        <meta property="og:type" content="article" />
        <script type="application/ld+json">
          {`
            {
              "@context": "https://schema.org",
              "@type": "BlogPosting",
              "headline": "Premium IV Hydration & In-Home Hospice in San Diego County",
              "image": "https://images.pexels.com/photos/3683074/pexels-photo-3683074.jpeg",
              "author": {
                "@type": "Organization",
                "name": "Vitale Health Concierge"
              },
              "publisher": {
                "@type": "Organization",
                "name": "Vitale Health Concierge",
                "logo": {
                  "@type": "ImageObject",
                  "url": "https://vitalehealth.com/logo.png"
                }
              },
              "datePublished": "2025-05-20",
              "dateModified": "2025-05-20"
            }
          `}
        </script>
      </Helmet>

      <div className="bg-white py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Premium IV Hydration & In-Home Hospice in San Diego County
            </h1>
            <p className="mt-4 text-lg text-gray-500">
              Serving La Jolla, Rancho Santa Fe, Del Mar, Coronado, and Carlsbad
            </p>
          </div>

          <div className="mt-10">
            <img 
              src="https://images.pexels.com/photos/3683074/pexels-photo-3683074.jpeg" 
              alt="Mobile nurse providing IV therapy in San Diego County" 
              className="w-full h-96 object-cover rounded-lg shadow-md"
            />
          </div>

          <div className="mt-12 prose prose-indigo prose-lg text-gray-500 mx-auto">
            <h2>Exclusive Healthcare Services for San Diego County's Coastal Elite</h2>
            <p>
              San Diego County's coastal communities demand healthcare that matches their sophisticated lifestyle—personalized, private, and delivered with exceptional service. Vitale Health Concierge brings premium IV hydration therapy and compassionate hospice care directly to your La Jolla, Rancho Santa Fe, or Del Mar residence.
            </p>

            <h2>IV Hydration Therapy: Wellness Optimized for Southern California Living</h2>
            <p>
              Our mobile IV therapy services are perfectly suited to San Diego's active, outdoor-oriented culture. Our registered nurses bring customized IV treatments to your doorstep:
            </p>
            <ul>
              <li><strong>Athletic Recovery</strong> - Ideal for golfers at Torrey Pines and tennis players at La Jolla Beach & Tennis Club</li>
              <li><strong>Beauty & Anti-Aging</strong> - Popular in Rancho Santa Fe and La Jolla for maintaining youthful appearance</li>
              <li><strong>Executive Performance</strong> - Energy and focus enhancement for professionals in San Diego's biotech and tech sectors</li>
              <li><strong>Immune Defense</strong> - Essential for maintaining health year-round</li>
              <li><strong>Hangover Recovery</strong> - Fast relief after social events in Del Mar and Coronado</li>
            </ul>

            <p>
              All treatments are administered by licensed healthcare professionals who understand the unique health priorities of San Diego County's coastal communities.
            </p>

            <h2>Private Hospice Care: Compassionate End-of-Life Support</h2>
            <p>
              Our concierge hospice services provide dignified, compassionate care for loved ones in the comfort of their San Diego County homes. We understand the importance of maintaining privacy and dignity during this sensitive time.
            </p>
            <p>
              Our hospice care includes:
            </p>
            <ul>
              <li>24/7 on-call nursing support from Scripps and UCSD-trained professionals</li>
              <li>Pain management and symptom control</li>
              <li>Emotional and spiritual support for patients and families</li>
              <li>Coordination with primary physicians at Scripps, UCSD Health, and Sharp Healthcare</li>
              <li>Assistance with advance directives and end-of-life planning</li>
            </ul>

            <h2>Why San Diego County Residents Choose Our Concierge Services</h2>
            <p>
              Families in La Jolla, Rancho Santa Fe, Del Mar, and throughout San Diego County trust Vitale Health Concierge for several reasons:
            </p>
            <ul>
              <li><strong>Absolute Privacy</strong> - Discreet service that respects your confidentiality</li>
              <li><strong>Elite Medical Team</strong> - Staffed by Scripps and UCSD-affiliated healthcare professionals</li>
              <li><strong>Rapid Response</strong> - Same-day IV therapy appointments available throughout the 92037, 92067, and 92014 zip codes</li>
              <li><strong>Luxury Experience</strong> - Premium amenities and concierge approach to healthcare</li>
              <li><strong>Comprehensive Care</strong> - Seamless coordination between wellness services and hospice care when needed</li>
            </ul>

            <h2>Serving San Diego County's Most Exclusive Communities</h2>
            <p>
              Our services are available throughout San Diego County, with particular focus on:
            </p>
            <ul>
              <li><strong>La Jolla (92037)</strong> - Serving La Jolla Shores, La Jolla Farms, and Muirlands</li>
              <li><strong>Rancho Santa Fe (92067)</strong> - Including The Covenant, Fairbanks Ranch, and The Crosby</li>
              <li><strong>Del Mar (92014)</strong> - Complete coverage of Beach Colony, Del Mar Heights, and Olde Del Mar</li>
              <li><strong>Coronado (92118)</strong> - Serving Country Club, The Shores, and the Historic District</li>
              <li><strong>Carlsbad (92009, 92011)</strong> - Including Aviara, La Costa, and Rancho Carrillo</li>
            </ul>

            <h2>Membership Options for San Diego County Residents</h2>
            <p>
              Our membership plans are tailored to the needs of San Diego County's discerning residents:
            </p>
            <ul>
              <li><strong>Coastal Elite</strong> - Unlimited IV therapy sessions, priority scheduling, and complimentary wellness consultations</li>
              <li><strong>Family Wellness</strong> - Comprehensive coverage for households in La Jolla, Rancho Santa Fe, and beyond</li>
              <li><strong>Active Lifestyle</strong> - Performance-focused IV therapy for San Diego's golf, tennis, and surfing enthusiasts</li>
            </ul>

            <div className="bg-indigo-50 p-6 rounded-lg mt-8">
              <h3 className="text-xl font-semibold text-indigo-900">Contact Us for San Diego County Service</h3>
              <p className="mt-2">
                To schedule IV therapy or discuss hospice care options in San Diego County, contact our concierge team. We offer same-day appointments for residents in La Jolla, Rancho Santa Fe, Del Mar, and surrounding communities.
              </p>
              <div className="mt-4">
                <Button className="w-full sm:w-auto">Schedule a Consultation</Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default SanDiegoCountyBlog;