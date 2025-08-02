import WishlistPage from "@/components/wishlist/WishlistPage";

export default function WishlistRoute({ params }) {
  return <WishlistPage wishlistId={params.id} />;
}
