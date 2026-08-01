import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { 
  HiSearch, 
  HiLocationMarker, 
  HiAcademicCap, 
  HiHome, 
  HiShieldCheck, 
  HiCurrencyRupee, 
  HiWifi,
  HiArrowRight,
  HiStar
} from "react-icons/hi";
import { FaBuilding, FaGraduationCap, FaShieldAlt, FaPiggyBank, FaWifi } from "react-icons/fa";
import { POPULAR_COLLEGES, ROOM_TYPES } from "../utils/constants.js";

const Home = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedRoomType, setSelectedRoomType] = useState("");

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchQuery) params.set("search", searchQuery);
    if (selectedCity) params.set("city", selectedCity);
    if (selectedRoomType) params.set("roomType", selectedRoomType);
    navigate(`/listings?${params.toString()}`);
  };

  return (
    <div className="space-y-16 pb-16">
      
      {/* 1. HERO SECTION & SEARCH */}
      <section className="relative bg-gradient-to-b from-blue-900 via-blue-800 to-blue-950 text-white pt-20 pb-28 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Background Decorative Blur Spheres */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-orange-500/15 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-5xl mx-auto text-center relative z-10 space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-700/60 border border-blue-500/30 text-blue-200 text-xs font-semibold uppercase tracking-wider backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-orange-400 animate-pulse"></span>
            #1 Student Accommodations Platform
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight">
            Find Your Perfect <span className="text-orange-400 underline decoration-orange-400/40">Student Home</span> Near Campus
          </h1>

          <p className="text-lg sm:text-xl text-blue-100/90 max-w-2xl mx-auto font-normal">
            Rooms, PGs, Hostels, and Flats designed for student life. Zero brokerage, verified property owners, and walking distance to top colleges.
          </p>

          {/* SEARCH BAR CARD (Airbnb / Booking style floating container) */}
          <div className="pt-6 max-w-4xl mx-auto">
            <form 
              onSubmit={handleSearch}
              className="bg-white rounded-3xl p-3 sm:p-4 shadow-2xl border border-white/20 text-slate-800 flex flex-col md:flex-row gap-3 items-center"
            >
              {/* College / Keyword Search */}
              <div className="w-full md:flex-1 px-3 py-2 flex items-center gap-3 border-b md:border-b-0 md:border-r border-slate-100">
                <FaGraduationCap className="text-blue-600 text-xl shrink-0" />
                <div className="flex flex-col text-left w-full">
                  <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    College / Area / Title
                  </label>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="e.g. DU, IIT Bombay, North Campus"
                    className="w-full bg-transparent text-sm font-medium text-slate-800 focus:outline-none placeholder:text-slate-400"
                  />
                </div>
              </div>

              {/* City Input */}
              <div className="w-full md:w-48 px-3 py-2 flex items-center gap-3 border-b md:border-b-0 md:border-r border-slate-100">
                <HiLocationMarker className="text-orange-500 text-xl shrink-0" />
                <div className="flex flex-col text-left w-full">
                  <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    City
                  </label>
                  <input
                    type="text"
                    value={selectedCity}
                    onChange={(e) => setSelectedCity(e.target.value)}
                    placeholder="Delhi, Mumbai, Noida"
                    className="w-full bg-transparent text-sm font-medium text-slate-800 focus:outline-none placeholder:text-slate-400"
                  />
                </div>
              </div>

              {/* Room Type Selector */}
              <div className="w-full md:w-48 px-3 py-2 flex items-center gap-3">
                <HiHome className="text-blue-600 text-xl shrink-0" />
                <div className="flex flex-col text-left w-full">
                  <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    Room Type
                  </label>
                  <select
                    value={selectedRoomType}
                    onChange={(e) => setSelectedRoomType(e.target.value)}
                    className="w-full bg-transparent text-sm font-medium text-slate-800 focus:outline-none cursor-pointer"
                  >
                    <option value="">All Types</option>
                    {ROOM_TYPES.map((type) => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full md:w-auto px-8 py-4 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold rounded-2xl shadow-lg shadow-orange-500/30 flex items-center justify-center gap-2 transition-all hover:scale-[1.02] active:scale-95 cursor-pointer shrink-0"
              >
                <HiSearch className="text-xl" />
                <span>Search Rooms</span>
              </button>
            </form>
          </div>

          {/* Quick Stat Pill Highlights */}
          <div className="pt-8 flex flex-wrap items-center justify-center gap-6 text-sm text-blue-200 font-medium">
            <div className="flex items-center gap-2">
              <HiShieldCheck className="text-orange-400 text-lg" />
              <span>Verified Property Owners</span>
            </div>
            <div className="flex items-center gap-2">
              <HiCurrencyRupee className="text-orange-400 text-lg" />
              <span>Zero Brokerage Fees</span>
            </div>
            <div className="flex items-center gap-2">
              <HiAcademicCap className="text-orange-400 text-lg" />
              <span>100% Student Focused</span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. POPULAR COLLEGE HUBS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
              Popular College Campuses
            </h2>
            <p className="text-slate-500 text-sm mt-1">
              Explore student accommodations near top Indian universities
            </p>
          </div>
          <Link
            to="/listings"
            className="inline-flex items-center gap-1.5 text-blue-600 hover:text-blue-700 font-semibold text-sm group"
          >
            <span>View all hubs</span>
            <HiArrowRight className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {POPULAR_COLLEGES.map((college, idx) => (
            <Link
              key={idx}
              to={`/listings?collegeNearby=${encodeURIComponent(college.name)}`}
              className="bg-white rounded-2xl p-4 border border-slate-100 shadow-xs hover:shadow-md hover:border-blue-200 transition-all text-center group flex flex-col items-center justify-center"
            >
              <div className="w-12 h-12 rounded-2xl bg-blue-50 group-hover:bg-blue-600 text-blue-600 group-hover:text-white flex items-center justify-center mb-3 transition-colors">
                <FaGraduationCap className="text-xl" />
              </div>
              <h3 className="font-bold text-slate-800 text-sm line-clamp-1 group-hover:text-blue-600 transition-colors">
                {college.name}
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">{college.city}</p>
              <span className="mt-2 text-[11px] font-semibold px-2 py-0.5 bg-slate-100 text-slate-600 rounded-full">
                {college.count}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* 3. FEATURED LISTINGS PREVIEW (UI Layout for Sprint 1, connects to GET /api/listings in Sprint 2) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-orange-600 uppercase tracking-wider mb-1">
              <HiStar /> Recommended For Students
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
              Featured Accommodations
            </h2>
            <p className="text-slate-500 text-sm mt-1">
              Top rated student rooms, PGs, and hostels available right now
            </p>
          </div>

          <Link
            to="/listings"
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm rounded-xl shadow-sm transition-all hover:shadow flex items-center justify-center gap-2"
          >
            <span>Explore All Listings</span>
            <HiArrowRight />
          </Link>
        </div>

        {/* Preview Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          
          {/* Card Preview 1 */}
          <div className="bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300 group flex flex-col">
            <div className="relative h-56 bg-slate-200 overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=800&q=80"
                alt="Modern Student PG"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-blue-700 shadow-xs">
                PG / Hostel
              </div>
              <div className="absolute top-3 right-3 bg-orange-500 text-white text-xs font-extrabold px-3 py-1 rounded-full shadow-md">
                ₹8,500 / mo
              </div>
            </div>

            <div className="p-5 flex flex-col flex-grow">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 mb-2">
                <HiLocationMarker className="text-orange-500" />
                <span>North Campus, Delhi</span>
              </div>
              <h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-1">
                Luxury Student PG with Meal Service
              </h3>
              <p className="text-xs text-slate-500 mt-2 line-clamp-2 leading-relaxed">
                Fully furnished room with high-speed Wi-Fi, air conditioning, daily housekeeping, and 3-time meals included.
              </p>

              <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-lg">
                  Near DU North Campus
                </span>
                <Link
                  to="/listings"
                  className="text-xs font-bold text-slate-700 hover:text-blue-600 flex items-center gap-1"
                >
                  Details <HiArrowRight className="text-xs" />
                </Link>
              </div>
            </div>
          </div>

          {/* Card Preview 2 */}
          <div className="bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300 group flex flex-col">
            <div className="relative h-56 bg-slate-200 overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=800&q=80"
                alt="Single Room Near IIT"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-blue-700 shadow-xs">
                Single Room
              </div>
              <div className="absolute top-3 right-3 bg-orange-500 text-white text-xs font-extrabold px-3 py-1 rounded-full shadow-md">
                ₹12,000 / mo
              </div>
            </div>

            <div className="p-5 flex flex-col flex-grow">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 mb-2">
                <HiLocationMarker className="text-orange-500" />
                <span>Powai, Mumbai</span>
              </div>
              <h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-1">
                Private Studio Single Occupancy
              </h3>
              <p className="text-xs text-slate-500 mt-2 line-clamp-2 leading-relaxed">
                Quiet single room designed for serious study. Includes study desk, bookshelf, personal balcony, and 24/7 power backup.
              </p>

              <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-lg">
                  Near IIT Bombay
                </span>
                <Link
                  to="/listings"
                  className="text-xs font-bold text-slate-700 hover:text-blue-600 flex items-center gap-1"
                >
                  Details <HiArrowRight className="text-xs" />
                </Link>
              </div>
            </div>
          </div>

          {/* Card Preview 3 */}
          <div className="bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300 group flex flex-col">
            <div className="relative h-56 bg-slate-200 overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=800&q=80"
                alt="Shared Room Bangalore"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-blue-700 shadow-xs">
                Double Sharing
              </div>
              <div className="absolute top-3 right-3 bg-orange-500 text-white text-xs font-extrabold px-3 py-1 rounded-full shadow-md">
                ₹6,500 / mo
              </div>
            </div>

            <div className="p-5 flex flex-col flex-grow">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 mb-2">
                <HiLocationMarker className="text-orange-500" />
                <span>Koramangala, Bangalore</span>
              </div>
              <h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-1">
                Modern Double Sharing Room
              </h3>
              <p className="text-xs text-slate-500 mt-2 line-clamp-2 leading-relaxed">
                Spacious twin bed room with attached bathroom, gaming lobby, high-speed Wi-Fi, and 5 mins walk to college.
              </p>

              <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-lg">
                  Near Christ University
                </span>
                <Link
                  to="/listings"
                  className="text-xs font-bold text-slate-700 hover:text-blue-600 flex items-center gap-1"
                >
                  Details <HiArrowRight className="text-xs" />
                </Link>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 4. WHY STAYNEAR SECTION */}
      <section className="bg-white py-16 border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-orange-600 bg-orange-50 px-3 py-1 rounded-full">
              Why Students Choose Us
            </span>
            <h2 className="text-3xl font-extrabold text-slate-900">
              Built Specifically for Student Needs
            </h2>
            <p className="text-slate-500 text-sm">
              We remove the stress of finding campus housing so you can focus on your studies.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100 hover:border-blue-200 transition-all hover:-translate-y-1">
              <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center text-xl mb-4 shadow-md shadow-blue-500/20">
                <FaGraduationCap />
              </div>
              <h3 className="font-bold text-slate-900 text-base mb-2">Campus Proximity</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Filter accommodations by distance to your exact university gate or campus library.
              </p>
            </div>

            <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100 hover:border-blue-200 transition-all hover:-translate-y-1">
              <div className="w-12 h-12 rounded-2xl bg-orange-500 text-white flex items-center justify-center text-xl mb-4 shadow-md shadow-orange-500/20">
                <FaShieldAlt />
              </div>
              <h3 className="font-bold text-slate-900 text-base mb-2">Verified Owners</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Direct connections with property owners. No middle-man scams or fake pictures.
              </p>
            </div>

            <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100 hover:border-blue-200 transition-all hover:-translate-y-1">
              <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center text-xl mb-4 shadow-md shadow-blue-500/20">
                <FaPiggyBank />
              </div>
              <h3 className="font-bold text-slate-900 text-base mb-2">Zero Brokerage</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Save money with transparent monthly rent pricing and no agent commission.
              </p>
            </div>

            <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100 hover:border-blue-200 transition-all hover:-translate-y-1">
              <div className="w-12 h-12 rounded-2xl bg-orange-500 text-white flex items-center justify-center text-xl mb-4 shadow-md shadow-orange-500/20">
                <FaWifi />
              </div>
              <h3 className="font-bold text-slate-900 text-base mb-2">Student Amenities</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Wi-Fi, quiet study spaces, meal plans, laundry, and round-the-clock security.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. OWNER CALL TO ACTION BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative bg-gradient-to-r from-blue-900 to-blue-700 rounded-3xl p-8 sm:p-12 text-white overflow-hidden shadow-2xl flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-4 max-w-xl text-center md:text-left z-10">
            <span className="text-xs font-bold text-orange-400 uppercase tracking-widest bg-blue-950/60 px-3 py-1 rounded-full border border-blue-500/30">
              For Property Owners
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Have a Room or PG Near a College?
            </h2>
            <p className="text-blue-100 text-sm sm:text-base leading-relaxed">
              List your property on StayNear and connect directly with thousands of verified students searching for accommodations near your location.
            </p>
          </div>

          <div className="z-10 shrink-0">
            <Link
              to="/register"
              className="px-8 py-4 bg-orange-500 hover:bg-orange-600 text-white font-extrabold text-base rounded-2xl shadow-xl shadow-orange-500/30 hover:scale-105 active:scale-95 transition-all inline-flex items-center gap-2"
            >
              <FaBuilding />
              <span>List Your Property Free</span>
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
};

export default Home;
