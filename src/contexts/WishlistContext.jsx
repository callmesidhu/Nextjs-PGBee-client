"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { getAccessToken } from "@/utils/auth";
import { toast } from "react-toastify";

const WishlistContext = createContext();

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error("useWishlist must be used within a WishlistProvider");
  }
  return context;
};

export const WishlistProvider = ({ children }) => {
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(false);

  // Load wishlist items from localStorage on component mount
  useEffect(() => {
    const savedWishlistItems = localStorage.getItem("pgbee_wishlist_items");
    if (savedWishlistItems) {
      try {
        setWishlistItems(JSON.parse(savedWishlistItems));
      } catch (error) {
        console.error("Error parsing saved wishlist items:", error);
        setWishlistItems([]);
      }
    }
  }, []);

  // Save wishlist items to localStorage whenever items change
  useEffect(() => {
    localStorage.setItem("pgbee_wishlist_items", JSON.stringify(wishlistItems));
  }, [wishlistItems]);

  // Add item to wishlist
  const addToWishlist = (pgData) => {
    const token = getAccessToken();
    if (!token) {
      return false; // Let the calling component handle redirect
    }

    // Check if item already exists
    const itemExists = wishlistItems.some((item) => item.id === pgData.id);
    if (itemExists) {
      toast.info("This property is already in your wishlist!", {
        style: {
          backgroundColor: "#FFEB67",
          color: "#000",
          fontWeight: "500",
        },
      });
      return true;
    }

    setWishlistItems((prev) => [...prev, pgData]);

    toast.success("Added to wishlist!", {
      style: {
        backgroundColor: "#FFEB67",
        color: "#000",
        fontWeight: "500",
      },
    });

    return true;
  };

  // Remove item from wishlist
  const removeFromWishlist = (pgId) => {
    setWishlistItems((prev) => prev.filter((item) => item.id !== pgId));

    toast.success("Removed from wishlist!", {
      style: {
        backgroundColor: "#FFEB67",
        color: "#000",
        fontWeight: "500",
      },
    });
  };

  // Check if item is in wishlist
  const isInWishlist = (pgId) => {
    return wishlistItems.some((item) => item.id === pgId);
  };

  // Toggle item in wishlist (for quick add/remove)
  const toggleWishlist = (pgData) => {
    const token = getAccessToken();
    if (!token) {
      return false; // Let the calling component handle redirect
    }

    const isCurrentlyInWishlist = isInWishlist(pgData.id);

    if (isCurrentlyInWishlist) {
      removeFromWishlist(pgData.id);
    } else {
      addToWishlist(pgData);
    }

    return true;
  };

  // Get total items count
  const getTotalItemsCount = () => {
    return wishlistItems.length;
  };

  const value = {
    wishlistItems,
    loading,
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
    toggleWishlist,
    getTotalItemsCount,
  };

  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  );
};
