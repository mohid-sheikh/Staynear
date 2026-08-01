import { useState, useEffect } from "react";
import { HiFilter, HiRefresh, HiCurrencyRupee } from "react-icons/hi";
import { ROOM_TYPES } from "../../utils/constants.js";

const Filters = ({ filters, onFilterChange, onReset }) => {
  const [minRent, setMinRent] = useState(filters.minRent || "");
  const [maxRent, setMaxRent] = useState(filters.maxRent || "");
  const [roomType, setRoomType] = useState(filters.roomType || "");

  useEffect(() => {
    setMinRent(filters.minRent || "");
    setMaxRent(filters.maxRent || "");
    setRoomType(filters.roomType || "");
  }, [filters]);

  const handleApplyRent = (e) => {
    e.preventDefault();
    onFilterChange({ minRent, maxRent });
  };

  const handleSelectRoomType = (type) => {
    const nextType = roomType === type ? "" : type;
    setRoomType(nextType);
    onFilterChange({ roomType: nextType });
  };

  return (
    <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-xs space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-slate-100">
        <div className="flex items-center gap-2 font-bold text-slate-900 text-base">
          <HiFilter className="text-blue-600 text-xl" />
          <span>Filter Accommodation</span>
        </div>
        <button
          onClick={onReset}
          className="text-xs font-semibold text-orange-600 hover:text-orange-700 flex items-center gap-1 cursor-pointer"
        >
          <HiRefresh />
          <span>Reset</span>
        </button>
      </div>

      {/* Room Type Selector Pills */}
      <div>
        <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-3">
          Room / Stay Type
        </label>
        <div className="flex flex-wrap gap-2">
          {ROOM_TYPES.map((type) => {
            const isSelected = roomType === type;
            return (
              <button
                key={type}
                type="button"
                onClick={() => handleSelectRoomType(type)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  isSelected
                    ? "bg-blue-600 text-white shadow-md shadow-blue-500/20"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {type}
              </button>
            );
          })}
        </div>
      </div>

      {/* Rent Range Filter */}
      <form onSubmit={handleApplyRent} className="space-y-3 pt-2 border-t border-slate-100">
        <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
          Monthly Rent Range (₹)
        </label>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <span className="text-[10px] text-slate-400 font-medium">Min Rent</span>
            <div className="relative mt-1">
              <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs font-bold">₹</span>
              <input
                type="number"
                value={minRent}
                onChange={(e) => setMinRent(e.target.value)}
                placeholder="2000"
                className="w-full pl-6 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:bg-white focus:border-blue-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <span className="text-[10px] text-slate-400 font-medium">Max Rent</span>
            <div className="relative mt-1">
              <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs font-bold">₹</span>
              <input
                type="number"
                value={maxRent}
                onChange={(e) => setMaxRent(e.target.value)}
                placeholder="25000"
                className="w-full pl-6 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:bg-white focus:border-blue-500 focus:outline-none"
              />
            </div>
          </div>
        </div>

        <button
          type="submit"
          className="w-full py-2 bg-slate-900 hover:bg-blue-600 text-white font-bold text-xs rounded-xl transition-colors cursor-pointer mt-2"
        >
          Apply Price Filter
        </button>
      </form>
    </div>
  );
};

export default Filters;
