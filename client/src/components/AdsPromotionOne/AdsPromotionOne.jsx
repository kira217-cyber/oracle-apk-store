import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";
import { useNavigate } from "react-router";
import axios from "axios";

const AdsPromotionOne = () => {
  const navigate = useNavigate();
  const [adsBanners, setAdsBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAdsBanners = async () => {
      try {
        setLoading(true);

        // 1. Fetch all ads promotions
        const adsRes = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/ads-promotion-one`
        );
        const promotions = adsRes.data;

        // 2. Fetch all public/active APKs
        const apksRes = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/all-apks`
        );
        const allApks = apksRes.data;

        // 3. Match promotions with active apps
        const matchedBanners = promotions
          .map((promo) => {
            const app = allApks.find(
              (apk) => apk.apk_Id === promo.app_id && apk.status === "active"
            );
            if (app) {
              return {
                apk_Id: app.apk_Id,
                title: app.apkTitle,
                image: `${import.meta.env.VITE_API_URL}${promo.image}`, // full URL
              };
            }
            return null;
          })
          .filter(Boolean); // remove null values

        setAdsBanners(matchedBanners);
      } catch (err) {
        console.error("Error fetching ads promotions:", err);
        setError("Failed to load ads promotions");
      } finally {
        setLoading(false);
      }
    };

    fetchAdsBanners();
  }, []);

  if (loading) {
    return (
      <section className="">
        <div className="text-center text-gray-600">
          Loading ads promotions...
        </div>
      </section>
    );
  }

  if (error || adsBanners.length === 0) {
    return null; // or show a message if needed
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
        {adsBanners.map((banner) => (
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
                Ads
              </span>

              {/* Title */}
              <div className="absolute bottom-4 left-4 text-white md:text-lg font-bold shadow-lg">
                {banner.title}
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
};

export default AdsPromotionOne;
