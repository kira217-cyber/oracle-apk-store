import { useState } from "react";
import { Menu, X, Search, Mic } from "lucide-react";
import { Link, NavLink } from "react-router";

const Navbar = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Top Helpline Bar */}
      <div className="w-full bg-green-900 text-white text-sm">
        <div className="max-w-7xl mx-auto px-4 py-2 text-lg">
          Helpline: inquary@oraclestore.org
        </div>
      </div>

      {/* Main Navbar */}
      <nav className="w-full bg-white text-black shadow">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16 gap-4">
            {/* Logo + Title */}
            <Link to="/">
               <div className="flex items-center gap-2 cursor-pointer">
                <img
                  src="https://i.ibb.co.com/XrR0LRdp/hd-google-play-playstore-logo-symbol-png-701751694777134cuw3jc7voo-removebg-preview.png"
                  alt="Oracle Store"
                  className="w-9 h-9"
                />
                <span className="font-bold text-lg">ORACLE STORE</span>
              </div>
            </Link>

            {/* Menu Links Desktop */}
            <ul className="hidden md:flex items-center gap-6 font-semibold">
              <NavLink
                to="/"
                className={({ isActive }) =>
                  `cursor-pointer ${
                    isActive
                      ? "text-green-700 font-bold"
                      : "hover:text-green-700"
                  }`
                }
              >
                HOME
              </NavLink>

              <NavLink
                to="/android"
                className={({ isActive }) =>
                  `cursor-pointer ${
                    isActive
                      ? "text-green-700 font-bold"
                      : "hover:text-green-700"
                  }`
                }
              >
                ANDROID APP
              </NavLink>

              <NavLink
                to="/iso"
                className={({ isActive }) =>
                  `cursor-pointer ${
                    isActive
                      ? "text-green-700 font-bold"
                      : "hover:text-green-700"
                  }`
                }
              >
                ISO APP
              </NavLink>

              <NavLink
                to="/windows"
                className={({ isActive }) =>
                  `cursor-pointer ${
                    isActive
                      ? "text-green-700 font-bold"
                      : "hover:text-green-700"
                  }`
                }
              >
                WINDOWS SOFT
              </NavLink>
            </ul>

            {/* Search Desktop */}
            <div className="hidden md:flex items-center bg-gray-200 rounded-full px-4 py-1 w-80">
              <button className="cursor-pointer">
                <Mic size={18} className="text-gray-600 mr-2" />
              </button>

              <input
                type="text"
                placeholder="Search..."
                className="flex-1 bg-transparent outline-none text-sm"
              />

              <button className="cursor-pointer">
                <Search size={20} className="text-gray-600" />
              </button>
            </div>

            {/* Buttons Desktop */}
            <div className="hidden md:flex items-center gap-3">
              <Link
                to={"/login"}
                className="px-5 py-2 rounded-full border border-green-700 text-green-700 hover:bg-green-700 hover:text-white cursor-pointer transition"
              >
                Login
              </Link>

              <Link
                to={"/register"}
                className="px-5 py-2 rounded-full bg-blue-500 text-white hover:bg-blue-600 cursor-pointer transition"
              >
                Publish APK
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setOpen(!open)}
              className="md:hidden cursor-pointer"
            >
              {open ? <X size={30} /> : <Menu size={30} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {open && (
          <div className="md:hidden bg-green-900 text-white px-4 py-4 space-y-4">
            {/* Search Mobile */}
            <div className="flex items-center bg-white rounded-full px-4 py-2">
              <Mic size={18} className="text-gray-600 mr-2" />
              <input
                type="text"
                placeholder="Search..."
                className="flex-1 outline-none text-black"
              />
              <Search size={20} className="text-gray-700" />
            </div>

            {/* Links */}
            <ul className="space-y-2 font-semibold">
              <NavLink
                to="/"
                className={({ isActive }) =>
                  `block cursor-pointer ${
                    isActive ? "text-green-300 font-bold" : ""
                  }`
                }
              >
                HOME
              </NavLink>

              <NavLink
                to="/android"
                className={({ isActive }) =>
                  `block cursor-pointer ${
                    isActive ? "text-green-300 font-bold" : ""
                  }`
                }
              >
                ANDROID APP
              </NavLink>

              <NavLink
                to="/iso"
                className={({ isActive }) =>
                  `block cursor-pointer ${
                    isActive ? "text-green-300 font-bold" : ""
                  }`
                }
              >
                ISO APP
              </NavLink>

              <NavLink
                to="/windows"
                className={({ isActive }) =>
                  `block cursor-pointer ${
                    isActive ? "text-green-300 font-bold" : ""
                  }`
                }
              >
                WINDOWS SOFT
              </NavLink>
            </ul>

            {/* Buttons */}
            <div className="flex justify-start gap-4 items-center gap-3">
              <Link
                to={"/login"}
                className="px-4 py-2 rounded-full bg-white text-green-800 font-semibold cursor-pointer"
              >
                Login
              </Link>

              <Link
                to={"/register"}
                className="px-4 py-2 rounded-full bg-blue-500 text-white font-semibold cursor-pointer"
              >
                Publish APK
              </Link>
            </div>
          </div>
        )}
      </nav>
    </>
  );
};

export default Navbar;
