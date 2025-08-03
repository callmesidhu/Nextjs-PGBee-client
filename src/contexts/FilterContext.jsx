"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

const FilterContext = createContext();

export const useFilters = () => {
  const context = useContext(FilterContext);
  if (!context) {
    throw new Error("useFilters must be used within a FilterProvider");
  }
  return context;
};

export const FilterProvider = ({ children }) => {
  const [isMounted, setIsMounted] = useState(false);
  const [filters, setFilters] = useState({
    minPrice: 1000,
    maxPrice: 15000,
    gender: "Any", // 'Any', 'Boys', 'Girls'
    placeType: "Any", // 'Any', 'Hostel', 'PG'
    hostelType: "Any", // 'Any', 'Budget', 'Premium', 'Luxury', 'Co-living'
    rooms: "Any",
    bathrooms: "Any",
    selectedAmenities: [],
    curfew: "Any", // 'Any', 'Yes', 'No'
    roomType: "Any", // 'Any', 'Single', 'Shared'
    bathroomAttachment: "Any", // 'Any', 'Attached', 'Not Attached'
    cautionDeposit: "Any", // 'Any', 'Yes', 'No'
  });

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const updateFilter = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const updateFilters = (newFilters) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  };

  const clearAllFilters = () => {
    setFilters({
      minPrice: 1000,
      maxPrice: 15000,
      gender: "Any",
      placeType: "Any",
      hostelType: "Any",
      rooms: "Any",
      bathrooms: "Any",
      selectedAmenities: [],
      curfew: "Any",
      roomType: "Any",
      bathroomAttachment: "Any",
      cautionDeposit: "Any",
    });
  };

  const filterHostels = (hostels) => {
    if (!isMounted) return hostels; // Return unfiltered data during SSR

    return hostels.filter((hostel) => {
      // Price filter
      const priceMatch =
        hostel.price >= filters.minPrice && hostel.price <= filters.maxPrice;

      // Gender filter - Enhanced matching for all possible database values
      const genderMatch =
        filters.gender === "Any" ||
        (filters.gender === "Boys" &&
          (hostel.sex === "Male" ||
            hostel.sex === "Boys" ||
            hostel.sex === "male" ||
            hostel.sex === "boys" ||
            hostel.sex === "Men" ||
            hostel.sex === "men")) ||
        (filters.gender === "Girls" &&
          (hostel.sex === "Female" ||
            hostel.sex === "Girls" ||
            hostel.sex === "female" ||
            hostel.sex === "girls" ||
            hostel.sex === "Women" ||
            hostel.sex === "women"));

      // Place type filter (if needed in future)
      const placeTypeMatch =
        filters.placeType === "Any" ||
        (hostel.placeType &&
          hostel.placeType.toLowerCase() === filters.placeType.toLowerCase());

      // Hostel type filter
      const hostelTypeMatch =
        filters.hostelType === "Any" ||
        (hostel.hostelType &&
          hostel.hostelType.toLowerCase() === filters.hostelType.toLowerCase());

      // Amenities filter
      const amenitiesMatch =
        filters.selectedAmenities.length === 0 ||
        filters.selectedAmenities.every(
          (amenity) =>
            hostel.amenities &&
            hostel.amenities.some((hostelAmenity) =>
              hostelAmenity.toLowerCase().includes(amenity.toLowerCase())
            )
        );

      return (
        priceMatch &&
        genderMatch &&
        placeTypeMatch &&
        hostelTypeMatch &&
        amenitiesMatch
      );
    });
  };

  const getActiveFiltersCount = () => {
    if (!isMounted) return 0; // Return 0 during SSR

    let count = 0;
    if (filters.gender !== "Any") count++;
    if (filters.placeType !== "Any") count++;
    if (filters.hostelType !== "Any") count++;
    if (filters.minPrice !== 1000 || filters.maxPrice !== 15000) count++;
    if (filters.rooms !== "Any") count++;
    if (filters.bathrooms !== "Any") count++;
    if (filters.selectedAmenities.length > 0) count++;
    if (filters.curfew !== "Any") count++;
    if (filters.roomType !== "Any") count++;
    if (filters.bathroomAttachment !== "Any") count++;
    if (filters.cautionDeposit !== "Any") count++;
    return count;
  };

  return (
    <FilterContext.Provider
      value={{
        filters,
        updateFilter,
        updateFilters,
        clearAllFilters,
        filterHostels,
        getActiveFiltersCount,
        isMounted,
      }}
    >
      {children}
    </FilterContext.Provider>
  );
};
