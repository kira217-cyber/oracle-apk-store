import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router";

const BadgeApp = () => {
  const navigate = useNavigate();
  const [badgeApps, setBadgeApps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // 1. Get all Badge Apps
        const badgeRes = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/badge-app`
        );
        const badges = badgeRes.data;

        // 2. Get all public/active APKs
        const apkRes = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/all-apks`
        );
        const activeApks = apkRes.data.filter((apk) => apk.status === "active");

        // 3. Match and prepare final data
        const matched = badges
          .map((badge) => {
            const app = activeApks.find((apk) => apk.apk_Id === badge.app_id);
            if (app) {
              return {
                _id: badge._id,
                apk_Id: app.apk_Id,
                title: app.apkTitle,
                author: app.user?.email || "Unknown", // uploader email
                image: `${import.meta.env.VITE_API_URL}${badge.image}`,
                badge: badge.badge_name || null,
              };
            }
            return null;
          })
          .filter(Boolean);

        setBadgeApps(matched);
      } catch (err) {
        console.error("Error loading Badge Apps:", err);
        setError("Failed to load featured apps");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <section className="">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="w-full">
              <div className="h-[220px] rounded-2xl bg-gray-200 animate-pulse" />
              <div className="mt-2 h-10 bg-gray-200 animate-pulse rounded" />
            </div>
          ))}
        </div>
      </section>
    );
  }

  if (error || badgeApps.length === 0) {
    return null; // or <div className="text-center py-10">{error || "No badge apps available"}</div>
  }

  return (
    <section className="">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {badgeApps.map((app) => (
          <div
            key={app._id}
            className="w-full cursor-pointer"
            onClick={() => navigate(`/app-details/${app.apk_Id}`)}
          >
            {/* Card */}
            <div
              className={`relative h-[220px] rounded-2xl shadow-lg flex items-center justify-center text-center p-4 overflow-hidden`}
              style={{
                backgroundImage: `url(${app.image})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            >
              {/* Badge */}
              {app.badge && (
                <span className="absolute top-3 right-3 bg-blue-600 text-white text-xs font-semibold px-3 py-1 rounded-full">
                  {app.badge}
                </span>
              )}

              {/* Content */}
              {/* <h3 className="text-white text-lg font-bold leading-tight drop-shadow-lg">
                {app.title}
              </h3> */}
            </div>

            {/* App Info */}
            <div className="mt-2">
              <h4 className="text-sm font-semibold text-gray-900 truncate">
                {app.title}
              </h4>
              <p className="text-xs text-gray-500">{app.author}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default BadgeApp;
