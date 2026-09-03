import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getMyListings, deleteListing } from "../../services/listingService.js";
import { getOwnerAnalytics } from "../../services/dashboardService.js";
import { getOwnerVisitRequests } from "../../services/visitService.js";
import DashboardStatCard from "../../components/dashboard/DashboardStatCard.jsx";
import StatusBadge from "../../components/dashboard/StatusBadge.jsx";
import Loader from "../../components/common/Loader.jsx";
import Modal from "../../components/common/Modal.jsx";
import { useAuth } from "../../hooks/useAuth.js";
import { 
  HiPlus, 
  HiCheckCircle, 
  HiPencilAlt, 
  HiTrash, 
  HiEye, 
  HiHeart,
  HiBookmark,
  HiBan,
  HiCalendar,
  HiClock
} from "react-icons/hi";
import { FaBuilding } from "react-icons/fa";
import toast from "react-hot-toast";

const OwnerDashboard = () => {
  const { user } = useAuth();
  const [listings, setListings] = useState([]);
  const [analytics, setAnalytics] = useState({
    totalListings: 0,
    availableListings: 0,
    bookedListings: 0,
    occupiedListings: 0,
    totalWishlistCount: 0,
    pendingVisitRequests: 0,
    upcomingVisits: 0,
  });
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState(null);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [listingsRes, analyticsRes, visitsRes] = await Promise.all([
        getMyListings(),
        getOwnerAnalytics().catch(() => null),
        getOwnerVisitRequests().catch(() => null),
      ]);

      if (listingsRes && listingsRes.success) {
        setListings(listingsRes.listings || []);
      }

      let pendingVisitsCount = 0;
      let upcomingVisitsCount = 0;
      if (visitsRes && visitsRes.success && visitsRes.visits) {
        pendingVisitsCount = visitsRes.visits.filter((v) => v.status === "pending").length;
        upcomingVisitsCount = visitsRes.visits.filter((v) => v.status === "approved").length;
      }

      if (analyticsRes && analyticsRes.success && analyticsRes.analytics) {
        setAnalytics({
          ...analyticsRes.analytics,
          pendingVisitRequests: pendingVisitsCount,
          upcomingVisits: upcomingVisitsCount,
        });
      } else if (listingsRes && listingsRes.listings) {
        const all = listingsRes.listings;
        setAnalytics({
          totalListings: all.length,
          availableListings: all.filter((l) => l.status === "available" || l.available).length,
          bookedListings: all.filter((l) => l.status === "booked").length,
          occupiedListings: all.filter((l) => l.status === "occupied").length,
          totalWishlistCount: 0,
          pendingVisitRequests: pendingVisitsCount,
          upcomingVisits: upcomingVisitsCount,
        });
      }
    } catch (err) {
      console.error("Failed to load dashboard data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      const data = await deleteListing(deleteId);
      if (data.success) {
        toast.success("Listing deleted successfully!");
        setListings((prev) => prev.filter((item) => item._id !== deleteId));
        fetchDashboardData();
      }
    } catch (err) {
      toast.error("Failed to delete listing.");
    } finally {
      setDeleteId(null);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-blue-900 to-blue-700 rounded-3xl p-8 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2 text-center md:text-left">
          <span className="text-xs font-bold uppercase tracking-widest text-orange-400 bg-blue-950/60 px-3 py-1 rounded-full border border-blue-500/30">
            Property Owner Portal
          </span>
          <h1 className="text-3xl font-extrabold tracking-tight">
            Welcome back, {user?.name}!
          </h1>
          <p className="text-blue-100 text-sm">
            Manage your student accommodations, track availability, and view student interest analytics.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <Link
            to="/owner/visits"
            className="px-5 py-3.5 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-sm rounded-2xl flex items-center gap-2 transition-all"
          >
            <HiCalendar className="text-lg text-orange-400" />
            <span>Visit Requests ({analytics.pendingVisitRequests})</span>
          </Link>

          <Link
            to="/owner/create-listing"
            className="px-6 py-3.5 bg-orange-500 hover:bg-orange-600 text-white font-extrabold text-sm rounded-2xl shadow-lg flex items-center gap-2 transition-all shrink-0"
          >
            <HiPlus className="text-lg" />
            <span>Post Accommodation</span>
          </Link>
        </div>
      </div>

      {/* Analytics Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
        <DashboardStatCard
          title="Total Listings"
          value={analytics.totalListings}
          icon={FaBuilding}
          color="blue"
          description="Posted on StayNear"
        />
        <DashboardStatCard
          title="Available"
          value={analytics.availableListings}
          icon={HiCheckCircle}
          color="emerald"
          description="Open for students"
        />
        <DashboardStatCard
          title="Pending Visits"
          value={analytics.pendingVisitRequests}
          icon={HiClock}
          color="amber"
          description="Awaiting action"
        />
        <DashboardStatCard
          title="Booked"
          value={analytics.bookedListings}
          icon={HiBookmark}
          color="amber"
          description="Reserved by students"
        />
        <DashboardStatCard
          title="Occupied"
          value={analytics.occupiedListings}
          icon={HiBan}
          color="slate"
          description="Currently full"
        />
        <DashboardStatCard
          title="Wishlist Saves"
          value={analytics.totalWishlistCount}
          icon={HiHeart}
          color="orange"
          description="Student saves"
        />
      </div>

      {/* Managed Properties Table */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-xs space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div>
            <h3 className="text-lg font-bold text-slate-900">Your Managed Properties</h3>
            <p className="text-xs text-slate-400">List of rooms, PGs, and hostels posted under your account</p>
          </div>
          <Link
            to="/owner/listings"
            className="text-xs font-bold text-blue-600 hover:underline"
          >
            Manage All Properties →
          </Link>
        </div>

        {loading ? (
          <Loader message="Loading your dashboard statistics..." />
        ) : listings.length === 0 ? (
          <div className="text-center py-12 space-y-4">
            <p className="text-sm text-slate-500">You haven't listed any accommodations yet.</p>
            <Link
              to="/owner/create-listing"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white font-bold text-xs rounded-xl shadow-sm hover:bg-blue-700"
            >
              <HiPlus /> Post Your First Property
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-700">
              <thead className="bg-slate-50 text-xs font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100">
                <tr>
                  <th className="p-4 rounded-l-2xl">Property Title</th>
                  <th className="p-4">Room Type</th>
                  <th className="p-4">Rent</th>
                  <th className="p-4">College Nearby</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 rounded-r-2xl text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {listings.slice(0, 6).map((item) => (
                  <tr key={item._id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="p-4 font-bold text-slate-900 max-w-xs truncate">
                      {item.title}
                    </td>
                    <td className="p-4 text-xs font-semibold text-slate-600">
                      {item.roomType}
                    </td>
                    <td className="p-4 font-bold text-orange-600">
                      ₹{Number(item.rent).toLocaleString("en-IN")}
                    </td>
                    <td className="p-4 text-xs font-medium text-slate-500">
                      {item.collegeNearby}
                    </td>
                    <td className="p-4">
                      <StatusBadge status={item.status || (item.available ? "available" : "occupied")} />
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          to={`/listings/${item._id}`}
                          className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl"
                          title="View Public Page"
                        >
                          <HiEye className="text-base" />
                        </Link>
                        <Link
                          to={`/owner/edit-listing/${item._id}`}
                          className="p-2 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-xl"
                          title="Edit"
                        >
                          <HiPencilAlt className="text-base" />
                        </Link>
                        <button
                          onClick={() => setDeleteId(item._id)}
                          className="p-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl cursor-pointer"
                          title="Delete"
                        >
                          <HiTrash className="text-base" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

      </div>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        title="Confirm Delete Listing"
      >
        <div className="space-y-4">
          <p className="text-sm text-slate-600">
            Are you sure you want to permanently delete this accommodation listing? This action cannot be undone.
          </p>
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              onClick={() => setDeleteId(null)}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl"
            >
              Cancel
            </button>
            <button
              onClick={handleDelete}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs rounded-xl shadow-sm"
            >
              Delete Permanently
            </button>
          </div>
        </div>
      </Modal>

    </div>
  );
};

export default OwnerDashboard;
