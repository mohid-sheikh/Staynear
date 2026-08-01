import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getSingleListing, updateListing } from "../../services/listingService.js";
import ListingForm from "../../components/listings/ListingForm.jsx";
import Loader from "../../components/common/Loader.jsx";
import ErrorState from "../../components/common/ErrorState.jsx";
import toast from "react-hot-toast";

const EditListing = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [initialValues, setInitialValues] = useState(null);
  const [fetching, setFetching] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(false);

  const fetchListing = async () => {
    setFetching(true);
    setError(false);
    try {
      const data = await getSingleListing(id);
      if (data.success && data.listing) {
        setInitialValues(data.listing);
      } else {
        setError(true);
      }
    } catch (err) {
      console.error("Failed to fetch listing:", err);
      setError(true);
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    fetchListing();
  }, [id]);

  const handleSubmit = async (listingData) => {
    setSubmitting(true);
    try {
      const data = await updateListing(id, listingData);
      if (data.success) {
        toast.success("Listing updated successfully!");
        navigate("/owner/listings");
      } else {
        toast.error(data.message || "Failed to update listing.");
      }
    } catch (err) {
      console.error("Error updating listing:", err);
      const msg = err.response?.data?.message || "Failed to update listing.";
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  if (fetching) return <Loader message="Fetching property details..." />;
  if (error || !initialValues) return <ErrorState onRetry={fetchListing} message="Listing not found." />;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <ListingForm
        initialValues={initialValues}
        onSubmit={handleSubmit}
        loading={submitting}
        isEditing={true}
      />
    </div>
  );
};

export default EditListing;
