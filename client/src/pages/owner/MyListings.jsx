import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getMyListings, deleteListing, updateListingStatus } from "../../services/listingService.js";
import ListingCard from "../../components/listings/ListingCard.jsx";
import Loader from "../../components/common/Loader.jsx";
import EmptyState from "../../components/common/EmptyState.jsx";
import Modal from "../../components/common/Modal.jsx";
import { HiPlus, HiPencilAlt, HiTrash, HiEye } from "react-icons/hi";
import toast from "react-hot-toast";

const MyListings = () => {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState(null);
  const [updatingStatusId, setUpdatingStatusId] = useState(null);

  const fetchMine = async () => {
    setLoading(true);
    try {
      const data = await getMyListings();
      if (data.success) {
        setListings(data.listings || []);
      }
    } catch (err) {
      console.error("Failed to load listings:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMine();
  }, []);

  const handleStatusChange = async (id, newStatus) => {
    setUpdatingStatusId(id);
    try {
      const res = await updateListingStatus(id, newStatus);
      if (res.success) {
        toast.success(`Property status updated to "${newStatus}"`);
        setListings((prev) =>
          prev.map((item) =>
            item._id === id ? { ...item, status: newStatus, available: newStatus === "available" } : item
          )
        );
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update property status");
    } finally {
      setUpdatingStatusId(null);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      const data = await deleteListing(deleteId);
      if (data.success) {
        toast.success("Listing deleted successfully!");
        setListings((prev) => prev.filter((l) => l._id !== deleteId));
      }
    } catch (err) {
      toast.error("Failed to delete listing.");
    } finally {
      setDeleteId(null);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            My Accommodations
          </h1>
          <p className="text-slate-500 text-sm">
            Manage, update status, and monitor all properties listed under your account
          </p>
        </div>

        <Link
          to="/owner/create-listing"
          className="px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white font-extrabold text-sm rounded-2xl shadow-md flex items-center justify-center gap-2 transition-all"
        >
          <HiPlus className="text-lg" />
          <span>Post New Property</span>
        </Link>
      </div>

      {loading ? (
        <Loader message="Fetching your property listings..." />
      ) : listings.length === 0 ? (
        <EmptyState
          title="No Properties Posted Yet"
          message="You haven't added any accommodations to StayNear. Start reaching students by posting your first property."
          actionText="Create Listing Now"
          onAction={() => window.location.href = "/owner/create-listing"}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {listings.map((item) => (
            <div key={item._id} className="relative flex flex-col">
              <ListingCard listing={item} />
              
              {/* Owner Control Overlay Bar */}
              <div className="mt-3 bg-white rounded-2xl p-3 border border-slate-100 shadow-2xs space-y-2">
                
                {/* Status Selector Dropdown */}
                <div className="flex items-center justify-between gap-2 border-b border-slate-100 pb-2">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    Change Status:
                  </span>
                  <select
                    disabled={updatingStatusId === item._id}
                    value={item.status || (item.available ? "available" : "occupied")}
                    onChange={(e) => handleStatusChange(item._id, e.target.value)}
                    className="bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1 text-xs font-bold text-slate-800 cursor-pointer focus:outline-none focus:border-blue-600"
                  >
                    <option value="available">Available (Green)</option>
                    <option value="booked">Booked (Amber)</option>
                    <option value="occupied">Occupied (Slate)</option>
                  </select>
                </div>

                {/* Quick Actions */}
                <div className="flex items-center justify-between gap-2 pt-1">
                  <Link
                    to={`/listings/${item._id}`}
                    className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl flex items-center gap-1"
                  >
                    <HiEye /> View Public
                  </Link>

                  <div className="flex items-center gap-2">
                    <Link
                      to={`/owner/edit-listing/${item._id}`}
                      className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-600 font-bold text-xs rounded-xl flex items-center gap-1"
                    >
                      <HiPencilAlt /> Edit
                    </Link>

                    <button
                      onClick={() => setDeleteId(item._id)}
                      className="px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 font-bold text-xs rounded-xl flex items-center gap-1 cursor-pointer"
                    >
                      <HiTrash /> Delete
                    </button>
                  </div>
                </div>

              </div>
            </div>
          ))}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        title="Delete Accommodation"
      >
        <div className="space-y-4">
          <p className="text-sm text-slate-600">
            Are you sure you want to delete this property listing?
          </p>
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              onClick={() => setDeleteId(null)}
              className="px-4 py-2 bg-slate-100 text-slate-700 font-semibold text-xs rounded-xl"
            >
              Cancel
            </button>
            <button
              onClick={handleDelete}
              className="px-4 py-2 bg-red-600 text-white font-extrabold text-xs rounded-xl shadow-sm"
            >
              Delete
            </button>
          </div>
        </div>
      </Modal>

    </div>
  );
};

export default MyListings;
