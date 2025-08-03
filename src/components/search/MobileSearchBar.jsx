"use client";

import { useState, useRef } from "react";
import { Icon, ICONS } from "@/components/dashboard/Icons";

const MobileSearchBar = ({
  onSearch,
  searchQuery,
  suggestions = [],
  showSuggestions,
  onInputChange,
  onSuggestionClick,
  onFocus,
  onBlur,
  onNearMeClick,
  placeholder = "Search locations, hostels...",
  className = "",
  isLoading = false,
}) => {
  const [location, setLocation] = useState(searchQuery);
  const inputRef = useRef(null);

  const handleInputChange = (e) => {
    const value = e.target.value;
    setLocation(value);
    onInputChange?.(value);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      onSearch?.(location);
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

  return (
    <div className={`sm:hidden relative ${className}`}>
      <div className="p-4 bg-white border-b">
        <div className="relative">
          <input
            ref={inputRef}
            type="text"
            value={location}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
            onBlur={() => {
              setTimeout(() => onBlur?.(), 200);
            }}
            onFocus={onFocus}
            placeholder={placeholder}
            className="w-full px-4 py-3 pr-20 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />

          {location && (
            <button
              onClick={handleClear}
              className="absolute right-16 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              type="button"
            >
              <Icon path={ICONS.close} className="w-4 h-4" />
            </button>
          )}

          <button
            onClick={handleNearMe}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
            type="button"
            aria-label="Near me"
          >
            <Icon path={ICONS.nearMe} className="w-4 h-4 text-gray-600" />
          </button>
        </div>

        <button
          onClick={() => onSearch?.(location)}
          disabled={isLoading}
          className="w-full mt-3 px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          type="button"
        >
          {isLoading ? "Searching..." : "Search"}
        </button>
      </div>

      {/* Mobile Search Suggestions */}
      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute top-full left-0 right-0 bg-white border-l border-r border-b border-gray-300 shadow-lg z-50 max-h-60 overflow-y-auto">
          {suggestions.map((suggestion, index) => (
            <div
              key={`${suggestion.type}-${suggestion.text}-${index}`}
              onMouseDown={(e) => {
                e.preventDefault();
                handleSuggestionSelect(suggestion);
              }}
              className="px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0 flex items-center gap-3"
            >
              {getSuggestionIcon(suggestion.type)}
              <div className="flex flex-col flex-1">
                <span className="text-sm text-gray-700 font-medium">
                  {suggestion.text}
                </span>
                <span className="text-xs text-gray-400 capitalize">
                  {suggestion.type}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MobileSearchBar;
