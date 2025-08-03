"use client";

import React, { useState, useEffect } from "react";
import Data from "@/components/dashboard/Data";
import Footer from "@/components/common/Footer";
import Header from "@/components/common/Navbar";
import HostelCard from "@/components/dashboard/HostelCard";
import { Icon, ICONS } from "@/components/dashboard/Icons";
import MobileSidebar from "@/components/dashboard/MobileBar";
import FiltersSidebar from "@/components/dashboard/SideBar";
import ActiveFilters from "@/components/dashboard/ActiveFilters";
import { FilterProvider, useFilters } from "@/contexts/FilterContext";
import { applySearchAndFilters } from "@/utils/searchUtils";

function AppContent() {
  const [showFilters, setShowFilters] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [hostels, setHostels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredHostels, setFilteredHostels] = useState([]);
  const { filterHostels, filters } = useFilters();

  useEffect(() => {
    const fetchHostels = async () => {
      try {
        const result = await Data();
        console.log("✅ Fetched accommodations:", result);
        setHostels(result);
      } catch (error) {
        console.error("❌ Failed to load accommodations:", error);
        // Set some mock data or empty array if API fails
        setHostels([]);
      } finally {
        setLoading(false);
      }
    };

    fetchHostels();
  }, []);

  // Get search query from URL params
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const search = urlParams.get("search");
    if (search) {
      setSearchQuery(search);
    }
  }, []);

  // Update filtered hostels whenever hostels, searchQuery, or filters change
  useEffect(() => {
    console.log("🔄 Updating filtered hostels:", {
      searchQuery,
      hostelsCount: hostels.length,
      filtersActive: Object.keys(filters).some(
        (key) =>
          filters[key] !== "Any" &&
          filters[key] !== "" &&
          filters[key] !== 1000 &&
          filters[key] !== 15000 &&
          (!Array.isArray(filters[key]) || filters[key].length > 0)
      ),
    }); // Debug log

    const getFilteredHostels = () => {
      // First apply context filters
      const contextFiltered = filterHostels(hostels);

      // Then apply search query if it exists
      if (searchQuery.trim()) {
        const searchFiltered = applySearchAndFilters(
          contextFiltered,
          searchQuery,
          filters
        );
        console.log("🎯 Search filtered results:", searchFiltered.length); // Debug log
        return searchFiltered;
      }

      console.log("📋 Context filtered results:", contextFiltered.length); // Debug log
      return contextFiltered;
    };

    setFilteredHostels(getFilteredHostels());
  }, [hostels, searchQuery, filters, filterHostels]);

  // Handle search from navbar - only on explicit search action (not real-time)
  const handleNavbarSearch = (query) => {
    console.log("🔍 Search initiated:", query); // Debug log
    setSearchQuery(query || "");

    // Update URL without navigating
    const url = new URL(window.location);
    if (query && query.trim()) {
      url.searchParams.set("search", query);
    } else {
      url.searchParams.delete("search");
    }
    window.history.pushState({}, "", url);
  };

  // Dynamic title based on place type filter and search
  const getDisplayTitle = () => {
    let title = "";

    if (filters.placeType === "PG") {
      title = "PGs";
    } else if (filters.placeType === "Hostel") {
      title = "Hostels";
    } else {
      title = "Accommodations (Hostels & PGs)";
    }

    if (searchQuery.trim()) {
      title += ` for "${searchQuery}"`;
    }

    return title;
  };

  return (
    <div className="bg-gray-50 min-h-screen font-sans flex flex-col">
      <Header
        onMenuClick={() => setIsMenuOpen(!isMenuOpen)}
        hostels={hostels}
        onSearch={handleNavbarSearch}
        initialSearchQuery={searchQuery}
        showSearch={true}
      />
      <MobileSidebar isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />

      <main className="flex-grow container mx-auto py-8 px-2 sm:px-4 lg:px-6">
        {/* Mobile Filter Button */}
        <div className="lg:hidden mb-4">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            <Icon path={ICONS.filter} className="w-5 h-5 mr-2 -ml-1" />
            {showFilters ? "Hide Filters" : "Show Filters"}
          </button>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar */}
          <div
            className={`${
              showFilters ? "block" : "hidden"
            } lg:block w-full lg:w-1/4 xl:w-64`}
          >
            <FiltersSidebar />
          </div>

          {/* Main content */}
          <div className="w-full lg:flex-1">
            <ActiveFilters />

            {/* Search Results Info */}
            {searchQuery.trim() && (
              <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-blue-800 text-sm">
                  <strong>Search results for:</strong> "{searchQuery}"
                  <button
                    onClick={() => {
                      setSearchQuery("");
                      const url = new URL(window.location);
                      url.searchParams.delete("search");
                      window.history.pushState({}, "", url);
                    }}
                    className="ml-2 text-blue-600 hover:text-blue-800 underline"
                  >
                    Clear search
                  </button>
                </p>
              </div>
            )}

            <h2 className="text-lg font-semibold text-gray-700 mb-4">
              {getDisplayTitle()} in College Of Engineering, Trivandrum (
              {filteredHostels.length} search results)
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
                <p className="text-gray-500 text-lg">
                  {searchQuery.trim()
                    ? "No results found for your search."
                    : "Loading...."}
                </p>
                {searchQuery.trim() && (
                  <p className="text-gray-400 mt-2">
                    Try adjusting your search terms or clearing filters.
                  </p>
                )}
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
