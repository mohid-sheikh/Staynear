import { Link } from "react-router-dom";
import { FaBuilding, FaGraduationCap, FaShieldAlt, FaPiggyBank, FaHeart } from "react-icons/fa";

const About = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      
      {/* Hero Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <span className="text-xs font-bold uppercase tracking-widest text-blue-600 bg-blue-50 px-3.5 py-1 rounded-full">
          About StayNear
        </span>
        <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
          Solving Campus Housing for Every Student
        </h1>
        <p className="text-base text-slate-600 leading-relaxed">
          StayNear is built to streamline student accommodation discovery across India. We connect verified property owners directly with university students searching for safe, affordable, and nearby rooms, PGs, and hostels.
        </p>
      </div>

      {/* Grid Features */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-xs space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center text-xl">
            <FaGraduationCap />
          </div>
          <h3 className="text-lg font-bold text-slate-900">For Students</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Search listings by college campus, filter by room type, and view transparent rental prices without any hidden brokerage fees.
          </p>
        </div>

        <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-xs space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-orange-500 text-white flex items-center justify-center text-xl">
            <FaBuilding />
          </div>
          <h3 className="text-lg font-bold text-slate-900">For Owners</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Easily post accommodations, manage availability, upload property photos via Cloudinary, and receive direct inquiries from verified students.
          </p>
        </div>

        <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-xs space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500 text-white flex items-center justify-center text-xl">
            <FaShieldAlt />
          </div>
          <h3 className="text-lg font-bold text-slate-900">Safety & Trust</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Every property listing includes verified owner details and clear amenity descriptions for peace of mind.
          </p>
        </div>
      </div>

      {/* CTA */}
      <div className="bg-gradient-to-r from-blue-900 to-blue-700 rounded-3xl p-8 sm:p-12 text-white text-center space-y-6 shadow-xl">
        <h2 className="text-3xl font-extrabold">Ready to Find Your Student Home?</h2>
        <p className="text-blue-100 text-sm max-w-xl mx-auto">
          Explore hundreds of active rooms, hostels, and PGs available near your university today.
        </p>
        <Link
          to="/listings"
          className="inline-block px-8 py-4 bg-orange-500 hover:bg-orange-600 text-white font-extrabold text-sm rounded-2xl shadow-lg transition-all"
        >
          Explore All Listings
        </Link>
      </div>

    </div>
  );
};

export default About;
