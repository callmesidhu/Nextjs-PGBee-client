# Search Functionality Implementation Guide

This document explains how the comprehensive search functionality has been implemented in your PG Bee project.

## Overview

The search functionality includes:

- **Enhanced Search Bar** - Matches your exact HTML design
- **Advanced Search Modal** - Detailed filtering options
- **Search Results Page** - Dedicated page for search results
- **Location-based Search** - "Near me" functionality
- **Real-time Suggestions** - Smart autocomplete
- **Filter Integration** - Works seamlessly with existing filters

## Components Created/Updated

### 1. Enhanced SearchBar Component

**File**: `src/components/search/SearchBar.jsx`

- Exact replica of your HTML design
- Includes "Near me" button with geolocation
- Real-time search suggestions
- Responsive design

### 2. Search Results Page

**File**: `src/app/search/page.jsx`

- Dedicated search results page
- Advanced search modal integration
- Mobile-responsive filters
- Loading states and error handling

### 3. Enhanced Search Utilities

**File**: `src/utils/enhancedSearchUtils.js`

- Advanced filtering logic
- Location-based search
- Smart suggestion generation
- Distance calculation for "Near me"

### 4. Updated Search Hook

**File**: `src/hooks/useSearch.js`

- Enhanced with location support
- Better suggestion management
- URL parameter handling

### 5. Searchable Hostel List Component

**File**: `src/components/search/SearchableHostelList.jsx`

- Reusable search results component
- Sorting options
- Load more functionality
- Empty states

### 6. Advanced Search Modal

**File**: `src/components/search/AdvancedSearchModal.jsx`

- Detailed search form
- Multiple filter categories
- Suggestion dropdowns
- Form validation

## Usage Examples

### Basic Search Implementation

```jsx
import { useState } from "react";
import { useSearch } from "@/hooks/useSearch";
import SearchBar from "@/components/search/SearchBar";

function MyComponent({ hostels }) {
  const {
    searchQuery,
    suggestions,
    showSuggestions,
    isLoading,
    handleInputChange,
    handleSearch,
    handleSuggestionClick,
    handleNearMeSearch,
    setShowSuggestions,
  } = useSearch(hostels);

  const handleSearchSubmit = async (query) => {
    const searchTerm = handleSearch(query);
    // Navigate or filter results
    console.log("Searching for:", searchTerm);
  };

  const handleNearMe = async () => {
    const nearMeQuery = await handleNearMeSearch();
    if (nearMeQuery) {
      handleSearchSubmit(nearMeQuery);
    }
  };

  return (
    <SearchBar
      searchQuery={searchQuery}
      suggestions={suggestions}
      showSuggestions={showSuggestions}
      isLoading={isLoading}
      onInputChange={handleInputChange}
      onSearch={handleSearchSubmit}
      onSuggestionClick={(suggestion) => {
        const searchTerm = handleSuggestionClick(suggestion);
        handleSearchSubmit(searchTerm);
      }}
      onNearMeClick={handleNearMe}
      onFocus={() => {
        if (searchQuery.trim()) {
          setShowSuggestions(true);
        }
      }}
      onBlur={() => setShowSuggestions(false)}
      placeholder="Bangalore, India"
    />
  );
}
```

### Search Results with Filters

```jsx
import SearchableHostelList from "@/components/search/SearchableHostelList";
import { useFilters } from "@/contexts/FilterContext";

function SearchResultsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [hostels, setHostels] = useState([]);

  return (
    <div>
      <SearchableHostelList
        hostels={hostels}
        searchQuery={searchQuery}
        onSearchQueryChange={setSearchQuery}
        showHeader={true}
        maxResults={20}
        sortBy="popularity"
      />
    </div>
  );
}
```

### Advanced Search Modal

```jsx
import AdvancedSearchModal from "@/components/search/AdvancedSearchModal";

function MyPage() {
  const [showAdvancedSearch, setShowAdvancedSearch] = useState(false);
  const [hostels, setHostels] = useState([]);

  const handleAdvancedSearch = (query) => {
    console.log("Advanced search:", query);
    // Handle the search results
  };

  return (
    <>
      <button onClick={() => setShowAdvancedSearch(true)}>
        Advanced Search
      </button>

      <AdvancedSearchModal
        isOpen={showAdvancedSearch}
        onClose={() => setShowAdvancedSearch(false)}
        onSearch={handleAdvancedSearch}
        hostels={hostels}
      />
    </>
  );
}
```

## Features

### 1. Smart Suggestions

- Searches across hostel names, locations, amenities, and gender types
- Groups suggestions by type (hostel, location, amenity, gender)
- Limits suggestions for better performance
- Real-time filtering as user types

### 2. Location-based Search

- "Near me" button with geolocation API
- Distance calculation for sorting by proximity
- User-friendly error handling for location permissions
- Fallback to manual search if geolocation fails

### 3. Advanced Filtering

- Price range filtering
- Gender and place type filters
- Amenity multi-select
- Room type and curfew options
- Bathroom attachment preferences
- Caution deposit requirements

### 4. URL State Management

- Search queries are stored in URL parameters
- Direct linking to search results
- Browser back/forward navigation support
- Shareable search URLs

### 5. Mobile Optimization

- Responsive design for all screen sizes
- Mobile-specific filter modals
- Touch-friendly interactions
- Optimized for mobile performance

## Integration with Existing Code

### Navbar Integration

The Navbar component has been updated to support the new search functionality:

```jsx
<Navbar
  hostels={hostels}
  onSearch={handleNavbarSearch}
  initialSearchQuery={searchQuery}
/>
```

### Filter Context Integration

Works seamlessly with your existing FilterContext:

```jsx
import { useFilters } from "@/contexts/FilterContext";
import { applySearchAndFilters } from "@/utils/enhancedSearchUtils";

const { filters } = useFilters();
const filteredData = applySearchAndFilters(hostels, searchQuery, filters);
```

## Navigation Routes

### Search Page

- **Route**: `/search`
- **URL Parameters**: `?search=query`
- **Example**: `/search?search=bangalore%20boys%20hostel`

### Main Page with Search

- **Route**: `/`
- **URL Parameters**: `?search=query`
- **Example**: `/?search=koramangala`

## Performance Optimizations

1. **Debounced Search**: Input changes are debounced to prevent excessive API calls
2. **Memoized Suggestions**: Suggestions are generated once and cached
3. **Lazy Loading**: Components load only when needed
4. **Virtual Scrolling**: For large result sets (can be implemented)
5. **Image Lazy Loading**: Images load as user scrolls

## SEO Considerations

1. **Server-side Rendering**: Search results are SSR-friendly
2. **Meta Tags**: Dynamic meta tags based on search query
3. **Structured Data**: JSON-LD for better search engine understanding
4. **URL Structure**: Clean, semantic URLs for search results

## Future Enhancements

1. **Search Analytics**: Track popular searches and user behavior
2. **Saved Searches**: Allow users to save and retrieve searches
3. **Search History**: Recent searches functionality
4. **Voice Search**: Voice input for search queries
5. **Image Search**: Search by uploading room images
6. **Map Integration**: Visual search on a map interface

## Testing

The components include proper loading states, error handling, and edge cases:

- Empty search results
- Network errors
- Geolocation permission denied
- Invalid search inputs
- Large result sets
- Mobile device testing

## Browser Support

- Modern browsers (Chrome, Firefox, Safari, Edge)
- Mobile browsers (iOS Safari, Chrome Mobile)
- Graceful degradation for older browsers
- Progressive Web App compatible
