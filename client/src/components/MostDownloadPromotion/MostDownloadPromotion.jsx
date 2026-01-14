import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { FaStar } from "react-icons/fa";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import axios from "axios";

const MostDownloadPromotion = () => {
  const navigate = useNavigate();
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMostDownloads = async () => {
      try {
        // 1. Get most download promotions
        const promoRes = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/most-download`
        );

        // 2. Get all active APKs
        const apkRes = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/all-apks`
        );

        const activeApks = apkRes.data.filter((apk) => apk.status === "active");

        // 3. Match promotions with active apps
        const matchedApps = promoRes.data
          .map((promo) => {
            const app = activeApks.find((a) => a.apk_Id === promo.app_id);
            if (app) {
              return {
                app_id: app.apk_Id,
                name: app.apkTitle,
                logo: app.apkLogo
                  ? `${import.meta.env.VITE_API_URL}${app.apkLogo}`
                  : null,
                apkFile: app.apkFile
                  ? `${import.meta.env.VITE_API_URL}${app.apkFile}`
                  : null,
                screenshots: app.screenshots || [],
                author: app.user?.email || "Unknown Author",
                rating: 4.5, // can be dynamic later if you add rating field
              };
            }
            return null;
          })
          .filter(Boolean);

        setApps(matchedApps);
      } catch (error) {
        console.error("Error loading most downloaded apps:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMostDownloads();
  }, []);

  const truncateLetters = (text = "", limit = 7) => {
    if (!text) return "";
    return text.length > limit ? text.slice(0, limit) + "..." : text;
  };

  // Handle direct APK download
  const handleInstall = (apkFileUrl, appName) => {
    if (!apkFileUrl) {
      alert("APK file not available");
      return;
    }

    // Create hidden link and trigger download
    const link = document.createElement("a");
    link.href = apkFileUrl;
    link.download = `${appName.replace(/\s+/g, "_")}.apk`; // nice filename
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) {
    return (
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl md:text-2xl font-bold text-gray-900">
            Most Download
          </h2>
        </div>
        <div className="text-center text-gray-600">
          Loading featured apps...
        </div>
      </div>
    );
  }

  if (apps.length === 0) {
    return null; // or show "No featured apps" message
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl md:text-2xl font-bold text-gray-900">
          Most Download
        </h2>
      </div>

      <div className="flex justify-center items-center ">
        <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-6">
          {apps.map((app) => (
            <div
              key={app.app_id}
              className="rounded-2xl bg-[#d4f1f3] p-4 shadow-md cursor-pointer"
              onClick={() => navigate(`/app-details/${app.app_id}`)}
            >
              {/* Top Section */}
              <div className="flex items-center gap-4">
                {app.logo ? (
                  <img
                    src={app.logo}
                    alt={app.name}
                    className="w-18 h-18 rounded-2xl object-cover"
                  />
                ) : (
                  <div className="w-18 h-18 bg-gray-300 rounded-2xl flex items-center justify-center text-xs text-gray-600">
                    No Logo
                  </div>
                )}

                <div className="flex-1">
                  <h1 className="md:hidden text-lg font-semibold">
                    {truncateLetters(app.name, 7)}
                  </h1>
                  <h1 className="hidden md:block text-lg font-semibold">
                    {app.name}
                  </h1>
                  <p className="hidden md:block text-gray-500 text-sm">{app.author}</p>
                  <p className="md:hidden text-gray-500 text-sm">{truncateLetters(app.author, 9)}</p>

                  <div className="flex items-center gap-1 mt-1">
                    <FaStar className="text-yellow-400" />
                    <span className="text-gray-700 font-medium">
                      {app.rating}
                    </span>
                    <span className="text-gray-500 text-sm">(3.7k)</span>
                  </div>
                </div>

                {/* INSTALL Button - triggers direct download */}
                <button
                  onClick={(e) => {
                    e.stopPropagation(); // prevent card navigation
                    handleInstall(app.apkFile, app.name);
                  }}
                  className="px-4 py-1 cursor-pointer bg-blue-600 text-white rounded-full font-semibold hover:bg-blue-700 text-sm transition"
                >
                  INSTALL
                </button>
              </div>

              {/* Swiper Images Slider Section - real screenshots */}
              <div className="mt-5">
                <Swiper spaceBetween={12} slidesPerView={3}>
                  {app.screenshots.slice(0, 6).map((img, index) => (
                    <SwiperSlide key={index}>
                      <img
                        src={`${import.meta.env.VITE_API_URL}${img}`}
                        className="w-full h-40 md:h-80 object-fill rounded-xl"
                        alt={`Screenshot ${index + 1}`}
                        onError={(e) => {
                          e.target.src = "/placeholder-image.jpg"; // fallback
                        }}
                      />
                    </SwiperSlide>
                  ))}
                </Swiper>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MostDownloadPromotion;
