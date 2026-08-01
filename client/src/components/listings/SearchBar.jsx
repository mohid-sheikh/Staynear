import { useState, useEffect } from "react";
import { HiSearch, HiLocationMarker, HiHome } from "react-icons/hi";
import { FaGraduationCap } from "react-icons/fa";
import { ROOM_TYPES } from "../../utils/constants.js";

const SearchBar = ({ onSearch, initialSearch = "", initialCity = "", initialCollege = "", initialRoomType = "" }) => {
  const [search, setSearch] = useState(initialSearch);
  const [city, setCity] = useState(initialCity);
  const [collegeNearby, setCollegeNearby] = useState(initialCollege);
  const [roomType, setRoomType] = useState(initialRoomType);

  useEffect(() => {
    setSearch(initialSearch);
    setCity(initialCity);
    setCollegeNearby(initialCollege);
    setRoomType(initialRoomType);
  }, [initialSearch, initialCity, initialCollege, initialRoomType]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch({ search, city, collegeNearby, roomType });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-3xl p-3 sm:p-4 shadow-xl border border-slate-100 flex flex-col md:flex-row items-center gap-3"
    >
      {/* Keyword Search */}
      <div className="w-full md:flex-1 px-3 py-2 flex items-center gap-3 border-b md:border-b-0 md:border-r border-slate-100">
        <HiSearch className="text-blue-600 text-xl shrink-0" />
        <div className="flex flex-col text-left w-full">
          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            Keyword / Title
          </label>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by title..."
            className="w-full bg-transparent text-sm font-medium text-slate-800 focus:outline-none placeholder:text-slate-400"
          />
        </div>
      </div>

      {/* College Nearby */}
      <div className="w-full md:w-52 px-3 py-2 flex items-center gap-3 border-b md:border-b-0 md:border-r border-slate-100">
        <FaGraduationCap className="text-orange-500 text-lg shrink-0" />
        <div className="flex flex-col text-left w-full">
          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            College
          </label>
          <input
            type="text"
            value={collegeNearby}
            onChange={(e) => setCollegeNearby(e.target.value)}
            placeholder="DU, IIT..."
            className="w-full bg-transparent text-sm font-medium text-slate-800 focus:outline-none placeholder:text-slate-400"
          />
        </div>
      </div>

      {/* City */}
      <div className="w-full md:w-44 px-3 py-2 flex items-center gap-3 border-b md:border-b-0 md:border-r border-slate-100">
        <HiLocationMarker className="text-blue-600 text-xl shrink-0" />
        <div className="flex flex-col text-left w-full">
          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            City
          </label>
          <input
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="Delhi, Mumbai..."
            className="w-full bg-transparent text-sm font-medium text-slate-800 focus:outline-none placeholder:text-slate-400"
          />
        </div>
      </div>

      {/* Room Type */}
      <div className="w-full md:w-44 px-3 py-2 flex items-center gap-3">
        <HiHome className="text-orange-500 text-xl shrink-0" />
        <div className="flex flex-col text-left w-full">
          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            Room Type
          </label>
          <select
            value={roomType}
            onChange={(e) => setRoomType(e.target.value)}
            className="w-full bg-transparent text-sm font-medium text-slate-800 focus:outline-none cursor-pointer"
          >
            <option value="">All Types</option>
            {ROOM_TYPES.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Search Button */}
      <button
        type="submit"
        className="w-full md:w-auto px-7 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-2xl shadow-md transition-all hover:scale-[1.02] cursor-pointer shrink-0"
      >
        Search
      </button>
    </form>
  );
};

export default SearchBar;
