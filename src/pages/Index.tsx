
import React from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

const Index = () => {
  const navigate = useNavigate();
  const { isAuthenticated, userRole, signOut } = useAuth();

  const handleDashboardClick = () => {
    if (isAuthenticated) {
      if (userRole === 'professional') {
        navigate('/dashboard/professional');
      } else if (userRole === 'admin') {
        navigate('/dashboard/admin');
      } else {
        navigate('/dashboard');
      }
    } else {
      navigate('/auth');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <header className="py-4 px-8 flex justify-between items-center bg-white shadow-sm">
        <div className="flex items-center">
          <div className="bg-indigo-600 text-white font-bold text-xl px-3 py-1 rounded mr-2">VH</div>
          <h1 className="text-xl font-bold text-gray-800">Vitale Health Concierge</h1>
        </div>
        <div>
          {isAuthenticated ? (
            <div className="flex gap-2">
              <Button onClick={handleDashboardClick}>Dashboard</Button>
              <Button variant="outline" onClick={signOut}>Sign Out</Button>
            </div>
          ) : (
            <Button onClick={() => navigate('/auth')}>Sign In</Button>
          )}
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
            <span className="block">Premium Healthcare</span>
            <span className="block text-indigo-600">At Your Fingertips</span>
          </h1>
          <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
            Experience personalized care with our tiered membership plans. Connect with healthcare professionals, access digital health tools, and more.
          </p>
          <div className="mt-5 max-w-md mx-auto sm:flex sm:justify-center md:mt-8">
            <div className="rounded-md shadow">
              <Button className="w-full" size="lg" onClick={handleDashboardClick}>
                {isAuthenticated ? 'Go to Dashboard' : 'Start Free Trial'}
              </Button>
            </div>
            <div className="mt-3 rounded-md shadow sm:mt-0 sm:ml-3">
              <Button variant="outline" className="w-full" size="lg" onClick={() => navigate('/auth')}>
                Learn More
              </Button>
            </div>
          </div>
        </div>

        <div className="mt-24 grid gap-8 md:grid-cols-3">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="bg-indigo-100 text-indigo-600 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
              </svg>
            </div>
            <h3 className="text-xl font-medium text-gray-900">Smart Access</h3>
            <p className="mt-2 text-gray-500">
              Get started with essential healthcare features. Book services, access basic health tools, and engage with our AI assistant.
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md border border-indigo-200">
            <div className="bg-indigo-600 text-white p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-medium text-gray-900">Core Concierge</h3>
            <p className="mt-2 text-gray-500">
              Upgrade to priority scheduling with specialists, unlock more health tools, and enjoy 15% off all bookings.
            </p>
          </div>
          <div className="bg-gradient-to-br from-indigo-50 to-purple-50 p-6 rounded-lg shadow-md border border-purple-200">
            <div className="bg-purple-600 text-white p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
              </svg>
            </div>
            <h3 className="text-xl font-medium text-gray-900">VIP Executive</h3>
            <p className="mt-2 text-gray-500">
              Our premium tier offers all features plus telehealth services, a personal primary care physician, and 20% off bookings.
            </p>
          </div>
        </div>
      </main>

      <footer className="bg-gray-800 text-white py-8 mt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between">
            <div className="mb-6 md:mb-0">
              <div className="flex items-center">
                <div className="bg-white text-indigo-600 font-bold text-xl px-3 py-1 rounded mr-2">VH</div>
                <span className="text-xl font-bold">Vitale Health</span>
              </div>
              <p className="mt-2 text-gray-400 text-sm">Personalized healthcare at your fingertips</p>
            </div>
            <div className="grid grid-cols-2 gap-8 md:gap-20">
              <div>
                <h3 className="text-sm font-semibold uppercase tracking-wider">Membership</h3>
                <ul className="mt-4 space-y-2">
                  <li><a href="#" className="text-gray-400 hover:text-white">Smart Access</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-white">Core Concierge</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-white">VIP Executive</a></li>
                </ul>
              </div>
              <div>
                <h3 className="text-sm font-semibold uppercase tracking-wider">Support</h3>
                <ul className="mt-4 space-y-2">
                  <li><a href="#" className="text-gray-400 hover:text-white">Contact</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-white">FAQ</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-white">Privacy</a></li>
                </ul>
              </div>
            </div>
          </div>
          <div className="mt-8 border-t border-gray-700 pt-8 flex flex-col md:flex-row justify-between">
            <p className="text-gray-400 text-sm">© 2025 Vitale Health Concierge. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
