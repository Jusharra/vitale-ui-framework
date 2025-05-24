import React from 'react';
import MainLayout from '@/components/layout/MainLayout';

const Financing = () => {
  return (
    <MainLayout>
      <div className="bg-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center">
            <h2 className="text-base text-indigo-600 font-semibold tracking-wide uppercase">Financing Options</h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              Flexible Payment Solutions
            </p>
            <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
              We believe quality healthcare should be accessible to everyone. Explore our financing options designed to fit your budget.
            </p>
          </div>

          <div className="mt-16">
            <div className="space-y-12">
              <div className="bg-gray-50 rounded-lg p-8 shadow-sm">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Monthly Membership Plans</h3>
                <p className="text-gray-600 mb-6">
                  Our tiered membership plans offer predictable monthly payments with no hidden fees. Choose the plan that best fits your healthcare needs and budget.
                </p>
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
                    <h4 className="text-lg font-semibold text-indigo-600">Smart Access</h4>
                    <p className="text-3xl font-bold mt-2">$9.99<span className="text-sm text-gray-500">/month</span></p>
                    <ul className="mt-4 space-y-2">
                      <li className="flex items-center">
                        <svg className="h-5 w-5 text-green-500 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        Basic health tracking
                      </li>
                      <li className="flex items-center">
                        <svg className="h-5 w-5 text-green-500 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        Health articles access
                      </li>
                      <li className="flex items-center">
                        <svg className="h-5 w-5 text-green-500 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        10% off medications
                      </li>
                    </ul>
                  </div>
                  <div className="bg-white p-6 rounded-lg shadow-md border-2 border-indigo-500 relative">
                    <div className="absolute top-0 right-0 bg-indigo-500 text-white text-xs font-bold px-3 py-1 rounded-bl-lg rounded-tr-lg">POPULAR</div>
                    <h4 className="text-lg font-semibold text-indigo-600">Core Concierge</h4>
                    <p className="text-3xl font-bold mt-2">$24.99<span className="text-sm text-gray-500">/month</span></p>
                    <ul className="mt-4 space-y-2">
                      <li className="flex items-center">
                        <svg className="h-5 w-5 text-green-500 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        Everything in Smart Access
                      </li>
                      <li className="flex items-center">
                        <svg className="h-5 w-5 text-green-500 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        3 telehealth consultations/month
                      </li>
                      <li className="flex items-center">
                        <svg className="h-5 w-5 text-green-500 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        20% off medications
                      </li>
                      <li className="flex items-center">
                        <svg className="h-5 w-5 text-green-500 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        Medical transportation
                      </li>
                    </ul>
                  </div>
                  <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
                    <h4 className="text-lg font-semibold text-indigo-600">VIP Executive</h4>
                    <p className="text-3xl font-bold mt-2">$49.99<span className="text-sm text-gray-500">/month</span></p>
                    <ul className="mt-4 space-y-2">
                      <li className="flex items-center">
                        <svg className="h-5 w-5 text-green-500 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        Everything in Core Concierge
                      </li>
                      <li className="flex items-center">
                        <svg className="h-5 w-5 text-green-500 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        Unlimited telehealth
                      </li>
                      <li className="flex items-center">
                        <svg className="h-5 w-5 text-green-500 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        30% off medications
                      </li>
                      <li className="flex items-center">
                        <svg className="h-5 w-5 text-green-500 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        24/7 priority support
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-8 shadow-sm">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Healthcare Financing</h3>
                <p className="text-gray-600 mb-6">
                  For procedures and services not covered by insurance, we offer flexible financing options through our trusted partners.
                </p>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
                    <h4 className="text-lg font-semibold text-indigo-600">CareCredit®</h4>
                    <p className="mt-2 text-gray-600">
                      Special financing options for healthcare expenses with convenient monthly payments and promotional financing.
                    </p>
                    <ul className="mt-4 space-y-2 text-sm text-gray-600">
                      <li>• No interest if paid in full within 6, 12, or 18 months</li>
                      <li>• Quick application process</li>
                      <li>• Accepted by thousands of providers</li>
                    </ul>
                  </div>
                  <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
                    <h4 className="text-lg font-semibold text-indigo-600">Vitale Payment Plans</h4>
                    <p className="mt-2 text-gray-600">
                      Our in-house payment plans allow you to spread the cost of your healthcare over time with no credit check required.
                    </p>
                    <ul className="mt-4 space-y-2 text-sm text-gray-600">
                      <li>• 0% interest options available</li>
                      <li>• Flexible payment schedules</li>
                      <li>• No impact on credit score</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-8 shadow-sm">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Insurance Coordination</h3>
                <p className="text-gray-600 mb-6">
                  We work with most major insurance providers to maximize your benefits and minimize out-of-pocket expenses.
                </p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 flex items-center justify-center">
                    <p className="font-medium text-gray-800">Blue Cross</p>
                  </div>
                  <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 flex items-center justify-center">
                    <p className="font-medium text-gray-800">Aetna</p>
                  </div>
                  <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 flex items-center justify-center">
                    <p className="font-medium text-gray-800">Cigna</p>
                  </div>
                  <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 flex items-center justify-center">
                    <p className="font-medium text-gray-800">UnitedHealthcare</p>
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

export default Financing;