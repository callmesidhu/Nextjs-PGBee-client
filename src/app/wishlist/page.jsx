"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useWishlist } from "@/contexts/WishlistContext";
import { getAccessToken } from "@/utils/auth";
import { Icon, ICONS } from "@/components/dashboard/Icons";

export default function WishlistPage() {
  const router = useRouter();
  const { wishlistItems, getTotalItemsCount, removeFromWishlist } =
    useWishlist();

  useEffect(() => {
    const token = getAccessToken();
    if (!token) {
      router.push("/auth/login");
    }
  }, [router]);

  const handlePropertyClick = (propertyId) => {
    router.push(`/${propertyId}`);
  };

  const handleRemoveFromWishlist = (propertyId) => {
    removeFromWishlist(propertyId);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">My Wishlist</h1>
              <p className="text-gray-600 mt-2">
                {getTotalItemsCount()} saved properties
              </p>
            </div>
            <button
              onClick={() => router.push("/")}
              className="px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors flex items-center gap-2"
            >
              <Icon path={ICONS.plus} className="w-5 h-5" />
              Browse Properties
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8">
        {wishlistItems.length === 0 ? (
          <div className="text-center py-12">
            <Icon
              path={ICONS.heart}
              className="w-20 h-20 text-gray-300 mx-auto mb-6"
            />
            <h3 className="text-2xl font-semibold text-gray-600 mb-4">
              Your wishlist is empty
            </h3>
            <p className="text-gray-500 mb-8 max-w-md mx-auto">
              Start adding properties to your wishlist by clicking the heart
              icon on any property you like.
            </p>
            <button
              onClick={() => router.push("/")}
              className="px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
            >
              Browse Properties
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {wishlistItems.map((property) => (
              <div
                key={property.id}
                className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
              >
                {/* Property Image */}
                <div className="relative h-48 bg-gray-200">
                  {property.images && property.images.length > 0 ? (
                    <img
                      src={property.images[0]}
                      alt={property.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.src = "/images/placeholder-hostel.jpg";
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      <Icon path={ICONS.image} className="w-12 h-12" />
                    </div>
                  )}

                  {/* Remove from wishlist button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveFromWishlist(property.id);
                    }}
                    className="absolute top-3 right-3 w-8 h-8 bg-white/90 rounded-full flex items-center justify-center hover:bg-white transition-colors"
                  >
                    <Icon path={ICONS.heart} className="w-4 h-4 text-red-500" />
                  </button>
                </div>

                {/* Property Details */}
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-1">
                    {property.name}
                  </h3>
                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                    {property.address}
                  </p>

                  {/* Price */}
                  <div className="flex items-center justify-between">
                    <div className="text-lg font-bold text-gray-900">
                      ₹{property.price?.toLocaleString()}/month
                    </div>
                    <button
                      onClick={() => handlePropertyClick(property.id)}
                      className="px-4 py-2 bg-gray-900 text-white text-sm rounded-lg hover:bg-gray-800 transition-colors"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
