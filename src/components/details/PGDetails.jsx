"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Icon, ICONS } from "@/components/dashboard/Icons";
import { getAccessToken } from "@/utils/auth";
import { toast } from "react-toastify";
import BookingModal from "@/components/booking/BookingModal";

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

const PGDetails = ({ pgData }) => {
  const router = useRouter();
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);

  // Handle scroll to show/hide scroll-to-top button
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleBookNow = () => {
    // const token = getAccessToken();
    // if (!token) {
    //   router.push("/auth/signup");
    // } else {
    setIsBookingModalOpen(true);
    // }
  };

  const handleWishlist = () => {
    const token = getAccessToken();
    // if (!token) {
    //   router.push("/auth/signup");
    // } else {
    setIsWishlisted(!isWishlisted);
    toast.success(
      isWishlisted ? "Removed from wishlist" : "Added to wishlist",
      {
        style: {
          backgroundColor: "#FFEB67",
          color: "#000",
          fontWeight: "500",
        },
      }
    );
    // }
  };

  const openImageModal = (index) => {
    setSelectedImageIndex(index);
    setIsImageModalOpen(true);
  };

  const closeImageModal = () => {
    setIsImageModalOpen(false);
  };

  const nextImage = () => {
    setSelectedImageIndex((prev) =>
      prev === pgData.images.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = () => {
    setSelectedImageIndex((prev) =>
      prev === 0 ? pgData.images.length - 1 : prev - 1
    );
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Back button */}
      <div className="mb-6">
        <button
          onClick={() => router.back()}
          className="flex items-center text-gray-600 hover:text-gray-900"
        >
          <Icon
            path={ICONS.arrowLeft || ICONS.chevronLeft}
            className="w-5 h-5 mr-2"
          />
          Back to listings
        </button>
      </div>

      {/* Main content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left column - Images and main info */}
        <div className="lg:col-span-2">
          {/* Image Gallery */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-6">
            {pgData.images && pgData.images.length > 0 ? (
              <>
                {/* Main Image */}
                <div className="relative h-96">
                  <img
                    src={pgData.images[selectedImageIndex]}
                    alt={`${pgData.name} - Image ${selectedImageIndex + 1}`}
                    className="w-full h-full object-cover cursor-pointer"
                    onClick={() => openImageModal(selectedImageIndex)}
                    onError={(e) => {
                      e.target.src = "/images/placeholder-hostel.jpg";
                    }}
                  />
                  {pgData.images.length > 1 && (
                    <>
                      <button
                        onClick={prevImage}
                        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75"
                      >
                        <Icon path={ICONS.chevronLeft} className="w-5 h-5" />
                      </button>
                      <button
                        onClick={nextImage}
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75"
                      >
                        <Icon path={ICONS.chevronRight} className="w-5 h-5" />
                      </button>
                    </>
                  )}
                </div>

                {/* Thumbnail Gallery */}
                {pgData.images.length > 1 && (
                  <div className="p-4">
                    <div className="flex space-x-2 overflow-x-auto">
                      {pgData.images.map((image, index) => (
                        <img
                          key={index}
                          src={image}
                          alt={`${pgData.name} - Thumbnail ${index + 1}`}
                          className={`h-20 w-40 object-cover rounded-lg cursor-pointer ${
                            selectedImageIndex === index
                              ? "ring-2 ring-blue-500"
                              : ""
                          }`}
                          onClick={() => setSelectedImageIndex(index)}
                          onError={(e) => {
                            e.target.src = "/images/placeholder-hostel.jpg";
                          }}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="h-96 flex items-center justify-center bg-gray-200">
                <p className="text-gray-500">No images available</p>
              </div>
            )}
          </div>

          {/* PG Information */}
          <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {pgData.name}
            </h1>
            <p className="text-lg text-gray-600 mb-4">{pgData.address}</p>

            {/* Rating */}
            <div className="flex items-center mb-6">
              <span className="bg-yellow-400 text-black text-sm font-bold px-3 py-1 rounded flex items-center">
                {pgData.rating}
                <Icon path={ICONS.star} className="w-4 h-4 ml-1" />
              </span>
              <span className="text-sm text-gray-600 ml-3">
                ({pgData.reviews} Reviews)
              </span>
            </div>

            {/* Basic Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  Basic Information
                </h3>
                <div className="space-y-2">
                  <p className="text-gray-700">
                    <span className="font-medium">Gender:</span> {pgData.sex}
                  </p>
                  {pgData.curfew && (
                    <p className="text-gray-700">
                      <span className="font-medium">Curfew:</span>{" "}
                      {pgData.curfew}
                    </p>
                  )}
                  {(pgData.bedrooms || pgData.bathrooms) && (
                    <div className="flex space-x-4">
                      {pgData.bedrooms && (
                        <p className="text-gray-700">
                          <span className="font-medium">Bedrooms:</span>{" "}
                          {pgData.bedrooms}
                        </p>
                      )}
                      {pgData.bathrooms && (
                        <p className="text-gray-700">
                          <span className="font-medium">Bathrooms:</span>{" "}
                          {pgData.bathrooms}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {pgData.location && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    Location
                  </h3>
                  <p className="text-gray-700 mb-2">{pgData.address}</p>
                  <a
                    href={pgData.location}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-blue-600 hover:text-blue-800"
                  >
                    <Icon path={ICONS.mapPin} className="w-4 h-4 mr-1" />
                    View on Map
                  </a>
                </div>
              )}
            </div>

            {/* Description */}
            {pgData.description && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Description
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  {pgData.description}
                </p>
              </div>
            )}

            {/* Amenities */}
            {pgData.amenities && pgData.amenities.length > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  Amenities
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {pgData.amenities.map((amenity, index) => (
                    <div key={index} className="flex items-center">
                      <Icon
                        path={ICONS.checkCircle}
                        className="w-5 h-5 text-green-500 mr-2 flex-shrink-0"
                      />
                      <span className="text-gray-700">{amenity}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right column - Pricing and booking */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-lg p-6 sticky top-4">
            {/* Pricing */}
            {/* Pricing */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Pricing
              </h3>
              {pgData.rentOptions
                .slice()
                .sort((a, b) => a.price - b.price)
                .map((rent, index) => {
                  const fakeOriginal = rent.price + 1000;
                  return (
                    <div
                      key={index}
                      className="flex justify-between items-center p-3 bg-gray-50 rounded-lg shadow-sm hover:bg-gray-100 transition-all mb-2"
                    >
                      <span className="text-sm text-gray-600">
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
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <button
                onClick={handleBookNow}
                className="w-full bg-gray-900 text-white py-3 rounded-lg font-semibold hover:bg-gray-800 transition-colors"
              >
                Book Now
              </button>

              {/* Call Owner Button */}
              {pgData.phone && (
                <a
                  href={`tel:${pgData.phone}`}
                  className="w-full border-2 border-gray-900 text-gray-900 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
                >
                  <Icon path={ICONS.phone} className="w-5 h-5" />
                  <span>Call {pgData.phone}</span>
                </a>
              )}

              {/* <button
                onClick={handleWishlist}
                className={`w-full border-2 py-3 rounded-lg font-semibold transition-colors ${
                  isWishlisted
                    ? "border-red-500 text-red-500 hover:bg-red-50"
                    : "border-gray-300 text-gray-700 hover:bg-gray-50"
                }`}
              >
                <Icon
                  path={ICONS.heart}
                  className={`w-5 h-5 inline mr-2 ${
                    isWishlisted ? "text-red-500" : ""
                  }`}
                />
                {isWishlisted ? "Remove from Wishlist" : "Add to Wishlist"}
              </button> */}
            </div>
          </div>
        </div>
      </div>

      {/* Image Modal */}
      {isImageModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center">
          <div className="relative max-w-4xl max-h-full p-4">
            <button
              onClick={closeImageModal}
              className="absolute top-4 right-4 text-white hover:text-gray-300 z-10"
            >
              <Icon path={ICONS.close} className="w-8 h-8" />
            </button>

            <img
              src={pgData.images[selectedImageIndex]}
              alt={`${pgData.name} - Full size`}
              className="max-w-full max-h-full object-contain"
              onError={(e) => {
                e.target.src = "/images/placeholder-hostel.jpg";
              }}
            />

            {pgData.images.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-300"
                >
                  <Icon path={ICONS.chevronLeft} className="w-8 h-8" />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-300"
                >
                  <Icon path={ICONS.chevronRight} className="w-8 h-8" />
                </button>
              </>
            )}

            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white">
              {selectedImageIndex + 1} / {pgData.images.length}
            </div>
          </div>
        </div>
      )}

      {/* Scroll to top button */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 bg-gray-900 text-white p-3 rounded-full shadow-lg hover:bg-gray-800 transition-all duration-300 z-40"
          aria-label="Scroll to top"
        >
          <Icon path={ICONS.chevronUp} className="w-6 h-6" />
        </button>
      )}

      {/* Booking Modal */}
      <BookingModal
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
        pgData={pgData}
      />
    </div>
  );
};

export default PGDetails;
