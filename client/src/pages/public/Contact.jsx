import { useState } from "react";
import { HiMail, HiPhone, HiLocationMarker, HiCheckCircle } from "react-icons/hi";
import toast from "react-hot-toast";

const Contact = () => {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    toast.success("Thank you! Your message has been sent to our support team.");
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Get in Touch
        </h1>
        <p className="text-slate-500 text-sm">
          Have questions about student accommodations or listing your property? We're here to help!
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Contact Info */}
        <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-xs space-y-6">
          <h3 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3">
            Contact Information
          </h3>

          <div className="space-y-4 text-sm text-slate-600">
            <div className="flex items-start gap-3">
              <HiMail className="text-blue-600 text-xl shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-slate-800 block text-xs uppercase tracking-wider">Email Support</span>
                <span>support@staynear.com</span>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <HiPhone className="text-orange-500 text-xl shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-slate-800 block text-xs uppercase tracking-wider">Helpline</span>
                <span>+91 1800-STAY-NEAR</span>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <HiLocationMarker className="text-blue-600 text-xl shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-slate-800 block text-xs uppercase tracking-wider">Headquarters</span>
                <span>Tech Park, Sector 62, Noida, UP, India</span>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-8 sm:p-10 border border-slate-100 shadow-xs">
          {submitted ? (
            <div className="text-center py-12 space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-3xl mx-auto">
                <HiCheckCircle />
              </div>
              <h3 className="text-xl font-bold text-slate-900">Message Received!</h3>
              <p className="text-sm text-slate-500 max-w-md mx-auto">
                Our support team will review your inquiry and reach back out to you via email within 24 hours.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">Your Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Ananya Verma"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-semibold focus:bg-white focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">Your Email *</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="ananya@student.edu"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-semibold focus:bg-white focus:outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">Subject *</label>
                <input
                  type="text"
                  required
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  placeholder="Inquiry about PG listing"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-semibold focus:bg-white focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">Message *</label>
                <textarea
                  required
                  rows={4}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="How can we help you?"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium focus:bg-white focus:outline-none"
                ></textarea>
              </div>

              <button
                type="submit"
                className="px-8 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-sm rounded-2xl shadow-md transition-all cursor-pointer"
              >
                Send Message
              </button>
            </form>
          )}
        </div>

      </div>

    </div>
  );
};

export default Contact;
