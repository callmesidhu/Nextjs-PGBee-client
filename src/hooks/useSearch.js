"use client";

import { useState, useEffect, useMemo } from "react";
import {
  generateSearchSuggestions,
  filterSuggestions,
  getCurrentLocation,
  sortByDistance,
} from "@/utils/searchUtils";

export const useSearch = (data = []) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [userLocation, setUserLocation] = useState(null);

  // Generate all possible suggestions from data
  const allSuggestions = useMemo(() => {
    return generateSearchSuggestions(data);
  }, [data]);

  // Initialize with URL search params if available
  useEffect(() => {
    if (typeof window !== "undefined") {
      const urlParams = new URLSearchParams(window.location.search);
      const searchParam = urlParams.get("search");
      if (searchParam) {
        setSearchQuery(searchParam);
      }
    }
  }, []);

  const handleSearch = (query) => {
    const searchTerm = query !== undefined ? query : searchQuery;

    if (query === "") {
      setSearchQuery("");
      setShowSuggestions(false);
      return "";
    }

    if (!searchTerm.trim()) {
      return searchTerm;
    }

    setSearchQuery(searchTerm);
    setShowSuggestions(false);
    return searchTerm;
  };

  const handleInputChange = (value) => {
    setSearchQuery(value);

    if (value.trim().length > 0) {
      const filtered = filterSuggestions(allSuggestions, value);
      setSuggestions(filtered);
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setSearchQuery(suggestion.text);
    setShowSuggestions(false);
    return suggestion.text;
  };

  const handleNearMeSearch = async () => {
    setIsLoading(true);

    try {
      const location = await getCurrentLocation();
      setUserLocation(location);

      // Set search query to "Near me" for display
      const nearMeQuery = "Near me";
      setSearchQuery(nearMeQuery);
      setShowSuggestions(false);

      setIsLoading(false);
      return nearMeQuery;
    } catch (error) {
      console.error("Error getting location:", error);
      setIsLoading(false);

      // Show user-friendly error messages
      if (error.code === 1) {
        alert(
          "Location access denied. Please enable location services and try again."
        );
      } else if (error.code === 2) {
        alert("Location not available. Please try again later.");
      } else if (error.code === 3) {
        alert("Location request timed out. Please try again.");
      } else {
        alert("Unable to get your location. Please search manually.");
      }

      return null;
    }
  };

  const sortDataByDistance = (dataToSort) => {
    if (userLocation && userLocation.latitude && userLocation.longitude) {
      return sortByDistance(
        dataToSort,
        userLocation.latitude,
        userLocation.longitude
      );
    }
    return dataToSort;
  };

  const clearSearch = () => {
    setSearchQuery("");
    setSuggestions([]);
    setShowSuggestions(false);
    setUserLocation(null);
  };

  return {
    searchQuery,
    setSearchQuery,
    suggestions,
    setSuggestions,
    showSuggestions,
    setShowSuggestions,
    isLoading,
    setIsLoading,
    userLocation,
    allSuggestions,
    handleSearch,
    handleInputChange,
    handleSuggestionClick,
    handleNearMeSearch,
    sortDataByDistance,
    clearSearch,
  };
};
