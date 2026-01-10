import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";
import { FaStar } from "react-icons/fa";
import { useNavigate } from "react-router";
import axios from "axios";

const PopularApps = () => {
  const navigate = useNavigate();
  const [popularApps, setPopularApps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPopularApps = async () => {
      try {
        setLoading(true);

        // 1. Fetch all popular promotions
        const popularRes = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/popular`
        );
        const promotions = popularRes.data;

        // 2. Fetch all public/active APKs
        const apksRes = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/all-apks`
        );
        const allApks = apksRes.data;

        // 3. Match promotions with active apps
        const matchedApps = promotions
          .map((promo) => {
            const app = allApks.find(
              (apk) => apk.apk_Id === promo.app_id && apk.status === "active"
            );
            if (app) {
              return {
                apk_Id: app.apk_Id,
                name: app.apkTitle,
                image: `${import.meta.env.VITE_API_URL}${promo.image}`, // full URL
                // You can add real rating later if you have it in DB
                rating: 4.3, // placeholder - can be dynamic later
              };
            }
            return null;
          })
          .filter(Boolean); // remove null values

        setPopularApps(matchedApps);
      } catch (err) {
        console.error("Error fetching popular apps:", err);
        setError("Failed to load popular apps");
      } finally {
        setLoading(false);
      }
    };

    fetchPopularApps();
  }, []);

  if (loading) {
    return (
      <section className="py-6">
        <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-4">
          Popular
        </h2>
        <div className="text-center text-gray-600">Loading popular apps...</div>
      </section>
    );
  }

  if (error || popularApps.length === 0) {
    return (
      <section className="py-6">
        <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-4">
          Popular
        </h2>
        <div className="text-center text-gray-600">
          {error || "No popular apps available at the moment"}
        </div>
      </section>
    );
  }

  return (
    <section className="">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 ">
        <h2 className="text-xl md:text-2xl font-bold text-gray-900">Popular</h2>
      </div>

      {/* Swiper Slider */}
      <Swiper
        modules={[Autoplay]}
        spaceBetween={16}
        slidesPerView={2}
        breakpoints={{
          640: { slidesPerView: 2 },
          768: { slidesPerView: 3 },
          1024: { slidesPerView: 4 },
        }}
        loop={true}
        autoplay={{ delay: 3000, disableOnInteraction: false }}
        className="py-4 "
      >
        {popularApps.map((app) => (
          <SwiperSlide key={app.apk_Id}>
            <div
              onClick={() => navigate(`/app-details/${app.apk_Id}`)}
              className="cursor-pointer rounded-2xl bg-gray-50/50 shadow-md overflow-hidden hover:scale-105 transition-transform duration-300 mb-2"
            >
              {/* Image - using promotion image */}
              <div className="w-full h-[190px] rounded-t-xl overflow-hidden">
                <img
                  src={app.image}
                  alt={app.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.src = "/placeholder-app.jpg"; // fallback image
                  }}
                />
              </div>

              {/* App Info */}
              <div className="mt-3 px-3 pb-3">
                <h3 className="text-sm font-semibold text-gray-900 truncate">
                  {app.name}
                </h3>

                {/* Rating (placeholder - you can make it dynamic later) */}
                <div className="flex items-center gap-1 mt-1">
                  <FaStar className="text-yellow-400 text-xs" />
                  <span className="text-xs text-gray-700">{app.rating}</span>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
};

export default PopularApps;
