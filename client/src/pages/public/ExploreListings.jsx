import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { getAllListings } from "../../services/listingService.js";
import ListingCard from "../../components/listings/ListingCard.jsx";
import SearchBar from "../../components/listings/SearchBar.jsx";
import Filters from "../../components/listings/Filters.jsx";
import Pagination from "../../components/common/Pagination.jsx";
import Loader from "../../components/common/Loader.jsx";
import EmptyState from "../../components/common/EmptyState.jsx";
import ErrorState from "../../components/common/ErrorState.jsx";
import { HiSortAscending, HiFilter } from "react-icons/hi";

const ExploreListings = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [totalListings, setTotalListings] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [showMobileFilter, setShowMobileFilter] = useState(false);

  // Parse filters from URL params
  const city = searchParams.get("city") || "";
  const collegeNearby = searchParams.get("collegeNearby") || "";
  const roomType = searchParams.get("roomType") || "";
  const minRent = searchParams.get("minRent") || "";
  const maxRent = searchParams.get("maxRent") || "";
  const search = searchParams.get("search") || "";
  const sort = searchParams.get("sort") || "newest";
  const page = parseInt(searchParams.get("page") || "1", 10);

  const fetchListings = async () => {
    setLoading(true);
    setError(false);
    try {
      const query = {
        page,
        limit: 9,
        sort,
      };
      if (city) query.city = city;
      if (collegeNearby) query.collegeNearby = collegeNearby;
      if (roomType) query.roomType = roomType;
      if (minRent) query.minRent = minRent;
      if (maxRent) query.maxRent = maxRent;
      if (search) query.search = search;

      const data = await getAllListings(query);
      if (data.success) {
        setListings(data.listings || []);
        setTotalListings(data.totalListings || 0);
        setTotalPages(data.totalPages || 1);
      } else {
        setError(true);
      }
    } catch (err) {
      console.error("Failed to fetch listings:", err);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchListings();
  }, [searchParams]);

  const updateQueryParams = (newParams) => {
    const current = Object.fromEntries(searchParams.entries());
    const updated = { ...current, ...newParams, page: "1" };

    // Remove empty parameters
    Object.keys(updated).forEach((key) => {
      if (!updated[key]) delete updated[key];
    });

    setSearchParams(updated);
  };

  const handlePageChange = (newPage) => {
    const current = Object.fromEntries(searchParams.entries());
    setSearchParams({ ...current, page: newPage.toString() });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleResetFilters = () => {
    setSearchParams({});
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Header Banner */}
      <div className="space-y-2">
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          Explore Student Accommodations
        </h1>
        <p className="text-slate-500 text-sm">
          Browse verified rooms, hostels, flats, and PGs near major colleges.
        </p>
      </div>

      {/* Top Search Bar */}
      <SearchBar
        initialSearch={search}
        initialCity={city}
        initialCollege={collegeNearby}
        initialRoomType={roomType}
        onSearch={(query) => updateQueryParams(query)}
      />

      {/* Control Bar: Total Count & Sort Selector */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-100 shadow-2xs">
        <div className="text-sm font-semibold text-slate-700">
          Showing <span className="text-blue-600 font-bold">{listings.length}</span> of{" "}
          <span className="text-slate-900 font-bold">{totalListings}</span> accommodations
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
          {/* Mobile Filter Toggle */}
          <button
            onClick={() => setShowMobileFilter(!showMobileFilter)}
            className="lg:hidden px-4 py-2 bg-slate-100 text-slate-700 text-xs font-bold rounded-xl flex items-center gap-1.5"
          >
            <HiFilter className="text-blue-600" />
            <span>Filters</span>
          </button>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-2">
            <HiSortAscending className="text-slate-400 text-lg" />
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider hidden sm:inline">
              Sort By:
            </span>
            <select
              value={sort}
              onChange={(e) => updateQueryParams({ sort: e.target.value })}
              className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-bold text-slate-800 focus:outline-none cursor-pointer"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="rentLow">Rent: Low to High</option>
              <option value="rentHigh">Rent: High to Low</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Grid & Filter Sidebar Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Filter Sidebar */}
        <div className={`lg:block ${showMobileFilter ? "block" : "hidden"}`}>
          <Filters
            filters={{ minRent, maxRent, roomType }}
            onFilterChange={(newFilters) => updateQueryParams(newFilters)}
            onReset={handleResetFilters}
          />
        </div>

        {/* Listings Grid */}
        <div className="lg:col-span-3">
          {loading ? (
            <Loader message="Fetching campus accommodations..." />
          ) : error ? (
            <ErrorState onRetry={fetchListings} />
          ) : listings.length === 0 ? (
            <EmptyState
              title="No Accommodations Found"
              message="No listings matched your criteria. Try expanding your search location or clearing price filters."
              actionText="Clear All Filters"
              onAction={handleResetFilters}
            />
          ) : (
            <div className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {listings.map((listing) => (
                  <ListingCard key={listing._id} listing={listing} />
                ))}
              </div>

              {/* Server-Side Pagination */}
              <Pagination
                currentPage={page}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            </div>
          )}
        </div>

      </div>

    </div>
  );
};

export default ExploreListings;
