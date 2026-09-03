import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getOwnerVisitRequests, updateVisitStatus } from "../../services/visitService.js";
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
  HiCheck, 
  HiX, 
  HiCheckCircle,
  HiVideoCamera,
  HiUserGroup,
  HiChatAlt2,
  HiAcademicCap
} from "react-icons/hi";
import toast from "react-hot-toast";

const OwnerVisits = () => {
  const [visits, setVisits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionModal, setActionModal] = useState({ isOpen: false, visitId: null, targetStatus: null, actionLabel: "" });
  const [updatingId, setUpdatingId] = useState(null);

  const fetchVisits = async () => {
    setLoading(true);
    try {
      const data = await getOwnerVisitRequests();
      if (data.success) {
        setVisits(data.visits || []);
      }
    } catch (err) {
      console.error("Failed to load owner visits:", err);
      toast.error("Failed to load property visit requests.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVisits();
  }, []);

  const triggerActionModal = (visitId, targetStatus, actionLabel) => {
    setActionModal({
      isOpen: true,
      visitId,
      targetStatus,
      actionLabel,
    });
  };

  const handleConfirmStatusChange = async () => {
    const { visitId, targetStatus } = actionModal;
    if (!visitId || !targetStatus) return;

    setUpdatingId(visitId);
    try {
      const res = await updateVisitStatus(visitId, targetStatus);
      if (res.success) {
        toast.success(`Visit request updated to '${targetStatus}'.`);
        setVisits((prev) =>
          prev.map((v) => (v._id === visitId ? { ...v, status: targetStatus } : v))
        );
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update visit status.");
    } finally {
      setUpdatingId(null);
      setActionModal({ isOpen: false, visitId: null, targetStatus: null, actionLabel: "" });
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "approved":
        return <span className="px-3 py-1 bg-emerald-100 text-emerald-700 text-xs font-bold rounded-full">Approved</span>;
      case "pending":
        return <span className="px-3 py-1 bg-amber-100 text-amber-700 text-xs font-bold rounded-full">Pending Action</span>;
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
          <HiCalendar className="text-blue-600" />
          <span>Incoming Property Visit Requests</span>
        </h1>
        <p className="text-slate-500 text-sm">
          Review, approve, reject, and monitor student visit bookings for your accommodations
        </p>
      </div>

      {loading ? (
        <Loader message="Fetching visit requests for your properties..." />
      ) : visits.length === 0 ? (
        <EmptyState
          icon={HiCalendar}
          title="No Visit Requests Received"
          message="You haven't received any student visit requests yet. Maintain accurate property details to attract interested students."
          actionText="Manage My Listings"
          onAction={() => (window.location.href = "/owner/listings")}
        />
      ) : (
        <div className="space-y-4">
          {visits.map((visit) => {
            const student = visit.student || {};
            const listing = visit.listing || {};
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
                className="bg-white rounded-3xl p-6 border border-slate-100 shadow-xs hover:shadow-md transition-all space-y-4"
              >
                {/* Top Row: Listing & Status */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
                  <div>
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-blue-600 block">
                      Target Accommodation
                    </span>
                    <h3 className="text-base font-bold text-slate-900">
                      {listing.title || "Accommodation Property"}
                    </h3>
                    <div className="flex items-center gap-3 text-xs text-slate-500 font-medium mt-0.5">
                      <span className="flex items-center gap-1">
                        <HiLocationMarker className="text-orange-500" />
                        {listing.area}, {listing.city}
                      </span>
                      <span className="font-bold text-slate-800">
                        ₹{Number(listing.rent || 0).toLocaleString("en-IN")} / mo
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-start sm:self-auto">
                    {getStatusBadge(visit.status)}
                    <span className="text-[11px] font-bold px-2.5 py-0.5 bg-blue-50 text-blue-700 rounded-full inline-flex items-center gap-1">
                      {visit.visitType === "Virtual Tour" ? <HiVideoCamera /> : <HiUserGroup />}
                      <span>{visit.visitType || "In-Person"}</span>
                    </span>
                  </div>
                </div>

                {/* Middle Row: Student Information & Requested Schedule */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-1">
                  
                  {/* Student Details */}
                  <div className="bg-slate-50 rounded-2xl p-4 space-y-2 border border-slate-100 text-xs">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                      Student Details
                    </span>
                    <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
                      <HiUser className="text-blue-600 shrink-0 text-base" />
                      <span>{student.name || "Student"}</span>
                    </div>
                    {student.college && (
                      <div className="flex items-center gap-2 text-slate-600">
                        <HiAcademicCap className="text-blue-500 shrink-0 text-base" />
                        <span>{student.college}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2 text-slate-700 font-semibold pt-1">
                      <HiPhone className="text-emerald-600 shrink-0 text-base" />
                      <a href={`tel:${visit.studentPhone || student.phone}`} className="hover:underline text-blue-600">
                        {visit.studentPhone || student.phone || "No phone provided"}
                      </a>
                    </div>
                    {student.email && (
                      <div className="flex items-center gap-2 text-slate-600">
                        <HiMail className="text-slate-400 shrink-0 text-base" />
                        <a href={`mailto:${student.email}`} className="hover:underline">{student.email}</a>
                      </div>
                    )}
                  </div>

                  {/* Visit Timing & Notes */}
                  <div className="bg-slate-50 rounded-2xl p-4 space-y-2 border border-slate-100 text-xs">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                      Requested Schedule & Notes
                    </span>
                    <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
                      <HiCalendar className="text-orange-500 text-base shrink-0" />
                      <span>{visitDateFormatted}</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-700 font-semibold">
                      <HiClock className="text-blue-600 text-base shrink-0" />
                      <span>{visit.visitTime}</span>
                    </div>
                    {visit.message ? (
                      <div className="mt-2 pt-2 border-t border-slate-200/60 text-slate-600 flex items-start gap-1.5">
                        <HiChatAlt2 className="text-slate-400 shrink-0 text-sm mt-0.5" />
                        <p className="italic leading-relaxed text-[11px]">"{visit.message}"</p>
                      </div>
                    ) : (
                      <p className="text-[11px] text-slate-400 pt-1">No additional message provided.</p>
                    )}
                  </div>

                </div>

                {/* Bottom Row: Actions */}
                <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                  <Link
                    to={`/listings/${listing._id}`}
                    className="text-xs font-bold text-blue-600 hover:underline"
                  >
                    View Accommodation Page →
                  </Link>

                  <div className="flex items-center gap-2">
                    {visit.status === "pending" && (
                      <>
                        <button
                          onClick={() => triggerActionModal(visit._id, "rejected", "Reject")}
                          disabled={updatingId === visit._id}
                          className="px-4 py-2 bg-rose-50 hover:bg-rose-100 text-rose-600 font-extrabold text-xs rounded-xl flex items-center gap-1.5 cursor-pointer transition-colors"
                        >
                          <HiX />
                          <span>Reject</span>
                        </button>

                        <button
                          onClick={() => triggerActionModal(visit._id, "approved", "Approve")}
                          disabled={updatingId === visit._id}
                          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl shadow-md shadow-emerald-500/20 flex items-center gap-1.5 cursor-pointer transition-colors"
                        >
                          <HiCheck />
                          <span>Approve Visit</span>
                        </button>
                      </>
                    )}

                    {visit.status === "approved" && (
                      <button
                        onClick={() => triggerActionModal(visit._id, "completed", "Mark as Completed")}
                        disabled={updatingId === visit._id}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs rounded-xl shadow-md shadow-blue-500/20 flex items-center gap-1.5 cursor-pointer transition-colors"
                      >
                        <HiCheckCircle />
                        <span>Mark Completed</span>
                      </button>
                    )}
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      )}

      {/* Confirmation Modal */}
      <Modal
        isOpen={actionModal.isOpen}
        onClose={() => setActionModal({ isOpen: false, visitId: null, targetStatus: null, actionLabel: "" })}
        title={`Confirm ${actionModal.actionLabel}`}
      >
        <div className="space-y-4">
          <p className="text-sm text-slate-600">
            Are you sure you want to <strong>{actionModal.actionLabel.toLowerCase()}</strong> this visit request?
          </p>
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              onClick={() => setActionModal({ isOpen: false, visitId: null, targetStatus: null, actionLabel: "" })}
              className="px-4 py-2 bg-slate-100 text-slate-700 font-semibold text-xs rounded-xl"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirmStatusChange}
              disabled={!!updatingId}
              className={`px-4 py-2 text-white font-extrabold text-xs rounded-xl shadow-sm cursor-pointer ${
                actionModal.targetStatus === "rejected"
                  ? "bg-rose-600 hover:bg-rose-700"
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              {updatingId ? "Updating..." : `Confirm ${actionModal.actionLabel}`}
            </button>
          </div>
        </div>
      </Modal>

    </div>
  );
};

export default OwnerVisits;
