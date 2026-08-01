import { useAuth } from "../../hooks/useAuth.js";
import { HiUser, HiMail, HiPhone, HiAcademicCap, HiCalendar, HiShieldCheck } from "react-icons/hi";
import { FaBuilding, FaGraduationCap, FaUserCircle } from "react-icons/fa";

const Profile = () => {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Header Profile Card */}
      <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-xl flex flex-col sm:flex-row items-center gap-6">
        <div className="w-24 h-24 rounded-3xl bg-blue-600 text-white flex items-center justify-center text-5xl shadow-lg shadow-blue-500/20 shrink-0">
          <FaUserCircle />
        </div>

        <div className="space-y-2 text-center sm:text-left flex-grow">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
            <h1 className="text-2xl font-black text-slate-900">{user.name}</h1>
            <span className={`px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider ${
              user.role === "owner" ? "bg-orange-100 text-orange-700" : "bg-blue-100 text-blue-700"
            }`}>
              {user.role}
            </span>
          </div>
          <p className="text-xs text-slate-500 font-medium">{user.email}</p>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-full">
            <HiShieldCheck />
            <span>Verified Account</span>
          </div>
        </div>
      </div>

      {/* Account Details Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-xs space-y-6">
        <h3 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3">
          Personal Information
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          
          <div className="flex items-start gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-100">
            <HiUser className="text-blue-600 text-xl shrink-0 mt-0.5" />
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Full Name</span>
              <span className="text-sm font-bold text-slate-800">{user.name}</span>
            </div>
          </div>

          <div className="flex items-start gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-100">
            <HiMail className="text-orange-500 text-xl shrink-0 mt-0.5" />
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Email Address</span>
              <span className="text-sm font-bold text-slate-800">{user.email}</span>
            </div>
          </div>

          <div className="flex items-start gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-100">
            <HiPhone className="text-blue-600 text-xl shrink-0 mt-0.5" />
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Phone Number</span>
              <span className="text-sm font-bold text-slate-800">{user.phone || "Not specified"}</span>
            </div>
          </div>

          <div className="flex items-start gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-100">
            <HiAcademicCap className="text-orange-500 text-xl shrink-0 mt-0.5" />
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">College / University</span>
              <span className="text-sm font-bold text-slate-800">{user.college || "Not specified"}</span>
            </div>
          </div>

        </div>
      </div>

    </div>
  );
};

export default Profile;
