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
  const { id: currentApkId } = useParams(); // যেমন: "gracho-924304"

  const {
    data: allApks = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["allApks"],
    queryFn: fetchAllApks,
    staleTime: 1000 * 60 * 5, // 5 মিনিট ক্যাশ
  });

  // বর্তমান অ্যাপ খুঁজে বের করা
  const currentApp = allApks.find((app) => app.apk_Id === currentApkId);

  if (isLoading) {
    return <div className="text-sm text-gray-500">Loading similar apps...</div>;
  }

  if (isError || !currentApp) {
    return null;
  }

  // বর্তমান অ্যাপের ট্যাগগুলো
  const currentTags = currentApp.tags || [];

  // ফিল্টারিং লজিক:
  // 1. নিজের অ্যাপ না হওয়া
  // 2. একই ক্যাটাগরি
  // 3. অন্তত একটা ট্যাগ মিলে যাওয়া
  // 4. active স্ট্যাটাস
  // তারপর সবচেয়ে নতুন ৫টা নেওয়া
  const similarApps = allApks
    .filter((app) => {
      if (app.apk_Id === currentApkId) return false;
      if (app.status !== "active") return false;
      if (app.appCategory !== currentApp.appCategory) return false;

      // ট্যাগ মিলছে কিনা চেক
      const appTags = app.tags || [];
      return currentTags.some((tag) => appTags.includes(tag));
    })
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)) // newest first
    .slice(0, 5); // সর্বোচ্চ ৫টা

  if (similarApps.length === 0) {
    return null;
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
            to={`/app-details/${app.apk_Id}`}
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
                <span>4.3</span>
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
