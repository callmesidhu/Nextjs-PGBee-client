import { useState } from "react";
import { useRouter } from "next/navigation";
import { getAccessToken } from "@/utils/auth";
import { Icon, ICONS } from "./Icons";

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

// Component to display rent options
const RentDisplay = ({ hostel }) => {
  return (
    <div className="mb-4">
      {hostel.rentOptions && hostel.rentOptions.length > 0 ? (
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-gray-700 mb-2">
            Available Options:
          </h4>
          {hostel.rentOptions
            .sort((a, b) => a.price - b.price) // ascending price sort
            .map((rent, index) => (
              <div
                key={index}
                className="flex justify-between items-center p-2 bg-gray-50 rounded-lg"
              >
                <span className="text-sm text-gray-600">
                  {formatSharingType(rent.sharingType)}
                </span>
                <span className="text-lg font-bold text-gray-900">
                  ₹{rent.price.toLocaleString()}
                </span>
              </div>
            ))}
        </div>
      ) : (
        <div className="flex items-baseline">
          <p className="text-lg font-bold text-gray-900">
            ₹{hostel.price.toLocaleString()}
          </p>
        </div>
      )}
    </div>
  );
};

const HostelCard = ({ hostel }) => {
  const [isWishlisted, setIsWishlisted] = useState(false);
  const router = useRouter();
  const displayedThumbnails = hostel.images.slice(1, 6);
  const remainingImagesCount = hostel.images.length - 6;
  const displayedAmenities = hostel.amenities.slice(0, 4);
  const remainingAmenitiesCount = hostel.amenities.length - 4;

  const handleBookNow = () => {
    const token = getAccessToken();
    if (!token) {
      // Redirect to login if not authenticated
      router.push("/auth/login");
    } else {
      // Proceed with booking logic here
      console.log("Booking hostel:", hostel.name);
      // You can add your booking logic here
    }
  };

  const handleWishlist = () => {
    const token = getAccessToken();
    if (!token) {
      // Redirect to login if not authenticated
      router.push("/auth/login");
    } else {
      setIsWishlisted(!isWishlisted);
    }
  };

  const handleViewDetails = () => {
    // Allow viewing details without authentication
    router.push(`/${hostel.id}`);
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden flex flex-col md:flex-row mb-3">
      {/* Image Gallery */}
      <div className="w-full md:w-2/5 md:h-70 flex-shrink-0 flex gap-1 p-2">
        {/* Main Image */}
        <div className="w-3/4">
          <img
            src={hostel.images[0]}
            alt={hostel.name}
            className="w-full h-48 md:h-65 object-cover rounded-xl"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = "https://placehold.co/300x300?text=Error";
            }}
          />
        </div>
        {/* Vertical Thumbnails */}
        <div className="w-1/4 flex flex-col gap-1 md:h-60">
          {displayedThumbnails.map((img, index) => (
            <div key={index} className="relative h-1/5">
              <img
                src={img}
                alt={`${hostel.name} thumbnail ${index + 2}`}
                className="w-full h-full object-cover rounded-lg cursor-pointer"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "https://placehold.co/100x100?text=Error";
                }}
              />
              {index === 4 && remainingImagesCount > 0 && (
                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-lg cursor-pointer">
                  <span className="text-white text-lg font-bold">
                    +{remainingImagesCount}
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Hostel Details */}
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
          {remainingAmenitiesCount > 0 && (
            <span className="text-sm text-gray-500">
              + {remainingAmenitiesCount} more
            </span>
          )}
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

        {/* Updated rent display section */}
        <RentDisplay hostel={hostel} />

        <p className="text-sm text-gray-600 mb-2">Gender: {hostel.sex}</p>
        {hostel.phone && (
          <p className="text-sm text-gray-600 mb-2">Phone: {hostel.phone}</p>
        )}
        <a href={hostel.location} target="_blank">
          <button className="text-sm text-blue-500 hover:underline focus:outline-none mb-2 text-left">
            Location
          </button>
        </a>
        <div className="flex items-center mt-auto">
          <div className="flex items-center space-x-2">
            <button
              onClick={handleViewDetails}
              className="px-5 py-2 text-base font-semibold border border-gray-400 text-gray-800 rounded-lg hover:bg-gray-100"
            >
              View Details
            </button>
            <button
              onClick={handleBookNow}
              className="px-5 py-2 text-base font-semibold bg-gray-900 text-white rounded-lg hover:bg-gray-800"
            >
              Book Now
            </button>
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
