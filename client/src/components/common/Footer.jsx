import { Link } from "react-router-dom";
import { FaBuilding, FaGithub, FaTwitter, FaLinkedin, FaHeart } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          
          {/* Brand Info */}
          <div className="space-y-4 md:col-span-1">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white font-bold text-lg">
                <FaBuilding />
              </div>
              <span className="text-2xl font-bold tracking-tight text-white">
                Stay<span className="text-orange-500">Near</span>
              </span>
            </Link>
            <p className="text-sm text-slate-400 leading-relaxed">
              Empowering students to discover safe, affordable, and comfortable accommodations right next to their college campus.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <a href="#" className="w-9 h-9 rounded-full bg-slate-800 flex items-center justify-center hover:bg-blue-600 hover:text-white transition-colors">
                <FaTwitter className="text-base" />
              </a>
              <a href="#" className="w-9 h-9 rounded-full bg-slate-800 flex items-center justify-center hover:bg-blue-600 hover:text-white transition-colors">
                <FaLinkedin className="text-base" />
              </a>
              <a href="#" className="w-9 h-9 rounded-full bg-slate-800 flex items-center justify-center hover:bg-blue-600 hover:text-white transition-colors">
                <FaGithub className="text-base" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider">Navigation</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/" className="hover:text-white transition-colors">Home</Link></li>
              <li><Link to="/listings" className="hover:text-white transition-colors">Explore Listings</Link></li>
              <li><Link to="/register" className="hover:text-white transition-colors">Sign Up</Link></li>
              <li><Link to="/login" className="hover:text-white transition-colors">Log In</Link></li>
            </ul>
          </div>

          {/* Accommodation Types */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider">Room Types</h3>
            <ul className="space-y-2 text-sm text-slate-400">
              <li><Link to="/listings?roomType=Single" className="hover:text-white transition-colors">Single Rooms</Link></li>
              <li><Link to="/listings?roomType=Double" className="hover:text-white transition-colors">Double Sharing</Link></li>
              <li><Link to="/listings?roomType=Triple" className="hover:text-white transition-colors">Triple Sharing</Link></li>
              <li><Link to="/listings?roomType=PG" className="hover:text-white transition-colors">Paying Guest (PG)</Link></li>
              <li><Link to="/listings?roomType=Hostel" className="hover:text-white transition-colors">Student Hostels</Link></li>
            </ul>
          </div>

          {/* Student Hub */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider">For Owners</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Have a property near a university or college campus? List it on StayNear and reach thousands of verified students.
            </p>
            <Link 
              to="/register" 
              className="inline-block px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white font-medium text-sm rounded-xl transition-all shadow-xs"
            >
              List Your Property
            </Link>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-800 flex flex-col md:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} StayNear Inc. All rights reserved.</p>
          <div className="flex items-center gap-1">
            <span>Built with</span>
            <FaHeart className="text-orange-500 text-xs" />
            <span>for students everywhere</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
