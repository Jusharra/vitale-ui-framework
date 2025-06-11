import React from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Helmet } from 'react-helmet';

const ContraCostaCountyBlog = () => {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": "Premium IV Hydration & In-Home Hospice in Contra Costa County",
    "image": "https://images.pexels.com/photos/3825586/pexels-photo-3825586.jpeg",
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
        <title>Concierge Wellness Services – Contra Costa County</title>
        <meta name="description" content="Book luxury in-home IV therapy & end-of-life care in Contra Costa County. Mobile nurses. Membership plans. Trusted by families in Alamo, Danville, and Orinda." />
        <meta property="og:title" content="Concierge IV Therapy & Private Hospice Care in Contra Costa County" />
        <meta property="og:description" content="Book luxury in-home IV therapy & end-of-life care in Contra Costa County. Mobile nurses. Membership plans. Trusted by families in Alamo, Danville, and Orinda." />
        <meta property="og:type" content="article" />
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      </Helmet>

      <div className="bg-white py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Premium IV Hydration & In-Home Hospice in Contra Costa County
            </h1>
            <p className="mt-4 text-lg text-gray-500">
              Serving Alamo, Danville, Orinda, Lafayette, and Walnut Creek
            </p>
          </div>

          <div className="mt-10">
            <img 
              src="https://images.pexels.com/photos/3825586/pexels-photo-3825586.jpeg" 
              alt="Mobile nurse providing IV therapy in Contra Costa County" 
              className="w-full h-96 object-cover rounded-lg shadow-md"
            />
          </div>

          <div className="mt-12 prose prose-indigo prose-lg text-gray-500 mx-auto">
            <h2>Exclusive Healthcare Services for Contra Costa County's Prestigious Communities</h2>
            <p>
              Contra Costa County's affluent communities demand healthcare that matches their sophisticated lifestyle—discreet, personalized, and available on demand. Vitale Health Concierge brings premium IV hydration therapy and compassionate hospice care directly to your doorstep in Alamo, Danville, Orinda, and beyond.
            </p>

            <h2>IV Hydration Therapy: Wellness Optimized for East Bay Living</h2>
            <p>
              Our mobile IV therapy services are designed for the unique demands of Contra Costa County's active professionals and families. Our registered nurses bring customized IV treatments to your home:
            </p>
            <ul>
              <li><strong>Executive Performance</strong> - Energy and focus enhancement for professionals commuting to San Francisco and Silicon Valley</li>
              <li><strong>Athletic Recovery</strong> - Ideal for active residents in Danville's Blackhawk and Alamo's Round Hill Country Club</li>
              <li><strong>Immune Defense</strong> - Essential during seasonal changes in the East Bay</li>
              <li><strong>Beauty & Wellness</strong> - Popular in Orinda and Lafayette's luxury communities</li>
              <li><strong>Hangover & Dehydration Relief</strong> - Fast recovery after wine country excursions</li>
            </ul>

            <p>
              All treatments are administered by licensed healthcare professionals who understand the unique health priorities of Contra Costa County's communities.
            </p>

            <h2>Private Hospice Care: Compassionate End-of-Life Support</h2>
            <p>
              Our concierge hospice services provide dignified, compassionate care for loved ones in the comfort of their Contra Costa County homes. We understand the importance of maintaining privacy and dignity during this sensitive time.
            </p>
            <p>
              Our hospice care includes:
            </p>
            <ul>
              <li>24/7 on-call nursing support from John Muir Health and UCSF-trained professionals</li>
              <li>Pain management and symptom control</li>
              <li>Emotional and spiritual support for patients and families</li>
              <li>Coordination with primary physicians at John Muir Medical Center, Kaiser Permanente Walnut Creek, and UCSF Benioff Children's Hospital Oakland</li>
              <li>Assistance with advance directives and end-of-life planning</li>
            </ul>

            <h2>Why Contra Costa County Residents Choose Our Concierge Services</h2>
            <p>
              Families in Alamo, Danville, Orinda, and throughout Contra Costa County trust Vitale Health Concierge for several reasons:
            </p>
            <ul>
              <li><strong>Absolute Privacy</strong> - Discreet service that respects your confidentiality</li>
              <li><strong>Elite Medical Team</strong> - Staffed by John Muir Health and UCSF-affiliated healthcare professionals</li>
              <li><strong>Rapid Response</strong> - Same-day IV therapy appointments available throughout the 94507, 94526, and 94563 zip codes</li>
              <li><strong>Luxury Experience</strong> - Premium amenities and concierge approach to healthcare</li>
              <li><strong>Comprehensive Care</strong> - Seamless coordination between wellness services and hospice care when needed</li>
            </ul>

            <h2>Serving Contra Costa County's Most Exclusive Communities</h2>
            <p>
              Our services are available throughout Contra Costa County, with particular focus on:
            </p>
            <ul>
              <li><strong>Alamo (94507)</strong> - Serving Round Hill, Bryan Ranch, and Stonegate</li>
              <li><strong>Danville (94506, 94526)</strong> - Including Blackhawk, Diablo, and Sycamore Valley</li>
              <li><strong>Orinda (94563)</strong> - Complete coverage of Orinda Country Club, Sleepy Hollow, and Orinda Downs</li>
              <li><strong>Lafayette (94549)</strong> - Serving Happy Valley, Burton Valley, and Reliez Valley</li>
              <li><strong>Walnut Creek (94595, 94598)</strong> - Including Rossmoor, Northgate, and Parkmead</li>
            </ul>

            <h2>Membership Options for Contra Costa County Residents</h2>
            <p>
              Our membership plans are tailored to the needs of Contra Costa County's discerning residents:
            </p>
            <ul>
              <li><strong>Platinum Membership</strong> - Unlimited IV therapy sessions, priority scheduling, and complimentary wellness consultations</li>
              <li><strong>Family Plan</strong> - Comprehensive coverage for households in Alamo, Danville, and beyond</li>
              <li><strong>Executive Health</strong> - Performance-focused IV therapy for commuting professionals</li>
            </ul>

            <div className="bg-indigo-50 p-6 rounded-lg mt-8">
              <h3 className="text-xl font-semibold text-indigo-900">Contact Us for Contra Costa County Service</h3>
              <p className="mt-2">
                To schedule IV therapy or discuss hospice care options in Contra Costa County, contact our concierge team. We offer same-day appointments for residents in Alamo, Danville, Orinda, and surrounding communities.
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

export default ContraCostaCountyBlog;