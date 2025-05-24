import React from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Helmet } from 'react-helmet';

const CollinCountyBlog = () => {
  return (
    <MainLayout>
      <Helmet>
        <title>Concierge Wellness Services – Collin County</title>
        <meta name="description" content="Book luxury in-home IV therapy & end-of-life care in Collin County. Mobile nurses. Membership plans. Trusted by families in Frisco, Plano, and Prosper." />
        <meta property="og:title" content="Concierge IV Therapy & Private Hospice Care in Collin County" />
        <meta property="og:description" content="Book luxury in-home IV therapy & end-of-life care in Collin County. Mobile nurses. Membership plans. Trusted by families in Frisco, Plano, and Prosper." />
        <meta property="og:type" content="article" />
        <script type="application/ld+json">
          {`
            {
              "@context": "https://schema.org",
              "@type": "BlogPosting",
              "headline": "Premium IV Hydration & In-Home Hospice in Collin County",
              "image": "https://images.pexels.com/photos/4386467/pexels-photo-4386467.jpeg",
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
              Premium IV Hydration & In-Home Hospice in Collin County
            </h1>
            <p className="mt-4 text-lg text-gray-500">
              Serving Frisco, Plano, Prosper, McKinney, and Allen
            </p>
          </div>

          <div className="mt-10">
            <img 
              src="https://images.pexels.com/photos/4386467/pexels-photo-4386467.jpeg" 
              alt="Mobile nurse providing IV therapy in Collin County" 
              className="w-full h-96 object-cover rounded-lg shadow-md"
            />
          </div>

          <div className="mt-12 prose prose-indigo prose-lg text-gray-500 mx-auto">
            <h2>Exclusive Healthcare Services for Collin County's Affluent Communities</h2>
            <p>
              Collin County's rapid growth has established it as one of Texas' most prestigious areas, with residents who expect healthcare services that match their lifestyle. Vitale Health Concierge delivers premium IV hydration therapy and compassionate hospice care directly to your doorstep in Frisco, Plano, Prosper, and beyond.
            </p>

            <h2>IV Hydration Therapy: Wellness Optimized for North Texas Living</h2>
            <p>
              Our mobile IV therapy services are designed for the unique demands of Collin County's active professionals and families. Our registered nurses bring customized IV treatments to your home:
            </p>
            <ul>
              <li><strong>Executive Performance</strong> - Energy and focus enhancement for professionals in Plano's Legacy business district</li>
              <li><strong>Athletic Recovery</strong> - Ideal for active residents in Frisco's sports-oriented communities</li>
              <li><strong>Immune Defense</strong> - Essential during seasonal changes in North Texas</li>
              <li><strong>Beauty & Wellness</strong> - Popular in Prosper and West Plano's luxury communities</li>
              <li><strong>Hangover & Dehydration Relief</strong> - Fast recovery after social events in Shops at Legacy and Star in Frisco</li>
            </ul>

            <p>
              All treatments are administered by licensed healthcare professionals who understand the unique health priorities of Collin County's communities.
            </p>

            <h2>Private Hospice Care: Compassionate End-of-Life Support</h2>
            <p>
              Our concierge hospice services provide dignified, compassionate care for loved ones in the comfort of their Collin County homes. We understand the importance of maintaining privacy and dignity during this sensitive time.
            </p>
            <p>
              Our hospice care includes:
            </p>
            <ul>
              <li>24/7 on-call nursing support from Baylor Scott & White and Texas Health-trained professionals</li>
              <li>Pain management and symptom control</li>
              <li>Emotional and spiritual support for patients and families</li>
              <li>Coordination with primary physicians at Baylor Scott & White, Medical City Plano, and Texas Health Presbyterian</li>
              <li>Assistance with advance directives and end-of-life planning</li>
            </ul>

            <h2>Why Collin County Residents Choose Our Concierge Services</h2>
            <p>
              Families in Frisco, Plano, Prosper, and throughout Collin County trust Vitale Health Concierge for several reasons:
            </p>
            <ul>
              <li><strong>Absolute Privacy</strong> - Discreet service that respects your confidentiality</li>
              <li><strong>Elite Medical Team</strong> - Staffed by Baylor Scott & White and UT Southwestern-affiliated healthcare professionals</li>
              <li><strong>Rapid Response</strong> - Same-day IV therapy appointments available throughout the 75034, 75093, and 75078 zip codes</li>
              <li><strong>Luxury Experience</strong> - Premium amenities and concierge approach to healthcare</li>
              <li><strong>Comprehensive Care</strong> - Seamless coordination between wellness services and hospice care when needed</li>
            </ul>

            <h2>Serving Collin County's Most Exclusive Communities</h2>
            <p>
              Our services are available throughout Collin County, with particular focus on:
            </p>
            <ul>
              <li><strong>Frisco (75034, 75035)</strong> - Serving Starwood, Chapel Creek, Stonebriar, and Phillips Creek Ranch</li>
              <li><strong>Plano (75093, 75024)</strong> - Including Willow Bend, Kings Gate, and Avignon neighborhoods</li>
              <li><strong>Prosper (75078)</strong> - Complete coverage of Whitley Place, Whispering Farms, and Gentle Creek</li>
              <li><strong>McKinney (75070, 75071)</strong> - Serving Stonebridge Ranch, Tucker Hill, and Adriatica</li>
              <li><strong>Allen (75013)</strong> - Including Twin Creeks, Waterford Parks, and Star Creek</li>
            </ul>

            <h2>Membership Options for Collin County Residents</h2>
            <p>
              Our membership plans are tailored to the needs of Collin County's discerning residents:
            </p>
            <ul>
              <li><strong>Platinum Membership</strong> - Unlimited IV therapy sessions, priority scheduling, and complimentary wellness consultations</li>
              <li><strong>Family Plan</strong> - Comprehensive coverage for households in Frisco, Plano, and beyond</li>
              <li><strong>Corporate Wellness</strong> - On-site IV therapy for businesses in Legacy West and Hall Park</li>
            </ul>

            <div className="bg-indigo-50 p-6 rounded-lg mt-8">
              <h3 className="text-xl font-semibold text-indigo-900">Contact Us for Collin County Service</h3>
              <p className="mt-2">
                To schedule IV therapy or discuss hospice care options in Collin County, contact our concierge team. We offer same-day appointments for residents in Frisco, Plano, Prosper, and surrounding communities.
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

export default CollinCountyBlog;