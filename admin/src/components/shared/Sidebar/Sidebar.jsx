import { useState } from "react";
import { NavLink, Outlet } from "react-router";
import {
  FaHome,
  FaUser,
  FaMapMarkerAlt,
  FaLink,
  FaLock,
  FaSearch,
  FaBell,
  FaUserCircle,
  FaUpload,
} from "react-icons/fa";
import { MdPayment } from "react-icons/md";
import { IoSettingsSharp } from "react-icons/io5";
import { FiLogOut } from "react-icons/fi";
import { RxHamburgerMenu } from "react-icons/rx";
import { motion } from "framer-motion";

const Sidebar = () => {
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-100">
      {/* ================= MOBILE TOP BAR ================= */}
      <div className="fixed top-0 left-0 right-0 z-40 bg-gradient-to-r from-indigo-600 to-blue-500 p-3 md:hidden">
        <div className="flex items-center gap-3">
          {/* HAMBURGER */}
          <button onClick={() => setOpen(true)}>
            <RxHamburgerMenu className="text-3xl text-white" />
          </button>

          {/* SEARCH */}
          <div className="flex items-center bg-white rounded-full px-3 py-2 flex-1">
            <FaSearch className="text-gray-400 mr-2 text-sm" />
            <input
              type="text"
              placeholder="Search"
              className="w-full outline-none text-sm text-gray-600"
            />
          </div>

          {/* UPLOAD */}
          <motion.button
            whileTap={{ scale: 0.9 }}
            className="bg-indigo-600 text-white p-2 rounded-full"
          >
            <FaUpload />
          </motion.button>

          {/* PROFILE */}
          <FaUserCircle className="text-white text-2xl cursor-pointer" />
        </div>
      </div>

      {/* ================= OVERLAY (Mobile) ================= */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
        />
      )}

      {/* ================= SIDEBAR ================= */}
      <div
        className={`
          fixed top-0 left-0 h-screen w-72 bg-[#0F1015] text-white shadow-xl z-50
          transform transition-transform duration-300
          ${open ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
        `}
      >
        {/* PROFILE */}
        <div className="bg-purple-700 rounded-b-3xl pt-6 pb-10 flex flex-col items-center">
          <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center text-purple-700 text-4xl">
            <FaUser />
          </div>

          <div className="mt-4 text-center text-sm">
            <h2 className="text-lg font-semibold">Supper IT</h2>
            <p className="text-gray-200 mt-1">
              support@gmail.com <br />
              <span className="text-gray-300">Join Date : 25/12/2025</span>
            </p>
          </div>
        </div>

        {/* MENU */}
        <div className="mt-4 px-4 space-y-3">
          <SidebarLink to="/" icon={<FaHome />} text="Dashboard" />
          <SidebarLink to="/profile" icon={<FaUser />} text="Profile" />
          <SidebarLink to="/all-apk" icon={<FaMapMarkerAlt />} text="All App" />
          <SidebarLink to="/refer-link" icon={<FaLink />} text="Refer Link" />
          <SidebarLink to="/withdraw" icon={<MdPayment />} text="Withdraw" />
          <SidebarLink to="/top-up" icon={<IoSettingsSharp />} text="Top up" />
          <SidebarLink to="/boost-app" icon={<FaLock />} text="Boost app" />
        </div>

        {/* LOGOUT */}
        <div className="mt-6 px-4 pb-6">
          <button className="flex cursor-pointer items-center gap-3 text-red-400 hover:text-red-500 transition">
            <FiLogOut /> Sign out
          </button>
        </div>
      </div>

      {/* ================= MAIN CONTENT ================= */}
      <div className="md:ml-72 pt-20 md:pt-4 p-3">
        {/* ====== DESKTOP / TABLET TOP BAR ====== */}
        <motion.div
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="hidden md:flex w-full rounded-xl bg-gradient-to-r from-indigo-600 to-blue-500 p-4 items-center justify-between gap-3"
        >
          {/* SEARCH */}
          <div className="flex items-center bg-white rounded-full px-4 py-2 w-full max-w-md">
            <FaSearch className="text-gray-400 mr-2" />
            <input
              type="text"
              placeholder="Search"
              className="w-full outline-none text-sm text-gray-600"
            />
          </div>

          {/* ACTIONS */}
          <div className="flex items-center gap-4">
            <FaBell className="text-white text-xl cursor-pointer" />
            <FaUserCircle className="text-white text-2xl cursor-pointer" />

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex cursor-pointer items-center gap-2 bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-full text-sm font-medium"
            >
              <FaUpload />
              Upload Apk
            </motion.button>
          </div>
        </motion.div>

        {/* OUTLET */}
        <div className="mt-4">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

const SidebarLink = ({ to, icon, text }) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      `flex items-center gap-3 rounded-lg py-3 px-3 transition
      ${
        isActive
          ? "bg-purple-600 text-white"
          : "bg-[#1A1C24] hover:bg-[#242633] text-gray-300"
      }`
    }
  >
    <span className="text-lg">{icon}</span>
    <p className="text-sm">{text}</p>
  </NavLink>
);

export default Sidebar;
