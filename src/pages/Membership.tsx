import React from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { CheckIcon } from 'lucide-react';

const Membership = () => {
  return (
    <MainLayout>
      <div className="bg-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center">
            <h2 className="text-base text-indigo-600 font-semibold tracking-wide uppercase">Membership Options</h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              Premium Healthcare Membership
            </p>
            <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
              Our comprehensive membership plan offers everything you need for your healthcare journey.
            </p>
          </div>

          <div className="mt-16">
            <div className="max-w-lg mx-auto">
              {/* Single Membership Plan */}
              <div className="rounded-lg shadow-lg overflow-hidden">
                <div className="px-6 py-8 bg-white sm:p-10 sm:pb-6">
                  <div>
                    <h3 className="inline-flex px-4 py-1 rounded-full text-sm font-semibold tracking-wide uppercase bg-indigo-100 text-indigo-600">
                      Premium Membership
                    </h3>
                  </div>
                  <div className="mt-4 flex items-baseline text-6xl font-extrabold">
                    $197
                    <span className="ml-1 text-2xl font-medium text-gray-500">/mo</span>
                  </div>
                  <p className="mt-5 text-lg text-gray-500">
                    Complete healthcare coverage with personalized concierge service
                  </p>
                </div>
                <div className="px-6 pt-6 pb-8 bg-gray-50 sm:p-10 sm:pt-6">
                  <ul className="space-y-4">
                    <li className="flex items-start">
                      <div className="flex-shrink-0">
                        <CheckIcon className="h-6 w-6 text-green-500" />
                      </div>
                      <p className="ml-3 text-base text-gray-700">Unlimited telehealth consultations</p>
                    </li>
                    <li className="flex items-start">
                      <div className="flex-shrink-0">
                        <CheckIcon className="h-6 w-6 text-green-500" />
                      </div>
                      <p className="ml-3 text-base text-gray-700">Dedicated healthcare advisor</p>
                    </li>
                    <li className="flex items-start">
                      <div className="flex-shrink-0">
                        <CheckIcon className="h-6 w-6 text-green-500" />
                      </div>
                      <p className="ml-3 text-base text-gray-700">30% off prescribed medications</p>
                    </li>
                    <li className="flex items-start">
                      <div className="flex-shrink-0">
                        <CheckIcon className="h-6 w-6 text-green-500" />
                      </div>
                      <p className="ml-3 text-base text-gray-700">Unlimited medical transportation</p>
                    </li>
                    <li className="flex items-start">
                      <div className="flex-shrink-0">
                        <CheckIcon className="h-6 w-6 text-green-500" />
                      </div>
                      <p className="ml-3 text-base text-gray-700">VIP concierge services</p>
                    </li>
                    <li className="flex items-start">
                      <div className="flex-shrink-0">
                        <CheckIcon className="h-6 w-6 text-green-500" />
                      </div>
                      <p className="ml-3 text-base text-gray-700">Exclusive vacation package discounts</p>
                    </li>
                    <li className="flex items-start">
                      <div className="flex-shrink-0">
                        <CheckIcon className="h-6 w-6 text-green-500" />
                      </div>
                      <p className="ml-3 text-base text-gray-700">24/7 priority support</p>
                    </li>
                  </ul>
                  <div className="mt-8">
                    <Button className="w-full">Get Started</Button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-20">
            <div className="lg:text-center mb-12">
              <h3 className="text-2xl font-bold text-gray-900">Frequently Asked Questions</h3>
            </div>
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
              <div className="bg-gray-50 rounded-lg p-6 shadow-sm">
                <h4 className="text-lg font-medium text-gray-900">What's included in the membership?</h4>
                <p className="mt-2 text-gray-600">
                  Our premium membership includes unlimited telehealth consultations, dedicated healthcare advisor, medication discounts, medical transportation, VIP concierge services, vacation discounts, and 24/7 priority support.
                </p>
              </div>
              <div className="bg-gray-50 rounded-lg p-6 shadow-sm">
                <h4 className="text-lg font-medium text-gray-900">Can I cancel my membership?</h4>
                <p className="mt-2 text-gray-600">
                  Yes, you can cancel your membership at any time. Changes take effect at the start of your next billing cycle.
                </p>
              </div>
              <div className="bg-gray-50 rounded-lg p-6 shadow-sm">
                <h4 className="text-lg font-medium text-gray-900">Is there a contract or commitment?</h4>
                <p className="mt-2 text-gray-600">
                  No, our membership is month-to-month with no long-term contracts. You can cancel anytime without penalty.
                </p>
              </div>
              <div className="bg-gray-50 rounded-lg p-6 shadow-sm">
                <h4 className="text-lg font-medium text-gray-900">Do you offer family plans?</h4>
                <p className="mt-2 text-gray-600">
                  Yes, we offer family plans with discounted rates for additional family members. Contact our support team for details on family pricing.
                </p>
              </div>
              <div className="bg-gray-50 rounded-lg p-6 shadow-sm">
                <h4 className="text-lg font-medium text-gray-900">How do the medication discounts work?</h4>
                <p className="mt-2 text-gray-600">
                  Our medication discounts apply at participating pharmacies. Simply show your digital membership card at checkout to receive your 30% discount.
                </p>
              </div>
              <div className="bg-gray-50 rounded-lg p-6 shadow-sm">
                <h4 className="text-lg font-medium text-gray-900">Can I try before I commit?</h4>
                <p className="mt-2 text-gray-600">
                  Yes, we offer a 14-day free trial for new members. You can experience all the benefits of your membership before being charged.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-20 bg-indigo-50 rounded-lg p-8 text-center">
            <h3 className="text-2xl font-bold text-gray-900">Ready to get started?</h3>
            <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">
              Join thousands of members who are taking control of their healthcare experience with Vitalé Health Concierge.
            </p>
            <div className="mt-8">
              <Button size="lg">Sign Up Today</Button>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Membership;