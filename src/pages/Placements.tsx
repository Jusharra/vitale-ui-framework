import React from 'react';
import MainLayout from '@/components/layout/MainLayout';

const Placements = () => {
  return (
    <MainLayout>
      <div className="min-h-screen bg-gray-100 py-6 flex flex-col justify-center sm:py-12">
        <div className="relative py-3 sm:max-w-xl sm:mx-auto">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-300 to-purple-300 shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl"></div>
          <div className="relative bg-white shadow-lg sm:rounded-3xl p-8">
            <h1 className="text-2xl font-bold text-gray-900">
              Unlock Your Potential with Our Placement Services
            </h1>
            <p className="mt-4 text-gray-600">
              Ready to take the next step in your career? Our placement services connect you with top healthcare providers.
            </p>
            <div className="mt-8">
              <h2 className="text-xl font-semibold text-gray-800">Request a Placement</h2>
              <p className="text-gray-500 mt-2">
                Fill out the form below to get started.
              </p>
              <form className="mt-4">
                <div className="mb-4">
                  <label htmlFor="name" className="block text-gray-700 text-sm font-bold mb-2">
                    Full Name
                  </label>
                  <input type="text" id="name" placeholder="Your Name" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
                </div>
                <div className="mb-4">
                  <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2">
                    Email Address
                  </label>
                  <input type="email" id="email" placeholder="Your Email" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
                </div>
                <div className="mb-4">
                  <label htmlFor="role" className="block text-gray-700 text-sm font-bold mb-2">
                    Desired Role
                  </label>
                  <select id="role" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
                    <option>Physician</option>
                    <option>Nurse Practitioner</option>
                    <option>Physician Assistant</option>
                  </select>
                </div>
                <button className="bg-indigo-500 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="submit">
                  Submit Request
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Placements;