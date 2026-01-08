import React from "react";
import { Link } from "react-router";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
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

  // 🔹 Oldest first (IMPORTANT)
  const orderedApps = [...apps].reverse();

  // 🔹 Chunk logic (UNCHANGED)
  const chunkApps = (arr, size) =>
    arr.reduce(
      (acc, _, i) => (i % size ? acc : [...acc, arr.slice(i, i + size)]),
      []
    );

  const rows = chunkApps(orderedApps, 7);

  if (isLoading) {
    return (
      <div className="text-center py-10 text-gray-500">Loading apps...</div>
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
        {/* Apps */}
        {rows.map((row, idx) => (
          <div
            key={idx}
            className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-7 gap-2 md:gap-2 mb-6 mt-6"
          >
            {row.map((app) => (
              <div
                key={app._id}
                className="text-center backdrop-blur-xl bg-white/30 p-1 md:p-2 rounded-lg shadow-md hover:shadow-md transition"
              >
                <Link to={`/app/${app._id}`} className="cursor-pointer">
                  <div className="auto-shine shine-animate rounded-2xl">
                    <img
                      src={`${import.meta.env.VITE_API_URL}${app.apkLogo}`}
                      alt={app.apkTitle}
                      className="w-24 h-22 md:w-36 md:h-36 mx-auto rounded-md md:rounded-2xl shadow hover:scale-105 transition object-cover"
                    />
                    <span className="shine-layer"></span>
                  </div>
                </Link>

                <Link
                  to={`/app/${app._id}`}
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
