import React from "react";
import { Link } from "react-router";

const Footer = () => {
  return (
    <footer className="bg-white text-black mb-10 md:mb-0">
      <div className="max-w-7xl mx-auto px-4 py-4">
        {/* Top Section */}
        <div className="flex items-center justify-between ">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2">
              <img
                src="https://i.ibb.co.com/XrR0LRdp/hd-google-play-playstore-logo-symbol-png-701751694777134cuw3jc7voo-removebg-preview.png"
                alt="logo"
                className="w-10 h-10 rounded-md"
              />
              <h2 className="text-xl font-bold text-black">Oracle Apk Store</h2>
            </div>
            <p className="mt-3 text-sm leading-relaxed">
              Discover amazing apps, games, tools and more. Download safely and
              enjoy the best digital experience.
            </p>
          </div>

          <div className="flex items-center justify-between gap-2 md:gap-8">
            {/* Quick Links */}
            <div>
              <h3 className="text-red-500 underline font-bold mb-3">Quick Links</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link to="/" className="hover:text-black font-bold">
                    Home
                  </Link>
                </li>
                <li>
                  <Link to="/all-apps" className="hover:text-black font-bold">
                    All Apps
                  </Link>
                </li>
                <li>
                  <Link to="/trending" className="hover:text-black font-bold">
                    Trending
                  </Link>
                </li>
                <li>
                  <Link to="/contact" className="hover:text-black font-bold">
                    Contact Us
                  </Link>
                </li>
              </ul>
            </div>

            {/* Categories */}
            <div>
              <h3 className="text-red-500 underline font-bold mb-3">Categories</h3>
              <ul className="space-y-2 text-sm">
                <li className="hover:text-black font-bold">Games</li>
                <li className="hover:text-black font-bold">Tools</li>
                <li className="hover:text-black font-bold">Social Media</li>
                <li className="hover:text-black font-bold">Education</li>
              </ul>
            </div>

            {/* Support */}
            <div>
              <h3 className="text-red-500 font-bold mb-3 underline">Support</h3>
              <ul className="space-y-2 text-sm">
                <li className="hover:text-black font-bold">Privacy</li>
                <li className="hover:text-black font-bold">Terms</li>
                <li className="hover:text-black font-bold">Help</li>
                <li className="hover:text-black font-bold">Refund</li>
              </ul>
            </div>
          </div>
          {/* Social Icons */}
          <div className="flex gap-4 justify-center md:hidden">
            <a href="#" className="hover:text-black">
              <svg width="22" height="22" fill="currentColor">
                <path d="M22 11.1C22 5 17 0 11 0S0 5 0 11.1C0 16.6 4 21.1 9.3 22v-7.7H6.5v-3.2h2.8V8.6c0-2.8 1.6-4.4 4.2-4.4 1.2 0 2.5.2 2.5.2v2.8h-1.4c-1.4 0-1.9.9-1.9 1.8v2.2h3.2l-.5 3.2h-2.7V22C18 21.1 22 16.6 22 11.1z" />
              </svg>
            </a>

            <a href="#" className="hover:text-black">
              <svg width="22" height="22" fill="currentColor">
                <path d="M22 2.2c-.8.4-1.8.7-2.7.8a4.5 4.5 0 0 0 2-2.5 9 9 0 0 1-2.9 1.1A4.6 4.6 0 0 0 15.3 0c-2.6 0-4.6 2-4.6 4.6 0 .4 0 .8.1 1.1A13 13 0 0 1 1.6.9 4.6 4.6 0 0 0 3 6.9a4.6 4.6 0 0 1-2-.6v.1c0 2.3 1.7 4.2 3.9 4.6-.4.1-.9.2-1.3.2-.3 0-.6 0-.9-.1A4.6 4.6 0 0 0 7.6 14a9.2 9.2 0 0 1-6.7 1.9A13 13 0 0 0 7.1 18c8.4 0 13-7 13-13v-.6c1-.7 1.8-1.6 2.4-2.6z" />
              </svg>
            </a>

            <a href="#" className="hover:text-black">
              <svg width="22" height="22" fill="currentColor">
                <path d="M21.8 6.5a8.6 8.6 0 0 0-.6-3A4.8 4.8 0 0 0 18.8.8c-1.4-.6-2.8-.7-4.4-.8H7.6C6 .1 4.6.2 3.2.8A4.8 4.8 0 0 0 .8 3.5a8.6 8.6 0 0 0-.6 3C0 8 .1 9.5.1 11s0 3-.1 4.6c0 1 .2 2 .6 3a4.8 4.8 0 0 0 2.4 2.7c1.4.6 2.8.7 4.4.8h6.8c1.6 0 3-.1 4.4-.8a4.8 4.8 0 0 0 2.4-2.7c.4-1 .6-2 .6-3 0-1.6.1-3.1.1-4.6s0-3-.1-4.5zM8.8 14.3V7.7l6 3.3-6 3.3z" />
              </svg>
            </a>
          </div>
        </div>

        <hr className="border-gray-700 my-6" />

        {/* Bottom */}
        <div className="text-center text-sm">
          © {new Date().getFullYear()} Orale Apk Store — All Rights Reserved
        </div>
      </div>
    </footer>
  );
};

export default Footer;
