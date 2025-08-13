import React, { useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { CheckIcon } from 'lucide-react';
import PublicStripeSubscriptionButton from '@/components/payments/PublicStripeSubscriptionButton';

const Membership = () => {
  const [isYearly, setIsYearly] = useState(false);
  
  const monthlyPrice = 1297;
  const yearlyPrice = 15564;
  const monthlySavings = (monthlyPrice * 12 - yearlyPrice) / (monthlyPrice * 12) * 100;
  
  const displayPrice = isYearly ? yearlyPrice : monthlyPrice;
  const displayInterval = isYearly ? '/year' : '/mo';
  const interval = isYearly ? 'yearly' : 'monthly';

  return (
    <MainLayout>
      <div className="bg-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center">
            <h2 className="text-base text-secondary font-semibold tracking-wide uppercase">Membership</h2>
            <p className="mt-2 text-3xl leading-8 font-semibold tracking-tight font-playfair text-foreground sm:text-4xl">
              Premium Membership—Your Family’s Private Health Office.
            </p>
            <p className="mt-4 max-w-2xl text-lg text-muted-foreground lg:mx-auto">
              Physician‑led preventive care, bespoke nursing, and priority access—on retainer.
            </p>
          </div>

          {/* Billing Toggle */}
          <div className="mt-12 flex justify-center">
            <div className="flex items-center space-x-3 bg-gray-100 rounded-lg p-1">
              <span className={`px-3 py-1 text-sm font-medium ${!isYearly ? 'text-indigo-600' : 'text-gray-500'}`}>
                Monthly
              </span>
              <Switch
                checked={isYearly}
                onCheckedChange={setIsYearly}
                className="data-[state=checked]:bg-indigo-600"
              />
              <span className={`px-3 py-1 text-sm font-medium ${isYearly ? 'text-indigo-600' : 'text-gray-500'}`}>
                Yearly
              </span>
              {isYearly && (
                <span className="px-2 py-1 text-xs font-semibold bg-green-100 text-green-800 rounded-full">
                  Save {Math.round(monthlySavings)}%
                </span>
              )}
            </div>
          </div>

          <div className="mt-16">
            <div className="max-w-lg mx-auto">
              {/* Single Membership Plan */}
              <div className="rounded-lg shadow-lg overflow-hidden">
                <div className="px-6 py-8 bg-white sm:p-10 sm:pb-6">
                  <div>
                    <h3 className="inline-flex px-4 py-1 rounded-full text-sm font-semibold tracking-wide uppercase bg-muted text-foreground/80">
                      Premium Membership
                    </h3>
                  </div>
                  <div className="mt-4 flex items-baseline text-6xl font-semibold">
                    ${displayPrice.toLocaleString()}
                    <span className="ml-1 text-2xl font-medium text-muted-foreground">{displayInterval}</span>
                  </div>
                  {isYearly && (
                    <p className="mt-2 text-sm text-green-700 font-medium">
                      Save ${(monthlyPrice * 12 - yearlyPrice).toLocaleString()} per year
                    </p>
                  )}
                  <p className="mt-5 text-lg text-muted-foreground">
                    Private coordination with physician oversight and 24/7 concierge access.
                  </p>
                </div>
                <div className="px-6 pt-6 pb-8 bg-gray-50 sm:p-10 sm:pt-6">
                  <ul className="space-y-4">
                    {[
                      'Executive health assessments',
                      'Priority same‑day house calls',
                      'White‑glove care coordination',
                      'Unlimited medical transport',
                      'Pharmacy concierge',
                      '24/7 priority support',
                    ].map((item) => (
                      <li className="flex items-start" key={item}>
                        <div className="flex-shrink-0">
                          <CheckIcon className="h-6 w-6 text-secondary" />
                        </div>
                        <p className="ml-3 text-base text-foreground/80">{item}</p>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-8">
                    <PublicStripeSubscriptionButton 
                      tier="premium"
                      interval={interval}
                      buttonText="Get Started"
                      className="w-full"
                      showFamilySelector={true}
                    />
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

          <div className="mt-20 bg-muted rounded-lg p-8 text-center border border-border">
            <h3 className="text-2xl font-playfair font-semibold text-foreground">Ready to get started?</h3>
            <p className="mt-4 text-lg text-muted-foreground max-w-3xl mx-auto">
              Join distinguished families who trust Vitalé for private, physician‑backed care.
            </p>
            <div className="mt-8">
              <PublicStripeSubscriptionButton 
                tier="premium"
                interval={interval}
                buttonText="Sign Up Today"
                className="text-lg px-8 py-3"
                showFamilySelector={false}
              />
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Membership;