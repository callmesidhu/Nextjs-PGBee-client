// Enhanced search utilities with location support
export const applySearchAndFilters = (data, searchQuery, filters = null) => {
  if (!Array.isArray(data)) return [];

  let filtered = [...data];

  // Apply search query filter
  if (searchQuery && searchQuery.trim()) {
    const query = searchQuery.toLowerCase();
    filtered = filtered.filter((item) => {
      // Search in hostel name
      const nameMatch = (item.hostelName || item.name || "")
        .toLowerCase()
        .includes(query);

      // Search in location/address
      const locationMatch = (item.location || item.address || "")
        .toLowerCase()
        .includes(query);

      // Search in amenities
      const amenitiesMatch = (item.amenities || []).some((amenity) =>
        amenity.toLowerCase().includes(query)
      );

      // Search in gender/sex
      const genderMatch = (item.sex || item.gender || "")
        .toLowerCase()
        .includes(query);

      // Search in description if available
      const descriptionMatch = (item.description || "")
        .toLowerCase()
        .includes(query);

      // Special "Near me" handling
      const nearMeMatch = query.includes("near me") || query.includes("nearby");

      return (
        nameMatch ||
        locationMatch ||
        amenitiesMatch ||
        genderMatch ||
        descriptionMatch ||
        nearMeMatch
      );
    });
  }

  // Apply additional filters if provided
  if (filters) {
    // Price range filter
    if (filters.minPrice !== undefined && filters.maxPrice !== undefined) {
      filtered = filtered.filter((item) => {
        const price = item.price || item.discountedPrice || 0;
        return price >= filters.minPrice && price <= filters.maxPrice;
      });
    }

    // Gender filter
    if (filters.gender && filters.gender !== "Any") {
      filtered = filtered.filter((item) => {
        const itemGender = item.sex || item.gender || "";
        return filters.gender === "Boys"
          ? ["Male", "Boys", "male", "boys", "Men", "men"].includes(itemGender)
          : filters.gender === "Girls"
          ? ["Female", "Girls", "female", "girls", "Women", "women"].includes(
              itemGender
            )
          : true;
      });
    }

    // Place type filter
    if (filters.placeType && filters.placeType !== "Any") {
      filtered = filtered.filter((item) => {
        const itemType = item.placeType || item.type || "";
        return itemType.toLowerCase() === filters.placeType.toLowerCase();
      });
    }

    // Hostel type filter
    if (filters.hostelType && filters.hostelType !== "Any") {
      filtered = filtered.filter((item) => {
        const itemHostelType = item.hostelType || "";
        return (
          itemHostelType.toLowerCase() === filters.hostelType.toLowerCase()
        );
      });
    }

    // Rooms filter
    if (filters.rooms && filters.rooms !== "Any") {
      const roomCount = filters.rooms === "5+" ? 5 : parseInt(filters.rooms);
      filtered = filtered.filter((item) => {
        const itemRooms = item.rooms || 0;
        return filters.rooms === "5+" ? itemRooms >= 5 : itemRooms >= roomCount;
      });
    }

    // Bathrooms filter
    if (filters.bathrooms && filters.bathrooms !== "Any") {
      const bathroomCount =
        filters.bathrooms === "5+" ? 5 : parseInt(filters.bathrooms);
      filtered = filtered.filter((item) => {
        const itemBathrooms = item.bathrooms || 0;
        return filters.bathrooms === "5+"
          ? itemBathrooms >= 5
          : itemBathrooms >= bathroomCount;
      });
    }

    // Amenities filter
    if (filters.selectedAmenities && filters.selectedAmenities.length > 0) {
      filtered = filtered.filter((item) =>
        filters.selectedAmenities.every((amenity) =>
          (item.amenities || []).some(
            (itemAmenity) =>
              itemAmenity.toLowerCase().includes(amenity.toLowerCase()) ||
              amenity.toLowerCase().includes(itemAmenity.toLowerCase())
          )
        )
      );
    }

    // Curfew filter
    if (filters.curfew && filters.curfew !== "Any") {
      filtered = filtered.filter((item) => {
        const itemCurfew = item.curfew || "";
        if (filters.curfew === "Yes") {
          return ["yes", "mandatory", "strict", "enforced"].some((val) =>
            itemCurfew.toLowerCase().includes(val)
          );
        } else if (filters.curfew === "No") {
          return (
            ["no", "none", "flexible", "free"].some((val) =>
              itemCurfew.toLowerCase().includes(val)
            ) || !itemCurfew
          );
        }
        return true;
      });
    }

    // Room type filter
    if (filters.roomType && filters.roomType !== "Any") {
      filtered = filtered.filter((item) => {
        const roomTypes = item.roomTypes || item.roomType || [];
        const roomTypeArray = Array.isArray(roomTypes)
          ? roomTypes
          : [roomTypes];
        return roomTypeArray.some((type) =>
          type.toLowerCase().includes(filters.roomType.toLowerCase())
        );
      });
    }

    // Bathroom attachment filter
    if (filters.bathroomAttachment && filters.bathroomAttachment !== "Any") {
      filtered = filtered.filter((item) => {
        const isAttached = item.bathroomAttached;
        if (filters.bathroomAttachment === "Attached") {
          return (
            isAttached === true ||
            isAttached === "true" ||
            isAttached === "attached"
          );
        } else if (filters.bathroomAttachment === "Not Attached") {
          return (
            isAttached === false ||
            isAttached === "false" ||
            isAttached === "shared" ||
            !isAttached
          );
        }
        return true;
      });
    }

    // Caution deposit filter
    if (filters.cautionDeposit && filters.cautionDeposit !== "Any") {
      filtered = filtered.filter((item) => {
        const hasDeposit = item.deposit || item.cautionDeposit;
        if (filters.cautionDeposit === "Yes") {
          return (
            hasDeposit === true || hasDeposit === "true" || hasDeposit === "yes"
          );
        } else if (filters.cautionDeposit === "No") {
          return (
            hasDeposit === false ||
            hasDeposit === "false" ||
            hasDeposit === "no" ||
            !hasDeposit
          );
        }
        return true;
      });
    }
  }

  return filtered;
};

// Generate search suggestions based on data
export const generateSearchSuggestions = (data = []) => {
  if (!Array.isArray(data) || data.length === 0) return [];

  const suggestions = new Set();

  data.forEach((item) => {
    // Add hostel names
    if (item.hostelName || item.name) {
      suggestions.add(
        JSON.stringify({
          text: item.hostelName || item.name,
          type: "hostel",
          id: item.id,
        })
      );
    }

    // Add locations
    if (item.location || item.address) {
      suggestions.add(
        JSON.stringify({
          text: item.location || item.address,
          type: "location",
        })
      );
    }

    // Add amenities
    if (item.amenities && Array.isArray(item.amenities)) {
      item.amenities.forEach((amenity) => {
        if (amenity) {
          suggestions.add(
            JSON.stringify({
              text: amenity,
              type: "amenity",
            })
          );
        }
      });
    }

    // Add gender/type
    if (item.sex || item.gender) {
      suggestions.add(
        JSON.stringify({
          text: item.sex || item.gender,
          type: "gender",
        })
      );
    }
  });

  // Add common location suggestions
  const commonLocations = [
    "Bangalore",
    "Mumbai",
    "Delhi",
    "Chennai",
    "Hyderabad",
    "Pune",
    "Koramangala",
    "BTM Layout",
    "Electronic City",
    "Whitefield",
    "Marathahalli",
    "Jayanagar",
    "Indiranagar",
    "HSR Layout",
  ];

  commonLocations.forEach((location) => {
    suggestions.add(
      JSON.stringify({
        text: location,
        type: "location",
      })
    );
  });

  return Array.from(suggestions)
    .map((str) => JSON.parse(str))
    .sort((a, b) => a.text.localeCompare(b.text));
};

// Filter suggestions based on query
export const filterSuggestions = (allSuggestions, query) => {
  if (!query.trim()) return [];

  const filtered = allSuggestions
    .filter((item) => item.text.toLowerCase().includes(query.toLowerCase()))
    .slice(0, 8);

  // Group suggestions by type for better UX
  const grouped = {
    hostel: filtered.filter((item) => item.type === "hostel").slice(0, 3),
    location: filtered.filter((item) => item.type === "location").slice(0, 2),
    amenity: filtered.filter((item) => item.type === "amenity").slice(0, 2),
    gender: filtered.filter((item) => item.type === "gender").slice(0, 1),
  };

  return [
    ...grouped.hostel,
    ...grouped.location,
    ...grouped.amenity,
    ...grouped.gender,
  ];
};

// Sort data based on various criteria
export const sortData = (data, sortBy = "popularity") => {
  const sorted = [...data];

  switch (sortBy.toLowerCase()) {
    case "price: low to high":
    case "price_asc":
      return sorted.sort((a, b) => {
        const priceA = a.discountedPrice || a.price || 0;
        const priceB = b.discountedPrice || b.price || 0;
        return priceA - priceB;
      });

    case "price: high to low":
    case "price_desc":
      return sorted.sort((a, b) => {
        const priceA = a.discountedPrice || a.price || 0;
        const priceB = b.discountedPrice || b.price || 0;
        return priceB - priceA;
      });

    case "rating":
    case "rating_desc":
      return sorted.sort((a, b) => (b.rating || 0) - (a.rating || 0));

    case "most reviewed":
    case "reviews_desc":
      return sorted.sort((a, b) => (b.reviews || 0) - (a.reviews || 0));

    case "newest":
    case "date_desc":
      return sorted.sort((a, b) => {
        const dateA = new Date(a.createdAt || a.addedDate || 0);
        const dateB = new Date(b.createdAt || b.addedDate || 0);
        return dateB - dateA;
      });

    case "popularity":
    case "default":
    default:
      return sorted.sort((a, b) => {
        const scoreA = (a.rating || 0) * (a.reviews || 1);
        const scoreB = (b.rating || 0) * (b.reviews || 1);
        return scoreB - scoreA;
      });
  }
};

// Location-based utilities
export const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Radius of the Earth in kilometers
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // Distance in kilometers
};

export const sortByDistance = (data, userLat, userLon) => {
  return data
    .map((item) => ({
      ...item,
      distance:
        item.latitude && item.longitude
          ? calculateDistance(userLat, userLon, item.latitude, item.longitude)
          : Infinity,
    }))
    .sort((a, b) => a.distance - b.distance);
};

// Get user's current location
export const getCurrentLocation = () => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error("Geolocation is not supported"));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
        });
      },
      (error) => {
        reject(error);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 600000, // 10 minutes
      }
    );
  });
};
