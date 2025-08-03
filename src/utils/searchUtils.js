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

      return (
        nameMatch ||
        locationMatch ||
        amenitiesMatch ||
        genderMatch ||
        descriptionMatch
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

    // Amenities filter
    if (filters.selectedAmenities && filters.selectedAmenities.length > 0) {
      filtered = filtered.filter((item) => {
        const itemAmenities = item.amenities || [];
        return filters.selectedAmenities.every((amenity) =>
          itemAmenities.some((itemAmenity) =>
            itemAmenity.toLowerCase().includes(amenity.toLowerCase())
          )
        );
      });
    }

    // Room type filter
    if (filters.roomType && filters.roomType !== "Any") {
      filtered = filtered.filter((item) => {
        // Check in room types or rent options
        const roomTypes = item.roomTypes || [];
        const rentOptions = item.Rents || item.rentOptions || [];

        return (
          roomTypes.includes(filters.roomType) ||
          rentOptions.some(
            (rent) =>
              rent.sharingType &&
              rent.sharingType
                .toLowerCase()
                .includes(filters.roomType.toLowerCase())
          )
        );
      });
    }

    // Bathroom attachment filter
    if (filters.bathroomAttachment && filters.bathroomAttachment !== "Any") {
      filtered = filtered.filter((item) => {
        if (filters.bathroomAttachment === "Attached") {
          return item.bathroomAttached === true;
        } else if (filters.bathroomAttachment === "Not Attached") {
          return item.bathroomAttached === false;
        }
        return true;
      });
    }

    // Caution deposit filter
    if (filters.cautionDeposit && filters.cautionDeposit !== "Any") {
      filtered = filtered.filter((item) => {
        const hasDeposit = filters.cautionDeposit === "Yes";
        return (
          item.deposit === hasDeposit || item.cautionDeposit === hasDeposit
        );
      });
    }

    // Curfew filter
    if (filters.curfew && filters.curfew !== "Any") {
      filtered = filtered.filter((item) => {
        const hasCurfew = filters.curfew === "Yes";
        return (
          item.curfew === hasCurfew ||
          (item.curfew === "mandatory" && hasCurfew) ||
          (item.curfew === "none" && !hasCurfew)
        );
      });
    }
  }

  return filtered;
};

export const getLocationSuggestions = (data) => {
  if (!Array.isArray(data)) return [];

  const locations = [
    ...new Set(
      data.map((item) => item.location || item.address || "").filter(Boolean)
    ),
  ];

  return locations.map((location) => ({
    text: location,
    type: "location",
  }));
};

export const getHostelSuggestions = (data) => {
  if (!Array.isArray(data)) return [];

  return data
    .map((item) => ({
      text: item.hostelName || item.name || "",
      type: "hostel",
      id: item.id,
    }))
    .filter((item) => item.text);
};

export const getAmenitySuggestions = (data) => {
  if (!Array.isArray(data)) return [];

  const amenities = [...new Set(data.flatMap((item) => item.amenities || []))];

  return amenities.map((amenity) => ({
    text: amenity,
    type: "amenity",
  }));
};

export const searchByLocation = (data, location) => {
  if (!location || !location.trim()) return data;

  const query = location.toLowerCase();
  return data.filter((item) => {
    const itemLocation = (item.location || item.address || "").toLowerCase();
    return itemLocation.includes(query);
  });
};

export const searchByHostelName = (data, name) => {
  if (!name || !name.trim()) return data;

  const query = name.toLowerCase();
  return data.filter((item) => {
    const hostelName = (item.hostelName || item.name || "").toLowerCase();
    return hostelName.includes(query);
  });
};

export const searchByAmenity = (data, amenity) => {
  if (!amenity || !amenity.trim()) return data;

  const query = amenity.toLowerCase();
  return data.filter((item) => {
    const amenities = item.amenities || [];
    return amenities.some((itemAmenity) =>
      itemAmenity.toLowerCase().includes(query)
    );
  });
};
