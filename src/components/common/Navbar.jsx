import { Icon, ICONS } from "@/components/dashboard/Icons";
import { useWishlist } from "@/contexts/WishlistContext";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { useState, useEffect, useCallback } from "react";
import NoSSR from "../NoSSR";
import SearchBar from "@/components/search/SearchBar";
import MobileSearchBar from "@/components/search/MobileSearchBar";
import { useSearch } from "@/hooks/useSearch";

const Navbar = ({
  onMenuClick,
  hostels = [],
  onSearch,
  initialSearchQuery = "",
  showSearch = true, // New prop to control search visibility
}) => {
  const router = useRouter();
  const { getTotalItemsCount } = useWishlist();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Search functionality
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
    setSearchQuery,
  } = useSearch(hostels);

  // Set initial search query if provided
  useEffect(() => {
    if (initialSearchQuery && initialSearchQuery !== searchQuery) {
      setSearchQuery(initialSearchQuery);
    }
  }, [initialSearchQuery, setSearchQuery, searchQuery]);

  useEffect(() => {
    const token = Cookies.get("accessToken");
    setIsAuthenticated(!!token);
  }, []);

  const handleLogout = () => {
    Cookies.remove("accessToken");
    Cookies.remove("refreshToken");
    setIsAuthenticated(false);
    window.location.reload();
  };

  const handleLoginSignup = () => {
    router.push("/auth/signup");
  };

  const handleWishlistClick = () => {
    const token = Cookies.get("accessToken");
    if (!token) {
      router.push("/auth/signup");
    } else {
      router.push("/wishlist");
    }
  };

  const handleSearchSubmit = (query) => {
    console.log("🔍 Navbar search submit:", query); // Debug log
    const searchTerm = handleSearch(query);

    if (onSearch) {
      // If parent component provides search handler, use it
      onSearch(searchTerm);
    } else if (searchTerm && searchTerm.trim()) {
      // Otherwise, navigate to search page
      const searchParams = new URLSearchParams();
      searchParams.set("search", searchTerm.trim());
      router.push(`/search?${searchParams.toString()}`);
    } else {
      // If empty search, go to main page or clear search
      onSearch && onSearch("");
    }
  };

  const handleNearMeClick = async () => {
    const nearMeQuery = await handleNearMeSearch();

    if (nearMeQuery) {
      if (onSearch) {
        onSearch(nearMeQuery);
      } else {
        const searchParams = new URLSearchParams();
        searchParams.set("search", nearMeQuery);
        router.push(`/search?${searchParams.toString()}`);
      }
    }
  };

  return (
    <nav className="bg-white shadow-sm py-5 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo */}
        <div className="flex items-center">
          <h1 className="text-3xl font-bold text-gray-800">
            <img src="/images/logo.png" alt="PgBee Logo" className="h-8" />
          </h1>
        </div>

        {/* Search Bar - Only show if showSearch is true */}
        {showSearch && (
          <SearchBar
            searchQuery={searchQuery}
            suggestions={suggestions}
            showSuggestions={showSuggestions}
            onInputChange={handleInputChange}
            onSearch={(searchTerm) => {
              handleSearchSubmit(searchTerm);
              if (onSearch) {
                onSearch(searchTerm);
              }
            }}
            onSuggestionClick={(suggestion) => {
              const searchTerm = handleSuggestionClick(suggestion);
              handleSearchSubmit(searchTerm);
              if (onSearch) {
                onSearch(searchTerm);
              }
            }}
            onFocus={() => {
              if (searchQuery.trim()) {
                setShowSuggestions(true);
              }
            }}
            onBlur={() => setShowSuggestions(false)}
            onNearMeClick={handleNearMeClick}
            isLoading={isLoading}
            placeholder="Bangalore, India"
          />
        )}

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center space-x-4 text-sm font-medium text-gray-600">
          <a href="#" className="flex items-center hover:text-gray-900">
            <Icon path={ICONS.globe} className="w-5 h-5 mr-1" />
            <span>EN</span>
          </a>
          <a href="#" className="flex items-center hover:text-gray-900">
            <Icon path={ICONS.rupee} className="w-5 h-5 mr-1" />
            <span>INR</span>
          </a>
          {/* Wishlist temporarily commented out */}
          {/* <button
            onClick={handleWishlistClick}
            className="flex items-center hover:text-gray-900 relative"
          >
            <Icon path={ICONS.heart} className="w-5 h-5 mr-1" />
            <span>Wishlist</span>
            {isAuthenticated && getTotalItemsCount() > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {getTotalItemsCount()}
              </span>
            )}
          </button> */}
          {/* Auth section */}
          <NoSSR>
            {isAuthenticated ? (
              <button
                className="p-5 flex items-center cursor-pointer"
                onClick={handleLogout}
              >
                <Icon path={ICONS.user} className="w-5 h-5 mr-1" />
                <span>Logout</span>
              </button>
            ) : (
              <button
                className="p-5 flex items-center cursor-pointer"
                onClick={handleLoginSignup}
              >
                <Icon path={ICONS.user} className="w-5 h-5 mr-1" />
                <span>Login/Signup</span>
              </button>
            )}
          </NoSSR>
        </nav>

        {/* Mobile Search Bar - Only show if showSearch is true */}
        {showSearch && (
          <MobileSearchBar
            searchQuery={searchQuery}
            suggestions={suggestions}
            showSuggestions={showSuggestions}
            onInputChange={handleInputChange}
            onSearch={(searchTerm) => {
              handleSearchSubmit(searchTerm);
              if (onSearch) {
                onSearch(searchTerm);
              }
            }}
            onSuggestionClick={(suggestion) => {
              const searchTerm = handleSuggestionClick(suggestion);
              handleSearchSubmit(searchTerm);
              if (onSearch) {
                onSearch(searchTerm);
              }
            }}
            onFocus={() => {
              if (searchQuery.trim()) {
                setShowSuggestions(true);
              }
            }}
            onBlur={() => setShowSuggestions(false)}
            onNearMeClick={handleNearMeClick}
            isLoading={isLoading}
            placeholder="Search locations, hostels..."
          />
        )}

        {/* Mobile Menu Toggle */}
        <div className="md:hidden">
          <button
            onClick={onMenuClick}
            className="p-2 rounded-md text-gray-600 hover:bg-gray-100"
          >
            <Icon path={ICONS.menu} className="w-6 h-6" />
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
