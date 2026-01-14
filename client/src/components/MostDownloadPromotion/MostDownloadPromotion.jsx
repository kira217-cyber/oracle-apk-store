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
        const promoRes = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/most-download`
        );

        const apkRes = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/all-apks`
        );

        const activeApks = apkRes.data.filter((apk) => apk.status === "active");

        const matchedApps = promoRes.data
          .map((promo) => {
            const app = activeApks.find((a) => a.apk_Id === promo.app_id);
            if (!app) return null;

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
              rating: 4.5,
            };
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

  const handleInstall = (apkFileUrl, appName) => {
    if (!apkFileUrl) return alert("APK file not available");

    const link = document.createElement("a");
    link.href = apkFileUrl;
    link.download = `${appName.replace(/\s+/g, "_")}.apk`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) {
    return (
      <div className="text-center text-gray-600">Loading featured apps...</div>
    );
  }

  if (!apps.length) return null;

  return (
    <div>
      <div className="mb-4">
        <h2 className="text-xl md:text-2xl font-bold text-gray-900">
          Most Download
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {apps.map((app) => (
          <div
            key={app.app_id}
            onClick={() => navigate(`/app-details/${app.app_id}`)}
            className="rounded-2xl bg-[#d4f1f3] p-4 shadow-md cursor-pointer"
          >
            {/* 🔹 Top Section */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              {/* Logo */}
              {app.logo ? (
                <img
                  src={app.logo}
                  alt={app.name}
                  className="w-16 h-16 rounded-2xl object-cover"
                />
              ) : (
                <div className="w-16 h-16 bg-gray-300 rounded-2xl flex items-center justify-center text-xs">
                  No Logo
                </div>
              )}

              {/* Info */}
              <div className="flex-1">
                <h1 className="text-lg font-semibold">{app.name}</h1>
                <p className="text-gray-500 text-sm truncate">  {truncateLetters(app.author, 7)}</p>

                <div className="flex items-center gap-1 mt-1">
                  <FaStar className="text-yellow-400" />
                  <span className="font-medium">{app.rating}</span>
                  <span className="text-sm text-gray-500">(3.7k)</span>
                </div>
              </div>

              {/* INSTALL Button */}
              <div className="w-full sm:w-auto">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleInstall(app.apkFile, app.name);
                  }}
                  className="w-full cursor-pointer sm:w-auto px-4 py-2 bg-blue-600 text-white rounded-full font-semibold hover:bg-blue-700 text-sm transition"
                >
                  INSTALL
                </button>
              </div>
            </div>

            {/* 🔹 Screenshots */}
            {app.screenshots.length > 0 && (
              <div className="mt-5">
                <Swiper spaceBetween={12} slidesPerView={3}>
                  {app.screenshots.slice(0, 6).map((img, index) => (
                    <SwiperSlide key={index}>
                      <img
                        src={`${import.meta.env.VITE_API_URL}${img}`}
                        className="w-full h-40 md:h-80 object-fill rounded-xl"
                        alt={`Screenshot ${index + 1}`}
                        onError={(e) =>
                          (e.target.src = "/placeholder-image.jpg")
                        }
                      />
                    </SwiperSlide>
                  ))}
                </Swiper>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default MostDownloadPromotion;
