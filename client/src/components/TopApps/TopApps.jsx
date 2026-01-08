import React from "react";
import { Link } from "react-router";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import Skeleton from "react-loading-skeleton";
import "swiper/css";

import Categories from "../Categories/Categories";
import ButtonBanner from "../ButtonBanner/ButtonBanner";

const TopApps = () => {
  // 🔹 React Query + Axios
  const {
    data: apps = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["all-apks"],
    queryFn: async () => {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/all-apks`
      );
      return res.data;
    },
  });

  // 🔹 ONLY ACTIVE APPS
  const activeApps = apps.filter((app) => app.status === "active");

  // 🔹 Chunk apps
  const chunkApps = (arr, size) =>
    arr.reduce(
      (acc, _, i) => (i % size ? acc : [...acc, arr.slice(i, i + size)]),
      []
    );

  const rows = chunkApps(activeApps, 7);

  // 🔹 Skeleton UI
  if (isLoading) {
    return (
      <div className="px-4 py-10">
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-7 gap-4">
          {Array.from({ length: 14 }).map((_, i) => (
            <div
              key={i}
              className="text-center backdrop-blur-xl bg-white/30 p-2 rounded-lg"
            >
              <Skeleton height={120} borderRadius={16} />
              <Skeleton height={14} width="80%" className="mt-2" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center py-10 text-red-500">Failed to load apps</div>
    );
  }

  return (
    <div>
      {/* ⭐ Shine Effect */}
      <style>{`
        .auto-shine {
          position: relative;
          overflow: hidden;
          border-radius: 16px;
        }
        .shine-layer {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            120deg,
            transparent 30%,
            rgba(255,255,255,0.9) 50%,
            transparent 70%
          );
          transform: translateX(-150%);
          pointer-events: none;
        }
        .shine-animate .shine-layer {
          animation: shineSwipe 1.4s ease-out infinite;
        }
        @keyframes shineSwipe {
          0% { transform: translateX(-150%) skewX(-15deg); }
          100% { transform: translateX(150%) skewX(-15deg); }
        }
      `}</style>

      {/* Categories */}
      <Categories />

      {/* Button Banner */}
      <ButtonBanner />

      {/* Apps Grid */}
      <div className="px-2">
        {rows.length === 0 && (
          <div className="text-center py-10 text-gray-500">
            No active apps available
          </div>
        )}

        {rows.map((row, index) => (
          <div
            key={index}
            className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-7 gap-2 mb-6 mt-6"
          >
            {row.map((app) => (
              <div
                key={app._id}
                className="text-center backdrop-blur-xl bg-white/30 p-1 md:p-2 rounded-lg shadow-sm hover:shadow-md transition"
              >
                <Link to={`/app-details/${app._id}`}>
                  <div className="auto-shine shine-animate">
                    <img
                      src={`${import.meta.env.VITE_API_URL}${app.apkLogo}`}
                      alt={app.apkTitle}
                      className="w-24 h-24 md:w-36 md:h-36 mx-auto rounded-xl md:rounded-2xl shadow object-cover"
                    />
                    <div className="shine-layer"></div>
                  </div>
                </Link>

                <Link
                  to={`/app/${app._id}`}
                  className="block mt-2 text-sm font-semibold hover:text-blue-600"
                >
                  {app.apkTitle}
                </Link>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default TopApps;
