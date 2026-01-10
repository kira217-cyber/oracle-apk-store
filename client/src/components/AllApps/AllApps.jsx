import React from "react";
import { Link } from "react-router";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import Skeleton from "react-loading-skeleton";
import ButtonBanner from "../ButtonBanner/ButtonBanner";

const AllApps = () => {
  // 🔹 Fetch all APKs
  const {
    data: apps = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["all-apks"],
    queryFn: async () => {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/all-apks`);
      return res.data;
    },
  });

  // 🔹 ONLY ACTIVE APPS
  const activeApps = apps.filter((app) => app.status === "active");

  // 🔹 Oldest first
  const orderedApps = [...activeApps].reverse();

  // 🔹 Chunk logic
  const chunkApps = (arr, size) =>
    arr.reduce(
      (acc, _, i) => (i % size ? acc : [...acc, arr.slice(i, i + size)]),
      []
    );

  const rows = chunkApps(orderedApps, 7);

  // 🔹 Skeleton Loading UI
  if (isLoading) {
    return (
      <div className="mt-10 px-4">
        <ButtonBanner />

        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-7 gap-4 mt-8">
          {Array.from({ length: 21 }).map((_, i) => (
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
    <div className="mt-10">
      <ButtonBanner />

      <div className="rounded-b-md py-5">
        {/* No Active Apps */}
        {rows.length === 0 && (
          <div className="text-center py-10 text-gray-500">
            No active apps available
          </div>
        )}

        {/* Apps */}
        {rows.map((row, idx) => (
          <div
            key={idx}
            className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-7 gap-2 mb-6 mt-6"
          >
            {row.map((app) => (
              <div
                key={app._id}
                className="text-center backdrop-blur-xl bg-white/30 p-1 md:p-2 rounded-lg shadow-md hover:shadow-lg transition"
              >
                <Link
                  to={`/app-details/${app.apk_Id}`}
                  className="cursor-pointer"
                >
                  <div className="auto-shine shine-animate rounded-2xl">
                    <img
                      src={`${import.meta.env.VITE_API_URL}${app.apkLogo}`}
                      alt={app.apkTitle}
                      className="w-24 h-24 md:w-36 md:h-36 mx-auto rounded-xl md:rounded-2xl shadow hover:scale-105 transition object-cover"
                    />
                    <span className="shine-layer"></span>
                  </div>
                </Link>

                <Link
                  to={`/app-details/${app.apk_Id}`}
                  className="block mt-2 text-sm font-semibold hover:text-blue-600 cursor-pointer"
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

export default AllApps;
