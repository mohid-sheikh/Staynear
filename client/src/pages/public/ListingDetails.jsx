import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { getSingleListing } from "../../services/listingService.js";
import ImageCarousel from "../../components/listings/ImageCarousel.jsx";
import ReviewSection from "../../components/listings/ReviewSection.jsx";
import StatusBadge from "../../components/dashboard/StatusBadge.jsx";
import Loader from "../../components/common/Loader.jsx";
import ErrorState from "../../components/common/ErrorState.jsx";
import LocationMap from "../../components/maps/LocationMap.jsx";
import ScheduleVisitModal from "../../components/visits/ScheduleVisitModal.jsx";
import { useWishlist } from "../../hooks/useWishlist.js";
import { useAuth } from "../../hooks/useAuth.js";
import { 
  HiLocationMarker, 
  HiHeart, 
  HiOutlineHeart, 
  HiPhone, 
  HiMail, 
  HiCheckCircle, 
  HiUserCircle,
  HiShieldCheck,
  HiShare,
  HiCalendar
} from "react-icons/hi";
import toast from "react-hot-toast";

const ListingDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [isVisitModalOpen, setIsVisitModalOpen] = useState(false);
  const { isWishlisted, toggleWishlist, addRecentlyViewed } = useWishlist();

  const fetchDetails = async () => {
    setLoading(true);
    setError(false);
    try {
      const data = await getSingleListing(id);
      if (data.success && data.listing) {
        setListing(data.listing);
        addRecentlyViewed(data.listing);
      } else {
        setError(true);
      }
    } catch (err) {
      console.error("Error loading listing details:", err);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDetails();
  }, [id]);

  if (loading) return <Loader message="Loading property details..." />;
  if (error || !listing) return <ErrorState onRetry={fetchDetails} message="Property listing not found or has been removed." />;

  const {
    _id,
    title,
    description,
    rent,
    city,
    area,
    collegeNearby,
    roomType,
    amenities = [],
    images = [],
    location,
    owner,
    status = "available",
  } = listing;

  const wishlisted = isWishlisted(_id);

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Listing link copied to clipboard!");
    }
  };

  const handleScheduleVisitClick = () => {
    if (!user) {
      toast.error("Please login to schedule a property visit.");
      navigate("/login");
      return;
    }
    if (user.role === "owner" && owner?._id === user.id) {
      toast.error("You cannot schedule a visit for your own property.");
      return;
    }
    setIsVisitModalOpen(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Top Breadcrumb & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 mb-1">
            <Link to="/" className="hover:text-blue-600">Home</Link>
            <span>/</span>
            <Link to="/listings" className="hover:text-blue-600">Listings</Link>
            <span>/</span>
            <span className="text-slate-600 line-clamp-1">{title}</span>
          </div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 leading-snug">
              {title}
            </h1>
            <StatusBadge status={status} />
          </div>
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 mt-2">
            <HiLocationMarker className="text-orange-500 text-base shrink-0" />
            <span>{location?.address || `${area}, ${city}`}</span>
            <span>•</span>
            <span className="text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-full font-bold">
              {roomType}
            </span>
          </div>
        </div>

        {/* Wishlist & Share Buttons */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={handleShare}
            className="px-4 py-2.5 bg-white border border-slate-200 hover:bg-slate-50 rounded-xl text-slate-700 font-semibold text-xs flex items-center gap-1.5 shadow-2xs transition-all cursor-pointer"
          >
            <HiShare className="text-base" />
            <span>Share</span>
          </button>

          <button
            onClick={() => toggleWishlist(listing)}
            className="px-4 py-2.5 bg-white border border-slate-200 hover:bg-slate-50 rounded-xl text-slate-700 font-semibold text-xs flex items-center gap-1.5 shadow-2xs transition-all cursor-pointer"
          >
            {wishlisted ? (
              <>
                <HiHeart className="text-orange-500 text-lg" />
                <span className="text-orange-600 font-bold">Saved</span>
              </>
            ) : (
              <>
                <HiOutlineHeart className="text-lg" />
                <span>Save</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Main Grid: Photo Gallery & Quick Details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left 2 Columns: Photo Carousel, Overview, Description, Amenities, Location Map, Reviews */}
        <div className="lg:col-span-2 space-y-8">
          
          <ImageCarousel images={images} />

          {/* Key Overview Cards */}
          <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-xs grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
            <div className="p-3 bg-slate-50 rounded-2xl">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Monthly Rent</span>
              <span className="text-lg font-black text-orange-600">₹{Number(rent).toLocaleString("en-IN")}</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-2xl">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Room Type</span>
              <span className="text-sm font-bold text-slate-800">{roomType}</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-2xl">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Status</span>
              <div className="mt-1 flex justify-center">
                <StatusBadge status={status} />
              </div>
            </div>
            <div className="p-3 bg-slate-50 rounded-2xl">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Near Campus</span>
              <span className="text-xs font-bold text-blue-600 line-clamp-1">{collegeNearby}</span>
            </div>
          </div>

          {/* Description */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-xs space-y-4">
            <h3 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3">
              About This Accommodation
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-line">
              {description}
            </p>
          </div>

          {/* Amenities */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-xs space-y-4">
            <h3 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3">
              Amenities & Facilities
            </h3>
            {amenities.length === 0 ? (
              <p className="text-xs text-slate-400">No specific amenities listed.</p>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {amenities.map((amenity, idx) => (
                  <div key={idx} className="flex items-center gap-2 p-3 bg-slate-50 rounded-2xl text-xs font-semibold text-slate-700 border border-slate-100">
                    <HiCheckCircle className="text-emerald-500 text-base shrink-0" />
                    <span>{amenity}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Property Location Map Section */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-xs space-y-4">
            <h3 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3">
              Property Location & Map
            </h3>
            <LocationMap location={location} title={title} area={area} city={city} />
          </div>

          {/* Reviews Component */}
          <ReviewSection listingId={_id} />

        </div>

        {/* Right Column: Owner Contact Card */}
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-xl space-y-6 sticky top-24">
            
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Price</span>
                <span className="text-3xl font-black text-slate-900">
                  ₹{Number(rent).toLocaleString("en-IN")}
                </span>
                <span className="text-xs text-slate-400 font-medium"> / month</span>
              </div>
              <div className="px-3 py-1 bg-emerald-100 text-emerald-700 text-xs font-extrabold rounded-full">
                Zero Brokerage
              </div>
            </div>

            {/* Owner Contact Information */}
            <div className="space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Property Owner Contact
              </h4>

              <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-2xl">
                <div className="w-12 h-12 rounded-xl bg-blue-600 text-white flex items-center justify-center text-xl font-bold">
                  <HiUserCircle className="text-2xl" />
                </div>
                <div>
                  <h5 className="font-bold text-slate-900 text-sm">{owner?.name || "Verified Owner"}</h5>
                  <p className="text-xs text-slate-500 font-medium">{owner?.college || "Property Owner"}</p>
                </div>
              </div>

              {/* Schedule Property Visit CTA */}
              <button
                onClick={handleScheduleVisitClick}
                className="w-full py-3.5 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-extrabold text-sm rounded-2xl shadow-md shadow-orange-500/20 flex items-center justify-center gap-2 transition-all hover:scale-[1.01] active:scale-95 cursor-pointer"
              >
                <HiCalendar className="text-lg" />
                <span>Schedule Property Visit</span>
              </button>

              {owner?.phone && (
                <a
                  href={`tel:${owner.phone}`}
                  className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-2xl flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <HiPhone className="text-base" />
                  <span>Call Owner ({owner.phone})</span>
                </a>
              )}

              {owner?.email && (
                <a
                  href={`mailto:${owner.email}?subject=Inquiry%20regarding%20${encodeURIComponent(title)}`}
                  className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-2xl flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <HiMail className="text-base" />
                  <span>Email Owner</span>
                </a>
              )}

              <div className="pt-2 text-[11px] text-slate-400 flex items-center gap-1.5 justify-center">
                <HiShieldCheck className="text-blue-600 text-base" />
                <span>Verified StayNear Accommodation Listing</span>
              </div>
            </div>

          </div>
        </div>

      </div>

      {/* Schedule Visit Modal */}
      <ScheduleVisitModal
        isOpen={isVisitModalOpen}
        onClose={() => setIsVisitModalOpen(false)}
        listingId={_id}
        listingTitle={title}
      />

    </div>
  );
};

export default ListingDetails;
