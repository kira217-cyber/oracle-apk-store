import React from "react";
import { FaChevronRight, FaStar } from "react-icons/fa";
import { Link, useParams } from "react-router";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";

const API_BASE = `${import.meta.env.VITE_API_URL}`;

const fetchAllApks = async () => {
  const { data } = await axios.get(`${API_BASE}/api/all-apks`);
  return data;
};

const SimilarApp = () => {
  const { id: currentAppId } = useParams(); // Current app ID

  const {
    data: allApks = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["allApks"],
    queryFn: fetchAllApks,
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
  });

  // Get current app to know its category
  const currentApp = allApks.find((app) => app._id === currentAppId);

  if (isLoading) {
    return <div className="text-sm text-gray-500">Loading similar apps...</div>;
  }

  if (isError || !currentApp) {
    return null; // Hide section if error or no current app
  }

  // Filter similar apps: same category, exclude current app, limit to 3
  const similarApps = allApks
    .filter(
      (app) =>
        app._id !== currentAppId &&
        app.appCategory === currentApp.appCategory &&
        app.status === "active" // Optional: only show active/published apps
    )
    .slice(0, 3);

  if (similarApps.length === 0) {
    return null; // Hide if no similar apps
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-800">Similar apps</h2>
        <FaChevronRight className="text-gray-500" />
      </div>

      <div className="space-y-5">
        {similarApps.map((app) => (
          <Link
            key={app._id}
            to={`/app-details/${app._id}`}
            className="flex gap-4 items-center hover:bg-gray-50/50 -mx-4 px-4 py-2 rounded-lg transition"
          >
            <img
              src={`${API_BASE}${app.apkLogo}`}
              alt={app.apkTitle}
              className="w-16 h-16 rounded-xl object-cover shadow-md"
            />
            <div className="flex-1">
              <p className="text-lg font-medium text-gray-800 line-clamp-1">
                {app.apkTitle}
              </p>
              <p className="text-sm text-gray-500">
                {app.user?.email?.split("@")[0] || "Developer"}
              </p>
              <div className="flex items-center gap-1 text-sm text-gray-600 mt-1">
                <span>4.3</span>{" "}
                {/* You can make this dynamic later if you have ratings */}
                <FaStar className="text-green-600" />
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default SimilarApp;
