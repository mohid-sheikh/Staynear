import { useWishlist } from "../../hooks/useWishlist.js";
import ListingCard from "../../components/listings/ListingCard.jsx";
import EmptyState from "../../components/common/EmptyState.jsx";
import { HiClock } from "react-icons/hi";

const RecentlyViewed = () => {
  const { recentlyViewed } = useWishlist();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="space-y-1">
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
          <HiClock className="text-blue-600" />
          <span>Recently Viewed Accommodations</span>
        </h1>
        <p className="text-slate-500 text-sm">
          History of property listings you inspected during your search
        </p>
      </div>

      {recentlyViewed.length === 0 ? (
        <EmptyState
          icon={HiClock}
          title="No Browsing History Yet"
          message="You haven't inspected any property details pages yet."
          actionText="Browse Campus Rooms"
          onAction={() => window.location.href = "/listings"}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recentlyViewed.map((item) => (
            <ListingCard key={item._id} listing={item} />
          ))}
        </div>
      )}
    </div>
  );
};

export default RecentlyViewed;
