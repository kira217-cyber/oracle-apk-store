import React, { useState } from "react";
import {
  FaArrowRight,
  FaChevronDown,
  FaStar,
  FaChevronUp,
} from "react-icons/fa";
import { IoShareSocial } from "react-icons/io5";
import { FaRegHeart } from "react-icons/fa";
import { PiDesktopTowerFill } from "react-icons/pi";
import { FaGlobe, FaEnvelope, FaShieldAlt } from "react-icons/fa";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { Link, useParams } from "react-router";
import SimilarApp from "../SImilarApp/SimilarApp";
import RatingsAndReviews from "../RatingsAndReviews/RatingsAndReviews";
import DataSafety from "../DataSafety/DataSafety";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";

// Helper to format date
const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

// Update this to your actual backend URL
const API_BASE = `${import.meta.env.VITE_API_URL}`;

const fetchApkDetails = async (id) => {
  const { data } = await axios.get(`${API_BASE}/api/apk/${id}`);
  return data;
};

const fetchDeveloperDetails = async (developerId) => {
  if (!developerId) return null;
  const { data } = await axios.get(`${API_BASE}/api/developer/details/${developerId}`);
  return data;
};

const MobileAppDetails = () => {
  const { id } = useParams(); // Get APK id from route
  const [isOpen, setIsOpen] = useState(true);

  const {
    data: apk,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["apk", id],
    queryFn: () => fetchApkDetails(id),
    enabled: !!id,
  });

  const { data: developer } = useQuery({
    queryKey: ["developer", apk?.user?._id],
    queryFn: () => fetchDeveloperDetails(apk?.user?._id),
    enabled: !!apk?.user?._id,
  });

  // Download handler
  const handleDownload = () => {
    if (apk?.apkFile) {
      const downloadUrl = `${API_BASE}${apk.apkFile}`;
      window.open(downloadUrl, "_blank");
    }
  };

  if (isLoading) {
    return <div className="text-center py-20">Loading app details...</div>;
  }

  if (isError) {
    return (
      <div className="text-center py-20 text-red-600">
        Error: {error?.message || "Failed to load"}
      </div>
    );
  }

  if (!apk) {
    return <div className="text-center py-20">App not found</div>;
  }

  // Developer name
  const developerName =
    developer?.accountType === "company"
      ? developer.companyName
      : `${developer?.firstName || ""} ${developer?.lastName || ""}`.trim() ||
        apk.user?.email ||
        "Developer";

  const imageBase = API_BASE;

  return (
    <>
      {/* Mobile Design */}
      <div className="w-full md:hidden">
        <div className="max-w-6xl mx-auto px-4 py-8 grid md:grid-cols-2 gap-8 items-center">
          {/* -------- MOBILE TOP SECTION -------- */}
          <div className="md:hidden flex items-center gap-4">
            <div className="shadow-xl p-1 rounded-xl">
              <div className="h-22 w-22">
                <img
                  src={`${imageBase}${apk.apkLogo}`}
                  className="w-full h-full object-cover rounded-lg"
                  alt="app logo"
                />
              </div>
            </div>

            <div>
              <h1 className="text-xl font-bold text-black leading-tight">
                {apk.apkTitle}
              </h1>

              <Link
                to="/my-apps"
                className="text-sm text-green-700 font-semibold leading-tight"
              >
                {developerName}
              </Link>
            </div>
          </div>

          <div className="flex justify-center md:hidden gap-6 pb-2">
            <div className="text-center min-w-[70px]">
              <p className="flex items-center gap-1 text-lg font-semibold justify-center">
                4.2 <FaStar className="text-yellow-400" />
              </p>
              <p className="text-xs">3.76K reviews</p>
            </div>

            <div className="text-center min-w-[70px]">
              <p className="text-lg font-semibold">1M+</p>
              <p className="text-xs">Downloads</p>
            </div>

            <div className="text-center min-w-[70px]">
              <p className="text-lg font-semibold">3+</p>
              <p className="text-xs">Rated</p>
            </div>
          </div>

          {/* MOBILE BUTTONS */}
          <div className="md:hidden">
            <button
              onClick={handleDownload}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold px-8 py-3 rounded-xl"
            >
              Install
            </button>

            <div className="flex items-center justify-center gap-6 mt-4">
              <button className="flex items-center gap-2 text-green-700 font-semibold">
                <IoShareSocial size={20} />
                Share
              </button>

              <button className="flex items-center gap-2 text-green-700 font-semibold">
                <FaRegHeart size={18} />
                Add to wishlist
              </button>
            </div>
          </div>

          <div className="flex gap-2 justify-center mt-2 md:hidden">
            <span className="text-gray-600">
              <PiDesktopTowerFill size={24} />
            </span>
            <p className="text-gray-600 font-semibold">
              This app is available for all of your devices
            </p>
          </div>
        </div>
      </div>

      {/* Screenshots Slider */}
      <div className="mt-4 px-2 relative md:hidden">
        <Swiper
          spaceBetween={12}
          slidesPerView={3}
          modules={[Navigation]}
          navigation={{
            prevEl: ".prev-mobile",
            nextEl: ".next-mobile",
          }}
        >
          {apk.screenshots?.slice(0, 9).map((img, index) => (
            <SwiperSlide key={index}>
              <img
                src={`${imageBase}${img}`}
                className="w-full h-50 md:h-60 object-cover rounded-lg"
                alt={`Screenshot ${index + 1}`}
              />
            </SwiperSlide>
          ))}
        </Swiper>

        
      </div>

      {/* ================= About this app ================= */}
      <div className="px-4 mt-8 md:hidden">
        <h2 className="text-black text-2xl font-semibold">About this app</h2>
        <p className="text-gray-600 text-sm mt-4 leading-relaxed">
          {apk.fullAbout || "No description available."}
        </p>

        <div className="mt-6">
          <p className="text-sm text-gray-600">
            <span className="font-medium">Updated on</span>{" "}
            {formatDate(apk.updatedAt)}
          </p>

          <div className="flex flex-wrap gap-3 mt-4">
            {apk.tags?.[0] && (
              <span className="px-3 py-1 bg-white/70 rounded-full border border-gray-500 text-gray-600 text-sm">
                #{apk.tags[0]}
              </span>
            )}
            <span className="px-3 py-1 bg-white/70 rounded-full border border-gray-500 text-gray-600 text-sm">
              {apk.appCategory}
            </span>
          </div>
        </div>
      </div>

      {/* Data Safety & Ratings */}
      <div className="px-4 md:hidden">
        <div className="font-sans">
          <DataSafety />
          <RatingsAndReviews />
        </div>
      </div>

      {/* ================= App Support and Similar Apps ================= */}
      <div className="mt-8 px-4 md:hidden font-sans">
        <div className="mb-6">
          <div
            onClick={(e) => {
              e.preventDefault();
              setIsOpen(!isOpen);
            }}
            className="flex items-center justify-between mb-4 cursor-pointer select-none"
          >
            <h2 className="text-lg font-semibold text-gray-800">App support</h2>
            {isOpen ? (
              <FaChevronUp className="text-gray-500" />
            ) : (
              <FaChevronDown className="text-gray-500" />
            )}
          </div>

          {isOpen && (
            <div className="space-y-4">
              {developer?.website && (
                <div className="flex items-center gap-3 text-gray-700">
                  <FaGlobe />
                  <a
                    href={developer.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm"
                  >
                    Website
                  </a>
                </div>
              )}

              <div className="flex items-center gap-3 text-gray-700">
                <FaEnvelope />
                <div>
                  <p className="text-sm">Support email</p>
                  <p className="text-sm text-gray-500">
                    {apk.supportContact || apk.user?.email}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 text-gray-700">
                <FaShieldAlt />
                <span className="text-sm">Privacy Policy</span>
              </div>

              <div className="mb-8">
                <h3 className="text-sm font-medium text-gray-800 mb-2">
                  About the developer
                </h3>
                <div className="text-sm text-gray-600 space-y-1 leading-relaxed">
                  <p>{developerName}</p>
                  <p>{apk.supportContact || apk.user?.email}</p>
                  {developer?.country && <p>{developer.country}</p>}
                  {developer?.whatsapp && <p>{developer.whatsapp}</p>}
                </div>
              </div>
            </div>
          )}
        </div>

        <SimilarApp />
      </div>

      {/* ================= What’s New ================= */}
      <div className="md:hidden mt-8 px-4 mb-4">
        <h1 className="text-2xl font-bold">What’s new</h1>
        <p className="text-gray-500 text-sm mt-4">
          Last updated on {formatDate(apk.updatedAt)} <br />
          {apk.fullAbout ||
            "Bug fixes and performance improvements. Our continuous efforts are to improve and make the app more rewarding."}
        </p>
      </div>
    </>
  );
};

export default MobileAppDetails;
