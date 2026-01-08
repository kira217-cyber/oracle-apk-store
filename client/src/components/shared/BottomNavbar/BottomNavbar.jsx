import React from "react";
import { NavLink } from "react-router";
import { FaHome, FaSearch, FaDownload, FaUser } from "react-icons/fa";
import { useAuth } from "../../../hooks/useAuth";

const BottomNavbar = () => {
  const { user } = useAuth();

  const activeClass = "flex flex-col items-center text-[#00D3FF]";
  const normalClass = "flex flex-col items-center text-white";

  // 🔹 Nav items config
  const navItems = [
    {
      id: 1,
      to: "/",
      icon: <FaHome size={22} />,
      private: false,
    },
    {
      id: 2,
      to: "/search",
      icon: <FaSearch size={22} />,
      private: false,
    },
    {
      id: 3,
      to: "/download",
      icon: <FaDownload size={22} />,
      private: true,
      badge: true, // 🔴 red dot
    },
    {
      id: 4,
      to: "/profile",
      icon: <FaUser size={22} />,
      private: true,
    },
  ];
  return (
    <div className="md:hidden">
      <div className="fixed bottom-0 left-0 right-0 bg-gray-600 shadow-2xl py-3 z-50">
        <div className="flex justify-around items-center">
          {navItems.map((item) => {
            // 🔐 Private route check
            if (item.private && !user) return null;

            return (
              <NavLink
                key={item.id}
                to={item.to}
                className={({ isActive }) =>
                  isActive
                    ? `${activeClass} relative`
                    : `${normalClass} relative`
                }
              >
                {item.icon}

                {/* 🔴 Badge */}
                {item.badge && (
                  <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full"></span>
                )}
              </NavLink>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default BottomNavbar;
