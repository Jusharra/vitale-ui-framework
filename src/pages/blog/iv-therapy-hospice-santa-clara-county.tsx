import React from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Helmet } from 'react-helmet';

const SantaClaraCountyBlog = () => {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": "Premium IV Hydration & In-Home Hospice in Santa Clara County",
    "image": "https://images.pexels.com/photos/7579831/pexels-photo-7579831.jpeg",
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
  };

  return (
    <MainLayout>
      <Helmet>
        <title>Concierge Wellness Services – Santa Clara County</title>
        <meta name="description" content="Book luxury in-home IV therapy & end-of-life care in Santa Clara County. Mobile nurses. Membership plans. Trusted by families in Los Altos Hills, Palo Alto, and Saratoga." />
        <meta property="og:title" content="Concierge IV Therapy & Private Hospice Care in Santa Clara County" />
        <meta property="og:description" content="Book luxury in-home IV therapy & end-of-life care in Santa Clara County. Mobile nurses. Membership plans. Trusted by families in Los Altos Hills, Palo Alto, and Saratoga." />
        <meta property="og:type" content="article" />
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      </Helmet>

      <div className="bg-white py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Premium IV Hydration & In-Home Hospice in Santa Clara County
            </h1>
            <p className="mt-4 text-lg text-gray-500">
              Serving Los Altos Hills, Palo Alto, Saratoga, Los Gatos, and Monte Sereno
            </p>
          </div>

          <div className="mt-10">
            <img 
              src="https://images.pexels.com/photos/7579831/pexels-photo-7579831.jpeg" 
              alt="Mobile nurse providing IV therapy in Santa Clara County" 
              className="w-full h-96 object-cover rounded-lg shadow-md"
            />
          </div>

          <div className="mt-12 prose prose-indigo prose-lg text-gray-500 mx-auto">
            <h2>Silicon Valley's Premier Concierge Healthcare Services</h2>
            <p>
              Santa Clara County's tech executives, venture capitalists, and innovation leaders require healthcare that matches their fast-paced, high-performance lifestyles. Vitale Health Concierge delivers premium IV hydration therapy and dignified hospice care directly to your doorstep in Los Altos Hills, Palo Alto, Saratoga, and beyond.
            </p>

            <h2>IV Hydration Therapy: Performance Optimization for Silicon Valley Leaders</h2>
            <p>
              Our mobile IV therapy services are designed for the unique demands of Silicon Valley's elite. Our Stanford-trained nurses bring customized IV treatments to your home or office:
            </p>
            <ul>
              <li><strong>Executive Performance</strong> - Cognitive enhancement and energy optimization for tech leaders and VCs</li>
              <li><strong>Startup Founder Formula</strong> - Stress reduction and immune support for entrepreneurs</li>
              <li><strong>Biohacker's Boost</strong> - Advanced nutrient combinations for optimal cellular function</li>
              <li><strong>Recovery & Rehydration</strong> - Post-workout recovery for active professionals in Los Altos Hills and Saratoga</li>
              <li><strong>Jet Lag Reset</strong> - For frequent international travelers from San Jose International Airport</li>
            </ul>

            <p>
              All treatments are administered by licensed healthcare professionals who understand the unique health priorities of Silicon Valley's innovation community.
            </p>

            <h2>Private Hospice Care: Compassionate End-of-Life Support</h2>
            <p>
              Our concierge hospice services provide dignified, compassionate care for loved ones in the comfort of their Santa Clara County homes. We understand the importance of maintaining privacy and dignity during this sensitive time.
            </p>
            <p>
              Our hospice care includes:
            </p>
            <ul>
              <li>24/7 on-call nursing support from Stanford and El Camino Hospital-trained professionals</li>
              <li>Pain management and symptom control</li>
              <li>Emotional and spiritual support for patients and families</li>
              <li>Coordination with primary physicians at Stanford Medical Center and Palo Alto Medical Foundation</li>
              <li>Assistance with advance directives and end-of-life planning</li>
            </ul>

            <h2>Why Santa Clara County Residents Choose Our Concierge Services</h2>
            <p>
              Families in Los Altos Hills, Palo Alto, Saratoga, and throughout Santa Clara County trust Vitale Health Concierge for several reasons:
            </p>
            <ul>
              <li><strong>Absolute Privacy</strong> - Discreet service that respects your confidentiality</li>
              <li><strong>Elite Medical Team</strong> - Staffed by Stanford and Silicon Valley-affiliated healthcare professionals</li>
              <li><strong>Rapid Response</strong> - Same-day IV therapy appointments available throughout the 94022, 94301, and 95070 zip codes</li>
              <li><strong>Data-Driven Approach</strong> - Personalized care plans based on your health metrics</li>
              <li><strong>Comprehensive Care</strong> - Seamless coordination between wellness services and hospice care when needed</li>
            </ul>

            <h2>Serving Santa Clara County's Most Exclusive Communities</h2>
            <p>
              Our services are available throughout Santa Clara County, with particular focus on:
            </p>
            <ul>
              <li><strong>Los Altos Hills (94022, 94024)</strong> - Serving the entire community, including Palo Alto Hills and Woodland Acres</li>
              <li><strong>Palo Alto (94301, 94306)</strong> - Including Old Palo Alto, Crescent Park, and Professorville</li>
              <li><strong>Saratoga (95070)</strong> - Complete coverage of all neighborhoods, including Saratoga Hills and Golden Triangle</li>
              <li><strong>Los Gatos (95030, 95032)</strong> - Serving Hillbrook, Almond Grove, and surrounding areas</li>
              <li><strong>Monte Sereno (95030)</strong> - Full service throughout this exclusive enclave</li>
            </ul>

            <h2>Membership Options for Santa Clara County Residents</h2>
            <p>
              Our membership plans are tailored to the needs of Santa Clara County's innovation leaders:
            </p>
            <ul>
              <li><strong>Executive Performance</strong> - Weekly IV therapy sessions, biomarker tracking, and personalized wellness plans</li>
              <li><strong>Family Wellness</strong> - Comprehensive coverage for households in Los Altos Hills, Palo Alto, and beyond</li>
              <li><strong>Corporate Wellness</strong> - On-site IV therapy for tech companies and venture capital firms</li>
            </ul>

            <div className="bg-indigo-50 p-6 rounded-lg mt-8">
              <h3 className="text-xl font-semibold text-indigo-900">Contact Us for Santa Clara County Service</h3>
              <p className="mt-2">
                To schedule IV therapy or discuss hospice care options in Santa Clara County, contact our concierge team. We offer same-day appointments for residents in Los Altos Hills, Palo Alto, Saratoga, and surrounding communities.
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

export default SantaClaraCountyBlog;