import React from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Helmet } from 'react-helmet';

const MontgomeryCountyBlog = () => {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": "Premium IV Hydration & In-Home Hospice in Montgomery County",
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
        <title>Concierge Wellness Services – Montgomery County</title>
        <meta name="description" content="Book luxury in-home IV therapy & end-of-life care in Montgomery County. Mobile nurses. Membership plans. Trusted by families in The Woodlands, Carlton Woods, and Magnolia." />
        <meta property="og:title" content="Concierge IV Therapy & Private Hospice Care in Montgomery County" />
        <meta property="og:description" content="Book luxury in-home IV therapy & end-of-life care in Montgomery County. Mobile nurses. Membership plans. Trusted by families in The Woodlands, Carlton Woods, and Magnolia." />
        <meta property="og:type" content="article" />
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      </Helmet>

      <div className="bg-white py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Premium IV Hydration & In-Home Hospice in Montgomery County
            </h1>
            <p className="mt-4 text-lg text-gray-500">
              Serving The Woodlands, Carlton Woods, Magnolia, Conroe, and Spring
            </p>
          </div>

          <div className="mt-10">
            <img 
              src="https://images.pexels.com/photos/3184405/pexels-photo-3184405.jpeg" 
              alt="Mobile nurse providing IV therapy in Montgomery County" 
              className="w-full h-96 object-cover rounded-lg shadow-md"
            />
          </div>

          <div className="mt-12 prose prose-indigo prose-lg text-gray-500 mx-auto">
            <h2>Exclusive Healthcare Services for Montgomery County's Prestigious Communities</h2>
            <p>
              Montgomery County's growing affluent communities demand healthcare services that match their upscale lifestyle. Vitale Health Concierge delivers premium IV hydration therapy and compassionate hospice care directly to your doorstep in The Woodlands, Carlton Woods, Magnolia, and beyond.
            </p>

            <h2>IV Hydration Therapy: Wellness Optimized for North Houston Living</h2>
            <p>
              Our mobile IV therapy services are designed for the unique demands of Montgomery County's active professionals and families. Our registered nurses bring customized IV treatments to your home:
            </p>
            <ul>
              <li><strong>Executive Performance</strong> - Energy and focus enhancement for professionals in The Woodlands' Energy Corridor</li>
              <li><strong>Golf Recovery</strong> - Ideal for members of Carlton Woods, Club at Carlton Woods, and Woodforest Golf Club</li>
              <li><strong>Immune Defense</strong> - Essential during seasonal changes in Southeast Texas</li>
              <li><strong>Beauty & Wellness</strong> - Popular in The Woodlands' East Shore and Carlton Woods Creekside</li>
              <li><strong>Dehydration Relief</strong> - Fast recovery during hot Texas summers</li>
            </ul>

            <p>
              All treatments are administered by licensed healthcare professionals who understand the unique health priorities of Montgomery County's communities.
            </p>

            <h2>Private Hospice Care: Compassionate End-of-Life Support</h2>
            <p>
              Our concierge hospice services provide dignified, compassionate care for loved ones in the comfort of their Montgomery County homes. We understand the importance of maintaining privacy and dignity during this sensitive time.
            </p>
            <p>
              Our hospice care includes:
            </p>
            <ul>
              <li>24/7 on-call nursing support from Memorial Hermann and Houston Methodist-trained professionals</li>
              <li>Pain management and symptom control</li>
              <li>Emotional and spiritual support for patients and families</li>
              <li>Coordination with primary physicians at Memorial Hermann The Woodlands, Houston Methodist The Woodlands, and St. Luke's The Woodlands</li>
              <li>Assistance with advance directives and end-of-life planning</li>
            </ul>

            <h2>Why Montgomery County Residents Choose Our Concierge Services</h2>
            <p>
              Families in The Woodlands, Carlton Woods, Magnolia, and throughout Montgomery County trust Vitale Health Concierge for several reasons:
            </p>
            <ul>
              <li><strong>Absolute Privacy</strong> - Discreet service that respects your confidentiality</li>
              <li><strong>Elite Medical Team</strong> - Staffed by Memorial Hermann and Houston Methodist-affiliated healthcare professionals</li>
              <li><strong>Rapid Response</strong> - Same-day IV therapy appointments available throughout the 77380, 77382, and 77354 zip codes</li>
              <li><strong>Luxury Experience</strong> - Premium amenities and concierge approach to healthcare</li>
              <li><strong>Comprehensive Care</strong> - Seamless coordination between wellness services and hospice care when needed</li>
            </ul>

            <h2>Serving Montgomery County's Most Exclusive Communities</h2>
            <p>
              Our services are available throughout Montgomery County, with particular focus on:
            </p>
            <ul>
              <li><strong>The Woodlands (77380, 77381, 77382)</strong> - Serving East Shore, Carlton Woods, Grogan's Point, and Sterling Ridge</li>
              <li><strong>Magnolia (77354, 77355)</strong> - Including High Meadow Ranch, Indigo Lake Estates, and Woodforest</li>
              <li><strong>Conroe (77304, 77384)</strong> - Complete coverage of Grand Central Park, Woodforest, and April Sound</li>
              <li><strong>Spring (77386)</strong> - Serving Augusta Pines, Harmony, and Spring Trails</li>
              <li><strong>Montgomery (77356)</strong> - Including Buffalo Springs, Bentwater, and Lake Conroe communities</li>
            </ul>

            <h2>Membership Options for Montgomery County Residents</h2>
            <p>
              Our membership plans are tailored to the needs of Montgomery County's discerning residents:
            </p>
            <ul>
              <li><strong>Platinum Membership</strong> - Unlimited IV therapy sessions, priority scheduling, and complimentary wellness consultations</li>
              <li><strong>Family Plan</strong> - Comprehensive coverage for households in The Woodlands, Carlton Woods, and beyond</li>
              <li><strong>Corporate Wellness</strong> - On-site IV therapy for businesses in The Woodlands' Hughes Landing and Research Forest</li>
            </ul>

            <div className="bg-indigo-50 p-6 rounded-lg mt-8">
              <h3 className="text-xl font-semibold text-indigo-900">Contact Us for Montgomery County Service</h3>
              <p className="mt-2">
                To schedule IV therapy or discuss hospice care options in Montgomery County, contact our concierge team. We offer same-day appointments for residents in The Woodlands, Carlton Woods, Magnolia, and surrounding communities.
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

export default MontgomeryCountyBlog;