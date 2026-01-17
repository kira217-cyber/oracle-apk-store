import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router"; // ← added for navigation
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import { FaChevronLeft, FaChevronRight, FaStar } from "react-icons/fa";

import "swiper/css";
import "swiper/css/navigation";

const SearchPromotion = () => {
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate(); // ← hook for navigation

  useEffect(() => {
    const fetchApks = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/all-apks`,
        );

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();

        // Show most recent 10 apps (you can change to 8, 12, etc.)
        const recentApps = data.slice(0, 10);

        setApps(recentApps);
      } catch (err) {
        console.error("Failed to load promoted apps:", err);
        setError("Could not load apps");
      } finally {
        setLoading(false);
      }
    };

    fetchApks();
  }, []);

  // Navigate to app details when clicking a card
  const handleAppClick = (apkId) => {
    if (apkId) {
      navigate(`/app-details/${apkId}`);
    }
  };

  if (loading) {
    return (
      <div className="hidden lg:block max-w-7xl mx-auto px-6 py-12 relative">
        <div className="text-center py-10 text-gray-500">
          Loading featured apps...
        </div>
      </div>
    );
  }

  if (error || apps.length === 0) {
    return (
      <div className="hidden lg:block max-w-7xl mx-auto px-6 py-12 relative">
        <div className="text-center py-10 text-gray-600">
          {error || "No apps available at the moment"}
        </div>
      </div>
    );
  }

  return (
    <div className="hidden lg:block max-w-7xl mx-auto px-6 py-12 relative">
      {/* NAV BUTTONS – added cursor-pointer */}
      <button className="promo-prev cursor-pointer absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white w-10 h-10 flex items-center justify-center rounded-full shadow hover:bg-gray-100">
        <FaChevronLeft />
      </button>
      <button className="promo-next cursor-pointer absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white w-10 h-10 flex items-center justify-center rounded-full shadow hover:bg-gray-100">
        <FaChevronRight />
      </button>

      {/* SWIPER */}
      <Swiper
        spaceBetween={24}
        slidesPerView={3}
        modules={[Navigation]}
        navigation={{
          prevEl: ".promo-prev",
          nextEl: ".promo-next",
        }}
      >
        {apps.map((app) => (
          <SwiperSlide key={app._id || app.apk_Id}>
            <div
              className="bg-gray-50/50 cursor-pointer rounded-xl p-4 shadow-sm hover:shadow-md transition h-full"
              onClick={() => handleAppClick(app.apk_Id)}
            >
              {/* BANNER / Cover image */}
              <div className="h-50 bg-white rounded-lg flex items-center justify-center overflow-hidden cursor-pointer">
                <img
                  src={`${import.meta.env.VITE_API_URL}${app.apkLogo}`}
                  alt={app.apkTitle}
                  className="max-h-24 object-contain"
                  onError={(e) => {
                    e.target.src =
                      "https://via.placeholder.com/300x120?text=App+Cover";
                  }}
                />
              </div>

              {/* INFO */}
              <div className="flex items-start gap-3 mt-4 cursor-pointer">
                <img
                  src={`${import.meta.env.VITE_API_URL}${app.apkLogo}`}
                  alt={app.apkTitle}
                  className="w-14 h-14 rounded-sm object-cover"
                  onError={(e) => {
                    e.target.src = "https://via.placeholder.com/56?text=App";
                  }}
                />
                <div>
                  <h3 className="font-semibold text-sm">{app.apkTitle}</h3>
                  <p className="text-xs text-gray-500">
                    {app.user?.name ||
                      app.user?.firstName ||
                      app.user?.email ||
                      "Developer"}
                  </p>
                  <div className="flex items-center gap-1 text-xs text-gray-600 mt-1">
                    {/* Placeholder rating – change to real value when you add it */}
                    <span>4.3</span>
                    <FaStar className="text-yellow-400" />
                  </div>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default SearchPromotion;
