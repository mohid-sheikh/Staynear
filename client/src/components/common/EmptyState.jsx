import { FaSearch } from "react-icons/fa";

const EmptyState = ({ 
  title = "No Listings Found", 
  message = "We couldn't find any student accommodations matching your criteria. Try adjusting your filters or search terms.",
  actionText,
  onAction,
  icon: Icon = FaSearch
}) => {
  return (
    <div className="min-h-[40vh] flex flex-col items-center justify-center p-8 bg-white rounded-3xl border border-slate-100 shadow-xs text-center">
      <div className="w-16 h-16 rounded-2xl bg-blue-50 text-blue-500 flex items-center justify-center text-2xl mb-4">
        <Icon />
      </div>
      <h3 className="text-xl font-bold text-slate-800 mb-2">{title}</h3>
      <p className="text-sm text-slate-500 max-w-md mb-6 leading-relaxed">{message}</p>
      {actionText && onAction && (
        <button
          onClick={onAction}
          className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl shadow-sm transition-all hover:shadow cursor-pointer"
        >
          {actionText}
        </button>
      )}
    </div>
  );
};

export default EmptyState;
