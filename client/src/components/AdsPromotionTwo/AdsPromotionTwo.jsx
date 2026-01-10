import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";
import { useNavigate } from "react-router";
import axios from "axios";

const AdsPromotionTwo = () => {
  const navigate = useNavigate();
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // 1. Get all Ads Promotion Two
        const promoRes = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/ads-promotion-two`
        );

        // 2. Get all active APKs
        const apkRes = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/all-apks`
        );

        const activeApks = apkRes.data.filter((apk) => apk.status === "active");

        // 3. Match promotions with active apps
        const matched = promoRes.data
          .map((promo) => {
            const app = activeApks.find((apk) => apk.apk_Id === promo.app_id);
            if (app) {
              return {
                apk_Id: app.apk_Id,
                title: app.apkTitle,
                image: `${import.meta.env.VITE_API_URL}${promo.image}`,
                // You can make badge dynamic later if needed
                badge: "ads", // or "New", "Trending" etc.
              };
            }
            return null;
          })
          .filter(Boolean);

        setBanners(matched);
      } catch (error) {
        console.error("Error loading Ads Promotion Two:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="h-48 md:h-80 bg-gray-800 animate-pulse rounded-xl" />
    );
  }

  if (banners.length === 0) {
    return null; // or show fallback if you want
  }

  return (
    <section className="">
      <Swiper
        modules={[Autoplay]}
        spaceBetween={16}
        slidesPerView={1}
        loop={true}
        autoplay={{ delay: 3000, disableOnInteraction: false }}
        className="rounded-xl"
      >
        {banners.map((banner) => (
          <SwiperSlide key={banner.apk_Id}>
            <div
              onClick={() => navigate(`/app-details/${banner.apk_Id}`)}
              className="relative cursor-pointer w-full h-48 md:h-80 rounded-xl overflow-hidden shadow-lg"
            >
              {/* Background Image */}
              <img
                src={banner.image}
                alt={banner.title}
                className="w-full h-full object-cover"
              />

              {/* Badge */}
              <span className="bg-white absolute top-0 right-0 px-1 py-[0.5] text-black text-sm">
                {banner.badge || "Ads"}
              </span>

              {/* Title */}
              <div className="absolute bottom-4 left-4 text-white md:text-lg font-bold drop-shadow-lg">
                {banner.title}
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
};

export default AdsPromotionTwo;
