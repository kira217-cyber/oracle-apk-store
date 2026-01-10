import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import { useNavigate } from "react-router";
import { IoMdDownload } from "react-icons/io";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

// Fetch banners from backend
const fetchBanners = async () => {
  const { data } = await axios.get(
    `${import.meta.env.VITE_API_URL}/api/banners`
  );
  return data || [];
};

const Banner = () => {
  const navigate = useNavigate();

  const { data: bannerData = [], isLoading } = useQuery({
    queryKey: ["banners"],
    queryFn: fetchBanners,
  });

  // 🔽 DOWNLOAD HANDLER (NEW)
  const handleDownload = async (apkId) => {
    try {
      const { data } = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/apk/${apkId}`
      );

      if (!data?.apkFile) return;

      const apkUrl = `${import.meta.env.VITE_API_URL}${data.apkFile}`;

      const link = document.createElement("a");
      link.href = apkUrl;
      link.setAttribute("download", "");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("APK download failed:", error);
    }
  };

  if (isLoading || bannerData.length === 0) {
    return (
      <div className="w-full h-[220px] sm:h-[260px] md:h-[340px] lg:h-[400px] overflow-hidden shadow-xl bg-gray-900/50 rounded-2xl flex items-center justify-center">
        <p className="text-gray-500 text-lg">Loading promotions...</p>
      </div>
    );
  }

  return (
    <div className="w-full h-[220px] sm:h-[260px] md:h-[340px] lg:h-[400px] overflow-hidden shadow-xl">
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulse {
          0%, 100% { box-shadow: 0 0 15px rgba(34, 197, 94, 0.5); }
          50% { box-shadow: 0 0 30px rgba(34, 197, 94, 0.8); }
        }
        .animate-fade { animation: fadeIn 0.8s ease-out forwards; }
        .animate-pulse { animation: pulse 2s infinite; }
      `}</style>

      <Swiper
        modules={[Autoplay, Pagination]}
        autoplay={{ delay: 3500, disableOnInteraction: false }}
        pagination={{ clickable: true }}
        loop={bannerData.length > 1}
        speed={800}
        className="h-full"
      >
        {bannerData.map((banner) => (
          <SwiperSlide key={banner._id}>
            <div
              className="h-full bg-cover bg-center relative flex items-center justify-center cursor-pointer"
              style={{
                backgroundImage: `url(${import.meta.env.VITE_API_URL}${
                  banner.bg_image
                })`,
              }}
              onClick={() => navigate(`/app-details/${banner.app_url}`)}
            >
              <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-purple-900/40 to-black/70" />

              <div className="flex items-center gap-4 md:gap-180 relative text-center px-4 sm:px-8 z-10">
                <div className="space-y-2 sm:space-y-3 animate-fade">
                  <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white drop-shadow-lg">
                    {banner.title}
                  </h1>
                  <p className="text-base sm:text-lg md:text-xl text-gray-200">
                    {banner.subtitle}
                  </p>
                </div>

                <div
                  className="mt-4 sm:mt-6 flex flex-col items-center gap-4 animate-fade"
                  style={{ animationDelay: "0.4s" }}
                  onClick={(e) => e.stopPropagation()}
                >
                  <img
                    src={`${import.meta.env.VITE_API_URL}${banner.app_image}`}
                    alt={banner.title}
                    className="w-22 md:w-42 rounded-lg shadow-2xl border-4 border-white/20 cursor-pointer hover:scale-105 transition-transform"
                    onClick={() => navigate(`/app-details/${banner.app_url}`)}
                  />

                  {/* 🔽 DOWNLOAD BUTTON UPDATED */}
                  <button
                    onClick={() => handleDownload(banner.app_url)}
                    className="px-4 py-2 md:px-6 md:py-4 text-sm md:text-lg font-bold text-white bg-gradient-to-r from-green-500 to-emerald-600 rounded-full hover:from-green-600 hover:to-emerald-700 transform hover:scale-105 transition-all animate-pulse flex items-center gap-2 shadow-xl cursor-pointer"
                  >
                    <IoMdDownload />
                    Download
                  </button>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      <style>{`
        .swiper-pagination-bullet {
          background: rgba(255,255,255,0.5);
        }
        .swiper-pagination-bullet-active {
          background: #10b981;
        }
      `}</style>
    </div>
  );
};

export default Banner;