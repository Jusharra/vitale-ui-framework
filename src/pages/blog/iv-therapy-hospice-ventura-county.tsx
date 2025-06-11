import React from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Helmet } from 'react-helmet';

const VenturaCountyBlog = () => {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": "Premium IV Hydration & In-Home Hospice in Ventura County",
    "image": "https://images.pexels.com/photos/3184405/pexels-photo-3184405.jpeg",
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
        <title>Concierge Wellness Services – Ventura County</title>
        <meta name="description" content="Book luxury in-home IV therapy & end-of-life care in Ventura County. Mobile nurses. Membership plans. Trusted by families in Westlake Village, Thousand Oaks, and Ojai." />
        <meta property="og:title" content="Concierge IV Therapy & Private Hospice Care in Ventura County" />
        <meta property="og:description" content="Book luxury in-home IV therapy & end-of-life care in Ventura County. Mobile nurses. Membership plans. Trusted by families in Westlake Village, Thousand Oaks, and Ojai." />
        <meta property="og:type" content="article" />
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      </Helmet>

      <div className="bg-white py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Premium IV Hydration & In-Home Hospice in Ventura County
            </h1>
            <p className="mt-4 text-lg text-gray-500">
              Serving Westlake Village, Thousand Oaks, Ojai, Camarillo, and Montecito
            </p>
          </div>

          <div className="mt-10">
            <img 
              src="https://images.pexels.com/photos/3184405/pexels-photo-3184405.jpeg" 
              alt="Mobile nurse providing IV therapy in Ventura County" 
              className="w-full h-96 object-cover rounded-lg shadow-md"
            />
          </div>

          <div className="mt-12 prose prose-indigo prose-lg text-gray-500 mx-auto">
            <h2>Exclusive Healthcare Services for Ventura County's Prestigious Communities</h2>
            <p>
              Ventura County's blend of coastal beauty and sophisticated living demands healthcare services that match its residents' expectations. Vitale Health Concierge delivers premium IV hydration therapy and compassionate hospice care directly to your doorstep in Westlake Village, Thousand Oaks, Ojai, and beyond.
            </p>

            <h2>IV Hydration Therapy: Wellness Optimized for Southern California Living</h2>
            <p>
              Our mobile IV therapy services are designed for the unique demands of Ventura County's active professionals and families. Our registered nurses bring customized IV treatments to your home:
            </p>
            <ul>
              <li><strong>Executive Performance</strong> - Energy and focus enhancement for professionals in Westlake Village and Thousand Oaks</li>
              <li><strong>Athletic Recovery</strong> - Ideal for golfers at Sherwood Country Club and North Ranch Country Club</li>
              <li><strong>Wellness & Vitality</strong> - Popular in Ojai's health-conscious community</li>
              <li><strong>Immune Defense</strong> - Essential during seasonal changes in Southern California</li>
              <li><strong>Hangover & Dehydration Relief</strong> - Fast recovery after wine country tours in the Ojai Valley</li>
            </ul>

            <p>
              All treatments are administered by licensed healthcare professionals who understand the unique health priorities of Ventura County's communities.
            </p>

            <h2>Private Hospice Care: Compassionate End-of-Life Support</h2>
            <p>
              Our concierge hospice services provide dignified, compassionate care for loved ones in the comfort of their Ventura County homes. We understand the importance of maintaining privacy and dignity during this sensitive time.
            </p>
            <p>
              Our hospice care includes:
            </p>
            <ul>
              <li>24/7 on-call nursing support from Los Robles and Community Memorial-trained professionals</li>
              <li>Pain management and symptom control</li>
              <li>Emotional and spiritual support for patients and families</li>
              <li>Coordination with primary physicians at Los Robles Regional Medical Center, Community Memorial Hospital, and Ojai Valley Community Hospital</li>
              <li>Assistance with advance directives and end-of-life planning</li>
            </ul>

            <h2>Why Ventura County Residents Choose Our Concierge Services</h2>
            <p>
              Families in Westlake Village, Thousand Oaks, Ojai, and throughout Ventura County trust Vitale Health Concierge for several reasons:
            </p>
            <ul>
              <li><strong>Absolute Privacy</strong> - Discreet service that respects your confidentiality</li>
              <li><strong>Elite Medical Team</strong> - Staffed by UCLA and Cedars-Sinai-affiliated healthcare professionals</li>
              <li><strong>Rapid Response</strong> - Same-day IV therapy appointments available throughout the 91361, 91320, and 93023 zip codes</li>
              <li><strong>Luxury Experience</strong> - Premium amenities and concierge approach to healthcare</li>
              <li><strong>Comprehensive Care</strong> - Seamless coordination between wellness services and hospice care when needed</li>
            </ul>

            <h2>Serving Ventura County's Most Exclusive Communities</h2>
            <p>
              Our services are available throughout Ventura County, with particular focus on:
            </p>
            <ul>
              <li><strong>Westlake Village (91361)</strong> - Serving North Ranch, Lake Sherwood, and Hidden Valley</li>
              <li><strong>Thousand Oaks (91320, 91362)</strong> - Including Westlake Hills, Lang Ranch, and Lynn Ranch</li>
              <li><strong>Ojai (93023)</strong> - Complete coverage of Arbolada, East End, and Upper Ojai</li>
              <li><strong>Camarillo (93010, 93012)</strong> - Serving Spanish Hills, Sterling Hills, and Las Posas Estates</li>
              <li><strong>Montecito (93108)</strong> - Including Montecito Upper Village, Hedgerow, and Birnam Wood</li>
            </ul>

            <h2>Membership Options for Ventura County Residents</h2>
            <p>
              Our membership plans are tailored to the needs of Ventura County's discerning residents:
            </p>
            <ul>
              <li><strong>Platinum Membership</strong> - Unlimited IV therapy sessions, priority scheduling, and complimentary wellness consultations</li>
              <li><strong>Family Plan</strong> - Comprehensive coverage for households in Westlake Village, Thousand Oaks, and beyond</li>
              <li><strong>Wellness Retreat</strong> - Specialized services for Ojai's health-focused community</li>
            </ul>

            <div className="bg-indigo-50 p-6 rounded-lg mt-8">
              <h3 className="text-xl font-semibold text-indigo-900">Contact Us for Ventura County Service</h3>
              <p className="mt-2">
                To schedule IV therapy or discuss hospice care options in Ventura County, contact our concierge team. We offer same-day appointments for residents in Westlake Village, Thousand Oaks, Ojai, and surrounding communities.
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

export default VenturaCountyBlog;