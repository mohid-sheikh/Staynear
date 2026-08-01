import { HiChevronLeft, HiChevronRight } from "react-icons/hi";

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;

  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;
    let start = Math.max(1, currentPage - Math.floor(maxVisible / 2));
    let end = Math.min(totalPages, start + maxVisible - 1);

    if (end - start + 1 < maxVisible) {
      start = Math.max(1, end - maxVisible + 1);
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  };

  return (
    <div className="flex items-center justify-center gap-2 pt-8 pb-4">
      {/* Previous Button */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={`flex items-center gap-1 px-3 py-2 rounded-xl text-sm font-semibold transition-all ${
          currentPage === 1
            ? "text-slate-300 bg-slate-100 cursor-not-allowed"
            : "text-slate-700 bg-white border border-slate-200 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-300 shadow-2xs"
        }`}
      >
        <HiChevronLeft className="text-lg" />
        <span className="hidden sm:inline">Previous</span>
      </button>

      {/* Page Numbers */}
      <div className="flex items-center gap-1">
        {getPageNumbers().map((page) => (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`w-9 h-9 rounded-xl text-sm font-bold transition-all ${
              currentPage === page
                ? "bg-blue-600 text-white shadow-md shadow-blue-500/20"
                : "bg-white text-slate-700 border border-slate-200 hover:bg-slate-50"
            }`}
          >
            {page}
          </button>
        ))}
      </div>

      {/* Next Button */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={`flex items-center gap-1 px-3 py-2 rounded-xl text-sm font-semibold transition-all ${
          currentPage === totalPages
            ? "text-slate-300 bg-slate-100 cursor-not-allowed"
            : "text-slate-700 bg-white border border-slate-200 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-300 shadow-2xs"
        }`}
      >
        <span className="hidden sm:inline">Next</span>
        <HiChevronRight className="text-lg" />
      </button>
    </div>
  );
};

export default Pagination;
