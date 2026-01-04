// src/layouts/Sidebar.jsx

import React, { useState } from "react";
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
import { toast } from "react-toastify"; // Make sure you have react-toastify installed
import { useAuth } from "../../../hooks/useAuth";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { logout } = useAuth(); // Get setUser from context
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear user from context and localStorage
    logout();
    toast.success("👋 Logged out successfully!");
    navigate("/login");
  };

  const menuItems = [
    { to: "/", icon: <FaHome />, text: "Dashboard" },
    { to: "/profile", icon: <FaUser />, text: "Profile" },
    { to: "/all-apk", icon: <FaDownload />, text: "All Apps" },
    { to: "/refer-link", icon: <FaLink />, text: "Refer & Earn" },
    { to: "/withdraw", icon: <FaWallet />, text: "Withdraw" },
    { to: "/boost-app", icon: <FaRocket />, text: "Boost App" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
      {/* ================= MOBILE TOP BAR ================= */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-black/30 backdrop-blur-xl border-b border-white/10 md:hidden">
        <div className="flex items-center justify-between p-4">
          <button
            onClick={() => setIsOpen(true)}
            className="text-white text-2xl hover:bg-white/10 p-3 rounded-xl transition"
          >
            <FaBars />
          </button>

          <h1 className="text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            APK Store
          </h1>

          <div className="flex items-center gap-4">
            <FaBell className="text-xl cursor-pointer hover:text-purple-400 transition" />
            <FaUserCircle className="text-2xl cursor-pointer hover:text-purple-400 transition" />
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
              className="fixed left-0 top-0 h-full cursor-pointer w-80 bg-gradient-to-b from-purple-950 via-indigo-950 to-black z-50 shadow-2xl"
            >
              <SidebarContent
                menuItems={menuItems}
                onClose={() => setIsOpen(false)}
                onLogout={handleLogout}
              />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ================= DESKTOP SIDEBAR ================= */}
      <div className="hidden md:block fixed left-0 top-0 h-full w-72 bg-black/40 backdrop-blur-2xl border-r border-white/10 z-40">
        <SidebarContent menuItems={menuItems} onLogout={handleLogout} />
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
                className="w-full pl-14 pr-6 py-4 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl focus:outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-500/20 transition-all placeholder-gray-400"
              />
            </div>
          </div>

          <div className="flex items-center gap-5">
            <div className="relative">
              <FaBell className="text-2xl cursor-pointer hover:text-purple-400 transition" />
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse"></span>
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-3 cursor-pointer bg-gradient-to-r from-purple-600 to-pink-600 px-7 py-4 rounded-2xl font-bold shadow-xl hover:shadow-purple-600/40 transition"
            >
              <FaUpload className="text-lg" />
              Upload APK
            </motion.button>
          </div>
        </motion.div>

        {/* Page Content Outlet */}
        <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-2 mt-10 md:mt-0 md:p-10 shadow-2xl border border-white/10">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

// Reusable Sidebar Content Component
const SidebarContent = ({ menuItems, onClose, onLogout }) => {
  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-white/10">
        <div className="flex items-center justify-between">
          {/* Logo + Title - Centered */}
          <div className="flex md:hidden items-center justify-center gap-4">
            <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center text-3xl font-bold shadow-lg">
              A
            </div>
            <div className="text-center">
              <h1 className="text-2xl font-extrabold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                APK Store
              </h1>
              <p className="text-xs text-gray-400">Developer Dashboard</p>
            </div>
          </div>

          {/* Close Button - Only on Mobile */}
          {onClose && (
            <button
              onClick={onClose}
              className="absolute right-6 text-2xl p-2 rounded-xl hover:bg-white/10 transition md:hidden"
            >
              <FaTimes />
            </button>
          )}
        </div>
      </div>

      {/* Profile Section */}
      <div className="p-6 bg-gradient-to-r from-purple-900/40 to-pink-900/30 backdrop-blur-md border-b border-white/10">
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center text-2xl font-bold ring-4 ring-white/20">
              S
            </div>
            <div className="absolute bottom-0 right-0 w-5 h-5 bg-green-500 rounded-full border-4 border-black"></div>
          </div>
          <div>
            <h3 className="font-bold text-lg">Supper IT</h3>
            <p className="text-sm text-gray-300">support@gmail.com</p>
            <p className="text-xs text-gray-400 mt-1">Joined Dec 2025</p>
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
              `flex items-center gap-4 px-6 py-4 rounded-2xl transition-all duration-300 group relative overflow-hidden
              ${
                isActive
                  ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-2xl shadow-purple-600/40 font-bold"
                  : "text-gray-300 hover:bg-white/10 hover:text-white"
              }`
            }
          >
            <motion.span whileHover={{ scale: 1.15 }} className="text-xl z-10">
              {item.icon}
            </motion.span>
            <span className="font-medium z-10">{item.text}</span>

            {/* Active Indicator Background */}
            {({ isActive }) =>
              isActive && (
                <motion.div
                  layoutId="sidebarActiveBg"
                  className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                />
              )
            }
          </NavLink>
        ))}
      </nav>

      {/* Logout */}
      <div className="p-6 border-t border-white/10">
        <button
          onClick={onLogout}
          className="w-full flex cursor-pointer items-center gap-4 px-6 py-4 rounded-2xl bg-red-500/15 hover:bg-red-500/25 text-red-400 hover:text-red-300 transition-all duration-300 group"
        >
          <motion.span
            whileHover={{ scale: 1.15, rotate: 90 }}
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
