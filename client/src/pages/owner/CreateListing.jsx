import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createListing } from "../../services/listingService.js";
import ListingForm from "../../components/listings/ListingForm.jsx";
import toast from "react-hot-toast";

const CreateListing = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (formData) => {
    setLoading(true);
    try {
      const data = await createListing(formData);
      if (data.success) {
        toast.success("Listing created successfully!");
        navigate("/owner/listings");
      } else {
        toast.error(data.message || "Failed to create listing.");
      }
    } catch (err) {
      console.error("Error creating listing:", err);
      const msg = err.response?.data?.message || "Server Error creating listing.";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <ListingForm onSubmit={handleSubmit} loading={loading} isEditing={false} />
    </div>
  );
};

export default CreateListing;
