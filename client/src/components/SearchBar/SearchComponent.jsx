import React, { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import { FaStar, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import "swiper/css";
import "swiper/css/navigation";
import SearchPromotion from "./SearchPromotion";
import axios from "axios";
const SearchComponent = () => {
  const { apkId } = useParams(); // gets the :apkId from URL → /search-app/abc123

  const [app, setApp] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!apkId) {
      setError("No app ID provided");
      setLoading(false);
      return;
    }

    const fetchApp = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/apk/${apkId}`
        );
        setApp(res.data);
      } catch (err) {
        console.error("Failed to load app:", err);
        setError("Failed to load app details");
      } finally {
        setLoading(false);
      }
    };

    fetchApp();
  }, [apkId]);

  const handleInstall = () => {
    if (!app?.apkFile) {
      alert("Download not available at the moment.");
      return;
    }

    const link = document.createElement("a");
    link.href = app.apkFile; // assuming this is full public URL (http/https)
    link.download = `${app.apkTitle.replace(/[^a-z0-9]/gi, "_")}.apk`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

//   const handleNavigate = (app) => {
//     navigate(`/app-details/${app.apk_Id}`); // ← this is the correct dynamic path
//   };

  if (loading) {
    return (
      <div className="text-center py-20 text-xl font-medium">
        Loading app details...
      </div>
    );
  }

  if (error || !app) {
    return (
      <div className="text-center py-20 text-red-600 text-xl">
        {error || "App not found"}
      </div>
    );
  }

  const hasAdsOrPurchases =
    app.showsAds === "Yes" || app.earningOrAds === "Yes";

  return (
    <>
      <div className="hidden lg:block max-w-7xl mx-auto px-6 py-10">
        <div className="grid grid-cols-2 gap-12 items-center">
          {/* LEFT INFO */}
          <div>
            <div className="flex items-center gap-4">
              <Link to={`/app-details/${app.apk_Id}`} className="shadow-xl cursor-pointer rounded-xl">
                <img
               
                  src={`${import.meta.env.VITE_API_URL}${app.apkLogo}`}
                  alt={app.apkTitle}
                  className="w-22 h-22 rounded-xl object-cover"
                  onError={(e) =>
                    (e.target.src = "https://via.placeholder.com/88?text=Logo")
                  }
                />
              </Link>
              <div>
                <Link
                  to={`/app-details/${app.apk_Id}`}
                  className="text-3xl cursor-pointer font-bold"
                >
                  {app.apkTitle}
                </Link>
                <p className="text-gray-500">
                  {app.user?.email || "Unknown Developer"}
                </p>
                <p className="text-sm text-gray-400">
                  {hasAdsOrPurchases ? "Contains ads" : "No ads"}
                  {hasAdsOrPurchases && app.earningOrAds === "Yes"
                    ? " · In-app purchases"
                    : ""}
                </p>
              </div>
            </div>

            <p className="mt-4 text-gray-700 text-lg">{app.shortDescription}</p>

            {/* Ratings / Stats – using placeholders for now */}
            <div className="flex flex-wrap gap-6 text-black mt-4">
              <div className="text-center">
                <p className="flex items-center gap-1 text-2xl font-semibold justify-center">
                  4.2 <FaStar className="text-yellow-400" />
                </p>
                <p className="text-sm">3.76K reviews</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-semibold flex justify-center">
                  1M+
                </p>
                <p className="text-sm">Downloads</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-semibold flex justify-center">3+</p>
                <p className="text-sm">Rated</p>
              </div>
            </div>

            <button
              onClick={handleInstall}
              className="mt-6 cursor-pointer w-1/2 bg-green-600 text-white px-6 py-3 rounded-2xl font-semibold hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={!app.apkFile}
            >
              Install
            </button>
          </div>

          {/* RIGHT SCREENSHOTS (SWIPER) */}
          <div className="relative">
            <Swiper
              spaceBetween={16}
              slidesPerView={3}
              modules={[Navigation]}
              navigation={{
                prevEl: ".prev-btn",
                nextEl: ".next-btn",
              }}
            >
              {app.screenshots?.length > 0 ? (
                app.screenshots.map((imgSrc, index) => (
                  <SwiperSlide key={index}>
                    <img
                      src={`${import.meta.env.VITE_API_URL}${imgSrc}`}
                      className="w-[250px] h-[350px] object-cover rounded-xl"
                      alt={`Screenshot ${index + 1}`}
                      onError={(e) =>
                        (e.target.src =
                          "https://via.placeholder.com/250x350?text=Screen")
                      }
                    />
                  </SwiperSlide>
                ))
              ) : (
                <SwiperSlide>
                  <div className="w-[250px] h-[350px] bg-gray-200 rounded-xl border flex items-center justify-center text-gray-500">
                    No screenshots available
                  </div>
                </SwiperSlide>
              )}
            </Swiper>

            <button className="prev-btn cursor-pointer absolute top-1/2 -left-5 z-10 -translate-y-1/2 w-10 h-10 flex items-center justify-center bg-white hover:bg-gray-200 rounded-full shadow">
              <FaChevronLeft />
            </button>

            <button className="next-btn cursor-pointer absolute top-1/2 -right-5 z-10 -translate-y-1/2 w-10 h-10 flex items-center justify-center bg-white hover:bg-gray-200 rounded-full shadow">
              <FaChevronRight />
            </button>
          </div>
        </div>
      </div>

      <SearchPromotion />
    </>
  );
};

export default SearchComponent;
