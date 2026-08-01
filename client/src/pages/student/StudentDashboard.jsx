import { Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth.js";
import { useWishlist } from "../../hooks/useWishlist.js";
import DashboardStatCard from "../../components/dashboard/DashboardStatCard.jsx";
import ListingCard from "../../components/listings/ListingCard.jsx";
import { HiHeart, HiClock, HiSearch, HiAcademicCap } from "react-icons/hi";
import { FaGraduationCap } from "react-icons/fa";

const StudentDashboard = () => {
  const { user } = useAuth();
  const { wishlist, recentlyViewed } = useWishlist();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-blue-900 to-blue-700 rounded-3xl p-8 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2 text-center md:text-left">
          <span className="text-xs font-bold uppercase tracking-widest text-orange-400 bg-blue-950/60 px-3 py-1 rounded-full border border-blue-500/30">
            Student Dashboard
          </span>
          <h1 className="text-3xl font-extrabold tracking-tight">
            Welcome back, {user?.name}!
          </h1>
          <p className="text-blue-100 text-sm">
            {user?.college ? `Student at ${user.college}` : "Searching for rooms near your college campus"}
          </p>
        </div>

        <Link
          to="/listings"
          className="px-6 py-3.5 bg-orange-500 hover:bg-orange-600 text-white font-extrabold text-sm rounded-2xl shadow-lg flex items-center gap-2 transition-all shrink-0"
        >
          <HiSearch className="text-lg" />
          <span>Explore Campus Rooms</span>
        </Link>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <DashboardStatCard
          title="Saved Listings"
          value={wishlist.length}
          icon={HiHeart}
          color="orange"
          description="In your wishlist"
        />
        <DashboardStatCard
          title="Recently Viewed"
          value={recentlyViewed.length}
          icon={HiClock}
          color="blue"
          description="Viewed properties"
        />
        <DashboardStatCard
          title="College Campus"
          value={user?.college || "General"}
          icon={FaGraduationCap}
          color="emerald"
          description="Your university"
        />
      </div>

      {/* Recently Viewed Row */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-xs space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div>
            <h3 className="text-lg font-bold text-slate-900">Recently Viewed Properties</h3>
            <p className="text-xs text-slate-400">Accommodations you recently inspected</p>
          </div>
          <Link to="/student/recently-viewed" className="text-xs font-bold text-blue-600 hover:underline">
            View All History →
          </Link>
        </div>

        {recentlyViewed.length === 0 ? (
          <div className="text-center py-10 space-y-3">
            <p className="text-sm text-slate-500">You haven't viewed any properties yet.</p>
            <Link
              to="/listings"
              className="inline-block px-5 py-2.5 bg-blue-600 text-white font-bold text-xs rounded-xl shadow-sm hover:bg-blue-700"
            >
              Start Exploring Rooms
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recentlyViewed.slice(0, 3).map((item) => (
              <ListingCard key={item._id} listing={item} />
            ))}
          </div>
        )}
      </div>

    </div>
  );
};

export default StudentDashboard;
