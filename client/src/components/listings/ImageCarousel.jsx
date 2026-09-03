import { useState } from "react";
import { HiChevronLeft, HiChevronRight, HiPhotograph } from "react-icons/hi";
import { getImageUrl } from "../../utils/imageUtils.js";

const ImageCarousel = ({ images = [] }) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [failedIndices, setFailedIndices] = useState(new Set());

  const handleImageError = (index) => {
    setFailedIndices((prev) => {
      const next = new Set(prev);
      next.add(index);
      return next;
    });
  };

  const hasImages = images.length > 0;
  const isCurrentFailed = failedIndices.has(selectedIndex);
  const currentImageUrl = getImageUrl(images[selectedIndex]);

  const handlePrev = () => {
    setSelectedIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setSelectedIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  if (!hasImages) {
    return (
      <div className="relative h-80 sm:h-96 md:h-[420px] rounded-3xl overflow-hidden bg-slate-100 border border-slate-200 shadow-sm flex flex-col items-center justify-center text-slate-400 p-6 text-center select-none">
        <HiPhotograph className="text-6xl text-slate-400 mb-2" />
        <h4 className="text-sm font-bold uppercase tracking-wider text-slate-600">
          No Photos Available
        </h4>
        <p className="text-xs text-slate-400 mt-1 max-w-xs">
          The property owner has not uploaded any photos for this listing yet.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* Main Image Display */}
      <div className="relative h-80 sm:h-96 md:h-[420px] rounded-3xl overflow-hidden bg-slate-900 border border-slate-100 shadow-md group">
        {!isCurrentFailed && currentImageUrl ? (
          <img
            src={currentImageUrl}
            alt={`Accommodation image ${selectedIndex + 1}`}
            onError={() => handleImageError(selectedIndex)}
            className="w-full h-full object-cover transition-all duration-300"
          />
        ) : (
          <div className="w-full h-full bg-slate-800 flex flex-col items-center justify-center text-slate-400 p-6 text-center select-none">
            <HiPhotograph className="text-5xl text-slate-500 mb-2" />
            <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
              Image Unavailable
            </span>
          </div>
        )}

        {/* Navigation Arrows */}
        {images.length > 1 && (
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
          {selectedIndex + 1} / {images.length}
        </div>
      </div>

      {/* Thumbnails Row */}
      {images.length > 1 && (
        <div className="flex items-center gap-3 overflow-x-auto pb-2">
          {images.map((img, idx) => {
            const thumbUrl = getImageUrl(img);
            return (
              <button
                key={idx}
                onClick={() => setSelectedIndex(idx)}
                className={`w-20 h-16 rounded-xl overflow-hidden shrink-0 border-2 transition-all cursor-pointer bg-slate-800 flex items-center justify-center ${
                  selectedIndex === idx
                    ? "border-blue-600 ring-2 ring-blue-500/30 scale-105"
                    : "border-transparent opacity-60 hover:opacity-100"
                }`}
              >
                {!failedIndices.has(idx) && thumbUrl ? (
                  <img
                    src={thumbUrl}
                    alt={`Thumbnail ${idx + 1}`}
                    onError={() => handleImageError(idx)}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <HiPhotograph className="text-xl text-slate-400" />
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ImageCarousel;
