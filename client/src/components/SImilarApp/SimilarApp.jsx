import React from "react";
import { FaChevronRight, FaStar } from "react-icons/fa";
import { Link, useParams } from "react-router"; // ← fixed import (use react-router-dom)
import axios from "axios";
import { useQuery } from "@tanstack/react-query";

// Helper function to normalize tags
const normalizeTag = (tag) =>
  tag
    ?.toString()
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ") // multiple spaces → single
    .replace(/[^a-z0-9\s-]/g, ""); // remove special chars except space & -

const API_BASE = `${import.meta.env.VITE_API_URL}`;

const fetchAllApks = async () => {
  const { data } = await axios.get(`${API_BASE}/api/all-apks`);
  return data;
};

const SimilarApp = () => {
  const { id: currentApkId } = useParams(); // e.g. "gracho-924304"

  const {
    data: allApks = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["allApks"],
    queryFn: fetchAllApks,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  if (isLoading) {
    return <div className="text-sm text-gray-500">Loading similar apps...</div>;
  }

  if (isError || !allApks?.length) {
    return null;
  }

  // Current app
  const currentApp = allApks.find((app) => app.apk_Id === currentApkId);

  if (!currentApp) {
    return null;
  }

  // Normalize current app tags
  const currentTags = (currentApp.tags || [])
    .map(normalizeTag)
    .filter(Boolean); // remove empty after normalize

  // Debug (remove in production)
  // console.log("Current App:", currentApp.apkTitle);
  // console.log("Current Tags (normalized):", currentTags);

  const similarApps = allApks
    .filter((app) => {
      // Skip itself
      if (app.apk_Id === currentApkId) return false;
      // Only active apps
      if (app.status !== "active") return false;

      // Normalize app tags
      const appTags = (app.tags || [])
        .map(normalizeTag)
        .filter(Boolean);

      // At least one tag matches (case-insensitive)
      const hasMatchingTag = currentTags.some((tag) =>
        appTags.includes(tag)
      );

      // Category match OR tag match → more results
      const sameCategory = app.appCategory === currentApp.appCategory;

      // Show app if same category OR has at least one matching tag
      return sameCategory || hasMatchingTag;
    })
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5);

  // Debug - how many found?
  // console.log("Similar apps found:", similarApps.length);

  if (similarApps.length === 0) {
    return null; // or fallback message
    // return <div className="text-sm text-gray-500">No similar apps found yet</div>;
  }

  return (
    <div className="mt-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-800">Similar Apps</h2>
        <FaChevronRight className="text-gray-500" />
      </div>

      <div className="space-y-4">
        {similarApps.map((app) => (
          <Link
            key={app._id}
            to={`/app-details/${app.apk_Id}`}
            className="flex gap-4 items-center hover:bg-gray-50 transition rounded-lg p-3 -mx-3"
          >
            <img
              src={`${API_BASE}${app.apkLogo}`}
              alt={app.apkTitle}
              className="w-16 h-16 rounded-xl object-cover shadow-sm border border-gray-200"
              onError={(e) => {
                e.target.src = "/placeholder-app-icon.png"; // fallback image
              }}
            />
            <div className="flex-1 min-w-0">
              <p className="font-medium text-gray-900 truncate">
                {app.apkTitle}
              </p>
              <p className="text-sm text-gray-600">
                {app.user?.fullName ||
                  app.user?.email?.split("@")[0] ||
                  "Developer"}
              </p>
              <div className="flex items-center gap-1.5 mt-1">
                <span className="text-sm font-medium text-gray-700">4.3</span>
                <FaStar className="text-amber-500 text-sm" />
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default SimilarApp;