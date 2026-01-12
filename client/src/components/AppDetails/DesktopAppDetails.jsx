import React, { useState, useEffect } from "react";
import {
  FaArrowRight,
  FaChevronDown,
  FaStar,
  FaChevronUp,
} from "react-icons/fa";
import { IoShareSocial } from "react-icons/io5";
import { FaRegHeart } from "react-icons/fa";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { Link, useParams } from "react-router"; // useParams to get the id
import { PiDesktopTowerFill } from "react-icons/pi";
import { FaGlobe, FaEnvelope, FaShieldAlt } from "react-icons/fa";
import DataSafety from "../DataSafety/DataSafety";
import RatingsAndReviews from "../RatingsAndReviews/RatingsAndReviews";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import SimilarApp from "../SImilarApp/SimilarApp";
import { toast } from "react-toastify";

// Helper to format date like "Dec 30, 2025"
const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

// Base URL for your backend (change if needed)
const API_BASE = `${import.meta.env.VITE_API_URL}`; // adjust to your backend URL

const fetchApkDetails = async (id) => {
  const { data } = await axios.get(`${API_BASE}/api/apk/${id}`);

  return data;
};

const fetchDeveloperDetails = async (developerId) => {
  if (!developerId) return null;
  const { data } = await axios.get(
    `${API_BASE}/api/developer/details/${developerId}`
  );
  return data;
};

const handleNavigate = () => {
  toast.info("Developer profile page is under construction.");
  }

const DesktopAppDetails = () => {
  const { id } = useParams(); // get the :id from URL
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

  // Handle download
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
        Error: {error.message}
      </div>
    );
  }

  if (!apk) {
    return <div className="text-center py-20">App not found</div>;
  }

  // Determine developer display name
  const developerName =
    developer?.accountType === "company"
      ? developer.companyName
      : `${developer?.firstName || ""} ${developer?.lastName || ""}`.trim() ||
        apk.user?.email;

  // Base URL for images
  const imageBase = API_BASE;
  console.log("APK Data:", apk.apk_Id);

  

  return (
    <>
    
      <div className="hidden md:block w-full">
        <div className="max-w-7xl mx-auto px-4 py-8 flex items-start">
          {/* Left Section */}
          <div className="space-y-4 w-[70%]">
            <h1 className="text-3xl md:text-4xl font-bold text-black">
              {apk.apkTitle}
            </h1>
            <Link onClick={handleNavigate} className="text-green-600 font-bold text-lg">
              {developerName}
            </Link>
            {/* Ratings / Stats - keeping static as in original, you can make dynamic later */}
            <div className="flex flex-wrap gap-6 text-black mt-4">
              <div className="text-center">
                <p className="flex items-center gap-1 text-xl font-semibold justify-center">
                  4.2 <FaStar className="text-yellow-400" />
                </p>
                <p className="text-sm">3.76K reviews</p>
              </div>
              <div className="text-center">
                <p className="text-xl font-semibold flex justify-center">1M+</p>
                <p className="text-sm">Downloads</p>
              </div>
              <div className="text-center">
                <p className="text-xl font-semibold flex justify-center">3+</p>
                <p className="text-sm">Rated</p>
              </div>
            </div>
            {/* Buttons */}
            <div className="flex flex-wrap gap-4 mt-6">
              <button
                onClick={handleDownload}
                className="bg-green-600 cursor-pointer hover:bg-green-700 text-white font-semibold px-8 py-3 rounded-lg"
              >
                Install
              </button>
              <button className="flex items-center cursor-pointer gap-2 border px-6 py-3 rounded-lg dark:border-gray-700 hover:bg-green-600 hover:text-white hover:border-none hover:font-bold">
                <IoShareSocial size={20} />
                Share
              </button>
              <button className="flex items-center cursor-pointer gap-2 border px-6 py-3 rounded-lg dark:border-gray-700 hover:bg-green-600 hover:text-white hover:border-none hover:font-bold">
                <FaRegHeart size={18} />
                Add to wishlist
              </button>
            </div>
            <div className="hidden md:flex items-center gap-2 mt-6">
              <span className="text-gray-600">
                <PiDesktopTowerFill size={24} />
              </span>
              <p className="text-gray-600 font-semibold">
                This app is available for all of your devices
              </p>
            </div>
            {/* 🔥 Swiper Images Slider Section */}
            <div className="mt-10 relative">
              <Swiper
                spaceBetween={12}
                slidesPerView={4}
                modules={[Navigation]}
                navigation={{
                  prevEl: ".prev-btn",
                  nextEl: ".next-btn",
                }}
              >
                {apk.screenshots?.map((img, index) => (
                  <SwiperSlide key={index}>
                    <img
                      src={`${imageBase}${img}`}
                      className="w-48 h-40 md:h-86 object-center rounded-xl"
                      alt={`Screenshot ${index + 1}`}
                    />
                  </SwiperSlide>
                ))}
              </Swiper>
              <button className="prev-btn cursor-pointer absolute top-1/2 -left-4 z-10 -translate-y-1/2 w-10 h-10 flex items-center justify-center bg-white hover:bg-gray-300 rounded-full shadow">
                <FaChevronLeft />
              </button>
              <button className="next-btn cursor-pointer absolute top-1/2 -right-4 z-10 -translate-y-1/2 w-10 h-10 flex items-center justify-center bg-white hover:bg-gray-300 rounded-full shadow">
                <FaChevronRight />
              </button>
            </div>
            <div>
              <div className="hidden md:flex gap-4 items-center mt-8">
                <h2 className="text-black text-2xl font-semibold">
                  About this app
                </h2>
                <span className="text-gray-600 p-2 cursor-pointer hover:bg-white hover:rounded-full">
                  <FaArrowRight size={20} />
                </span>
              </div>
              <div>
                <p className="mt-4 semifont-bold text-gray-600 text-[16px]">
                  {apk.fullAbout}
                </p>
                <p className="mt-4 font-bold text-gray-600">Updated on</p>
                <p className="text-gray-600">{formatDate(apk.updatedAt)}</p>
                <div className="mt-4 flex items-center gap-4">
                  {/* First tag as hashtag, rest as normal */}
                  {apk.tags?.length > 0 && (
                    <p className="text-gray-600 px-4 py-1 bg-white/70 rounded-full border-[1px] border-gray-500">
                      #{apk.tags[1]}
                    </p>
                  )}
                  <p className="text-gray-600 px-4 py-1 bg-white/70  rounded-full border-[1px] border-gray-500">
                    {apk.appCategory}
                  </p>
                </div>
              </div>
              <div className="hidden md:block">
                <div className="font-sans">
                  <DataSafety apk={apk} />
                </div>
              </div>
            </div>
            {/* Ratings and Reviews */}
            <RatingsAndReviews apkId={apk._id} />
          </div>
          {/* Right Section - App Icon */}
          <div className="flex w-[30%] md:justify-end">
            <div>
              <div className="w-64 h-64 md:w-64 md:h-64 rounded-2xl shadow-lg overflow-hidden">
                <img
                  src={`${imageBase}${apk.apkLogo}`}
                  alt="app icon"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="mt-18 font-sans">
                {/* ================= App Support ================= */}
                <div className="mb-6">
                  <div
                    onClick={(e) => {
                      e.preventDefault();
                      setIsOpen(!isOpen);
                    }}
                    className="flex items-center justify-between mb-4 cursor-pointer select-none"
                  >
                    <h2 className="text-lg font-semibold text-gray-800">
                      App support
                    </h2>
                    {isOpen ? (
                      <FaChevronUp className="text-gray-500" />
                    ) : (
                      <FaChevronDown className="text-gray-500" />
                    )}
                  </div>
                  {/* Content */}
                  {isOpen && (
                    <div className="space-y-4">
                      {/* Website */}
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
                      {/* Support Email */}
                      <div className="flex items-center gap-3 text-gray-700">
                        <FaEnvelope />
                        <div>
                          <p className="text-sm">Support email</p>
                          <p className="text-sm text-gray-500">
                            {apk.supportContact || apk.user?.email}
                          </p>
                        </div>
                      </div>
                      {/* Privacy Policy - assuming you have a link, otherwise just text */}
                      <div className="flex items-center gap-3 text-gray-700">
                        <FaShieldAlt />
                        <span className="text-sm">Privacy Policy</span>
                      </div>
                      {/* ================= About the Developer ================= */}
                      <div className="mb-8">
                        <h3 className="text-sm font-medium text-gray-800 mb-2">
                          About the developer
                        </h3>
                        <div className="text-sm text-gray-600 space-y-1 leading-relaxed">
                          <p>{developerName}</p>
                          <p>{apk.supportContact || apk.user?.email}</p>
                          <p>{developer?.country}</p>
                          {developer?.whatsapp && <p>{developer.whatsapp}</p>}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                {/* ================= Similar Apps ================= */}
                <SimilarApp />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default DesktopAppDetails;
