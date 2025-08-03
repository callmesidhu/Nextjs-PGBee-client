"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { getAccessToken } from "@/utils/auth";
import { Icon, ICONS } from "./Icons";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ChevronUp } from "lucide-react";

// Function to format sharing type for display
const formatSharingType = (sharingType) => {
  const typeMap = {
    "1-sharing": "1 Sharing",
    "1-sharing-attached": "1 Sharing (Attached Bath)",
    "2-sharing": "2 Sharing",
    "2-sharing-attached": "2 Sharing (Attached Bath)",
    "3-sharing": "3 Sharing",
    "3-sharing-attached": "3 Sharing (Attached Bath)",
    "3+-sharing": "3+ Sharing",
    "3+-sharing-attached": "3+ Sharing (Attached Bath)",
  };
  return typeMap[sharingType] || sharingType;
};

const RentDisplay = ({ hostel }) => {
  const [isOpen, setIsOpen] = useState(false);

  if (!hostel.rentOptions || hostel.rentOptions.length === 0) {
    return (
      <div className="flex items-baseline mb-2">
        <p className="text-lg font-bold text-gray-900">
          ₹{hostel.price.toLocaleString()}
        </p>
      </div>
    );
  }

  const minRent = Math.min(...hostel.rentOptions.map((r) => r.price));
  const sortedOptions = hostel.rentOptions.sort((a, b) => a.price - b.price);

  return (
    <div className="space-y-2 mb-2">
      <h4 className="text-sm font-medium text-gray-700">Available Options:</h4>

      <div
        className="flex justify-between items-center p-2 bg-gray-50 rounded-lg cursor-pointer"
        onClick={() => setIsOpen((prev) => !prev)}
      >
        <div className="text-sm text-gray-600">Starting from</div>
        <div className="flex items-center gap-2">
          <span className="text-lg font-bold text-gray-900">
            ₹{minRent.toLocaleString()}
          </span>
          {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="space-y-1"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
          >
            {sortedOptions.map((rent, index) => {
              const fakeOriginal = rent.price + 1000;
              return (
                <div
                  key={index}
                  className="flex justify-between items-center px-3 py-2 bg-white border border-gray-200 rounded-md shadow-sm hover:bg-gray-50 transition-all"
                >
                  <span className="text-sm text-gray-700">
                    {formatSharingType(rent.sharingType)}
                  </span>
                  <div className="flex flex-col text-right">
                    <span className="text-base font-bold text-green-700">
                      ₹{rent.price.toLocaleString()}
                    </span>
                    <span className="text-xs text-gray-400 line-through">
                      ₹{fakeOriginal.toLocaleString()}
                    </span>
                  </div>
                </div>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const HostelCard = ({ hostel }) => {
  const [isWishlisted, setIsWishlisted] = useState(false);
  const router = useRouter();

  const displayedThumbnails = hostel.images.slice(1, 6);
  const remainingImagesCount = hostel.images.length - 6;
  const displayedAmenities = hostel.amenities.slice(0);

  const handleBookNow = () => {
    const token = getAccessToken();
    if (!token) {
      router.push("/auth/signup");
    } else {
      console.log("Booking hostel:", hostel.name);
    }
  };

  const handleWishlist = () => {
    const token = getAccessToken();
    if (!token) {
      router.push("/auth/signup");
    } else {
      setIsWishlisted(!isWishlisted);
    }
  };

  const handleViewDetails = () => {
    router.push(`/${hostel.id}`);
  };

  return (
    <div
      className={`bg-white rounded-2xl shadow-lg overflow-hidden flex flex-col md:flex-row mb-3 transition-all ${
        hostel.available ? "" : "opacity-30 cursor-not-allowed"
      }`}
    >
      {/* Image Section */}
      <div className="w-full md:w-2/5 p-2 flex flex-col">
        <div>
          <img
            src={hostel.images[0]}
            alt={hostel.name}
            className="w-full h-48 md:h-64 object-cover rounded-xl"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = "https://placehold.co/300x300?text=Error";
            }}
          />
        </div>

        <div className="mt-2 flex gap-5 overflow-x-auto">
          {displayedThumbnails.map((img, index) => (
            <div key={index} className="relative w-24 h-16">
              <img
                src={img}
                alt={`${hostel.name} thumbnail ${index + 2}`}
                className="w-full h-full object-cover rounded-lg"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "https://placehold.co/100x100?text=Error";
                }}
              />
              {index === 4 && remainingImagesCount > 0 && (
                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-lg cursor-pointer">
                  <span className="text-white text-sm font-bold">
                    +{remainingImagesCount}
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Details Section */}
      <div className="p-4 flex flex-col flex-grow">
        <h3 className="text-2xl font-bold text-gray-900">{hostel.name}</h3>
        <p className="text-lg text-gray-400 mb-2">{hostel.address}</p>

        <div className="flex flex-wrap items-center text-sm text-gray-800 my-2 gap-x-4 gap-y-2">
          {displayedAmenities.map((amenity) => (
            <span key={amenity} className="flex items-center">
              <Icon
                path={ICONS.checkCircle}
                className="w-5 h-5 mr-1.5 text-gray-500"
              />
              {amenity}
            </span>
          ))}
        </div>

        <div className="flex items-center mb-3">
          <span className="bg-yellow-400 text-black text-sm font-bold px-2 py-1 rounded flex items-center">
            {hostel.rating}
            <Icon path={ICONS.star} className="w-3 h-3 ml-1" />
          </span>
          <span className="text-sm text-gray-600 ml-2">
            ({hostel.reviews} Ratings)
          </span>
        </div>

        <RentDisplay hostel={hostel} />

        <p className="text-sm text-gray-600 mb-2">Hostel For : {hostel.sex}</p>

        <div className="flex items-center mt-auto">
          <div className="flex items-center space-x-2">
            {hostel.available &&<button
              onClick={handleViewDetails}
              className="px-5 py-2 text-base font-semibold border border-gray-400 text-gray-800 rounded-lg hover:bg-gray-100"
            >
              View Details
            </button>}
          </div>
          <button
            onClick={handleWishlist}
            className="ml-auto p-2 border border-gray-300 rounded-full hover:bg-gray-100"
          >
            <Icon
              path={ICONS.heart}
              className={`w-6 h-6 ${
                isWishlisted ? "text-red-500" : "text-gray-400"
              }`}
            />
          </button>
        </div>
      </div>
    </div>
  );
};

export default HostelCard;
