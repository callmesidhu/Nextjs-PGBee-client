'use client';

import React, { useState, useEffect } from 'react';
import Data from '@/components/dashboard/Data';
import Footer from '@/components/common/Footer';
import Header from '@/components/common/Navbar';
import HostelCard from '@/components/dashboard/HostelCard';
import { Icon, ICONS } from '@/components/dashboard/Icons';
import MobileSidebar from '@/components/dashboard/MobileBar';
import FiltersSidebar from '@/components/dashboard/SideBar';
import ActiveFilters from '@/components/dashboard/ActiveFilters';
import { FilterProvider, useFilters } from '@/contexts/FilterContext';

function AppContent() {
  const [showFilters, setShowFilters] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [hostels, setHostels] = useState([]);
  const [loading, setLoading] = useState(true);
  const { filterHostels, filters } = useFilters();

  useEffect(() => {
    const fetchHostels = async () => {
      try {
        const result = await Data();
        console.log('✅ Fetched accommodations:', result);
        setHostels(result);
      } catch (error) {
        console.error('❌ Failed to load accommodations:', error);
        // Set some mock data or empty array if API fails
        setHostels([]);
      } finally {
        setLoading(false);
      }
    };

    fetchHostels();
  }, []);

  // Filter hostels based on current filter state
  const filteredHostels = filterHostels(hostels);

  // Dynamic title based on place type filter
  const getDisplayTitle = () => {
    if (filters.placeType === 'PG') {
      return 'PGs';
    } else if (filters.placeType === 'Hostel') {
      return 'Hostels';
    } else {
      return 'Accommodations (Hostels & PGs)';
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen font-sans flex flex-col">
      <Header onMenuClick={() => setIsMenuOpen(true)} />
      <MobileSidebar isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />

      <main className="flex-grow container mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Mobile Filter Button */}
        <div className="lg:hidden mb-4">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            <Icon path={ICONS.filter} className="w-5 h-5 mr-2 -ml-1" />
            {showFilters ? 'Hide Filters' : 'Show Filters'}
          </button>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <div className={`${showFilters ? 'block' : 'hidden'} lg:block w-full lg:w-1/4 xl:w-1/5`}>
            <FiltersSidebar />
          </div>

          {/* Main content */}
          <div className="w-full lg:w-3/4 xl:w-4/5">
            <ActiveFilters />
            
            <h2 className="text-lg font-semibold text-gray-700 mb-4">
              {getDisplayTitle()} in College Of Engineering, Trivandrum ({filteredHostels.length} search results)
            </h2>

            {loading ? (
              <p className="text-gray-500">Loading accommodations...</p>
            ) : Array.isArray(filteredHostels) && filteredHostels.length > 0 ? (
              <div>
                {filteredHostels.map((hostel) => (
                  <HostelCard key={hostel.id} hostel={hostel} />
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500 text-lg">Loading....</p>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <FilterProvider>
      <AppContent />
    </FilterProvider>
  );
}
