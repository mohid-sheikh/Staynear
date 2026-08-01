import { HiExclamationCircle, HiRefresh } from "react-icons/hi";

const ErrorState = ({ 
  title = "Something went wrong", 
  message = "Failed to load content from the server. Please check your network connection and try again.",
  onRetry 
}) => {
  return (
    <div className="min-h-[40vh] flex flex-col items-center justify-center p-8 bg-red-50/50 rounded-3xl border border-red-100 text-center">
      <div className="w-14 h-14 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center text-3xl mb-4">
        <HiExclamationCircle />
      </div>
      <h3 className="text-xl font-bold text-slate-900 mb-2">{title}</h3>
      <p className="text-sm text-slate-600 max-w-md mb-6 leading-relaxed">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white text-sm font-semibold rounded-xl shadow-sm transition-all flex items-center gap-2"
        >
          <HiRefresh className="text-base" />
          <span>Try Again</span>
        </button>
      )}
    </div>
  );
};

export default ErrorState;
