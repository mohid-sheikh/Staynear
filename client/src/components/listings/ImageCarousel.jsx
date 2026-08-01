import { useState } from "react";
import { HiChevronLeft, HiChevronRight } from "react-icons/hi";

const DEFAULT_IMAGE = "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=800&q=80";

const ImageCarousel = ({ images = [] }) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const imageList = images.length > 0 ? images : [DEFAULT_IMAGE];

  const handlePrev = () => {
    setSelectedIndex((prev) => (prev === 0 ? imageList.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setSelectedIndex((prev) => (prev === imageList.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="space-y-3">
      {/* Main Image Display */}
      <div className="relative h-80 sm:h-96 md:h-[420px] rounded-3xl overflow-hidden bg-slate-900 border border-slate-100 shadow-md group">
        <img
          src={imageList[selectedIndex]}
          alt={`Accommodation image ${selectedIndex + 1}`}
          onError={(e) => { e.target.src = DEFAULT_IMAGE; }}
          className="w-full h-full object-cover transition-all duration-300"
        />

        {/* Navigation Arrows */}
        {imageList.length > 1 && (
          <>
            <button
              onClick={handlePrev}
              className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 backdrop-blur-md text-slate-800 hover:bg-white hover:text-blue-600 flex items-center justify-center shadow-md transition-all cursor-pointer opacity-90 group-hover:opacity-100"
            >
              <HiChevronLeft className="text-2xl" />
            </button>
            <button
              onClick={handleNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 backdrop-blur-md text-slate-800 hover:bg-white hover:text-blue-600 flex items-center justify-center shadow-md transition-all cursor-pointer opacity-90 group-hover:opacity-100"
            >
              <HiChevronRight className="text-2xl" />
            </button>
          </>
        )}

        {/* Image Counter Badge */}
        <div className="absolute bottom-4 right-4 bg-slate-900/80 backdrop-blur-md text-white text-xs font-semibold px-3 py-1 rounded-full">
          {selectedIndex + 1} / {imageList.length}
        </div>
      </div>

      {/* Thumbnails Row */}
      {imageList.length > 1 && (
        <div className="flex items-center gap-3 overflow-x-auto pb-2">
          {imageList.map((img, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedIndex(idx)}
              className={`w-20 h-16 rounded-xl overflow-hidden shrink-0 border-2 transition-all cursor-pointer ${
                selectedIndex === idx
                  ? "border-blue-600 ring-2 ring-blue-500/30 scale-105"
                  : "border-transparent opacity-60 hover:opacity-100"
              }`}
            >
              <img
                src={img}
                alt={`Thumbnail ${idx + 1}`}
                onError={(e) => { e.target.src = DEFAULT_IMAGE; }}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ImageCarousel;
