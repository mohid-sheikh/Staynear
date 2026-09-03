import { useState, useEffect } from "react";
import { HiX, HiUpload, HiCheck, HiTrash } from "react-icons/hi";
import { ROOM_TYPES } from "../../utils/constants.js";
import LocationPicker from "../maps/LocationPicker.jsx";
import { getImageUrl } from "../../utils/imageUtils.js";

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

  const [location, setLocation] = useState({
    address: "",
    latitude: null,
    longitude: null,
  });

  const [existingImages, setExistingImages] = useState([]);
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

      if (Array.isArray(initialValues.images)) {
        setExistingImages(initialValues.images);
      }

      if (initialValues.location) {
        setLocation({
          address: initialValues.location.address || "",
          latitude: initialValues.location.latitude ?? null,
          longitude: initialValues.location.longitude ?? null,
        });
      }
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
    const incomingFiles = Array.from(e.target.files);
    const maxAllowed = Math.max(0, 5 - existingImages.length);
    const filesToKeep = incomingFiles.slice(0, maxAllowed);

    const updatedSelected = [...selectedFiles, ...filesToKeep].slice(0, maxAllowed);
    setSelectedFiles(updatedSelected);

    const previews = updatedSelected.map((file) => URL.createObjectURL(file));
    setFilePreviews(previews);
  };

  const handleRemoveExistingImage = (indexToRemove) => {
    setExistingImages((prev) => prev.filter((_, idx) => idx !== indexToRemove));
  };

  const handleRemoveSelectedFile = (indexToRemove) => {
    const updatedFiles = selectedFiles.filter((_, idx) => idx !== indexToRemove);
    setSelectedFiles(updatedFiles);
    const previews = updatedFiles.map((file) => URL.createObjectURL(file));
    setFilePreviews(previews);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const data = new FormData();
    data.append("title", formData.title);
    data.append("description", formData.description);
    data.append("rent", formData.rent);
    data.append("city", formData.city);
    data.append("area", formData.area);
    data.append("collegeNearby", formData.collegeNearby);
    data.append("roomType", formData.roomType);

    if (isEditing) {
      data.append("available", formData.available);
    }

    formData.amenities.forEach((amenity) => {
      data.append("amenities", amenity);
    });

    existingImages.forEach((img) => {
      data.append("existingImages", img);
    });

    selectedFiles.forEach((file) => {
      data.append("images", file);
    });

    if (location.address || location.latitude !== null || location.longitude !== null) {
      data.append("location", JSON.stringify(location));
    }

    onSubmit(data);
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

      {/* Location & Interactive Map Picker */}
      <div className="space-y-2">
        <h4 className="text-sm font-bold text-slate-900">
          Property Map Location & Address
        </h4>
        <LocationPicker location={location} onChange={setLocation} />
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

      {/* Image File Uploads & Management (Both Create & Edit) */}
      <div className="space-y-4 pt-2">
        <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
          Property Photos (Up to 5 images total)
        </label>

        {/* Existing Images display (Edit mode) */}
        {existingImages.length > 0 && (
          <div className="space-y-2">
            <span className="text-xs font-semibold text-slate-500 block">Current Photos:</span>
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
              {existingImages.map((img, idx) => (
                <div key={idx} className="relative h-24 rounded-2xl overflow-hidden border border-slate-200 shadow-xs group">
                  <img
                    src={getImageUrl(img)}
                    alt={`Property photo ${idx + 1}`}
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveExistingImage(idx)}
                    className="absolute top-1 right-1 w-7 h-7 rounded-full bg-red-600/90 hover:bg-red-700 text-white flex items-center justify-center text-xs shadow-md transition-all cursor-pointer"
                    title="Delete photo"
                  >
                    <HiTrash />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Upload Input Area (if total < 5) */}
        {existingImages.length + selectedFiles.length < 5 && (
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
                Click to upload {existingImages.length > 0 ? "additional property images" : "property images"}
              </span>
              <span className="text-xs text-slate-400">
                JPEG, PNG or WEBP (Max {5 - existingImages.length} photos)
              </span>
            </label>
          </div>
        )}

        {/* New File Previews */}
        {filePreviews.length > 0 && (
          <div className="space-y-2">
            <span className="text-xs font-semibold text-slate-500 block">New Photos to Upload:</span>
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
              {filePreviews.map((preview, idx) => (
                <div key={idx} className="relative h-24 rounded-2xl overflow-hidden border border-slate-200 shadow-xs group">
                  <img src={preview} alt={`New Preview ${idx + 1}`} className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => handleRemoveSelectedFile(idx)}
                    className="absolute top-1 right-1 w-7 h-7 rounded-full bg-red-600/90 hover:bg-red-700 text-white flex items-center justify-center text-xs shadow-md transition-all cursor-pointer"
                    title="Remove selected file"
                  >
                    <HiX />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

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
