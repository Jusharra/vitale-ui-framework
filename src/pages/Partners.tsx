import React from 'react';
import MainLayout from '@/components/layout/MainLayout';

const Partners = () => {
  const partners = [
    {
      name: "MedTech Solutions",
      logo: "https://images.pexels.com/photos/3184405/pexels-photo-3184405.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      description: "Leading provider of innovative medical technology solutions.",
      category: "Technology"
    },
    {
      name: "HealthFirst Insurance",
      logo: "https://images.pexels.com/photos/3184405/pexels-photo-3184405.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      description: "Comprehensive health insurance plans for individuals and families.",
      category: "Insurance"
    },
    {
      name: "Wellness Pharmaceuticals",
      logo: "https://images.pexels.com/photos/3184405/pexels-photo-3184405.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      description: "Developing breakthrough medications for chronic conditions.",
      category: "Pharmaceuticals"
    },
    {
      name: "CarePlus Medical Group",
      logo: "https://images.pexels.com/photos/3184405/pexels-photo-3184405.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      description: "Network of primary care and specialty physicians.",
      category: "Healthcare Providers"
    },
    {
      name: "MindBody Wellness",
      logo: "https://images.pexels.com/photos/3184405/pexels-photo-3184405.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      description: "Holistic approach to mental and physical wellbeing.",
      category: "Wellness"
    },
    {
      name: "HealthTech Innovations",
      logo: "https://images.pexels.com/photos/3184405/pexels-photo-3184405.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      description: "Cutting-edge health monitoring and diagnostic tools.",
      category: "Technology"
    }
  ];

  return (
    <MainLayout>
      <div className="bg-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center">
            <h2 className="text-base text-indigo-600 font-semibold tracking-wide uppercase">Our Partners</h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              Working Together for Better Healthcare
            </p>
            <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
              We collaborate with industry leaders to provide comprehensive healthcare solutions for our members.
            </p>
          </div>

          <div className="mt-16">
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {partners.map((partner, index) => (
                <div key={index} className="bg-gray-50 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300">
                  <div className="h-48 bg-gray-200">
                    <img 
                      src={partner.logo} 
                      alt={`${partner.name} logo`} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-6">
                    <div className="flex justify-between items-start">
                      <h3 className="text-lg font-medium text-gray-900">{partner.name}</h3>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                        {partner.category}
                      </span>
                    </div>
                    <p className="mt-3 text-base text-gray-500">{partner.description}</p>
                    <div className="mt-6">
                      <a href="#" className="text-indigo-600 hover:text-indigo-500 font-medium">
                        Learn more <span aria-hidden="true">→</span>
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-20 bg-indigo-50 rounded-lg p-8">
            <div className="lg:text-center">
              <h3 className="text-2xl font-bold text-gray-900">Become a Partner</h3>
              <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">
                Join our network of healthcare partners and help us revolutionize the healthcare experience for our members. We're always looking for innovative organizations that share our vision.
              </p>
            </div>
            <div className="mt-8 flex justify-center">
              <a
                href="#"
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Partner With Us
              </a>
            </div>
          </div>

          <div className="mt-20">
            <div className="lg:text-center mb-12">
              <h3 className="text-2xl font-bold text-gray-900">What Our Partners Say</h3>
            </div>
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
              <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <svg className="h-12 w-12 text-indigo-300" fill="currentColor" viewBox="0 0 32 32" aria-hidden="true">
                      <path d="M9.352 4C4.456 7.456 1 13.12 1 19.36c0 5.088 3.072 8.064 6.624 8.064 3.36 0 5.856-2.688 5.856-5.856 0-3.168-2.208-5.472-5.088-5.472-.576 0-1.344.096-1.536.192.48-3.264 3.552-7.104 6.624-9.024L9.352 4zm16.512 0c-4.8 3.456-8.256 9.12-8.256 15.36 0 5.088 3.072 8.064 6.624 8.064 3.264 0 5.856-2.688 5.856-5.856 0-3.168-2.304-5.472-5.184-5.472-.576 0-1.248.096-1.44.192.48-3.264 3.456-7.104 6.528-9.024L25.864 4z" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <p className="text-base text-gray-600">
                      "Partnering with Vitale Health Concierge has allowed us to reach more patients and provide better care. Their technology platform and concierge services complement our medical expertise perfectly."
                    </p>
                    <div className="mt-4">
                      <p className="text-base font-medium text-gray-900">Dr. Emily Chen</p>
                      <p className="text-sm text-gray-500">Medical Director, CarePlus Medical Group</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <svg className="h-12 w-12 text-indigo-300" fill="currentColor" viewBox="0 0 32 32" aria-hidden="true">
                      <path d="M9.352 4C4.456 7.456 1 13.12 1 19.36c0 5.088 3.072 8.064 6.624 8.064 3.36 0 5.856-2.688 5.856-5.856 0-3.168-2.208-5.472-5.088-5.472-.576 0-1.344.096-1.536.192.48-3.264 3.552-7.104 6.624-9.024L9.352 4zm16.512 0c-4.8 3.456-8.256 9.12-8.256 15.36 0 5.088 3.072 8.064 6.624 8.064 3.264 0 5.856-2.688 5.856-5.856 0-3.168-2.304-5.472-5.184-5.472-.576 0-1.248.096-1.44.192.48-3.264 3.456-7.104 6.528-9.024L25.864 4z" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <p className="text-base text-gray-600">
                      "The integration with Vitale's platform has streamlined our operations and improved patient satisfaction. Their focus on quality and innovation aligns perfectly with our company values."
                    </p>
                    <div className="mt-4">
                      <p className="text-base font-medium text-gray-900">Michael Johnson</p>
                      <p className="text-sm text-gray-500">CEO, HealthTech Innovations</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Partners;