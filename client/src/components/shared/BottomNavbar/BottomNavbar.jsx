import React from "react";
import { NavLink } from "react-router";
import { FaHome, FaSearch, FaDownload, FaUser } from "react-icons/fa";
import { IoAppsSharp } from "react-icons/io5";

const BottomNavbar = () => {
  const activeClass = "flex flex-col items-center text-[#00D3FF]";
  const normalClass = "flex flex-col items-center text-white";

  return (
    <div className="md:hidden">
      <div className="fixed bottom-0 left-0 right-0 bg-gray-600 shadow-2xl py-3 z-50">
        <div className="flex justify-around items-center">
          {/* Home */}
          <NavLink
            to="/"
            className={({ isActive }) => (isActive ? activeClass : normalClass)}
          >
            <FaHome  size={22} />
          </NavLink>

          {/* Search */}
          <NavLink
            to="/search"
            className={({ isActive }) => (isActive ? activeClass : normalClass)}
          >
            <FaSearch   size={22} />
          </NavLink>

          {/* Download + Red Dot */}
          <NavLink
            to="/download"
            className={({ isActive }) =>
              isActive ? `${activeClass} relative` : `${normalClass} relative`
            }
          >
            <FaDownload  size={22} />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full"></span>
          </NavLink>

          {/* Download + Red Dot */}
          <NavLink
            to="/my-apps"
            className={({ isActive }) =>
              isActive ? `${activeClass} relative` : `${normalClass} relative`
            }
          >
            <IoAppsSharp   size={22} />
         
          </NavLink>

          {/* Profile */}
          <NavLink
            to="/app-details"
            className={({ isActive }) => (isActive ? activeClass : normalClass)}
          >
            <FaUser color="white" size={22} />
          </NavLink>
        </div>
      </div>
    </div>
  );
};

export default BottomNavbar;
