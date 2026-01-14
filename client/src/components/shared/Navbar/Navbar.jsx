import { useState, useRef, useEffect } from "react";
import { Search, Mic, LogOut } from "lucide-react";
import { Link, NavLink, useNavigate } from "react-router";
import { useAuth } from "../../../hooks/useAuth";
import { toast } from "react-toastify";
import logo from "/logo.png";
import { FaTelegram, FaWhatsappSquare } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import SupportSection from "../../SupportSection/SupportSection";

const Navbar = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  const userInitial = user?.name ? user.name.charAt(0).toUpperCase() : "U";

  const toggleDropdown = () => {
    setDropdownOpen((prev) => !prev);
  };

  const handleNavigate = () => {
    toast.info("Page is under construction.");
  };

  const handleLogout = () => {
    logout();
    setDropdownOpen(false);
    navigate("/");
  };

 

  const handleBecomeDeveloper = () => {
    setDropdownOpen(false);
    const url = import.meta.env.VITE_DEVELOPER_REGISTER_LINK;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  // বাইরে ক্লিক করলে ড্রপডাউন বন্ধ (ডেস্কটপ + মোবাইল দুটোতেই)
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <>
      {/* Top Helpline Bar */}
      <div className="hidden md:block w-full bg-green-900 text-white text-sm">
        <SupportSection />
      </div>

      {/* Main Navbar */}
      <nav className="w-full bg-white shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3">
              <img
                src={logo}
                alt="Oracle Store"
                className="w-10 h-10 object-contain"
              />
              <span className="font-bold text-xl text-gray-800">
                ORACLE STORE
              </span>
            </Link>

            {/* Desktop Navigation Links */}
            <div className="hidden md:flex items-center gap-10 flex-1 justify-center">
              <NavLink
                to="/"
                className={({ isActive }) =>
                  `font-semibold text-md transition ${
                    isActive
                      ? "text-green-700 font-bold"
                      : "hover:text-green-700"
                  }`
                }
              >
                HOME
              </NavLink>
              <button
                onClick={handleNavigate}
                className="font-semibold text-md transition cursor-pointer hover:text-green-700"
              >
                ANDROID APP
              </button>
              <button
                onClick={handleNavigate}
                className="font-semibold text-md transition cursor-pointer hover:text-green-700"
              >
                ISO APP
              </button>
              {/* <NavLink
                to="/my-apps"
                className={({ isActive }) =>
                  `font-semibold text-sm transition ${isActive ? "text-green-700 font-bold" : "hover:text-green-700"}`
                }
              >
                My APPS
              </NavLink> */}
            </div>

            {/* Desktop Search Bar */}
            <div className="hidden md:flex items-center bg-gray-100 rounded-full px-5 py-2 w-94 mx-2">
              <Mic size={20} className="text-gray-500 mr-3 cursor-pointer" />
              <input
                type="text"
                placeholder="Search apps..."
                className="flex-1 bg-transparent outline-none text-base"
              />
              <Search size={22} className="text-gray-500 cursor-pointer ml-3" />
            </div>

            {/* Right Side: User State */}
            <div className="flex items-center gap-5" ref={dropdownRef}>
              {user?.isLoggedIn ? (
                <div className="relative">
                  {/* Avatar - Click to toggle dropdown (both desktop & mobile) */}
                  <div
                    onClick={toggleDropdown}
                    className="w-11 h-11 rounded-full bg-gradient-to-br from-green-600 to-emerald-700 flex items-center justify-center text-white font-bold text-xl cursor-pointer shadow-lg hover:scale-110 transition"
                  >
                    {userInitial}
                  </div>

                  {/* Dropdown - Dark Theme */}
                  <div
                    className={`
                      absolute right-0 top-14 w-64 bg-white text-black rounded-xl shadow-2xl z-50 overflow-hidden
                      transition-all duration-300
                      ${
                        dropdownOpen
                          ? "opacity-100 visible translate-y-0"
                          : "opacity-0 invisible -translate-y-4 pointer-events-none"
                      }
                    `}
                  >
                    <div className="py-4 px-5">
                      <div className="mb-4 pb-3 border-b border-gray-700">
                        <p className="font-semibold text-base">{user.name}</p>
                        <p className="text-sm text-gray-400 truncate">
                          {user.email}
                        </p>
                      </div>

                      <button
                        onClick={handleBecomeDeveloper}
                        className="w-full text-left py-3 px-4 cursor-pointer hover:bg-gray-100 rounded-lg transition font-medium"
                      >
                        Become a Developer
                      </button>

                      <button
                        onClick={handleLogout}
                        className="w-full text-left py-3 cursor-pointer px-4 text-red-400 hover:bg-gray-100 rounded-lg transition font-medium flex items-center gap-2"
                      >
                        <LogOut size={18} />
                        Logout
                      </button>
                    </div>

                    {/* Arrow */}
                    <div className="absolute -top-2 right-5 w-4 h-4 bg-gray-900 rotate-45 z-50"></div>
                  </div>
                </div>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="px-4 py-1 md:px-6 cursor-pointer md:py-2 rounded-full border-2 border-green-700 text-green-700 font-medium hover:bg-green-700 hover:text-white transition"
                  >
                    Login
                  </Link>
                  <button
                    onClick={handleBecomeDeveloper}
                    className="hidden md:block px-6 cursor-pointer py-2 rounded-full bg-blue-600 text-white font-medium hover:bg-blue-700 transition"
                  >
                    Publish APK
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
