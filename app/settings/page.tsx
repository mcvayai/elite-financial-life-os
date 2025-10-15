'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

const SettingsPage = () => {
  const [biblicalMode, setBiblicalMode] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Load biblical mode setting from localStorage
    const savedBiblicalMode = localStorage.getItem('biblicalMode');
    if (savedBiblicalMode !== null) {
      setBiblicalMode(JSON.parse(savedBiblicalMode));
    }
    setIsLoaded(true);
  }, []);

  const handleBiblicalModeToggle = (checked: boolean) => {
    setBiblicalMode(checked);
    localStorage.setItem('biblicalMode', JSON.stringify(checked));
    
    // Dispatch a custom event to notify other components
    window.dispatchEvent(new CustomEvent('biblicalModeChanged', { 
      detail: { biblicalMode: checked } 
    }));
  };

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-48 mb-8"></div>
            <div className="bg-white rounded-xl shadow-lg p-8">
              <div className="h-6 bg-gray-200 rounded w-32 mb-6"></div>
              <div className="h-4 bg-gray-200 rounded w-full mb-4"></div>
              <div className="h-10 bg-gray-200 rounded w-24"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link 
            href="/dashboard" 
            className="inline-flex items-center text-indigo-600 hover:text-indigo-700 transition-colors mb-4"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Dashboard
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-600 mt-2">Customize your Elite Financial Life OS experience</p>
        </div>

        {/* Settings Sections */}
        <div className="space-y-6">
          {/* AI Coach Settings */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center mb-6">
              <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center mr-4">
                <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900">AI Coach Settings</h2>
                <p className="text-gray-600">Configure how your AI financial coach responds to you</p>
              </div>
            </div>

            {/* Biblical Mode Toggle */}
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex-1">
                <h3 className="text-lg font-medium text-gray-900 mb-1">Biblical Mode</h3>
                <p className="text-gray-600 text-sm">
                  When enabled, your AI coach will provide financial advice through a biblical perspective, 
                  incorporating Christian principles of stewardship, generosity, and wise financial planning.
                </p>
              </div>
              <div className="ml-6">
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={biblicalMode}
                    onChange={(e) => handleBiblicalModeToggle(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                  <span className="ml-3 text-sm font-medium text-gray-700">
                    {biblicalMode ? 'Enabled' : 'Disabled'}
                  </span>
                </label>
              </div>
            </div>

            {biblicalMode && (
              <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-start">
                  <svg className="w-5 h-5 text-blue-600 mt-0.5 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                  <div>
                    <h4 className="text-sm font-medium text-blue-800 mb-1">Biblical Mode Active</h4>
                    <p className="text-sm text-blue-700">
                      Your AI coach will now incorporate biblical wisdom and Christian financial principles 
                      into all responses, referencing relevant scripture when appropriate.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Future Settings Placeholder */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center mb-6">
              <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center mr-4">
                <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900">More Settings</h2>
                <p className="text-gray-600">Additional customization options coming soon</p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 border border-gray-200 rounded-lg opacity-50">
                <h3 className="font-medium text-gray-700 mb-1">Notification Preferences</h3>
                <p className="text-sm text-gray-500">Coming soon</p>
              </div>
              <div className="p-4 border border-gray-200 rounded-lg opacity-50">
                <h3 className="font-medium text-gray-700 mb-1">Data Export</h3>
                <p className="text-sm text-gray-500">Coming soon</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
