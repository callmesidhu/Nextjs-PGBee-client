"use client";

import { useState, useEffect, useRef } from "react";
import { Icon, ICONS } from "@/components/dashboard/Icons";

const SearchBar = ({
  onSearch,
  searchQuery,
  suggestions = [],
  showSuggestions,
  onInputChange,
  onSuggestionClick,
  onFocus,
  onBlur,
  onNearMeClick,
  placeholder = "Bangalore, India",
  className = "",
  isLoading = false,
}) => {
  const [location, setLocation] = useState(searchQuery);
  const inputRef = useRef(null);
  const suggestionsRef = useRef(null);

  useEffect(() => {
    setLocation(searchQuery);
  }, [searchQuery]);

  const handleInputChange = (e) => {
    const value = e.target.value;
    setLocation(value);
    onInputChange?.(value);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      onSearch?.(location);
    } else if (e.key === "Escape") {
      onBlur?.();
    }
  };

  const handleSuggestionSelect = (suggestion) => {
    setLocation(suggestion.text);
    const searchTerm = onSuggestionClick?.(suggestion);
    onSearch?.(searchTerm);
  };

  const handleClear = () => {
    setLocation("");
    onSearch?.("");
  };

  const handleSearchClick = () => {
    onSearch?.(location);
  };

  const handleNearMe = () => {
    if (navigator.geolocation) {
      onNearMeClick?.();
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  };

  const getSuggestionIcon = (type) => {
    switch (type) {
      case "hostel":
        return <Icon path={ICONS.search} className="w-4 h-4 text-blue-500" />;
      case "location":
        return <Icon path={ICONS.mapPin} className="w-4 h-4 text-green-500" />;
      case "amenity":
        return <Icon path={ICONS.star} className="w-4 h-4 text-orange-500" />;
      case "gender":
        return <Icon path={ICONS.user} className="w-4 h-4 text-purple-500" />;
      default:
        return <Icon path={ICONS.search} className="w-4 h-4 text-gray-500" />;
    }
  };

  const getSuggestionTypeLabel = (type) => {
    switch (type) {
      case "hostel":
        return "Hostel";
      case "location":
        return "Location";
      case "amenity":
        return "Amenity";
      case "gender":
        return "Type";
      default:
        return "";
    }
  };

  return (
    <div className={`relative ${className}`}>
      {/* Desktop Search Bar - Exact match to your HTML */}
      <div className="max-w-xl mx-4 hidden sm:flex items-center border rounded-full shadow-sm bg-white">
        <div className="relative flex-1">
          <input
            ref={inputRef}
            type="text"
            value={location}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
            onBlur={() => {
              // Delay blur to allow suggestion clicks
              setTimeout(() => onBlur?.(), 200);
            }}
            onFocus={onFocus}
            placeholder={placeholder}
            className="w-full py-2 pl-3 pr-4 lg:px-4 rounded-l-full focus:outline-none"
          />

          {location && (
            <button
              onClick={handleClear}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 z-10"
              type="button"
            >
              <Icon path={ICONS.close} className="w-4 h-4" />
            </button>
          )}
        </div>

        <button
          onClick={handleNearMe}
          disabled={isLoading}
          className="flex items-center bg-gray-100 text-gray-600 px-4 py-1.5 rounded-full mx-2 whitespace-nowrap text-sm hover:bg-gray-200 transition-colors disabled:opacity-50"
          type="button"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="w-4 h-4 mr-1"
          >
            <path d="M12 8c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm8.94 3c-.46-4.17-3.77-7.48-7.94-7.94V1h-2v2.06C6.83 3.52 3.52 6.83 3.06 11H1v2h2.06c.46 4.17 3.77 7.48 7.94 7.94V23h2v-2.06c4.17-.46 7.48-3.77 7.94-7.94H23v-2h-2.06zM12 19c-3.87 0-7-3.13-7-7s3.13-7 7-7 7 3.13 7 7-3.13 7-7 7z" />
          </svg>
          {isLoading && onNearMeClick ? "Finding..." : "Near me"}
        </button>

        <button
          onClick={handleSearchClick}
          disabled={isLoading && !onNearMeClick}
          className="px-6 py-2 bg-gray-800 text-white rounded-2xl hover:bg-gray-700 font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          type="button"
        >
          {isLoading && !onNearMeClick ? "Searching..." : "Search"}
        </button>
      </div>

      {/* Search Suggestions Dropdown */}
      {showSuggestions && suggestions.length > 0 && (
        <div
          ref={suggestionsRef}
          className="absolute top-full left-4 right-4 bg-white border border-gray-300 rounded-lg shadow-lg mt-1 z-50 max-h-80 overflow-y-auto"
        >
          {suggestions.map((suggestion, index) => (
            <div
              key={`${suggestion.type}-${suggestion.text}-${index}`}
              onMouseDown={(e) => {
                e.preventDefault();
                handleSuggestionSelect(suggestion);
              }}
              className="px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0 flex items-center gap-3 transition-colors"
            >
              {getSuggestionIcon(suggestion.type)}
              <div className="flex flex-col flex-1">
                <span className="text-sm text-gray-700 font-medium">
                  {suggestion.text}
                </span>
                <span className="text-xs text-gray-400 capitalize">
                  {getSuggestionTypeLabel(suggestion.type)}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
