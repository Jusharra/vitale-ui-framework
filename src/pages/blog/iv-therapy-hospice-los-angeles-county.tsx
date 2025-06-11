import React from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Helmet } from 'react-helmet';

const LosAngelesCountyBlog = () => {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": "Premium IV Hydration & In-Home Hospice in Los Angeles County",
    "image": "https://images.pexels.com/photos/1640774/pexels-photo-1640774.jpeg",
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
        <title>Concierge Wellness Services – Los Angeles County</title>
        <meta name="description" content="Book luxury in-home IV therapy & end-of-life care in Los Angeles County. Mobile nurses. Membership plans. Trusted by families in Beverly Hills, Bel Air, and Malibu." />
        <meta property="og:title" content="Concierge IV Therapy & Private Hospice Care in Los Angeles County" />
        <meta property="og:description" content="Book luxury in-home IV therapy & end-of-life care in Los Angeles County. Mobile nurses. Membership plans. Trusted by families in Beverly Hills, Bel Air, and Malibu." />
        <meta property="og:type" content="article" />
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      </Helmet>

      <div className="bg-white py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Premium IV Hydration & In-Home Hospice in Los Angeles County
            </h1>
            <p className="mt-4 text-lg text-gray-500">
              Serving Beverly Hills, Bel Air, Malibu, Pacific Palisades, and Brentwood
            </p>
          </div>

          <div className="mt-10">
            <img 
              src="https://images.pexels.com/photos/1640774/pexels-photo-1640774.jpeg" 
              alt="Mobile nurse providing IV therapy in Los Angeles County" 
              className="w-full h-96 object-cover rounded-lg shadow-md"
            />
          </div>

          <div className="mt-12 prose prose-indigo prose-lg text-gray-500 mx-auto">
            <h2>Elite Healthcare Services for Los Angeles County's Most Exclusive Neighborhoods</h2>
            <p>
              Los Angeles County's entertainment executives, celebrities, and industry leaders demand healthcare that matches their high-profile lifestyles—discreet, personalized, and available on demand. Vitale Health Concierge brings premium IV hydration therapy and compassionate hospice care directly to your doorstep in Beverly Hills, Bel Air, Malibu, and beyond.
            </p>

            <h2>IV Hydration Therapy: Wellness Optimized for LA's Elite</h2>
            <p>
              Our mobile IV therapy services are designed for the unique demands of Los Angeles' high-performance culture. Our registered nurses bring customized IV treatments to your home, office, or set:
            </p>
            <ul>
              <li><strong>Red Carpet Ready</strong> - Pre-event beauty and wellness infusions popular in Beverly Hills and Bel Air</li>
              <li><strong>Performance & Recovery</strong> - For actors, athletes, and executives in Brentwood and Pacific Palisades</li>
              <li><strong>Hangover & Detox</strong> - Rapid recovery after industry events and premieres</li>
              <li><strong>Immune Defense</strong> - Essential for maintaining health during production schedules</li>
              <li><strong>Jet Lag Reset</strong> - For frequent travelers from LAX and Van Nuys private aviation</li>
            </ul>

            <p>
              All treatments are administered by licensed healthcare professionals who understand the unique health priorities of Los Angeles County's entertainment and business elite.
            </p>

            <h2>Private Hospice Care: Compassionate End-of-Life Support</h2>
            <p>
              Our concierge hospice services provide dignified, compassionate care for loved ones in the comfort of their Los Angeles County homes. We understand the importance of maintaining privacy and dignity during this sensitive time, especially for high-profile individuals and families.
            </p>
            <p>
              Our hospice care includes:
            </p>
            <ul>
              <li>24/7 on-call nursing support from Cedars-Sinai and UCLA-trained professionals</li>
              <li>Pain management and symptom control</li>
              <li>Emotional and spiritual support for patients and families</li>
              <li>Coordination with primary physicians at Cedars-Sinai, UCLA Medical Center, and other premier institutions</li>
              <li>Assistance with advance directives and end-of-life planning</li>
            </ul>

            <h2>Why Los Angeles County Residents Choose Our Concierge Services</h2>
            <p>
              Families in Beverly Hills, Bel Air, Malibu, and throughout Los Angeles County trust Vitale Health Concierge for several reasons:
            </p>
            <ul>
              <li><strong>Absolute Privacy</strong> - Discreet service that respects your confidentiality with strict NDA protocols</li>
              <li><strong>Elite Medical Team</strong> - Staffed by Cedars-Sinai and UCLA-affiliated healthcare professionals</li>
              <li><strong>Rapid Response</strong> - Same-day IV therapy appointments available throughout the 90210, 90077, and 90265 zip codes</li>
              <li><strong>Luxury Experience</strong> - Premium amenities and concierge approach to healthcare</li>
              <li><strong>Comprehensive Care</strong> - Seamless coordination between wellness services and hospice care when needed</li>
            </ul>

            <h2>Serving Los Angeles County's Most Exclusive Communities</h2>
            <p>
              Our services are available throughout Los Angeles County, with particular focus on:
            </p>
            <ul>
              <li><strong>Beverly Hills (90210, 90212)</strong> - Serving the Flats, Trousdale Estates, and Beverly Hills Gateway</li>
              <li><strong>Bel Air (90077)</strong> - Including East Gate, West Gate, and all private estates</li>
              <li><strong>Malibu (90265)</strong> - Complete coverage of Carbon Beach, Broad Beach, and Point Dume</li>
              <li><strong>Pacific Palisades (90272)</strong> - Serving the Riviera, Huntington, and Palisades Highlands</li>
              <li><strong>Brentwood (90049)</strong> - Including Brentwood Park, Mandeville Canyon, and Brentwood Circle</li>
            </ul>

            <h2>Membership Options for Los Angeles County Residents</h2>
            <p>
              Our membership plans are tailored to the needs of Los Angeles County's discerning residents:
            </p>
            <ul>
              <li><strong>Celebrity Wellness</strong> - Unlimited IV therapy sessions, priority scheduling, and complete privacy protocols</li>
              <li><strong>Family Plan</strong> - Comprehensive coverage for households in Beverly Hills, Bel Air, and beyond</li>
              <li><strong>Production Support</strong> - On-set IV therapy for film and television productions</li>
            </ul>

            <div className="bg-indigo-50 p-6 rounded-lg mt-8">
              <h3 className="text-xl font-semibold text-indigo-900">Contact Us for Los Angeles County Service</h3>
              <p className="mt-2">
                To schedule IV therapy or discuss hospice care options in Los Angeles County, contact our concierge team. We offer same-day appointments for residents in Beverly Hills, Bel Air, Malibu, and surrounding communities.
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

export default LosAngelesCountyBlog;