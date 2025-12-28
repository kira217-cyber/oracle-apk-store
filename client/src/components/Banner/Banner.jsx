import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import { useNavigate } from "react-router";
import { IoMdDownload } from "react-icons/io";

const bannerData = [
  {
    id: 1,
    title: "Oracle Store",
    subtitle: "Premium Apps & Games",
    bgUrl:
      "https://img.freepik.com/free-vector/gradient-black-technology-background_23-2149209060.jpg",
  },
  {
    id: 2,
    title: "Safe & Fast",
    subtitle: "Latest APK Downloads",
    bgUrl:
      "https://img.freepik.com/free-vector/gradient-hexagonal-background_23-2148954968.jpg",
  },
  {
    id: 3,
    title: "Download Now",
    subtitle: "100% Trusted Apps",
    bgUrl:
      "https://img.freepik.com/free-vector/3d-style-black-background-with-paper-layer_206725-669.jpg",
  },
];

const Banner = () => {
  const navigate = useNavigate();

  return (
    <div className="w-full h-[220px] sm:h-[260px] md:h-[340px] lg:h-[400px]  overflow-hidden shadow-xl">
      {/* Light Animations */}
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
        loop
        speed={800}
        className="h-full"
      >
        {bannerData.map((banner) => (
          <SwiperSlide key={banner.id}>
            <div
              className="h-full bg-cover bg-center relative flex items-center justify-center"
              style={{ backgroundImage: `url(${banner.bgUrl})` }}
            >
              {/* Dark Overlay */}
              <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-purple-900/40 to-black/70" />

              <div className="flex items-center gap-4 md:gap-200 relative text-center px-4 sm:px-8">
                {/* Text Content */}
                <div className="space-y-2 sm:space-y-3 animate-fade">
                  <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white drop-shadow-lg">
                    {banner.title}
                  </h1>
                  <p className="text-base sm:text-lg md:text-xl text-gray-200">
                    {banner.subtitle}
                  </p>
                </div>

                {/* Button + Logo Stack (Mobile Friendly) */}
                <div
                  className="mt-4 sm:mt-6 flex flex-col items-center gap-4 animate-fade"
                  style={{ animationDelay: "0.4s" }}
                >
                  <img
                    src="https://i.ibb.co/DDn0L7tp/logo-design-technology-company-vector-illustration-1253202-4950-ezgif-com-avif-to-jpg-converter.jpg"
                    alt="Oracle Store"
                    className="w-22 md:w-42 rounded-lg shadow-2xl border-4 border-white/20"
                  />{" "}
                  <button
                    onClick={() => navigate(`/app/${banner.id}`)}
                    className="px-4 py-2 md:px-6 md:py-4 text-sm cursor-pointer md:text-lg font-bold text-white bg-gradient-to-r from-green-500 to-emerald-600 rounded-full hover:from-green-600 hover:to-emerald-700 transform hover:scale-105 transition-all animate-pulse flex items-center gap-2 shadow-xl"
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

      {/* Pagination Style */}
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
