import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth.js";
import { HiUser, HiMail, HiLockClosed, HiPhone, HiAcademicCap } from "react-icons/hi";
import { FaBuilding, FaGraduationCap } from "react-icons/fa";

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "student",
    phone: "",
    college: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const payload = {
      ...formData,
      email: formData.email.trim().toLowerCase(),
    };

    const result = await register(payload);
    setLoading(false);

    if (result.success) {
      navigate("/login");
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12">
      <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-100 shadow-2xl max-w-lg w-full space-y-8">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-orange-500 text-white flex items-center justify-center text-xl font-bold mx-auto shadow-md shadow-orange-500/20">
            <FaGraduationCap />
          </div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">
            Join StayNear Today
          </h2>
          <p className="text-xs text-slate-500">
            Create an account to search accommodations or post your properties
          </p>
        </div>

        {/* Role Selector */}
        <div className="grid grid-cols-2 gap-3 p-1.5 bg-slate-100 rounded-2xl">
          <button
            type="button"
            onClick={() => setFormData((prev) => ({ ...prev, role: "student" }))}
            className={`py-3 rounded-xl text-xs font-extrabold flex items-center justify-center gap-2 transition-all cursor-pointer ${
              formData.role === "student"
                ? "bg-white text-blue-600 shadow-md"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            <FaGraduationCap className="text-base" />
            <span>I'm a Student</span>
          </button>

          <button
            type="button"
            onClick={() => setFormData((prev) => ({ ...prev, role: "owner" }))}
            className={`py-3 rounded-xl text-xs font-extrabold flex items-center justify-center gap-2 transition-all cursor-pointer ${
              formData.role === "owner"
                ? "bg-white text-orange-600 shadow-md"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            <FaBuilding className="text-base" />
            <span>I'm a Property Owner</span>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Name */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
              Full Name *
            </label>
            <div className="relative">
              <HiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-lg" />
              <input
                type="text"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                placeholder="Rahul Sharma"
                className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-semibold text-slate-800 focus:bg-white focus:border-blue-600 focus:outline-none"
              />
            </div>
          </div>

          {/* Email */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
              Email Address *
            </label>
            <div className="relative">
              <HiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-lg" />
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder="rahul@college.edu"
                className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-semibold text-slate-800 focus:bg-white focus:border-blue-600 focus:outline-none"
              />
            </div>
          </div>

          {/* Password */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
              Password (Min 6 characters) *
            </label>
            <div className="relative">
              <HiLockClosed className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-lg" />
              <input
                type="password"
                name="password"
                required
                minLength={6}
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-semibold text-slate-800 focus:bg-white focus:border-blue-600 focus:outline-none"
              />
            </div>
          </div>

          {/* Phone & College Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                Phone Number
              </label>
              <div className="relative">
                <HiPhone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-lg" />
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+91 9876543210"
                  className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-semibold text-slate-800 focus:bg-white focus:border-blue-600 focus:outline-none"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                College / University
              </label>
              <div className="relative">
                <HiAcademicCap className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-lg" />
                <input
                  type="text"
                  name="college"
                  value={formData.college}
                  onChange={handleChange}
                  placeholder="Delhi University"
                  className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-semibold text-slate-800 focus:bg-white focus:border-blue-600 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-orange-500 hover:bg-orange-600 disabled:bg-slate-300 text-white font-extrabold text-sm rounded-2xl shadow-lg shadow-orange-500/20 transition-all hover:scale-[1.01] active:scale-95 cursor-pointer mt-4"
          >
            {loading ? "Creating Account..." : `Register as ${formData.role === "owner" ? "Property Owner" : "Student"}`}
          </button>
        </form>

        {/* Footer */}
        <div className="text-center pt-4 border-t border-slate-100">
          <p className="text-xs text-slate-500">
            Already have an account?{" "}
            <Link to="/login" className="font-bold text-blue-600 hover:underline">
              Log In Here
            </Link>
          </p>
        </div>

      </div>
    </div>
  );
};

export default Register;
