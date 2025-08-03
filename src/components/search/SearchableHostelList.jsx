"use client";

import { useState, useEffect } from "react";
import { useFilters } from "@/contexts/FilterContext";
import { applySearchAndFilters, sortData } from "@/utils/searchUtils";
import HostelCard from "@/components/dashboard/HostelCard";
import { Icon, ICONS } from "@/components/dashboard/Icons";

const SearchableHostelList = ({
  hostels = [],
  searchQuery = "",
  onSearchQueryChange,
  className = "",
  showHeader = true,
  maxResults = null,
  sortBy = "popularity",
}) => {
  const { filters } = useFilters();
  const [filteredData, setFilteredData] = useState([]);
  const [displayCount, setDisplayCount] = useState(maxResults || 12);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);

    // Apply search and filters
    const filtered = applySearchAndFilters(hostels, searchQuery, filters);

    // Apply sorting
    const sorted = sortData(filtered, sortBy);

    setFilteredData(sorted);
    setIsLoading(false);
  }, [hostels, searchQuery, filters, sortBy]);

  const handleLoadMore = () => {
    setDisplayCount((prev) => prev + 12);
  };

  const clearSearch = () => {
    if (onSearchQueryChange) {
      onSearchQueryChange("");
    }
  };

  const displayedData = maxResults
    ? filteredData.slice(0, displayCount)
    : filteredData;
  const hasMore = filteredData.length > displayCount;

  if (isLoading) {
    return (
      <div className={`space-y-6 ${className}`}>
        {[1, 2, 3].map((i) => (
          <div key={i} className="animate-pulse">
            <div className="h-64 bg-gray-200 rounded-lg"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className={className}>
      {/* Search Results Header */}
      {showHeader && (
        <div className="mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                {searchQuery
                  ? `Search results for "${searchQuery}"`
                  : "All Hostels & PGs"}
              </h1>
              <p className="text-gray-600">
                {filteredData.length === 0
                  ? "No results found"
                  : `${filteredData.length} ${
                      filteredData.length === 1 ? "result" : "results"
                    } found`}
                {searchQuery && (
                  <button
                    onClick={clearSearch}
                    className="ml-3 text-blue-600 hover:text-blue-800 text-sm font-medium"
                  >
                    Clear search
                  </button>
                )}
              </p>
            </div>

            {/* Sort Options */}
            {filteredData.length > 0 && (
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium text-gray-700">
                  Sort by:
                </label>
                <select
                  className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={sortBy}
                  onChange={(e) => {
                    // This would need to be passed as a prop if sorting should be controlled externally
                    console.log("Sort changed to:", e.target.value);
                  }}
                >
                  <option value="popularity">Popularity</option>
                  <option value="price: low to high">Price: Low to High</option>
                  <option value="price: high to low">Price: High to Low</option>
                  <option value="rating">Rating</option>
                  <option value="most reviewed">Most Reviewed</option>
                  <option value="newest">Newest</option>
                </select>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Search Results */}
      {filteredData.length === 0 ? (
        <div className="text-center py-16">
          <div className="mb-6">
            <svg
              className="mx-auto h-16 w-16 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            No results found
          </h3>
          <p className="text-gray-500 mb-6 max-w-md mx-auto">
            {searchQuery
              ? `We couldn't find any hostels or PGs matching "${searchQuery}".`
              : "No hostels or PGs match your current filters."}
          </p>
          <div className="space-y-3 text-sm text-gray-600">
            <p className="font-medium">Try adjusting your search by:</p>
            <ul className="list-disc list-inside space-y-1 text-left max-w-sm mx-auto">
              <li>Using different keywords</li>
              <li>Checking your spelling</li>
              <li>Removing some filters</li>
              <li>Searching for a nearby location</li>
              <li>Using broader search terms</li>
            </ul>
          </div>
        </div>
      ) : (
        <>
          {/* Results Grid */}
          <div className="space-y-6">
            {displayedData.map((hostel, index) => (
              <HostelCard
                key={hostel.id || `hostel-${index}`}
                hostel={hostel}
              />
            ))}
          </div>

          {/* Load More Button */}
          {hasMore && (
            <div className="text-center mt-8">
              <button
                onClick={handleLoadMore}
                className="px-8 py-3 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors font-medium"
              >
                Load More ({filteredData.length - displayCount} remaining)
              </button>
            </div>
          )}

          {/* Results Summary */}
          {!hasMore && maxResults && filteredData.length > maxResults && (
            <div className="text-center mt-8 p-4 bg-gray-100 rounded-lg">
              <p className="text-gray-600">
                Showing all {filteredData.length} results
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default SearchableHostelList;
