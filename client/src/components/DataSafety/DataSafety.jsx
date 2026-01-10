import React, { useState } from "react";
import {
  FaArrowRight,
  FaCloud,
  FaShareAlt,
  FaShieldAlt,
  FaLock,
  FaCog,
  FaExclamationTriangle,
  FaDatabase,
} from "react-icons/fa";

const DataSafety = ({ apk }) => {
  const [visibleCount, setVisibleCount] = useState(2);

  if (!apk) return null;

  const {
    collectsUserData,
    sharesDataWithThirdParties,
    childDataTypes = [],
    purposeOfDataCollection = [],
    dataSharedWith = [],
    dataProtection = [],
    dataRetention = [],
    userControls = [],
    childCompliance = [],
    sensitivePermissions = [],
    showsAds = "No",
  } = apk;

  // Different icons for each section
  const safetyItems = [
    {
      icon: <FaShareAlt className="text-gray-600" />,
      title:
        sharesDataWithThirdParties === "Yes"
          ? "Data is shared with third parties"
          : "No data shared with third parties",
      description:
        sharesDataWithThirdParties === "Yes"
          ? `Shared with: ${
              dataSharedWith.slice(0, 3).join(", ") || "various partners"
            }`
          : "The developer says this app doesn't share your data with other companies or organizations.",
    },
    {
      icon: <FaDatabase className="text-gray-600" />,
      title:
        collectsUserData === "Yes" ? "Data is collected" : "No data collected",
      description:
        collectsUserData === "Yes"
          ? `Types include: ${
              childDataTypes.slice(0, 2).join(", ") || "various data"
            }`
          : "The developer says this app doesn't collect any user data.",
    },
    {
      icon: <FaCog className="text-gray-600" />,
      title: "Purpose of data collection",
      description:
        purposeOfDataCollection.length > 0
          ? purposeOfDataCollection.join(", ")
          : "Not specified",
    },
    {
      icon: <FaShieldAlt className="text-gray-600" />,
      title: "Data protection measures",
      description:
        dataProtection.length > 0 ? dataProtection.join(", ") : "Not specified",
    },
    {
      icon: <FaLock className="text-gray-600" />,
      title: "Sensitive permissions used",
      description:
        sensitivePermissions.length > 0
          ? sensitivePermissions.join(", ")
          : "None declared",
    },
    {
      icon: <FaExclamationTriangle className="text-gray-600" />,
      title:
        showsAds === "Yes" ? "Contains advertisements" : "No advertisements",
      description:
        showsAds === "Yes"
          ? "This app shows ads"
          : "This app does not show ads",
    },
  ];

  const hasMore = visibleCount < safetyItems.length;

  const handleSeeMore = () => {
    setVisibleCount((prev) => Math.min(prev + 2, safetyItems.length));
  };

  return (
    <div>
      {/* ================= Data Safety ================= */}
      <div className="rounded-lg mt-8">
        <div className="flex gap-4 sm:gap-6 items-center mb-4">
          <h2 className="text-xl sm:text-2xl font-semibold text-gray-800">
            Data safety
          </h2>
          <span className="text-lg sm:text-xl text-gray-400 p-2 cursor-pointer hover:bg-gray-200 hover:rounded-full transition-colors">
            <FaArrowRight />
          </span>
        </div>

        <p className="text-sm text-gray-500 mb-5 leading-relaxed">
          Safety starts with understanding how developers collect and share your
          data. Data privacy and security practices may vary based on your use,
          region, and age. The developer provided this information and may
          update it over time.
        </p>

        <div className="border border-gray-400 rounded-xl overflow-hidden">
          {safetyItems.slice(0, visibleCount).map((item, index) => (
            <div
              key={index}
              className={`
                flex items-center gap-3 sm:gap-4 
                p-4 sm:p-5
                border-b border-gray-200 last:border-b-0
              `}
            >
              <div className="mt-0.5 min-w-[28px] sm:min-w-[32px] flex items-center justify-center">
                {React.cloneElement(item.icon, {
                  size: 24, // good size for mobile + desktop
                  className: "text-gray-600 flex-shrink-0",
                })}
              </div>

              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-800 text-base sm:text-[15px] leading-tight">
                  {item.title}
                </p>
                <p className="text-sm sm:text-[13.5px] text-gray-600 mt-1.5 leading-relaxed">
                  {item.description}
                </p>
              </div>
            </div>
          ))}

          {hasMore && (
            <div className="px-4 sm:px-5 py-3 sm:py-4">
              <p
                onClick={handleSeeMore}
                className="
                  text-green-600 text-sm sm:text-base 
                  font-medium cursor-pointer 
                  hover:underline inline-block
                  transition-colors
                "
              >
                See details
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DataSafety;
