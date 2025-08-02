"use client";

import { useRouter } from "next/navigation";
import { useWishlist } from "@/contexts/WishlistContext";
import { getAccessToken } from "@/utils/auth";
import { Icon, ICONS } from "@/components/dashboard/Icons";

const WishlistButton = ({ pgData, className = "", showTooltip = false }) => {
  const router = useRouter();
  const { isInWishlist, toggleWishlist } = useWishlist();

  const isWishlisted = isInWishlist(pgData.id);

  const handleClick = (e) => {
    e.preventDefault();
    e.stopPropagation();

    const token = getAccessToken();
    if (!token) {
      router.push("/auth/login");
      return;
    }

    // Simple toggle for single wishlist
    toggleWishlist(pgData);
  };

  return (
    <button
      onClick={handleClick}
      className={`relative rounded-full border border-gray-200 hover:border-gray-300 transition-all duration-200 group ${className}`}
      title={
        showTooltip
          ? isWishlisted
            ? "Remove from wishlist"
            : "Add to wishlist"
          : ""
      }
    >
      <div className="flex items-center justify-center p-2">
        <Icon
          path={ICONS.heart}
          className={`w-5 h-5 transition-colors ${
            isWishlisted
              ? "text-red-500 fill-current"
              : "text-gray-400 group-hover:text-red-400"
          }`}
        />
      </div>
    </button>
  );
};

export default WishlistButton;
