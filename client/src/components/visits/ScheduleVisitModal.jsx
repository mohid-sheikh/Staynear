import { useState, useEffect } from "react";
import Modal from "../common/Modal.jsx";
import { useAuth } from "../../hooks/useAuth.js";
import { createVisitRequest } from "../../services/visitService.js";
import { HiCalendar, HiClock, HiPhone, HiChatAlt2, HiUserGroup, HiVideoCamera } from "react-icons/hi";
import toast from "react-hot-toast";

const TIME_SLOTS = [
  "Morning (9:00 AM - 12:00 PM)",
  "Afternoon (12:00 PM - 4:00 PM)",
  "Evening (4:00 PM - 7:00 PM)",
];

const ScheduleVisitModal = ({ isOpen, onClose, listingId, listingTitle = "Accommodation", onSuccess }) => {
  const { user } = useAuth();
  
  const todayStr = new Date().toISOString().split("T")[0];

  const [formData, setFormData] = useState({
    visitDate: todayStr,
    visitTime: TIME_SLOTS[0],
    visitType: "In-Person",
    studentPhone: "",
    message: "",
  });

  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    if (user?.phone) {
      setFormData((prev) => ({ ...prev, studentPhone: user.phone }));
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrorMsg("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    if (!formData.visitDate) {
      setErrorMsg("Please select a visit date.");
      return;
    }
    if (!formData.studentPhone.trim()) {
      setErrorMsg("Please provide a contact phone number.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await createVisitRequest({
        listingId,
        visitDate: formData.visitDate,
        visitTime: formData.visitTime,
        visitType: formData.visitType,
        studentPhone: formData.studentPhone.trim(),
        message: formData.message.trim(),
      });

      if (res.success) {
        toast.success("Visit request submitted to property owner!");
        if (onSuccess) onSuccess(res.visitRequest);
        onClose();
      } else {
        setErrorMsg(res.message || "Failed to schedule visit.");
      }
    } catch (err) {
      console.error("Schedule Visit error:", err);
      const msg = err.response?.data?.message || "Failed to schedule visit request.";
      setErrorMsg(msg);
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Schedule Property Visit">
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4 text-xs text-blue-800">
          <span className="font-bold block text-blue-900 mb-0.5">Property:</span>
          <span className="line-clamp-1">{listingTitle}</span>
        </div>

        {errorMsg && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs font-semibold">
            {errorMsg}
          </div>
        )}

        {/* Visit Type Selector */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
            Visit Mode *
          </label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setFormData((prev) => ({ ...prev, visitType: "In-Person" }))}
              className={`p-3 rounded-2xl text-xs font-bold border flex items-center justify-center gap-2 cursor-pointer transition-all ${
                formData.visitType === "In-Person"
                  ? "bg-blue-600 border-blue-600 text-white shadow-md shadow-blue-500/20"
                  : "bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100"
              }`}
            >
              <HiUserGroup className="text-base" />
              <span>In-Person Visit</span>
            </button>

            <button
              type="button"
              onClick={() => setFormData((prev) => ({ ...prev, visitType: "Virtual Tour" }))}
              className={`p-3 rounded-2xl text-xs font-bold border flex items-center justify-center gap-2 cursor-pointer transition-all ${
                formData.visitType === "Virtual Tour"
                  ? "bg-blue-600 border-blue-600 text-white shadow-md shadow-blue-500/20"
                  : "bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100"
              }`}
            >
              <HiVideoCamera className="text-base" />
              <span>Virtual Tour</span>
            </button>
          </div>
        </div>

        {/* Date & Time Slot Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block flex items-center gap-1">
              <HiCalendar className="text-orange-500" />
              <span>Visit Date *</span>
            </label>
            <input
              type="date"
              name="visitDate"
              min={todayStr}
              required
              value={formData.visitDate}
              onChange={handleChange}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:bg-white focus:border-blue-600 focus:outline-none"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block flex items-center gap-1">
              <HiClock className="text-blue-600" />
              <span>Preferred Slot *</span>
            </label>
            <select
              name="visitTime"
              value={formData.visitTime}
              onChange={handleChange}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:bg-white focus:border-blue-600 focus:outline-none cursor-pointer"
            >
              {TIME_SLOTS.map((slot) => (
                <option key={slot} value={slot}>
                  {slot}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Contact Phone */}
        <div className="space-y-1">
          <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block flex items-center gap-1">
            <HiPhone className="text-emerald-600" />
            <span>Contact Phone Number *</span>
          </label>
          <input
            type="tel"
            name="studentPhone"
            required
            value={formData.studentPhone}
            onChange={handleChange}
            placeholder="e.g. 9876543210"
            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:bg-white focus:border-blue-600 focus:outline-none"
          />
        </div>

        {/* Message / Special Instructions */}
        <div className="space-y-1">
          <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block flex items-center gap-1">
            <HiChatAlt2 className="text-slate-400" />
            <span>Message / Notes for Owner (Optional)</span>
          </label>
          <textarea
            name="message"
            rows={3}
            value={formData.message}
            onChange={handleChange}
            placeholder="e.g. I am looking to move in next month. Please let me know if morning works best."
            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:bg-white focus:border-blue-600 focus:outline-none"
          ></textarea>
        </div>

        {/* Submit Actions */}
        <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="px-6 py-2.5 bg-orange-500 hover:bg-orange-600 disabled:bg-slate-300 text-white font-extrabold text-xs rounded-xl shadow-md shadow-orange-500/20 transition-all cursor-pointer"
          >
            {submitting ? "Submitting Request..." : "Request Visit"}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default ScheduleVisitModal;
