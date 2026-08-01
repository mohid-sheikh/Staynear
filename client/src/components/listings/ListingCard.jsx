import { Link } from "react-router-dom";
import { HiLocationMarker, HiHeart, HiOutlineHeart } from "react-icons/hi";
import { FaGraduationCap } from "react-icons/fa";
import { useWishlist } from "../../hooks/useWishlist.js";
import StatusBadge from "../dashboard/StatusBadge.jsx";

const DEFAULT_IMAGE = "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=800&q=80";

const ListingCard = ({ listing }) => {
  const { isWishlisted, toggleWishlist } = useWishlist();

  if (!listing) return null;

  const {
    _id,
    title,
    description,
    rent,
    city,
    area,
    collegeNearby,
    roomType,
    images = [],
    status = "available",
  } = listing;

  const coverImage = images.length > 0 ? images[0] : DEFAULT_IMAGE;
  const wishlisted = isWishlisted(_id);

  return (
    <div className="bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-xs hover:shadow-xl transition-all duration-300 group flex flex-col h-full relative">
      
      {/* Image Container */}
      <div className="relative h-52 sm:h-56 bg-slate-100 overflow-hidden shrink-0">
        <img
          src={coverImage}
          alt={title}
          onError={(e) => { e.target.src = DEFAULT_IMAGE; }}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />

        {/* Room Type Badge */}
        <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-blue-700 shadow-xs">
          {roomType}
        </div>

        {/* Status Badge */}
        <div className="absolute top-3 left-28 shadow-sm">
          <StatusBadge status={status} />
        </div>

        {/* Heart Wishlist Button */}
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleWishlist(listing);
          }}
          className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center text-slate-700 hover:text-orange-500 transition-colors shadow-sm cursor-pointer"
          title={wishlisted ? "Remove from wishlist" : "Save to wishlist"}
        >
          {wishlisted ? (
            <HiHeart className="text-orange-500 text-xl" />
          ) : (
            <HiOutlineHeart className="text-xl" />
          )}
        </button>

        {/* Price Tag Overlay */}
        <div className="absolute bottom-3 right-3 bg-slate-900/90 backdrop-blur-md text-white px-3 py-1 rounded-xl text-xs font-extrabold shadow-md">
          ₹{rent ? Number(rent).toLocaleString("en-IN") : "0"} <span className="text-[10px] font-normal text-slate-300">/ mo</span>
        </div>
      </div>

      {/* Card Content */}
      <div className="p-5 flex flex-col flex-grow justify-between">
        <div>
          {/* Location Line */}
          <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 mb-2">
            <HiLocationMarker className="text-orange-500 shrink-0" />
            <span className="truncate">{area}, {city}</span>
          </div>

          {/* Title */}
          <h3 className="text-base font-bold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-1">
            {title}
          </h3>

          {/* Description */}
          <p className="text-xs text-slate-500 mt-2 line-clamp-2 leading-relaxed">
            {description}
          </p>
        </div>

        {/* Card Footer Info */}
        <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-1 text-xs font-semibold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-lg max-w-[170px] truncate">
            <FaGraduationCap className="shrink-0" />
            <span className="truncate">{collegeNearby}</span>
          </div>

          <Link
            to={`/listings/${_id}`}
            className="px-3 py-1.5 bg-slate-900 hover:bg-blue-600 text-white text-xs font-semibold rounded-xl transition-colors shrink-0"
          >
            View Details
          </Link>
        </div>
      </div>

    </div>
  );
};

export default ListingCard;
