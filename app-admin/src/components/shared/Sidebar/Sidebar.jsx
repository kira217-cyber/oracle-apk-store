import { useState } from "react";
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
} from "react-icons/fa";
import { RxHamburgerMenu } from "react-icons/rx";
import { IoAppsSharp } from "react-icons/io5";

const Sidebar = () => {
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#EAEFFE] flex">
      {/* ========= MOBILE TOP BAR ========= */}
      <div className="md:hidden fixed top-0 left-0 w-full bg-[#7347FF] text-white p-3 flex items-center gap-4 z-40">
        <button onClick={() => setOpen(true)}>
          <RxHamburgerMenu className="text-2xl" />
        </button>
        <p className="font-semibold text-lg">APK ADMIN</p>
      </div>

      {/* ========= OVERLAY ========= */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
        />
      )}

      {/* ========= SIDEBAR ========= */}
      <div
        className={`fixed top-0 left-0 h-screen w-72 bg-white shadow-xl z-50 overflow-y-auto transition-transform duration-300
          ${open ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
        `}
      >
        {/* PROFILE HEADER */}
        <div className="p-5 border-b">
          <div className="bg-[#7347FF] text-white rounded-2xl p-4 flex items-center gap-3">
            <div className="bg-white text-[#7347FF] font-bold w-12 h-12 rounded-xl flex items-center justify-center text-xl">
              AD
            </div>
            <div>
              <h2 className="font-semibold text-sm">APK ADMIN</h2>
              <p className="text-xs text-gray-200">Developer</p>
            </div>
          </div>
        </div>

        {/* SEARCH */}
        <div className="px-4 mt-4">
          <div className="flex items-center bg-gray-100 rounded-lg px-3 py-2">
            <FaSearch className="text-gray-400 mr-2" />
            <input
              type="text"
              placeholder="Search..."
              className="bg-transparent outline-none text-sm w-full"
            />
          </div>
        </div>

        {/* MENU */}
        <div className="mt-4 px-4 space-y-2">
          <MenuLink to="/" icon={<FaHome />} text="Dashboard" />
          <MenuLink to="/revenue" icon={<FaChartLine />} text="Revenue" />
          <MenuLink to="/all-user" icon={<FaUsers />} text="All User" />
          <MenuLink
            to="/notifications"
            icon={<FaBell />}
            text="Notifications"
          />
          <MenuLink to="/all-apk" icon={<IoAppsSharp />} text="All Apk" />
          <MenuLink to="/analytics" icon={<FaChartLine />} text="Analytics" />
          <MenuLink to="/likes" icon={<FaHeart />} text="Likes" />
          <MenuLink to="/wallet" icon={<FaWallet />} text="Wallets" />
        </div>

        {/* BOTTOM SECTION */}
        <div className="mt-32 md:mt-60 px-5 pb-10">
          <div className="mt-4 bg-gray-100 p-3 cursor-pointer hover:text-white hover:bg-[#7347FF] rounded-xl flex items-center justify-between">
            <button className="flex cursor-pointer items-center gap-2 text-sm">
              <FaSignOutAlt /> Logout
            </button>
          </div>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="flex-1 md:ml-72 mt-10 md:mt-0">
        <Outlet />
      </div>
    </div>
  );
};

const MenuLink = ({ to, icon, text }) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      `flex items-center gap-3 px-3 py-3 rounded-lg text-sm transition ${
        isActive ? "bg-[#7347FF] text-white" : "text-gray-700 hover:bg-gray-200"
      }`
    }
  >
    <span className="text-lg">{icon}</span>
    {text}
  </NavLink>
);

export default Sidebar;
