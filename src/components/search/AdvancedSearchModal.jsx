"use client";

import { useState, useEffect } from "react";
import { Icon, ICONS } from "@/components/dashboard/Icons";
import { useFilters } from "@/contexts/FilterContext";

const AdvancedSearchModal = ({ isOpen, onClose, onSearch, hostels = [] }) => {
  const { filters, updateFilter } = useFilters();
  const [searchForm, setSearchForm] = useState({
    location: "",
    hostelName: "",
    priceMin: "",
    priceMax: "",
    gender: "",
    placeType: "",
    amenities: [],
    roomType: "",
    curfew: "",
  });

  const [suggestions, setSuggestions] = useState({
    locations: [],
    hostelNames: [],
    amenities: [],
  });

  useEffect(() => {
    if (hostels.length > 0) {
      // Generate suggestions from data
      const locations = [
        ...new Set(hostels.map((h) => h.location || h.address).filter(Boolean)),
      ];
      const hostelNames = hostels
        .map((h) => h.hostelName || h.name)
        .filter(Boolean);
      const amenities = [...new Set(hostels.flatMap((h) => h.amenities || []))];

      setSuggestions({ locations, hostelNames, amenities });
    }
  }, [hostels]);

  const handleInputChange = (field, value) => {
    setSearchForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleAmenityToggle = (amenity) => {
    setSearchForm((prev) => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter((a) => a !== amenity)
        : [...prev.amenities, amenity],
    }));
  };

  const handleSearch = () => {
    // Build search query from form
    const searchParts = [];

    if (searchForm.location) searchParts.push(searchForm.location);
    if (searchForm.hostelName) searchParts.push(searchForm.hostelName);
    if (searchForm.amenities.length > 0)
      searchParts.push(...searchForm.amenities);

    const searchQuery = searchParts.join(" ");

    // Update filters
    const newFilters = {};
    if (searchForm.priceMin)
      newFilters.minPrice = parseInt(searchForm.priceMin);
    if (searchForm.priceMax)
      newFilters.maxPrice = parseInt(searchForm.priceMax);
    if (searchForm.gender) newFilters.gender = searchForm.gender;
    if (searchForm.placeType) newFilters.placeType = searchForm.placeType;
    if (searchForm.roomType) newFilters.roomType = searchForm.roomType;
    if (searchForm.curfew) newFilters.curfew = searchForm.curfew;
    if (searchForm.amenities.length > 0)
      newFilters.selectedAmenities = searchForm.amenities;

    // Apply filters
    Object.keys(newFilters).forEach((key) => {
      updateFilter(key, newFilters[key]);
    });

    // Trigger search
    onSearch(searchQuery);
    onClose();
  };

  const handleClear = () => {
    setSearchForm({
      location: "",
      hostelName: "",
      priceMin: "",
      priceMax: "",
      gender: "",
      placeType: "",
      amenities: [],
      roomType: "",
      curfew: "",
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">
              Advanced Search
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <Icon path={ICONS.close} className="w-6 h-6" />
            </button>
          </div>
          <p className="text-gray-600 mt-2">
            Find exactly what you're looking for with detailed filters
          </p>
        </div>

        {/* Search Form */}
        <div className="p-6 space-y-6">
          {/* Location and Hostel Name */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Location
              </label>
              <input
                type="text"
                value={searchForm.location}
                onChange={(e) => handleInputChange("location", e.target.value)}
                placeholder="e.g., Bangalore, Koramangala"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                list="locations"
              />
              <datalist id="locations">
                {suggestions.locations.map((loc, index) => (
                  <option key={index} value={loc} />
                ))}
              </datalist>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Hostel/PG Name
              </label>
              <input
                type="text"
                value={searchForm.hostelName}
                onChange={(e) =>
                  handleInputChange("hostelName", e.target.value)
                }
                placeholder="e.g., Zolo, Stanza Living"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                list="hostelNames"
              />
              <datalist id="hostelNames">
                {suggestions.hostelNames.map((name, index) => (
                  <option key={index} value={name} />
                ))}
              </datalist>
            </div>
          </div>

          {/* Price Range */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Price Range (₹ per month)
            </label>
            <div className="grid grid-cols-2 gap-4">
              <input
                type="number"
                value={searchForm.priceMin}
                onChange={(e) => handleInputChange("priceMin", e.target.value)}
                placeholder="Min price"
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="number"
                value={searchForm.priceMax}
                onChange={(e) => handleInputChange("priceMax", e.target.value)}
                placeholder="Max price"
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Gender and Place Type */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Gender Preference
              </label>
              <select
                value={searchForm.gender}
                onChange={(e) => handleInputChange("gender", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Any</option>
                <option value="Boys">Boys</option>
                <option value="Girls">Girls</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Place Type
              </label>
              <select
                value={searchForm.placeType}
                onChange={(e) => handleInputChange("placeType", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Any</option>
                <option value="Hostel">Hostel</option>
                <option value="PG">PG</option>
              </select>
            </div>
          </div>

          {/* Room Type and Curfew */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Room Type
              </label>
              <select
                value={searchForm.roomType}
                onChange={(e) => handleInputChange("roomType", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Any</option>
                <option value="Single">Single</option>
                <option value="Shared">Shared</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Curfew
              </label>
              <select
                value={searchForm.curfew}
                onChange={(e) => handleInputChange("curfew", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Any</option>
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </select>
            </div>
          </div>

          {/* Amenities */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Amenities
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 max-h-48 overflow-y-auto border border-gray-200 rounded-md p-3">
              {suggestions.amenities.map((amenity, index) => (
                <label
                  key={index}
                  className="flex items-center space-x-2 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={searchForm.amenities.includes(amenity)}
                    onChange={() => handleAmenityToggle(amenity)}
                    className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">{amenity}</span>
                </label>
              ))}
            </div>
            {searchForm.amenities.length > 0 && (
              <p className="text-xs text-blue-600 mt-2">
                {searchForm.amenities.length} amenity(ies) selected
              </p>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 bg-gray-50">
          <div className="flex flex-col sm:flex-row gap-3 sm:justify-end">
            <button
              onClick={handleClear}
              className="px-6 py-2 text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
            >
              Clear All
            </button>
            <button
              onClick={onClose}
              className="px-6 py-2 text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSearch}
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-medium"
            >
              Search
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdvancedSearchModal;
