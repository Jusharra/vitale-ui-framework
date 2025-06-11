import React from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Helmet } from 'react-helmet';

const TravisCountyBlog = () => {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": "Premium IV Hydration & In-Home Hospice in Travis County",
    "image": "https://images.pexels.com/photos/3758105/pexels-photo-3758105.jpeg",
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
        <title>Concierge Wellness Services – Travis County</title>
        <meta name="description" content="Book luxury in-home IV therapy & end-of-life care in Travis County. Mobile nurses. Membership plans. Trusted by families in Westlake Hills, Rollingwood, and Barton Creek." />
        <meta property="og:title" content="Concierge IV Therapy & Private Hospice Care in Travis County" />
        <meta property="og:description" content="Book luxury in-home IV therapy & end-of-life care in Travis County. Mobile nurses. Membership plans. Trusted by families in Westlake Hills, Rollingwood, and Barton Creek." />
        <meta property="og:type" content="article" />
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      </Helmet>

      <div className="bg-white py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Premium IV Hydration & In-Home Hospice in Travis County
            </h1>
            <p className="mt-4 text-lg text-gray-500">
              Serving Westlake Hills, Rollingwood, Barton Creek, Tarrytown, and Lake Travis
            </p>
          </div>

          <div className="mt-10">
            <img 
              src="https://images.pexels.com/photos/3758105/pexels-photo-3758105.jpeg" 
              alt="Mobile nurse providing IV therapy in Travis County" 
              className="w-full h-96 object-cover rounded-lg shadow-md"
            />
          </div>

          <div className="mt-12 prose prose-indigo prose-lg text-gray-500 mx-auto">
            <h2>Exclusive Healthcare Services for Travis County's Most Prestigious Neighborhoods</h2>
            <p>
              Austin's tech executives, entrepreneurs, and cultural leaders demand healthcare that matches their innovative lifestyles. Vitale Health Concierge delivers premium IV hydration therapy and compassionate hospice care directly to your doorstep in Westlake Hills, Rollingwood, Barton Creek, and beyond.
            </p>

            <h2>IV Hydration Therapy: Wellness Optimized for Austin's Elite</h2>
            <p>
              Our mobile IV therapy services are designed for the unique demands of Travis County's creative professionals and tech leaders. Our registered nurses bring customized IV treatments to your home:
            </p>
            <ul>
              <li><strong>Entrepreneur's Edge</strong> - Cognitive enhancement and energy optimization for Austin's tech founders</li>
              <li><strong>Creative Focus</strong> - Tailored formulations for musicians, filmmakers, and artists in Austin's cultural scene</li>
              <li><strong>Athletic Recovery</strong> - Ideal for active residents in Westlake Hills and Barton Creek</li>
              <li><strong>Festival Recovery</strong> - Post-event rehydration during SXSW, ACL, and other Austin events</li>
              <li><strong>Immune Defense</strong> - Essential during Central Texas' seasonal allergies and cedar fever</li>
            </ul>

            <p>
              All treatments are administered by licensed healthcare professionals who understand the unique health priorities of Travis County's innovative communities.
            </p>

            <h2>Private Hospice Care: Compassionate End-of-Life Support</h2>
            <p>
              Our concierge hospice services provide dignified, compassionate care for loved ones in the comfort of their Travis County homes. We understand the importance of maintaining privacy and dignity during this sensitive time.
            </p>
            <p>
              Our hospice care includes:
            </p>
            <ul>
              <li>24/7 on-call nursing support from St. David's and Ascension Seton-trained professionals</li>
              <li>Pain management and symptom control</li>
              <li>Emotional and spiritual support for patients and families</li>
              <li>Coordination with primary physicians at St. David's, Ascension Seton, and UT Health Austin</li>
              <li>Assistance with advance directives and end-of-life planning</li>
            </ul>

            <h2>Why Travis County Residents Choose Our Concierge Services</h2>
            <p>
              Families in Westlake Hills, Rollingwood, Barton Creek, and throughout Travis County trust Vitale Health Concierge for several reasons:
            </p>
            <ul>
              <li><strong>Absolute Privacy</strong> - Discreet service that respects your confidentiality</li>
              <li><strong>Elite Medical Team</strong> - Staffed by Dell Medical School and St. David's-affiliated healthcare professionals</li>
              <li><strong>Rapid Response</strong> - Same-day IV therapy appointments available throughout the 78746, 78733, and 78735 zip codes</li>
              <li><strong>Luxury Experience</strong> - Premium amenities and concierge approach to healthcare</li>
              <li><strong>Comprehensive Care</strong> - Seamless coordination between wellness services and hospice care when needed</li>
            </ul>

            <h2>Serving Travis County's Most Exclusive Communities</h2>
            <p>
              Our services are available throughout Travis County, with particular focus on:
            </p>
            <ul>
              <li><strong>Westlake Hills (78746)</strong> - Serving Rob Roy, Davenport Ranch, and Lost Creek</li>
              <li><strong>Rollingwood (78746)</strong> - Complete coverage of this exclusive enclave</li>
              <li><strong>Barton Creek (78735)</strong> - Including The Foothills, Mirador Drive, and Governor's Club</li>
              <li><strong>Tarrytown (78703)</strong> - Serving Pemberton Heights, Enfield, and Bryker Woods</li>
              <li><strong>Lake Travis (78732, 78734)</strong> - Including Lakeway, The Hills, and Steiner Ranch</li>
            </ul>

            <h2>Membership Options for Travis County Residents</h2>
            <p>
              Our membership plans are tailored to the needs of Travis County's innovative leaders:
            </p>
            <ul>
              <li><strong>Founder's Formula</strong> - Performance-focused IV therapy for tech entrepreneurs and executives</li>
              <li><strong>Family Wellness</strong> - Comprehensive coverage for households in Westlake Hills, Rollingwood, and beyond</li>
              <li><strong>Creative Elite</strong> - Specialized IV formulations for Austin's musicians, filmmakers, and artists</li>
            </ul>

            <div className="bg-indigo-50 p-6 rounded-lg mt-8">
              <h3 className="text-xl font-semibold text-indigo-900">Contact Us for Travis County Service</h3>
              <p className="mt-2">
                To schedule IV therapy or discuss hospice care options in Travis County, contact our concierge team. We offer same-day appointments for residents in Westlake Hills, Rollingwood, Barton Creek, and surrounding communities.
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

export default TravisCountyBlog;