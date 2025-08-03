"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { getAccessToken } from "@/utils/auth";
import { Icon, ICONS } from "@/components/dashboard/Icons";

export default function RoomFilter({ rooms, hostelGender }) {
  const router = useRouter();
  // State to manage the user's filter selections
  const [bathroomType, setBathroomType] = useState("Any"); // 'Any', 'Attached', 'Common'
  const [roomType, setRoomType] = useState("Any"); // 'Any', 'Single', '2 Shared', etc.
  const [genderFilter, setGenderFilter] = useState("Any"); // 'Any', 'Boys', 'Girls'

  // Get unique room types from the data for the dropdown
  const uniqueRoomTypes = useMemo(() => {
    return ["Any", ...Array.from(new Set(rooms.map((room) => room.type)))];
  }, [rooms]);

  // Determine available gender options based on hostel gender
  const availableGenderOptions = useMemo(() => {
    if (!hostelGender) return ["Any", "Boys", "Girls"];

    const normalizedGender = hostelGender.toLowerCase();
    if (normalizedGender.includes("male") || normalizedGender.includes("boy")) {
      return ["Any", "Boys"];
    } else if (
      normalizedGender.includes("female") ||
      normalizedGender.includes("girl")
    ) {
      return ["Any", "Girls"];
    }
    return ["Any", "Boys", "Girls"];
  }, [hostelGender]);

  // Filter the rooms based on the selected criteria
  const filteredRooms = useMemo(() => {
    return rooms.filter((room) => {
      const bathroomMatch =
        bathroomType === "Any" ||
        (bathroomType === "Attached" && room.attachedBathroom) ||
        (bathroomType === "Common" && !room.attachedBathroom);

      const roomTypeMatch = roomType === "Any" || room.type === roomType;

      // Gender filter logic - in a real app, this would depend on your data structure
      // For now, we'll show all rooms since gender is typically at hostel level
      const genderMatch = genderFilter === "Any" || true;

      return bathroomMatch && roomTypeMatch && genderMatch;
    });
  }, [rooms, bathroomType, roomType, genderFilter]);

  // Clear all filters
  const clearAllFilters = () => {
    setBathroomType("Any");
    setRoomType("Any");
    setGenderFilter("Any");
  };

  // Handle room selection with authentication check
  const handleSelectRoom = (room) => {
    const token = getAccessToken();
    if (!token) {
      // Redirect to signup if not authenticated
      router.push("/auth/signup");
    } else {
      // Proceed with room selection logic here
      console.log("Selecting room:", room);
      // You can add your room selection logic here
    }
  };

  // Get the display text for hostel gender
  const getGenderDisplayText = (gender) => {
    if (!gender) return "Mixed";
    const normalized = gender.toLowerCase();
    if (normalized.includes("male") || normalized.includes("boy"))
      return "Boys";
    if (normalized.includes("female") || normalized.includes("girl"))
      return "Girls";
    return gender;
  };

  return (
    <section className="bg-white rounded-xl shadow-lg p-6 mt-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Available Rooms</h2>
        {hostelGender && (
          <span
            className={`px-3 py-1 rounded-full text-sm font-medium ${
              hostelGender === "Male" || hostelGender === "Boys"
                ? "bg-blue-100 text-blue-800"
                : hostelGender === "Female" || hostelGender === "Girls"
                ? "bg-pink-100 text-pink-800"
                : "bg-gray-100 text-gray-800"
            }`}
          >
            {getGenderDisplayText(hostelGender)}
          </span>
        )}
      </div>

      {/* Main container with responsive grid layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Filter Controls */}
        <div className="lg:col-span-1 space-y-6">
          {/* Gender Filter - Only show if there are multiple options */}
          {availableGenderOptions.length > 1 && (
            <div>
              <label
                htmlFor="gender-filter"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Gender Preference
              </label>
              <select
                id="gender-filter"
                value={genderFilter}
                onChange={(e) => setGenderFilter(e.target.value)}
                className="w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-black focus:border-black sm:text-sm rounded-md border"
              >
                {availableGenderOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Bathroom Type Filter */}
          <div>
            <label
              htmlFor="bathroom-filter"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Bathroom Type
            </label>
            <select
              id="bathroom-filter"
              value={bathroomType}
              onChange={(e) => setBathroomType(e.target.value)}
              className="w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-black focus:border-black sm:text-sm rounded-md border"
            >
              <option>Any</option>
              <option>Attached</option>
              <option>Common</option>
            </select>
          </div>

          {/* Room Type Filter */}
          <div>
            <label
              htmlFor="room-type-filter"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Room Type
            </label>
            <select
              id="room-type-filter"
              value={roomType}
              onChange={(e) => setRoomType(e.target.value)}
              className="w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-black focus:border-black sm:text-sm rounded-md border"
            >
              {uniqueRoomTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          {/* Filter Summary */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold text-sm text-gray-700 mb-2">
              Filter Summary
            </h3>
            <p className="text-sm text-gray-600 mb-2">
              Showing {filteredRooms.length} of {rooms.length} room types
            </p>
            {(bathroomType !== "Any" ||
              roomType !== "Any" ||
              genderFilter !== "Any") && (
              <div className="space-y-1">
                {genderFilter !== "Any" && (
                  <p className="text-xs text-gray-500">
                    Gender: {genderFilter}
                  </p>
                )}
                {bathroomType !== "Any" && (
                  <p className="text-xs text-gray-500">
                    Bathroom: {bathroomType}
                  </p>
                )}
                {roomType !== "Any" && (
                  <p className="text-xs text-gray-500">Room: {roomType}</p>
                )}
                <button
                  onClick={clearAllFilters}
                  className="mt-2 text-xs text-blue-600 hover:text-blue-800 underline"
                >
                  Clear all filters
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Filtered Room Cards */}
        <div className="lg:col-span-2 space-y-4">
          {filteredRooms.length > 0 ? (
            filteredRooms.map((room, index) => (
              <div
                key={index}
                className="flex justify-between items-center p-4 border rounded-lg shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex-1">
                  <h3 className="font-bold text-lg text-gray-900">
                    {room.type}
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">
                    {room.attachedBathroom
                      ? "Attached Bathroom"
                      : "Common Bathroom"}
                  </p>
                  <div className="flex items-center mt-2 space-x-2">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        room.attachedBathroom
                          ? "bg-green-100 text-green-800"
                          : "bg-blue-100 text-blue-800"
                      }`}
                    >
                      {room.attachedBathroom
                        ? "Private Bathroom"
                        : "Shared Bathroom"}
                    </span>
                    {hostelGender && (
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          hostelGender === "Male" || hostelGender === "Boys"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-pink-100 text-pink-800"
                        }`}
                      >
                        {getGenderDisplayText(hostelGender)}
                      </span>
                    )}
                  </div>
                </div>
                <div className="text-right ml-4">
                  <p className="font-bold text-xl text-green-600">
                    ₹{room.price.toLocaleString()}
                  </p>
                  <p className="text-xs text-gray-500 mb-2">per month</p>
                  <button
                    onClick={() => handleSelectRoom(room)}
                    className="px-4 py-2 bg-gray-900 text-white text-sm rounded-lg hover:bg-gray-800 transition-colors"
                  >
                    Select Room
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center p-8 border rounded-lg bg-gray-50">
              <div className="text-gray-400 mb-4">
                <svg
                  className="w-12 h-12 mx-auto"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                  />
                </svg>
              </div>
              <p className="text-gray-500 text-lg font-medium">
                No rooms match the selected filters
              </p>
              <p className="text-gray-400 text-sm mt-1">
                Try adjusting your filters to see more options
              </p>
              <button
                onClick={clearAllFilters}
                className="mt-4 px-4 py-2 text-sm bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Clear All Filters
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
