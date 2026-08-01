import { Link } from "react-router-dom";
import { HiHome } from "react-icons/hi";

const NotFound = () => {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4 py-16">
      <div className="w-24 h-24 bg-blue-50 text-blue-600 rounded-3xl flex items-center justify-center text-5xl font-extrabold mb-6 shadow-inner">
        404
      </div>
      <h1 className="text-3xl font-extrabold text-slate-900 mb-2">Page Not Found</h1>
      <p className="text-slate-500 text-sm max-w-md mb-8">
        Oops! The page you are looking for doesn't exist or has been moved.
      </p>
      <Link
        to="/"
        className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl shadow-md flex items-center gap-2 transition-all hover:scale-105"
      >
        <HiHome className="text-lg" />
        <span>Return to Home</span>
      </Link>
    </div>
  );
};

export default NotFound;
