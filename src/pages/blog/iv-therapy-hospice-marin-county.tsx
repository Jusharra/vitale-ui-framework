import React from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Helmet } from 'react-helmet';

const MarinCountyBlog = () => {
  return (
    <MainLayout>
      <Helmet>
        <title>Concierge Wellness Services – Marin County</title>
        <meta name="description" content="Book luxury in-home IV therapy & end-of-life care in Marin County. Mobile nurses. Membership plans. Trusted by families in Tiburon, Ross, and Mill Valley." />
        <meta property="og:title" content="Concierge IV Therapy & Private Hospice Care in Marin County" />
        <meta property="og:description" content="Book luxury in-home IV therapy & end-of-life care in Marin County. Mobile nurses. Membership plans. Trusted by families in Tiburon, Ross, and Mill Valley." />
        <meta property="og:type" content="article" />
        <script type="application/ld+json">
          {`
            {
              "@context": "https://schema.org",
              "@type": "BlogPosting",
              "headline": "Premium IV Hydration & In-Home Hospice in Marin County",
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
              Premium IV Hydration & In-Home Hospice in Marin County
            </h1>
            <p className="mt-4 text-lg text-gray-500">
              Serving Tiburon, Ross, Belvedere, Mill Valley, and Kentfield
            </p>
          </div>

          <div className="mt-10">
            <img 
              src="https://images.pexels.com/photos/3683074/pexels-photo-3683074.jpeg" 
              alt="Mobile nurse providing IV therapy in Marin County" 
              className="w-full h-96 object-cover rounded-lg shadow-md"
            />
          </div>

          <div className="mt-12 prose prose-indigo prose-lg text-gray-500 mx-auto">
            <h2>Luxury Healthcare Services for Marin County's Discerning Residents</h2>
            <p>
              Marin County's unique blend of natural beauty and sophisticated living demands healthcare services that match its residents' expectations. Vitale Health Concierge delivers premium IV hydration therapy and compassionate hospice care directly to your Marin County home, whether you're in Tiburon, Ross, Belvedere, or Mill Valley.
            </p>

            <h2>IV Hydration Therapy: Wellness Optimized for Marin Lifestyles</h2>
            <p>
              Our mobile IV therapy services are perfectly suited to the active, wellness-focused lifestyle of Marin County residents. Our registered nurses bring customized IV treatments to your doorstep:
            </p>
            <ul>
              <li><strong>Athletic Recovery</strong> - Perfect for cyclists tackling Mount Tamalpais or trail runners in the Marin Headlands</li>
              <li><strong>Stress & Anxiety Relief</strong> - Tailored formulations for high-performing professionals in Tiburon and Ross</li>
              <li><strong>Immune Support</strong> - Vitamin-rich infusions to maintain health during seasonal changes</li>
              <li><strong>Anti-Aging & Wellness</strong> - Popular among Belvedere and Ross residents focused on longevity</li>
              <li><strong>Hangover & Detox</strong> - Rapid recovery after social events in Mill Valley and Sausalito</li>
            </ul>

            <p>
              All treatments are administered by licensed healthcare professionals who understand the unique health priorities of Marin County's communities.
            </p>

            <h2>Private Hospice Care: Compassionate End-of-Life Support</h2>
            <p>
              Our concierge hospice services provide dignified, compassionate care for loved ones in the comfort of their Marin County homes. We understand the importance of maintaining privacy and dignity during this sensitive time.
            </p>
            <p>
              Our hospice care includes:
            </p>
            <ul>
              <li>24/7 on-call nursing support from UCSF and Marin General-trained professionals</li>
              <li>Pain management and symptom control</li>
              <li>Emotional and spiritual support for patients and families</li>
              <li>Coordination with primary physicians at MarinHealth Medical Center and UCSF</li>
              <li>Assistance with advance directives and end-of-life planning</li>
            </ul>

            <h2>Why Marin County Residents Choose Our Concierge Services</h2>
            <p>
              Families in Tiburon, Ross, Belvedere, and throughout Marin County trust Vitale Health Concierge for several reasons:
            </p>
            <ul>
              <li><strong>Absolute Privacy</strong> - Discreet service that respects your confidentiality</li>
              <li><strong>Elite Medical Team</strong> - Staffed by UCSF and MarinHealth-affiliated healthcare professionals</li>
              <li><strong>Rapid Response</strong> - Same-day IV therapy appointments available throughout the 94920, 94957, and 94941 zip codes</li>
              <li><strong>Luxury Experience</strong> - Premium amenities and concierge approach to healthcare</li>
              <li><strong>Comprehensive Care</strong> - Seamless coordination between wellness services and hospice care when needed</li>
            </ul>

            <h2>Serving Marin County's Most Exclusive Communities</h2>
            <p>
              Our services are available throughout Marin County, with particular focus on:
            </p>
            <ul>
              <li><strong>Tiburon (94920)</strong> - Serving Paradise Cay, Tiburon Peninsula, and Reed neighborhoods</li>
              <li><strong>Ross (94957)</strong> - Complete coverage of all neighborhoods</li>
              <li><strong>Belvedere (94920)</strong> - Including Belvedere Island and Belvedere Lagoon</li>
              <li><strong>Mill Valley (94941)</strong> - Serving Strawberry, Tamalpais Valley, and Homestead Valley</li>
              <li><strong>Kentfield (94904)</strong> - Including Kent Woodlands and surrounding areas</li>
            </ul>

            <h2>Membership Options for Marin County Residents</h2>
            <p>
              Our membership plans are tailored to the needs of Marin County's health-conscious residents:
            </p>
            <ul>
              <li><strong>Wellness Optimization</strong> - Regular IV therapy sessions, health monitoring, and personalized wellness plans</li>
              <li><strong>Family Wellness</strong> - Comprehensive coverage for households in Tiburon, Ross, and beyond</li>
              <li><strong>Active Lifestyle</strong> - Recovery-focused IV therapy for Marin's athletic community</li>
            </ul>

            <div className="bg-indigo-50 p-6 rounded-lg mt-8">
              <h3 className="text-xl font-semibold text-indigo-900">Contact Us for Marin County Service</h3>
              <p className="mt-2">
                To schedule IV therapy or discuss hospice care options in Marin County, contact our concierge team. We offer same-day appointments for residents in Tiburon, Ross, Belvedere, and surrounding communities.
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

export default MarinCountyBlog;