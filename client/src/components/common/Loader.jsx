const Loader = ({ message = "Loading accommodations..." }) => {
  return (
    <div className="min-h-[50vh] flex flex-col items-center justify-center p-8 text-center">
      <div className="relative flex items-center justify-center mb-4">
        <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
        <div className="absolute w-6 h-6 border-4 border-orange-200 border-t-orange-500 rounded-full animate-spin animate-reverse"></div>
      </div>
      <p className="text-sm font-semibold text-slate-600 tracking-wide">{message}</p>
    </div>
  );
};

export default Loader;
