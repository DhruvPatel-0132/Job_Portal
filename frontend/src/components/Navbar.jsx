import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Home,
  Users,
  Briefcase,
  Search,
  Bell,
  MessageSquare,
  Grid,
} from "lucide-react";
import { useAuthStore } from "../store/authStore";

const Navbar = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const user = {
    name: "John Doe",
    avatar: "/avatar.svg",
    headline: "Software Engineer",
  };

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);
  const navigate = useNavigate();

  const logout = useAuthStore((state) => state.logout); // ✅ ADD THIS

  const handleLogout = () => {
    logout(); // now works
    navigate("/login");
  };

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-8 lg:px-16">
        <div className="flex items-stretch h-14">
          {/* ── Left: Logo + Search ── */}
          <div className="flex items-center gap-2 mr-2">
            <Link to="/dashboard" className="flex-shrink-0">
              <div className="w-9 h-9 bg-[#0a66c2] rounded flex items-center justify-center font-extrabold text-white text-xl leading-none select-none">
                in
              </div>
            </Link>
            <div className="hidden md:flex items-center bg-[#eef3f8] rounded-md px-3 h-9 w-[220px] gap-2 border border-transparent focus-within:border-[#0a66c2] focus-within:bg-white transition-all duration-150">
              <Search className="h-4 w-4 text-gray-500 flex-shrink-0" />
              <input
                type="text"
                className="bg-transparent text-sm text-gray-900 placeholder-gray-500 outline-none w-full"
                placeholder="Search"
              />
            </div>
          </div>

          {/* ── Center / Right: Nav Items ── */}
          <div className="flex items-stretch ml-auto">
            <NavItem
              icon={<Home className="h-5 w-5" />}
              label="Home"
              to="/dashboard"
              active
            />
            <NavItem
              icon={<Users className="h-5 w-5" />}
              label="My Network"
              to="#"
            />
            <NavItem
              icon={<Briefcase className="h-5 w-5" />}
              label="Jobs"
              to="#"
            />
            <NavItem
              icon={<Bell className="h-5 w-5" />}
              label="Notifications"
              to="#"
            />

            {/* Vertical divider */}
            <div className="self-center mx-1 w-px h-8 bg-gray-300" />

            {/* Me Dropdown */}
            <div className="relative flex items-stretch" ref={dropdownRef}>
              <button
                className="flex flex-col items-center justify-center px-3 text-gray-500 hover:text-gray-900 focus:outline-none border-b-2 border-transparent hover:border-gray-900 transition-colors h-full cursor-pointer"
                onClick={() => setIsDropdownOpen((o) => !o)}
              >
                <img
                  className="h-6 w-6 rounded-full object-cover"
                  src={user.avatar}
                  alt="User Avatar"
                />
                <div className="flex items-center mt-0.5">
                  <span className="text-xs hidden md:block">Me</span>
                  <svg
                    className="ml-0.5 h-3 w-3 hidden md:block"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              </button>

              {/* Dropdown Menu */}
              {isDropdownOpen && (
                <div className="absolute top-full right-0 mt-1 w-64 rounded-md shadow-xl bg-white ring-1 ring-black/10 z-50 overflow-hidden">
                  {/* Profile summary */}
                  <div className="p-4 border-b border-gray-100">
                    <div className="flex items-center gap-3">
                      <img
                        className="h-12 w-12 rounded-full object-cover border border-gray-200"
                        src={user.avatar}
                        alt="User Avatar"
                      />
                      <div>
                        <p className="text-sm font-semibold text-gray-900">
                          {user.name}
                        </p>
                        <p className="text-xs text-gray-500 truncate w-36">
                          {user.headline}
                        </p>
                      </div>
                    </div>
                    <Link
                      to="#"
                      className="mt-3 block w-full text-center border border-[#0a66c2] text-[#0a66c2] hover:bg-blue-50 px-4 py-1 rounded-full text-sm font-semibold transition-colors"
                    >
                      View Profile
                    </Link>
                  </div>
                  <div className="py-1">
                    <p className="px-4 pt-2 pb-1 text-xs font-semibold text-gray-900">
                      Account
                    </p>
                    <a
                      href="#"
                      className="block px-4 py-1.5 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Settings &amp; Privacy
                    </a>
                    <a
                      href="#"
                      className="block px-4 py-1.5 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Help
                    </a>
                  </div>
                  <div className="py-1 border-t border-gray-100">
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                    >
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

const NavItem = ({ icon, label, to, active }) => (
  <Link
    to={to}
    className={`flex flex-col items-center justify-center px-3 border-b-2 transition-colors
      ${
        active
          ? "border-gray-900 text-gray-900"
          : "border-transparent text-gray-500 hover:text-gray-900 hover:border-gray-900"
      }`}
  >
    {icon}
    <span className="text-xs mt-0.5 hidden md:block">{label}</span>
  </Link>
);

export default Navbar;
