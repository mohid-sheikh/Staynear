import { useState, useEffect } from "react";
import { HiPlus, HiX, HiUpload, HiCheck } from "react-icons/hi";
import { ROOM_TYPES } from "../../utils/constants.js";

const DEFAULT_AMENITIES = [
  "Wi-Fi",
  "AC",
  "Meals Included",
  "Attached Bathroom",
  "Power Backup",
  "Laundry",
  "Geyser",
  "Study Table",
  "CCTV Security",
  "Refrigerator",
  "Housekeeping",
  "Parking",
];

const ListingForm = ({ initialValues = {}, onSubmit, isEditing = false, loading = false }) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    rent: "",
    city: "",
    area: "",
    collegeNearby: "",
    roomType: "Single",
    amenities: [],
    available: true,
  });

  const [selectedFiles, setSelectedFiles] = useState([]);
  const [filePreviews, setFilePreviews] = useState([]);
  const [amenityInput, setAmenityInput] = useState("");

  useEffect(() => {
    if (initialValues && Object.keys(initialValues).length > 0) {
      setFormData({
        title: initialValues.title || "",
        description: initialValues.description || "",
        rent: initialValues.rent || "",
        city: initialValues.city || "",
        area: initialValues.area || "",
        collegeNearby: initialValues.collegeNearby || "",
        roomType: initialValues.roomType || "Single",
        amenities: Array.isArray(initialValues.amenities) ? initialValues.amenities : [],
        available: initialValues.available !== undefined ? initialValues.available : true,
      });
    }
  }, [initialValues]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const toggleAmenity = (amenity) => {
    setFormData((prev) => {
      const exists = prev.amenities.includes(amenity);
      return {
        ...prev,
        amenities: exists
          ? prev.amenities.filter((a) => a !== amenity)
          : [...prev.amenities, amenity],
      };
    });
  };

  const handleAddCustomAmenity = () => {
    if (!amenityInput.trim()) return;
    if (!formData.amenities.includes(amenityInput.trim())) {
      setFormData((prev) => ({
        ...prev,
        amenities: [...prev.amenities, amenityInput.trim()],
      }));
    }
    setAmenityInput("");
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files).slice(0, 5);
    setSelectedFiles(files);

    const previews = files.map((file) => URL.createObjectURL(file));
    setFilePreviews(previews);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (isEditing) {
      // Edit Listing sends JSON body
      onSubmit(formData);
    } else {
      // Create Listing sends Multipart FormData
      const data = new FormData();
      data.append("title", formData.title);
      data.append("description", formData.description);
      data.append("rent", formData.rent);
      data.append("city", formData.city);
      data.append("area", formData.area);
      data.append("collegeNearby", formData.collegeNearby);
      data.append("roomType", formData.roomType);

      formData.amenities.forEach((amenity) => {
        data.append("amenities", amenity);
      });

      selectedFiles.forEach((file) => {
        data.append("images", file);
      });

      onSubmit(data);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-100 shadow-sm space-y-8">
      
      {/* Basic Info Header */}
      <div>
        <h3 className="text-xl font-bold text-slate-900 mb-1">
          {isEditing ? "Edit Accommodation Details" : "Post a New Accommodation"}
        </h3>
        <p className="text-xs text-slate-500">
          Provide accurate property details to help students find your listing.
        </p>
      </div>

      {/* Grid: Title & Rent */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-1">
          <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
            Listing Title *
          </label>
          <input
            type="text"
            name="title"
            required
            value={formData.title}
            onChange={handleChange}
            placeholder="e.g. Spacious Single Room with AC & Wi-Fi"
            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-semibold text-slate-800 focus:bg-white focus:border-blue-600 focus:outline-none"
          />
        </div>

        <div className="space-y-1">
          <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
            Monthly Rent (₹) *
          </label>
          <input
            type="number"
            name="rent"
            required
            min="1000"
            value={formData.rent}
            onChange={handleChange}
            placeholder="e.g. 8500"
            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-semibold text-slate-800 focus:bg-white focus:border-blue-600 focus:outline-none"
          />
        </div>
      </div>

      {/* Grid: Location & College */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="space-y-1">
          <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
            City *
          </label>
          <input
            type="text"
            name="city"
            required
            value={formData.city}
            onChange={handleChange}
            placeholder="e.g. Delhi, Mumbai, Bangalore"
            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-semibold text-slate-800 focus:bg-white focus:border-blue-600 focus:outline-none"
          />
        </div>

        <div className="space-y-1">
          <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
            Area / Locality *
          </label>
          <input
            type="text"
            name="area"
            required
            value={formData.area}
            onChange={handleChange}
            placeholder="e.g. North Campus, Powai, Koramangala"
            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-semibold text-slate-800 focus:bg-white focus:border-blue-600 focus:outline-none"
          />
        </div>

        <div className="space-y-1">
          <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
            College / University Nearby *
          </label>
          <input
            type="text"
            name="collegeNearby"
            required
            value={formData.collegeNearby}
            onChange={handleChange}
            placeholder="e.g. Delhi University, IIT Bombay"
            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-semibold text-slate-800 focus:bg-white focus:border-blue-600 focus:outline-none"
          />
        </div>
      </div>

      {/* Room Type Selector */}
      <div className="space-y-2">
        <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
          Room Type *
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {ROOM_TYPES.map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => setFormData((prev) => ({ ...prev, roomType: type }))}
              className={`py-3 px-3 rounded-2xl text-xs font-extrabold border transition-all cursor-pointer ${
                formData.roomType === type
                  ? "bg-blue-600 border-blue-600 text-white shadow-md shadow-blue-500/20"
                  : "bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100"
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* Description */}
      <div className="space-y-1">
        <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
          Detailed Description *
        </label>
        <textarea
          name="description"
          required
          rows={4}
          value={formData.description}
          onChange={handleChange}
          placeholder="Describe rules, meal times, distance to campus gate, security, deposit requirements..."
          className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium text-slate-800 focus:bg-white focus:border-blue-600 focus:outline-none"
        ></textarea>
      </div>

      {/* Amenities Selector */}
      <div className="space-y-3">
        <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
          Included Amenities
        </label>
        <div className="flex flex-wrap gap-2">
          {DEFAULT_AMENITIES.map((amenity) => {
            const checked = formData.amenities.includes(amenity);
            return (
              <button
                key={amenity}
                type="button"
                onClick={() => toggleAmenity(amenity)}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                  checked
                    ? "bg-orange-500 text-white shadow-sm"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {checked && <HiCheck className="text-sm" />}
                <span>{amenity}</span>
              </button>
            );
          })}
        </div>

        {/* Custom Amenity Adder */}
        <div className="flex items-center gap-2 max-w-sm pt-2">
          <input
            type="text"
            value={amenityInput}
            onChange={(e) => setAmenityInput(e.target.value)}
            placeholder="Add custom amenity..."
            className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:bg-white focus:outline-none"
          />
          <button
            type="button"
            onClick={handleAddCustomAmenity}
            className="px-4 py-2 bg-slate-900 text-white text-xs font-bold rounded-xl hover:bg-blue-600 transition-colors"
          >
            Add
          </button>
        </div>
      </div>

      {/* Availability Checkbox (for editing) */}
      {isEditing && (
        <div className="flex items-center gap-3 pt-2">
          <input
            type="checkbox"
            id="available"
            name="available"
            checked={formData.available}
            onChange={handleChange}
            className="w-5 h-5 text-blue-600 rounded-md border-slate-300 focus:ring-blue-500"
          />
          <label htmlFor="available" className="text-sm font-bold text-slate-800 cursor-pointer">
            Mark as Available for Rent
          </label>
        </div>
      )}

      {/* Image File Uploads (for Create Listing) */}
      {!isEditing && (
        <div className="space-y-3 pt-2">
          <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
            Property Photos (Up to 5 images)
          </label>
          <div className="border-2 border-dashed border-slate-200 hover:border-blue-400 rounded-3xl p-6 text-center bg-slate-50 transition-colors">
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
              id="image-upload"
            />
            <label htmlFor="image-upload" className="cursor-pointer flex flex-col items-center gap-2">
              <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center text-2xl">
                <HiUpload />
              </div>
              <span className="text-sm font-bold text-slate-800">
                Click to upload property images
              </span>
              <span className="text-xs text-slate-400">
                JPEG, PNG or WEBP (Max 5 photos, uploaded directly to Cloudinary)
              </span>
            </label>
          </div>

          {/* Previews */}
          {filePreviews.length > 0 && (
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-3 pt-3">
              {filePreviews.map((preview, idx) => (
                <div key={idx} className="relative h-20 rounded-xl overflow-hidden border border-slate-200 shadow-xs">
                  <img src={preview} alt={`Preview ${idx + 1}`} className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Submit Button */}
      <div className="pt-4 border-t border-slate-100 flex justify-end">
        <button
          type="submit"
          disabled={loading}
          className="px-8 py-4 bg-orange-500 hover:bg-orange-600 disabled:bg-slate-300 text-white font-extrabold text-sm rounded-2xl shadow-lg shadow-orange-500/20 transition-all hover:scale-[1.01] active:scale-95 cursor-pointer"
        >
          {loading ? "Saving listing..." : isEditing ? "Update Property" : "Publish Listing"}
        </button>
      </div>

    </form>
  );
};

export default ListingForm;
