import React, { useState } from "react";
import { NavLink, Outlet } from "react-router";
import {
  FaHome,
  FaBell,
  FaHeart,
  FaWallet,
  FaChartLine,
  FaSignOutAlt,
  FaSearch,
  FaUsers,
  FaUserCircle,
  FaUpload,
  FaTimes,
} from "react-icons/fa";
import { RxHamburgerMenu } from "react-icons/rx";
import { IoAppsSharp } from "react-icons/io5";
import { motion } from "framer-motion";
import { useAuth } from "../../../hooks/useAuth";
import { toast } from "react-toastify";

const Sidebar = () => {
  const [open, setOpen] = useState(false);
  const { logout } = useAuth();

  const menuItems = [
    { to: "/", icon: <FaHome />, text: "Dashboard" },
    { to: "/revenue", icon: <FaChartLine />, text: "Revenue" },
    { to: "/all-developer", icon: <FaUsers />, text: "All Developer" },
    { to: "/notifications", icon: <FaBell />, text: "Notifications" },
    { to: "/all-apk", icon: <IoAppsSharp />, text: "All Apps" },
    { to: "/analytics", icon: <FaChartLine />, text: "Analytics" },
    { to: "/likes", icon: <FaHeart />, text: "Likes" },
    { to: "/wallets", icon: <FaWallet />, text: "Wallets" },
  ];

  const handleLogout = () => {
   logout()
   toast.success("Logout successfully!");
  };

  return (
    <div className="min-h-screen bg-black flex text-gray-100">
      {/* ========= MOBILE TOP BAR ========= */}
      <div className="md:hidden fixed top-0 left-0 w-full bg-gradient-to-r from-[#0f172a] to-[#1e293b] text-white p-4 flex items-center justify-between z-40 shadow-2xl border-b border-blue-900/50">
        <button onClick={() => setOpen(true)} className="cursor-pointer">
          <RxHamburgerMenu className="text-2xl" />
        </button>
        {/* <p className="font-bold text-lg tracking-wide">ADMIN</p> */}
        <div className="flex items-center gap-4">
          <FaBell className="text-xl cursor-pointer hover:text-blue-400 transition" />
          <FaUserCircle className="text-2xl cursor-pointer hover:text-blue-400 transition" />
        </div>
      </div>

      {/* ========= OVERLAY ========= */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          className="fixed inset-0 bg-black/80 z-40 md:hidden"
        />
      )}

      {/* ========= SIDEBAR ========= */}
      <div
        className={`fixed top-0 left-0 h-screen w-72 bg-black/95 backdrop-blur-2xl shadow-2xl z-50 overflow-y-auto transition-transform duration-300 border-r border-blue-950/50
          ${open ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
        `}
      >
        <SidebarContent
          menuItems={menuItems}
          onClose={() => setOpen(false)}
          onLogout={handleLogout}
        />
      </div>

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 md:ml-72 mt-16 md:mt-0 p-2 md:p-10">
        {/* Desktop Top Bar - Search + Icons + Upload Button */}
        <div className="hidden md:flex items-center justify-between mb-8">
          <div className="flex-1 max-w-3xl">
            <div className="relative">
              <FaSearch className="absolute left-5 top-1/2 -translate-y-1/2 text-blue-400 text-lg z-10" />
              <input
                type="text"
                placeholder="Search users, apps, analytics..."
                className="w-full pl-14 pr-6 py-4 bg-white/5 backdrop-blur-md border border-blue-800/40 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition-all placeholder-blue-500/70 cursor-text"
              />
            </div>
          </div>

          <div className="flex items-center gap-6 ml-8">
            <div className="relative cursor-pointer">
              <FaBell className="text-2xl hover:text-blue-400 transition" />
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse"></span>
            </div>

            <FaUserCircle className="text-3xl cursor-pointer hover:text-blue-400 transition" />

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-3 bg-gradient-to-r from-[#1d4ed8] to-[#3b82f6] px-7 py-4 rounded-xl font-bold shadow-xl hover:shadow-blue-600/50 transition cursor-pointer"
            >
              <FaUpload className="text-lg" />
              Upload APK
            </motion.button>
          </div>
        </div>

        {/* Page Content */}
        <div className="min-h-[90vh] bg-gradient-to-br from-[#0a0e1a]/95 via-[#0f172a]/98 to-[#111827]/95 rounded-3xl shadow-2xl border border-blue-900/40 backdrop-blur-xl overflow-hidden">
          <div className="p-2 md:p-12">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
};

// Reusable Sidebar Content Component
const SidebarContent = ({ menuItems, onClose, onLogout }) => {
  return (
    <div className="h-full flex flex-col">
      {/* Profile Header */}
      <div className="p-6 border-b border-blue-900/30 text-center">
        <div className="bg-gradient-to-br from-[#1e3a8a] via-[#1e40af] to-[#1d4ed8] rounded-2xl px-6 py-2 shadow-2xl shadow-blue-900/60">
          <div className="flex flex-col items-center gap-2 ">
            <div className="bg-white/20 backdrop-blur-md font-extrabold tracking-widest text-4xl px-6 py-3 rounded-2xl border-2 border-white/30 shadow-xl">
              ADMIN
            </div>
            <div className="text-center">
              <p className="text-blue-200 text-lg">Dashboard</p>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Close Button */}
      {onClose && (
        <button
          onClick={onClose}
          className="absolute top-0 right-0 text-2xl p-2 rounded-xl hover:bg-white/10 transition cursor-pointer md:hidden"
        >
          <FaTimes />
        </button>
      )}

      {/* Navigation Links */}
      <nav className="flex-1 px-6 py-8 space-y-3 overflow-y-auto">
        {menuItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end
            onClick={onClose}
            className={({ isActive }) =>
              `flex items-center gap-5 px-6 py-4 rounded-2xl text-base font-medium transition-all duration-300 group cursor-pointer
              ${
                isActive
                  ? "bg-gradient-to-r from-[#1d4ed8] to-[#3b82f6] text-white shadow-xl shadow-blue-800/50 scale-105"
                  : "text-gray-400 hover:bg-white/5 hover:text-white hover:shadow-lg backdrop-blur-sm"
              }`
            }
          >
            <span className="text-xl group-hover:scale-110 transition-transform">
              {item.icon}
            </span>
            <span>{item.text}</span>
          </NavLink>
        ))}
      </nav>

      {/* Logout - Bottom */}
      <div className="p-6 border-t border-blue-900/30">
        <button
          onClick={onLogout}
          className="w-full flex items-center justify-center gap-4 px-6 py-4 bg-gradient-to-r from-red-800/80 to-pink-800/80 hover:from-red-700 hover:to-pink-700 rounded-xl text-white font-semibold transition-all duration-300 shadow-lg hover:shadow-red-900/50 backdrop-blur-sm border border-red-900/30 cursor-pointer"
        >
          <FaSignOutAlt className="text-xl" />
          Logout
        </button>
      </div>
    </div>
  );
};

const MenuLink = ({ to, icon, text }) => (
  <NavLink
    to={to}
    end
    className={({ isActive }) =>
      `flex items-center gap-5 px-6 py-4 rounded-2xl text-base font-medium transition-all duration-300 group cursor-pointer
      ${
        isActive
          ? "bg-gradient-to-r from-[#1d4ed8] to-[#3b82f6] text-white shadow-xl shadow-blue-800/50 scale-105"
          : "text-gray-400 hover:bg-white/5 hover:text-white hover:shadow-lg backdrop-blur-sm"
      }`
    }
  >
    <span className="text-xl group-hover:scale-110 transition-transform">
      {icon}
    </span>
    <span>{text}</span>
  </NavLink>
);

export default Sidebar;
