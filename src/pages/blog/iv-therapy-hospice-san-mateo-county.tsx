import React from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Helmet } from 'react-helmet';

const SanMateoCountyBlog = () => {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": "Premium IV Hydration & In-Home Hospice in San Mateo County",
    "image": "https://images.pexels.com/photos/7089401/pexels-photo-7089401.jpeg",
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
        <title>Concierge Wellness Services – San Mateo County</title>
        <meta name="description" content="Book luxury in-home IV therapy & end-of-life care in San Mateo County. Mobile nurses. Membership plans. Trusted by families in Atherton, Menlo Park, and Hillsborough." />
        <meta property="og:title" content="Concierge IV Therapy & Private Hospice Care in San Mateo County" />
        <meta property="og:description" content="Book luxury in-home IV therapy & end-of-life care in San Mateo County. Mobile nurses. Membership plans. Trusted by families in Atherton, Menlo Park, and Hillsborough." />
        <meta property="og:type" content="article" />
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      </Helmet>

      <div className="bg-white py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Premium IV Hydration & In-Home Hospice in San Mateo County
            </h1>
            <p className="mt-4 text-lg text-gray-500">
              Serving Atherton, Menlo Park, Hillsborough, Woodside, and Portola Valley
            </p>
          </div>

          <div className="mt-10">
            <img 
              src="https://images.pexels.com/photos/7089401/pexels-photo-7089401.jpeg" 
              alt="Mobile nurse providing IV therapy in San Mateo County" 
              className="w-full h-96 object-cover rounded-lg shadow-md"
            />
          </div>

          <div className="mt-12 prose prose-indigo prose-lg text-gray-500 mx-auto">
            <h2>Concierge Wellness Services for San Mateo County's Elite Communities</h2>
            <p>
              San Mateo County's affluent communities demand healthcare that matches their lifestyle—discreet, personalized, and available on demand. Vitale Health Concierge brings premium IV hydration therapy and compassionate hospice care directly to your doorstep in Atherton, Menlo Park, Hillsborough, and beyond.
            </p>

            <h2>IV Hydration Therapy: Wellness Delivered to Your Door</h2>
            <p>
              Our mobile IV therapy services bring the benefits of direct nutrient delivery to your home, office, or hotel in San Mateo County. Our registered nurses administer customized IV drips designed to address your specific wellness needs:
            </p>
            <ul>
              <li><strong>Executive Performance Boost</strong> - Enhance mental clarity and energy for busy professionals in the Peninsula's tech corridor</li>
              <li><strong>Immune Defense</strong> - Strengthen your immune system with vitamin-rich formulations</li>
              <li><strong>Recovery & Rehydration</strong> - Ideal for athletes training in Woodside hills or recovering from social events</li>
              <li><strong>Anti-Aging & Beauty</strong> - Glutathione and collagen-enhancing infusions popular in Hillsborough and Atherton</li>
              <li><strong>Jet Lag Recovery</strong> - Perfect for frequent travelers using San Francisco International Airport</li>
            </ul>

            <p>
              All treatments are administered by licensed healthcare professionals in the comfort and privacy of your San Mateo County residence.
            </p>

            <h2>Private Hospice Care: Compassionate End-of-Life Support</h2>
            <p>
              Our concierge hospice services provide dignified, compassionate care for loved ones in the familiar surroundings of their San Mateo County home. We understand the unique needs of families in communities like Atherton and Hillsborough, where privacy and personalized attention are paramount.
            </p>
            <p>
              Our hospice care includes:
            </p>
            <ul>
              <li>24/7 on-call nursing support from Stanford-trained professionals</li>
              <li>Pain management and symptom control</li>
              <li>Emotional and spiritual support for patients and families</li>
              <li>Coordination with primary physicians at Stanford Medical Center and UCSF</li>
              <li>Assistance with advance directives and end-of-life planning</li>
            </ul>

            <h2>Why San Mateo County Residents Choose Our Concierge Services</h2>
            <p>
              Families in Atherton, Menlo Park, Hillsborough, and throughout San Mateo County trust Vitale Health Concierge for several reasons:
            </p>
            <ul>
              <li><strong>Absolute Privacy</strong> - Discreet service that respects your confidentiality</li>
              <li><strong>Elite Medical Team</strong> - Staffed by Stanford and UCSF-affiliated healthcare professionals</li>
              <li><strong>Rapid Response</strong> - Same-day IV therapy appointments available throughout the 94027, 94025, and 94010 zip codes</li>
              <li><strong>Luxury Experience</strong> - Premium amenities and concierge approach to healthcare</li>
              <li><strong>Comprehensive Care</strong> - Seamless coordination between wellness services and hospice care when needed</li>
            </ul>

            <h2>Serving San Mateo County's Most Exclusive Communities</h2>
            <p>
              Our services are available throughout San Mateo County, with particular focus on:
            </p>
            <ul>
              <li><strong>Atherton (94027)</strong> - Serving the entire community, including West Atherton and Lindenwood</li>
              <li><strong>Menlo Park (94025)</strong> - Including Allied Arts, Sharon Heights, and Stanford Hills</li>
              <li><strong>Hillsborough (94010)</strong> - Complete coverage of all neighborhoods</li>
              <li><strong>Woodside (94062)</strong> - Serving Mountain Home Road, Woodside Glens, and surrounding areas</li>
              <li><strong>Portola Valley (94028)</strong> - Including Westridge, Central Portola Valley, and Blue Oaks</li>
            </ul>

            <h2>Membership Options for San Mateo County Residents</h2>
            <p>
              Our membership plans are tailored to the needs of San Mateo County's discerning residents:
            </p>
            <ul>
              <li><strong>Platinum Membership</strong> - Unlimited IV therapy sessions, priority scheduling, and complimentary wellness consultations</li>
              <li><strong>Family Plan</strong> - Comprehensive coverage for households in Atherton, Hillsborough, and beyond</li>
              <li><strong>Corporate Wellness</strong> - On-site IV therapy for tech companies and venture capital firms in Menlo Park</li>
            </ul>

            <div className="bg-indigo-50 p-6 rounded-lg mt-8">
              <h3 className="text-xl font-semibold text-indigo-900">Contact Us for San Mateo County Service</h3>
              <p className="mt-2">
                To schedule IV therapy or discuss hospice care options in San Mateo County, contact our concierge team. We offer same-day appointments for residents in Atherton, Menlo Park, Hillsborough, and surrounding communities.
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

export default SanMateoCountyBlog;