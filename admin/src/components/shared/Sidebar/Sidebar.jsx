import React, { useEffect, useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router";
import {
  FaHome,
  FaUser,
  FaDownload,
  FaLink,
  FaWallet,
  FaRocket,
  FaSignOutAlt,
  FaSearch,
  FaBell,
  FaUpload,
  FaUserCircle,
  FaBars,
  FaTimes,
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
import { useAuth } from "../../../hooks/useAuth";
import { IoIosApps } from "react-icons/io";
import { TbCategoryFilled } from "react-icons/tb";
import axios from "axios";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { logout, user } = useAuth();
  const [developer, setDeveloper] = useState(null);
  const navigate = useNavigate();
  const userId = user?.id;

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully!");
    navigate("/login");
  };

  const handleClick = () => {
    navigate("/upload-apk");
  };

  const menuItems = [
    { to: "/", icon: <FaHome />, text: "Dashboard" },
    { to: "/profile", icon: <FaUser />, text: "Profile" },
    { to: "/upload-apk", icon: <IoIosApps />, text: "Publish APK" },
    { to: "/my-apps", icon: <TbCategoryFilled />, text: "My Apps" },
    { to: "/refer-link", icon: <FaLink />, text: "Refer & Earn" },
    { to: "/withdraw", icon: <FaWallet />, text: "Withdraw" },
    { to: "/boost-app", icon: <FaRocket />, text: "Boost App" },
  ];

  // Fetch developer data
  useEffect(() => {
    const fetchDeveloper = async () => {
      if (!userId) return;

      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/developer/${userId}`
        );

        if (response.data.success) {
          setDeveloper(response.data.developer);
        } else {
          toast.error(response.data.message || "Failed to load profile");
        }
      } catch (err) {
        console.error("Error fetching developer:", err);
        toast.error("Failed to load profile data");
      }
    };

    fetchDeveloper();
  }, [userId]);

  // Determine display name
  const displayName = developer
    ? developer.companyName?.trim() || developer.fullName?.trim() || "Developer"
    : "Loading...";

  const displayEmail = developer?.email || "N/A";

  const joinedDate = developer?.createdAt
    ? new Date(developer.createdAt).toLocaleDateString("en-US", {
        month: "short",
        year: "numeric",
      })
    : "N/A";

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-orange-950 text-white">
      {/* ================= MOBILE TOP BAR ================= */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-gray-900/80 backdrop-blur-xl border-b border-orange-800/30 md:hidden">
        <div className="flex items-center justify-between p-4">
          <button
            onClick={() => setIsOpen(true)}
            className="text-white text-2xl hover:bg-orange-900/40 p-3 rounded-xl transition cursor-pointer"
          >
            <FaBars />
          </button>

          <h1 className="text-xl font-bold bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text text-transparent">
            APK Store
          </h1>

          <div className="flex items-center gap-4">
            <FaBell className="text-xl cursor-pointer hover:text-orange-400 transition" />
            <FaUserCircle className="text-2xl cursor-pointer hover:text-orange-400 transition" />
          </div>
        </div>
      </div>

      {/* ================= MOBILE SIDEBAR + OVERLAY ================= */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40 md:hidden"
            />

            <motion.div
              initial={{ x: -320 }}
              animate={{ x: 0 }}
              exit={{ x: -320 }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="fixed left-0 top-0 h-full w-80 bg-gradient-to-b from-gray-900 via-orange-950 to-black z-50 shadow-2xl border-r border-orange-800/40"
            >
              <SidebarContent
                menuItems={menuItems}
                onClose={() => setIsOpen(false)}
                onLogout={handleLogout}
                developer={developer}
                displayName={displayName}
                displayEmail={displayEmail}
                joinedDate={joinedDate}
              />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ================= DESKTOP SIDEBAR ================= */}
      <div className="hidden md:block fixed left-0 top-0 h-full w-72 bg-gray-900/90 backdrop-blur-2xl border-r border-orange-800/40 z-40">
        <SidebarContent
          menuItems={menuItems}
          onLogout={handleLogout}
          developer={developer}
          displayName={displayName}
          displayEmail={displayEmail}
          joinedDate={joinedDate}
        />
      </div>

      {/* ================= MAIN CONTENT AREA ================= */}
      <div className="md:ml-72 pt-16 md:pt-8 px-4 md:px-10 pb-10">
        {/* Desktop Top Bar */}
        <motion.div
          initial={{ y: -30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="hidden md:flex items-center justify-between mb-10"
        >
          <div className="flex items-center flex-1 max-w-2xl">
            <div className="relative w-full">
              <FaSearch className="absolute z-10 left-5 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
              <input
                type="text"
                placeholder="Search apps, features, analytics..."
                className="w-full pl-14 pr-6 py-4 bg-gray-800/70 backdrop-blur-md border border-gray-700 rounded-2xl focus:outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-500/20 transition-all placeholder-gray-500"
              />
            </div>
          </div>

          <div className="flex items-center gap-5">
            <div className="relative cursor-pointer">
              <FaBell className="text-2xl hover:text-orange-400 transition" />
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-orange-500 rounded-full animate-pulse"></span>
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleClick}
              className="flex items-center cursor-pointer gap-3 bg-gradient-to-r from-orange-600 to-orange-500 px-7 py-4 rounded-2xl font-bold shadow-xl shadow-orange-900/50 hover:shadow-orange-900/70 transition"
            >
              <FaUpload className="text-lg" />
              Upload Apk / Ipa
            </motion.button>
          </div>
        </motion.div>

        {/* Page Content Outlet */}
        <div className="bg-gray-900/70 backdrop-blur-xl rounded-3xl mt-10 md:mt-0 p-2 md:p-10 shadow-2xl border border-orange-800/30 min-h-[80vh]">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

// Reusable Sidebar Content Component
const SidebarContent = ({
  menuItems,
  onClose,
  onLogout,
  displayName,
  displayEmail,
  joinedDate,
}) => {
  return (
    <div className="h-full flex flex-col">
      {/* Mobile Header */}
      <div className="md:hidden p-6 border-b border-orange-800/40">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center text-3xl font-bold shadow-lg">
              A
            </div>
            <div>
              <h1 className="text-2xl font-extrabold bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text text-transparent">
                APK Store
              </h1>
              <p className="text-xs text-gray-400">Developer Dashboard</p>
            </div>
          </div>

          {onClose && (
            <button
              onClick={onClose}
              className="text-2xl p-2 rounded-xl hover:bg-orange-900/40 transition cursor-pointer"
            >
              <FaTimes />
            </button>
          )}
        </div>
      </div>

      {/* Desktop Header Badge */}
      <div className="hidden md:block p-6 border-b border-orange-800/40 text-center">
        <div className="bg-gradient-to-r from-orange-600 to-orange-500 rounded-2xl px-8 py-4 shadow-2xl shadow-orange-900/60">
          <div className="text-2xl font-extrabold tracking-wider text-white">
            Developer Dashboard
          </div>
        </div>
      </div>

      {/* Profile Section */}
      <div className="p-6 bg-gradient-to-r from-orange-900/30 to-gray-900/50 backdrop-blur-md border-b border-orange-800/40">
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="w-16 h-16 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center text-2xl font-bold ring-4 ring-orange-500/30 shadow-xl">
              {displayName.charAt(0).toUpperCase()}
            </div>
            <div className="absolute bottom-0 right-0 w-5 h-5 bg-green-500 rounded-full border-4 border-gray-900"></div>
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-lg truncate max-w-[200px] text-orange-300">
              {displayName}
            </h3>
            <p
              className="text-sm text-gray-400 truncate  md:max-w-[160px]"
              title={displayEmail}
            >
              {displayEmail}
            </p>
            <p className="text-xs text-gray-500 mt-1">Joined {joinedDate}</p>
          </div>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {menuItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end
            onClick={onClose}
            className={({ isActive }) =>
              `flex items-center gap-4 px-6 py-4 rounded-2xl transition-all duration-300 group relative overflow-hidden cursor-pointer
              ${
                isActive
                  ? "bg-gradient-to-r from-orange-600 to-orange-500 text-white shadow-2xl shadow-orange-900/60 font-bold"
                  : "text-gray-300 hover:bg-orange-900/40 hover:text-orange-300"
              }`
            }
          >
            <motion.span whileHover={{ scale: 1.2 }} className="text-xl z-10">
              {item.icon}
            </motion.span>
            <span className="font-medium z-10">{item.text}</span>
            {({ isActive }) =>
              isActive && (
                <motion.div
                  layoutId="activeBackground"
                  className="absolute inset-0 bg-gradient-to-r from-orange-600 to-orange-500"
                  initial={false}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )
            }
          </NavLink>
        ))}
      </nav>

      {/* Logout */}
      <div className="p-6 border-t border-orange-800/40">
        <button
          onClick={onLogout}
          className="w-full cursor-pointer flex items-center gap-4 px-6 py-4 rounded-2xl bg-red-900/30 hover:bg-red-900/50 text-red-400 hover:text-red-300 transition-all duration-300 group"
        >
          <motion.span
            whileHover={{ scale: 1.2, rotate: 90 }}
            className="text-xl"
          >
            <FaSignOutAlt />
          </motion.span>
          <span className="font-semibold">Sign Out</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
