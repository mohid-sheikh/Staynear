import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getStudentVisitRequests, updateVisitStatus } from "../../services/visitService.js";
import Loader from "../../components/common/Loader.jsx";
import EmptyState from "../../components/common/EmptyState.jsx";
import Modal from "../../components/common/Modal.jsx";
import { 
  HiCalendar, 
  HiClock, 
  HiLocationMarker, 
  HiUser, 
  HiPhone, 
  HiMail, 
  HiVideoCamera, 
  HiUserGroup, 
  HiBan,
  HiPhotograph
} from "react-icons/hi";
import toast from "react-hot-toast";

const StudentVisits = () => {
  const [visits, setVisits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancelId, setCancelId] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);

  const fetchVisits = async () => {
    setLoading(true);
    try {
      const data = await getStudentVisitRequests();
      if (data.success) {
        setVisits(data.visits || []);
      }
    } catch (err) {
      console.error("Failed to load student visits:", err);
      toast.error("Failed to load your scheduled visit requests.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVisits();
  }, []);

  const handleCancelVisit = async () => {
    if (!cancelId) return;
    setUpdatingId(cancelId);
    try {
      const res = await updateVisitStatus(cancelId, "cancelled");
      if (res.success) {
        toast.success("Visit request cancelled.");
        setVisits((prev) =>
          prev.map((v) => (v._id === cancelId ? { ...v, status: "cancelled" } : v))
        );
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to cancel visit request.");
    } finally {
      setUpdatingId(null);
      setCancelId(null);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "approved":
        return <span className="px-3 py-1 bg-emerald-100 text-emerald-700 text-xs font-bold rounded-full">Approved</span>;
      case "pending":
        return <span className="px-3 py-1 bg-amber-100 text-amber-700 text-xs font-bold rounded-full">Pending Approval</span>;
      case "rejected":
        return <span className="px-3 py-1 bg-rose-100 text-rose-700 text-xs font-bold rounded-full">Rejected</span>;
      case "completed":
        return <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-bold rounded-full">Completed</span>;
      case "cancelled":
        return <span className="px-3 py-1 bg-slate-100 text-slate-600 text-xs font-bold rounded-full">Cancelled</span>;
      default:
        return <span className="px-3 py-1 bg-slate-100 text-slate-600 text-xs font-bold rounded-full">{status}</span>;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Page Header */}
      <div className="space-y-1">
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-3">
          <HiCalendar className="text-orange-500" />
          <span>My Scheduled Property Visits</span>
        </h1>
        <p className="text-slate-500 text-sm">
          Track, manage, and monitor status updates for your in-person and virtual property tours
        </p>
      </div>

      {loading ? (
        <Loader message="Loading your visit requests..." />
      ) : visits.length === 0 ? (
        <EmptyState
          icon={HiCalendar}
          title="No Visit Requests Found"
          message="You haven't requested any property visits yet. Browse campus rooms and click 'Schedule Property Visit' to book a tour."
          actionText="Explore Campus Rooms"
          onAction={() => (window.location.href = "/listings")}
        />
      ) : (
        <div className="space-y-4">
          {visits.map((visit) => {
            const listing = visit.listing || {};
            const owner = visit.owner || {};
            const images = listing.images || [];
            const coverImage = images.length > 0 ? getImageUrl(images[0]) : null;
            const visitDateFormatted = visit.visitDate
              ? new Date(visit.visitDate).toLocaleDateString("en-IN", {
                  weekday: "short",
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })
              : "Date TBD";

            return (
              <div
                key={visit._id}
                className="bg-white rounded-3xl p-6 border border-slate-100 shadow-xs hover:shadow-md transition-all flex flex-col md:flex-row gap-6 items-start md:items-center justify-between"
              >
                {/* Left Side: Property Thumbnail & Details */}
                <div className="flex items-start gap-4 flex-1">
                  <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden bg-slate-100 shrink-0 border border-slate-100 relative">
                    {coverImage ? (
                      <img
                        src={coverImage}
                        alt={listing.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center text-slate-400">
                        <HiPhotograph className="text-2xl" />
                        <span className="text-[9px] font-bold uppercase mt-1">No Photo</span>
                      </div>
                    )}
                  </div>

                  <div className="space-y-1.5 flex-1">
                    <div className="flex items-center gap-2">
                      {getStatusBadge(visit.status)}
                      <span className="text-[11px] font-bold px-2.5 py-0.5 bg-blue-50 text-blue-700 rounded-full inline-flex items-center gap-1">
                        {visit.visitType === "Virtual Tour" ? <HiVideoCamera /> : <HiUserGroup />}
                        <span>{visit.visitType || "In-Person"}</span>
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-slate-900 line-clamp-1">
                      {listing.title || "Property Accommodation"}
                    </h3>

                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500 font-medium">
                      <span className="flex items-center gap-1">
                        <HiLocationMarker className="text-orange-500" />
                        {listing.area}, {listing.city}
                      </span>
                      <span className="font-bold text-slate-900">
                        ₹{Number(listing.rent || 0).toLocaleString("en-IN")} / mo
                      </span>
                    </div>

                    <div className="pt-2 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs border-t border-slate-100">
                      <div className="flex items-center gap-1.5 text-slate-700 font-semibold">
                        <HiCalendar className="text-orange-500" />
                        <span>{visitDateFormatted}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-slate-700 font-semibold">
                        <HiClock className="text-blue-600" />
                        <span>{visit.visitTime}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Side: Owner Info & Action */}
                <div className="w-full md:w-auto border-t md:border-t-0 md:border-l border-slate-100 pt-4 md:pt-0 md:pl-6 space-y-3 shrink-0 flex flex-col justify-between">
                  <div className="space-y-1 text-xs">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                      Property Owner
                    </span>
                    <p className="font-bold text-slate-900 flex items-center gap-1">
                      <HiUser className="text-blue-600" />
                      <span>{owner.name || "Owner"}</span>
                    </p>
                    {owner.phone && (
                      <p className="text-slate-500 flex items-center gap-1">
                        <HiPhone className="text-emerald-500" />
                        <a href={`tel:${owner.phone}`} className="hover:underline">{owner.phone}</a>
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    {listing._id && (
                      <Link
                        to={`/listings/${listing._id}`}
                        className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-colors"
                      >
                        View Listing
                      </Link>
                    )}

                    {visit.status === "pending" && (
                      <button
                        onClick={() => setCancelId(visit._id)}
                        disabled={updatingId === visit._id}
                        className="px-3.5 py-2 bg-red-50 hover:bg-red-100 text-red-600 font-bold text-xs rounded-xl flex items-center gap-1 cursor-pointer transition-colors"
                      >
                        <HiBan />
                        <span>Cancel Request</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Cancel Confirmation Modal */}
      <Modal
        isOpen={!!cancelId}
        onClose={() => setCancelId(null)}
        title="Cancel Visit Request"
      >
        <div className="space-y-4">
          <p className="text-sm text-slate-600">
            Are you sure you want to cancel this property visit request?
          </p>
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              onClick={() => setCancelId(null)}
              className="px-4 py-2 bg-slate-100 text-slate-700 font-semibold text-xs rounded-xl"
            >
              No, Keep Request
            </button>
            <button
              onClick={handleCancelVisit}
              disabled={!!updatingId}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs rounded-xl shadow-sm cursor-pointer"
            >
              {updatingId ? "Cancelling..." : "Yes, Cancel Visit"}
            </button>
          </div>
        </div>
      </Modal>

    </div>
  );
};

export default StudentVisits;
