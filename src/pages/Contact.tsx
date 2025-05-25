import React from 'react';
import MainLayout from '@/components/layout/MainLayout';

const Contact = () => {
  return (
    <MainLayout>
      <div className="bg-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center">
            <h2 className="text-base text-indigo-600 font-semibold tracking-wide uppercase">Contact Us</h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              Get in Touch
            </p>
            <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
              We're here to answer your questions and provide the support you need.
            </p>
          </div>

          <div className="mt-16">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Send Us a Message</h3>
                <form className="space-y-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                      Full Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      id="name"
                      className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md p-2 border"
                      placeholder="John Doe"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                      Email Address
                    </label>
                    <input
                      type="email"
                      name="email"
                      id="email"
                      className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md p-2 border"
                      placeholder="john@example.com"
                    />
                  </div>
                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium text-gray-700">
                      Subject
                    </label>
                    <input
                      type="text"
                      name="subject"
                      id="subject"
                      className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md p-2 border"
                      placeholder="How can we help you?"
                    />
                  </div>
                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700">
                      Message
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      rows={4}
                      className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md p-2 border"
                      placeholder="Your message here..."
                    ></textarea>
                  </div>
                  <div>
                    <button
                      type="submit"
                      className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      Send Message
                    </button>
                  </div>
                </form>
              </div>

              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Contact Information</h3>
                <div className="bg-gray-50 rounded-lg p-6 shadow-sm">
                  <div className="flex items-start mb-6">
                    <div className="flex-shrink-0">
                      <svg className="h-6 w-6 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-900">Phone</p>
                      <p className="mt-1 text-sm text-gray-600">+1 (661) 489-8106</p>
                      <p className="mt-1 text-sm text-gray-500">Mon-Fri from 8am to 8pm</p>
                    </div>
                  </div>
                  <div className="flex items-start mb-6">
                    <div className="flex-shrink-0">
                      <svg className="h-6 w-6 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-900">Email</p>
                      <p className="mt-1 text-sm text-gray-600">support@vitalehealth.com</p>
                      <p className="mt-1 text-sm text-gray-500">We aim to respond within 24 hours</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <svg className="h-6 w-6 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-900">Office</p>
                      <p className="mt-1 text-sm text-gray-600">123 Health Avenue</p>
                      <p className="mt-1 text-sm text-gray-600">San Francisco, CA 94103</p>
                      <p className="mt-1 text-sm text-gray-500">Mon-Fri from 9am to 5pm</p>
                    </div>
                  </div>
                </div>

                <div className="mt-8">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Frequently Asked Questions</h3>
                  <div className="space-y-4">
                    <div className="bg-gray-50 rounded-lg p-4 shadow-sm">
                      <h4 className="text-base font-medium text-gray-900">How do I sign up for a membership?</h4>
                      <p className="mt-2 text-sm text-gray-600">
                        You can sign up for a membership by clicking the "Sign In" button at the top of the page and then selecting "Register" to create an account.
                      </p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4 shadow-sm">
                      <h4 className="text-base font-medium text-gray-900">Can I cancel my membership at any time?</h4>
                      <p className="mt-2 text-sm text-gray-600">
                        Yes, you can cancel your membership at any time through your account dashboard. There are no cancellation fees.
                      </p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4 shadow-sm">
                      <h4 className="text-base font-medium text-gray-900">How quickly can I see a doctor?</h4>
                      <p className="mt-2 text-sm text-gray-600">
                        With our Core and VIP memberships, you can typically schedule a telehealth appointment within 24 hours. In-person appointments depend on provider availability.
                      </p>
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

export default Contact;