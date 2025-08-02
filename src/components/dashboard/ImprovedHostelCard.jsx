import { useState } from "react";
import { useRouter } from "next/navigation";
import { getAccessToken } from "@/utils/auth";
import { Icon, ICONS } from "./Icons";
import { ASSETS } from "@/utils/assets";

const ImprovedHostelCard = ({ hostel }) => {
  const [isWishlisted, setIsWishlisted] = useState(false);
  const router = useRouter();

  // Get images from hostel data - no fallback to sample images
  const hostelImages = hostel.images || [];
  const mainImage = hostelImages[0] || null;
  const thumbnailImages = hostelImages.slice(1, 5); // Show up to 4 thumbnails
  const remainingImages = Math.max(0, hostelImages.length - 5);

  // Map amenity names to icons
  const getAmenityIcon = (amenity) => {
    const lowerAmenity = amenity.toLowerCase();
    if (lowerAmenity.includes("wifi")) return ICONS.wifi;
    if (lowerAmenity.includes("balcony")) return ICONS.balcony;
    if (lowerAmenity.includes("kitchen")) return ICONS.kitchen;
    if (lowerAmenity.includes("terrace")) return ICONS.terrace;
    return ICONS.checkCircle;
  };

  const handleBookNow = () => {
    const token = getAccessToken();
    if (!token) {
      router.push("/auth/login");
    } else {
      console.log("Booking hostel:", hostel.name);
    }
  };

  const handleWishlist = () => {
    const token = getAccessToken();
    if (!token) {
      router.push("/auth/login");
    } else {
      setIsWishlisted(!isWishlisted);
    }
  };

  const handleViewDetails = () => {
    router.push(`/${hostel.id}`);
  };

  // Default amenities for demo - only use backend data
  const displayedAmenities = hostel.amenities?.slice(0, 4) || [];
  const remainingAmenities = Math.max(0, (hostel.amenities?.length || 0) - 4);

  // Use only backend data - no fallbacks
  const hostelName = hostel.name;
  const hostelLocation = hostel.address;
  const hostelRating = hostel.rating;
  const hostelReviews = hostel.reviews;
  const hostelPrice = hostel.price;
  const hostelOriginalPrice = hostel.originalPrice;

  return (
    <div className="box-border content-stretch flex flex-row gap-10 items-center justify-center p-0 relative w-full bg-white rounded-2xl shadow-lg overflow-hidden mb-6 p-6">
      {/* Image Gallery Section */}
      <div className="box-border content-stretch flex flex-row gap-0.5 items-center justify-start flex-shrink-0">
        {/* Main Image */}
        <div className="bg-[rgba(66,66,66,0.3)] h-[255px] relative rounded-[15px] w-[380px] overflow-hidden">
          {mainImage ? (
            <img
              src={mainImage}
              alt={hostelName}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.style.display = "none";
              }}
            />
          ) : null}
          <div
            aria-hidden="true"
            className="absolute border border-[rgba(66,66,66,0.09)] border-solid inset-0 pointer-events-none rounded-[15px]"
          />
        </div>

        {/* Thumbnail Gallery */}
        <div className="flex flex-row items-center self-stretch">
          <div className="box-border content-stretch flex flex-col h-full items-start justify-between overflow-clip p-0 relative shrink-0 w-20">
            {/* First 4 thumbnail slots */}
            {[0, 1, 2, 3].map((index) => (
              <div
                key={index}
                className="bg-[rgba(66,66,66,0.3)] h-[49px] relative rounded-[10px] shrink-0 w-20 overflow-hidden"
              >
                {thumbnailImages[index] ? (
                  <img
                    src={thumbnailImages[index]}
                    alt={`${hostelName} thumbnail ${index + 1}`}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.style.display = "none";
                    }}
                  />
                ) : null}
                <div
                  aria-hidden="true"
                  className="absolute border border-[rgba(66,66,66,0.09)] border-solid inset-0 pointer-events-none rounded-[10px]"
                />
              </div>
            ))}

            {/* 5th slot with +X overlay if there are more images */}
            <div
              className={`h-[49px] relative rounded-[10px] shrink-0 w-full overflow-hidden ${
                remainingImages > 0 ? "bg-[#424242]" : "bg-[rgba(66,66,66,0.3)]"
              }`}
            >
              {thumbnailImages[4] && (
                <img
                  src={thumbnailImages[4]}
                  alt={`${hostelName} thumbnail 5`}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.style.display = "none";
                  }}
                />
              )}
              {remainingImages > 0 && (
                <div className="absolute bg-[rgba(66,66,66,0.6)] h-[49px] left-0 top-0 w-20 flex items-center justify-center">
                  <span className="font-['Poppins'] font-medium text-[18px] text-neutral-50 leading-[20px]">
                    +{remainingImages}
                  </span>
                </div>
              )}
              <div
                aria-hidden="true"
                className="absolute border border-[rgba(66,66,66,0.09)] border-solid inset-0 pointer-events-none rounded-[10px]"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Details Section */}
      <div className="basis-0 box-border content-stretch flex flex-col gap-4 grow items-start justify-start min-h-px min-w-px p-0 relative">
        {/* Title */}
        <div className="box-border content-stretch flex flex-col gap-2 items-start justify-start p-0 relative w-full">
          <h3 className="font-['Poppins'] font-bold text-[23px] text-[#1f1f1f] leading-[24px] overflow-hidden text-ellipsis">
            {hostelName}
          </h3>
          <p className="font-['Poppins'] font-normal text-[18px] text-[rgba(66,66,66,0.6)] leading-[25px]">
            {hostelLocation}
          </p>
        </div>

        {/* Highlights/Amenities */}
        {displayedAmenities.length > 0 && (
          <div className="box-border content-stretch flex flex-row gap-2 items-center justify-start p-0 relative shrink-0">
            <div className="box-border content-stretch flex flex-row gap-4 items-start justify-start p-0 relative shrink-0">
              {displayedAmenities.map((amenity, index) => (
                <div
                  key={index}
                  className="box-border content-stretch flex flex-row gap-[5px] items-center justify-start leading-[0] p-0 relative shrink-0"
                >
                  <div className="grid-cols-[max-content] grid-rows-[max-content] inline-grid place-items-start relative shrink-0">
                    <div
                      className="relative size-4"
                      style={{ marginTop: "calc(50% - 8px)" }}
                    >
                      <img
                        src={ASSETS.icons.amenity}
                        alt=""
                        className="block max-w-none size-full"
                      />
                    </div>
                  </div>
                  <div className="flex flex-col font-['Poppins'] font-normal justify-center not-italic relative shrink-0 text-[#1f1f1f] text-[14px] text-left text-nowrap">
                    <p className="block leading-[28px] whitespace-pre">
                      {amenity}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            {remainingAmenities > 0 && (
              <div className="flex flex-col font-['Poppins'] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[12px] text-[rgba(66,66,66,0.6)] text-left text-nowrap">
                <p className="block leading-[28px] whitespace-pre">
                  + {remainingAmenities} more
                </p>
              </div>
            )}
          </div>
        )}

        {/* Rating */}
        {(hostelRating || hostelReviews) && (
          <div className="box-border content-stretch flex flex-row gap-2 items-center justify-start p-0 relative shrink-0">
            <div className="bg-[#ffe536] box-border content-stretch flex flex-row gap-2 items-center justify-start p-[8px] relative rounded-[5px] shrink-0">
              <div className="flex flex-col font-['Poppins'] font-semibold justify-center leading-[0] not-italic relative shrink-0 text-[#1f1f1f] text-[14px] text-left text-nowrap">
                <p className="block leading-[14.4px] whitespace-pre">
                  {hostelRating || "0.0"}
                </p>
              </div>
              <div className="relative shrink-0 size-[9px]">
                <img
                  src={ASSETS.icons.starRating}
                  alt=""
                  className="block max-w-none size-full"
                />
              </div>
            </div>
            <div className="flex flex-col font-['Poppins'] font-semibold justify-center leading-[0] not-italic relative shrink-0 text-[#1f1f1f] text-[14px] text-left text-nowrap">
              <p className="block leading-[14.4px] whitespace-pre">
                ({hostelReviews || 0} Ratings)
              </p>
            </div>
          </div>
        )}

        {/* Price */}
        {hostelPrice && (
          <div className="box-border content-stretch flex flex-row gap-4 items-center justify-start leading-[0] not-italic p-0 relative shrink-0 text-left text-nowrap">
            <div className="flex flex-col font-['Poppins'] font-bold justify-center overflow-ellipsis overflow-hidden relative shrink-0 text-[#1f1f1f] text-[23px]">
              <p className="[text-overflow:inherit] block leading-[24px] overflow-inherit text-nowrap whitespace-pre">
                ₹{hostelPrice.toLocaleString()}
              </p>
            </div>
            {hostelOriginalPrice && (
              <div className="font-['Poppins'] font-semibold relative shrink-0 text-[18px] text-[rgba(66,66,66,0.3)] tracking-[1px]">
                <p className="[text-decoration-line:line-through] [text-decoration-skip-ink:none] [text-decoration-style:solid] [text-underline-position:from-font] block leading-[32px] text-nowrap whitespace-pre">
                  ₹{hostelOriginalPrice.toLocaleString()}
                </p>
              </div>
            )}
          </div>
        )}

        {/* CTA + Wishlist */}
        <div className="box-border content-stretch flex flex-row items-center justify-between p-0 relative shrink-0 w-full">
          <div className="box-border content-stretch flex flex-row gap-2 items-start justify-start p-0 relative shrink-0">
            <button
              onClick={handleViewDetails}
              className="box-border content-stretch flex flex-row gap-2 items-center justify-center px-4 py-2 relative rounded-[10px] shrink-0 border border-[#1f1f1f] bg-transparent hover:bg-gray-50 transition-colors"
            >
              <div className="flex flex-col font-['Poppins'] font-medium h-5 justify-center leading-[0] not-italic relative shrink-0 text-[#1f1f1f] text-[14px] text-center w-[97.881px]">
                <p className="block leading-[20px]">View Details</p>
              </div>
            </button>
            <button
              onClick={handleBookNow}
              className="bg-[#1f1f1f] box-border content-stretch flex flex-row gap-2 items-center justify-center px-4 py-2 relative rounded-[10px] shrink-0 hover:bg-gray-800 transition-colors"
            >
              <div className="flex flex-col font-['Poppins'] font-medium h-5 justify-center leading-[0] not-italic relative shrink-0 text-[14px] text-center text-neutral-50 w-[78.521px]">
                <p className="block leading-[20px]">Book Now</p>
              </div>
            </button>
          </div>
          <div className="flex flex-row items-center self-stretch">
            <button
              onClick={handleWishlist}
              className="h-full relative rounded-[500px] shrink-0 w-9 border border-[rgba(66,66,66,0.09)] hover:bg-gray-50 transition-colors"
            >
              <div className="box-border content-stretch flex flex-col gap-2 h-full items-center justify-center overflow-clip p-[8px] relative w-9">
                <div className="basis-0 box-border content-stretch flex flex-col gap-2 grow items-start justify-start min-h-px min-w-px pb-0 pt-0.5 px-0 relative shrink-0">
                  <div className="aspect-[39.9898/35.4754] basis-0 grow min-h-px min-w-px relative shrink-0">
                    <img
                      src={ASSETS.icons.heartWishlist}
                      alt=""
                      className={`block max-w-none size-full transition-colors ${
                        isWishlisted ? "text-red-500" : "text-gray-400"
                      }`}
                    />
                  </div>
                </div>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImprovedHostelCard;
