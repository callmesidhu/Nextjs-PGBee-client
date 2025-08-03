"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Navbar from "@/components/common/Navbar";
import FiltersSidebar from "@/components/dashboard/SideBar";
import SearchableHostelList from "@/components/search/SearchableHostelList";
import AdvancedSearchModal from "@/components/search/AdvancedSearchModal";
import { useFilters } from "@/contexts/FilterContext";
import mockData from "@/components/dashboard/Data";
import { Icon, ICONS } from "@/components/dashboard/Icons";

// Loading component
const SearchPageSkeleton = () => (
  <div className="animate-pulse">
    <div className="h-20 bg-gray-200 mb-6"></div>
    <div className="container mx-auto px-4">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="h-96 bg-gray-200 rounded-lg"></div>
        <div className="lg:col-span-3 space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-64 bg-gray-200 rounded-lg"></div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

// Search results content component
const SearchResultsContent = () => {
  const searchParams = useSearchParams();
  const { filters } = useFilters();
  const [searchQuery, setSearchQuery] = useState("");
  const [hostels, setHostels] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAdvancedSearch, setShowAdvancedSearch] = useState(false);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await mockData();
        setHostels(data);
      } catch (error) {
        console.error("Failed to fetch hostels:", error);
        setHostels([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const query = searchParams.get("search") || "";
    setSearchQuery(query);
  }, [searchParams]);

  const handleNavbarSearch = (query) => {
    if (query !== undefined) {
      const url = new URL(window.location);
      if (query.trim()) {
        url.searchParams.set("search", query);
      } else {
        url.searchParams.delete("search");
      }
      window.history.pushState({}, "", url);
      setSearchQuery(query);
    }
  };

  const handleAdvancedSearch = (query) => {
    handleNavbarSearch(query);
  };

  if (isLoading) {
    return <SearchPageSkeleton />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar with search functionality */}
      <Navbar
        hostels={hostels}
        onSearch={handleNavbarSearch}
        initialSearchQuery={searchQuery}
      />

      <div className="container mx-auto px-4 py-6">
        {/* Search Controls */}
        <div className="mb-6 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setShowAdvancedSearch(true)}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Icon path={ICONS.search} className="w-4 h-4" />
              Advanced Search
            </button>

            <button
              onClick={() => setShowMobileFilters(true)}
              className="lg:hidden flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Icon path={ICONS.filter} className="w-4 h-4" />
              Filters
            </button>
          </div>

          {/* Quick Stats */}
          <div className="text-sm text-gray-600">
            {searchQuery && (
              <span className="mr-4">Search: "{searchQuery}"</span>
            )}
            <span>{hostels.length} total properties</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Filters Sidebar - Hidden on mobile */}
          <div className="hidden lg:block lg:col-span-1">
            <FiltersSidebar />
          </div>

          {/* Search Results */}
          <div className="lg:col-span-3">
            <SearchableHostelList
              hostels={hostels}
              searchQuery={searchQuery}
              onSearchQueryChange={handleNavbarSearch}
              showHeader={false}
              className="space-y-6"
            />
          </div>
        </div>
      </div>

      {/* Advanced Search Modal */}
      <AdvancedSearchModal
        isOpen={showAdvancedSearch}
        onClose={() => setShowAdvancedSearch(false)}
        onSearch={handleAdvancedSearch}
        hostels={hostels}
      />

      {/* Mobile Filters Modal */}
      {showMobileFilters && (
        <div className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-50 flex items-end">
          <div className="bg-white w-full max-h-[80vh] overflow-y-auto rounded-t-lg">
            <div className="p-4 border-b border-gray-200 flex items-center justify-between">
              <h3 className="text-lg font-semibold">Filters</h3>
              <button
                onClick={() => setShowMobileFilters(false)}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <Icon path={ICONS.close} className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4">
              <FiltersSidebar />
            </div>
            <div className="p-4 border-t border-gray-200">
              <button
                onClick={() => setShowMobileFilters(false)}
                className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Main search page component
export default function SearchPage() {
  return (
    <Suspense fallback={<SearchPageSkeleton />}>
      <SearchResultsContent />
    </Suspense>
  );
}
