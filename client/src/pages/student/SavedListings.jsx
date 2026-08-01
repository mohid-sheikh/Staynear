import { useWishlist } from "../../hooks/useWishlist.js";
import ListingCard from "../../components/listings/ListingCard.jsx";
import EmptyState from "../../components/common/EmptyState.jsx";
import Loader from "../../components/common/Loader.jsx";
import { HiHeart } from "react-icons/hi";

const SavedListings = () => {
  const { wishlist, loadingWishlist } = useWishlist();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="space-y-1">
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
          <HiHeart className="text-orange-500" />
          <span>Saved Accommodations</span>
        </h1>
        <p className="text-slate-500 text-sm">
          Your saved student rooms, PGs, and hostels synced to your account
        </p>
      </div>

      {loadingWishlist ? (
        <Loader message="Loading your saved wishlist..." />
      ) : wishlist.length === 0 ? (
        <EmptyState
          icon={HiHeart}
          title="Your Wishlist is Empty"
          message="You haven't saved any accommodations yet. Browse explore listings and tap the heart icon to save your favorite rooms."
          actionText="Explore Campus Listings"
          onAction={() => (window.location.href = "/listings")}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {wishlist.map((item) => (
            <ListingCard key={item._id} listing={item} />
          ))}
        </div>
      )}
    </div>
  );
};

export default SavedListings;
