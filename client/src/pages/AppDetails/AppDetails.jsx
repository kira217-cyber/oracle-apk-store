import React, { useState } from "react";
import { FaArrowRight, FaChevronDown, FaStar } from "react-icons/fa";
import { IoShareSocial } from "react-icons/io5";
import { FaRegHeart } from "react-icons/fa";
import { RiBankLine } from "react-icons/ri";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { Link } from "react-router";
import { PiDesktopTowerFill } from "react-icons/pi";
import {
  FaShareAlt,
  FaCloud,
  FaMobileAlt,
  FaTabletAlt,
  FaGlobe,
  FaEnvelope,
  FaShieldAlt,
  FaChevronUp,
  FaEllipsisV,
  FaUserCircle,
} from "react-icons/fa";

const ReviewItem = ({
  name,
  date,
  rating,
  review,
  helpfulCount,
  reply,
  replyDate,
}) => {
  return (
    <div className="border-b border-gray-200 pb-6 mb-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <FaUserCircle className="text-3xl text-gray-400" />
          <div>
            <p className="text-sm font-medium text-gray-800">{name}</p>
            <div className="flex items-center gap-1 mt-1">
              {[...Array(5)].map((_, i) => (
                <FaStar
                  key={i}
                  className={`text-sm ${
                    i < rating ? "text-green-600" : "text-gray-300"
                  }`}
                />
              ))}
              <span className="text-xs text-gray-500 ml-2">{date}</span>
            </div>
          </div>
        </div>

        <FaEllipsisV className="text-gray-500 text-sm" />
      </div>

      {/* Review Text */}
      <p className="text-sm text-gray-700 mt-3 leading-relaxed">{review}</p>

      {/* Helpful */}
      <p className="text-xs text-gray-500 mt-3">
        {helpfulCount} people found this review helpful
      </p>

      <div className="flex items-center gap-3 mt-2">
        <span className="text-sm text-gray-600">
          Did you find this helpful?
        </span>
        <button className="border px-4 py-1 rounded-full text-sm">Yes</button>
        <button className="border px-4 py-1 rounded-full text-sm">No</button>
      </div>

      {/* Developer Reply */}
      {reply && (
        <div className="bg-gray-50/20 rounded-lg p-4 mt-4">
          <div className="flex justify-between mb-2">
            <p className="text-sm font-medium text-gray-800">
              Bangladesh Election Commission Secretariat
            </p>
            <span className="text-xs text-gray-500">{replyDate}</span>
          </div>

          <p className="text-sm text-gray-700 leading-relaxed">{reply}</p>
        </div>
      )}
    </div>
  );
};

const AppDetails = () => {
  const [isOpen, setIsOpen] = useState(true);
  const appData = [
    {
      id: 1,
      name: "App One",
      logo: "https://i.ibb.co.com/WvRGSWZj/unnamed-9.webp",

      img1: "https://i.ibb.co.com/QFKmDBf1/unnamed-1.webp",
      img2: "https://i.ibb.co.com/1GcJNQpV/unnamed.webp",
      img3: "https://i.ibb.co.com/4wkZccL9/unnamed-2.webp",
      img4: "https://i.ibb.co.com/kVvBsymq/unnamed-3.webp",
      img5: "https://i.ibb.co.com/ZRsmLrbj/unnamed-4.webp",
      img6: "https://i.ibb.co.com/YFJ4n3ZH/unnamed-5.webp",
      img7: "https://i.ibb.co.com/tT8ZXtW0/unnamed-6.webp",
      img8: "https://i.ibb.co.com/PzMV6ZXw/unnamed-7.webp",
      img9: "https://i.ibb.co.com/MxCFX406/unnamed-8.webp",
      rating: 4.5,
    },
  ];
  return (
    <>
      {/* Desktop Design */}
      <div className="hidden md:block w-full">
        <div className="max-w-7xl mx-auto px-4 py-8 flex items-start">
          {/* Left Section */}
          <div className="space-y-4 w-[70%]">
            <h1 className="text-3xl md:text-4xl font-bold text-black">
              Postal Vote BD
            </h1>

            <Link to="/my-apps" className="text-green-600 font-bold text-lg">
              Bangladesh Election Commission Secretariat
            </Link>

            {/* Ratings / Stats */}
            <div className="flex flex-wrap gap-6 text-black mt-4">
              <div className="text-center">
                <p className="flex items-center gap-1 text-xl font-semibold  justify-center">
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
              <button className="bg-green-600 cursor-pointer hover:bg-green-700 text-white font-semibold px-8 py-3 rounded-lg">
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
            <div className="mt-20 relative">
              {appData.map((app) => (
                <Swiper
                  key={app.id}
                  spaceBetween={12}
                  slidesPerView={4}
                  modules={[Navigation]}
                  navigation={{
                    prevEl: `.prev-${app.id}`,
                    nextEl: `.next-${app.id}`,
                  }}
                >
                  {[
                    app.img1,
                    app.img2,
                    app.img3,
                    app.img4,
                    app.img5,
                    app.img6,
                    app.img7,
                    app.img8,
                    app.img9,
                  ].map((img, index) => (
                    <SwiperSlide key={index}>
                      <img
                        src={img}
                        className="w-full h-40 md:h-80 object-cover rounded-xl"
                        alt=""
                      />
                    </SwiperSlide>
                  ))}
                </Swiper>
              ))}

              {appData.map((app) => (
                <div key={`nav-${app.id}`}>
                  <button
                    className={`prev-${app.id} cursor-pointer absolute top-1/2 -left-4 z-10 -translate-y-1/2 w-10 h-10 flex items-center justify-center bg-white hover:bg-gray-300 rounded-full shadow`}
                  >
                    <FaChevronLeft />
                  </button>
                  <button
                    className={`next-${app.id} cursor-pointer absolute top-1/2 -right-4 z-10 -translate-y-1/2 w-10 h-10 flex items-center justify-center bg-white hover:bg-gray-300 rounded-full shadow`}
                  >
                    <FaChevronRight />
                  </button>
                </div>
              ))}
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
                <p className="semifont-bold text-gray-600 text-[16px]">
                  Postal Vote BD is the official mobile application developed by
                  the Bangladesh Election Commission to enroll voters and track
                  ballot papers only at home and abroad. However, voters will
                  exercise their voting by manually casting vote in a postal
                  ballot paper sent by postal services. Voters will send this
                  ballot paper by postal service to concerned electoral
                  official(s) in Bangladesh. This secure and verified platform
                  enables eligible voters to exercise their democratic rights
                  conveniently from anywhere.
                </p>
                <p className="mt-4 semifont-bold text-gray-600 text-[16px]">
                  {" "}
                  CURRENT FEATURES:...
                </p>
                <p className="mt-4 font-bold text-gray-600">Updated on</p>
                <p className="text-gray-600">Dec 30, 2025</p>
                <div className="mt-4 flex items-center gap-4">
                  <p className="text-gray-600  px-3 py-1 bg-white/70 w-36 rounded-full border-[1px] border-gray-500">
                    #top free tools
                  </p>
                  <p className="text-gray-600  px-3 py-1 bg-white/70 w-16 rounded-full border-[1px] border-gray-500">
                    Tools
                  </p>{" "}
                </div>
              </div>
              <div className="hidden md:block">
                <div className="font-sans">
                  {/* ================= Data Safety ================= */}
                  <div className="rounded-lg mt-8">
                    <div className="flex gap-6 items-center mb-3">
                      <h2 className="text-2xl font-semibold text-gray-800">
                        Data safety
                      </h2>
                      <span className="text-xl text-gray-400 p-2 cursor-pointer hover:bg-gray-200 hover:rounded-full">
                        <FaArrowRight />
                      </span>
                    </div>

                    <p className="text-sm text-gray-500 mb-4 leading-relaxed">
                      Safety starts with understanding how developers collect
                      and share your data. Data privacy and security practices
                      may vary based on your use, region, and age. The developer
                      provided this information and may update it over time.
                    </p>

                    <div className="border border-gray-400 rounded-xl ">
                      {/* Row 1 */}
                      <div className="flex items-start gap-3 p-4">
                        <FaShareAlt className="text-gray-600 mt-1" />
                        <div>
                          <p className="font-medium text-gray-800">
                            No data shared with third parties
                          </p>
                          <p className="text-sm text-gray-500 hover:underline cursor-pointer">
                            Learn more about how developers declare sharing
                          </p>
                        </div>
                      </div>

                      {/* Row 2 */}
                      <div className="flex items-start gap-3 p-4">
                        <FaCloud className="text-gray-600 mt-1" />
                        <div>
                          <p className="font-medium text-gray-800">
                            No data collected
                          </p>
                          <p className="text-sm text-gray-500 hover:underline cursor-pointer">
                            Learn more about how developers declare collection
                          </p>
                        </div>
                      </div>
                      <p className="text-green-600 text-sm font-medium ml-4 mb-4 px-4 cursor-pointer">
                        See details
                      </p>
                    </div>
                  </div>

                  {/* ================= Ratings & Reviews ================= */}
                  <div>
                    <div className="flex gap-6 items-center mt-6 mb-3">
                      <h2 className="text-2xl font-semibold text-gray-800">
                        Ratings and reviews
                      </h2>
                      <span className="text-xl text-gray-400 p-2 cursor-pointer hover:bg-gray-200 hover:rounded-full">
                        <FaArrowRight />
                      </span>
                    </div>

                    {/* Phone / Tablet Toggle */}
                    <div className="flex gap-2 mb-6">
                      <button className="flex items-center gap-2 bg-green-100 text-green-700 px-4 py-1.5 rounded-full text-sm font-medium">
                        <FaMobileAlt /> Phone
                      </button>
                      <button className="flex items-center gap-2 border px-4 py-1.5 rounded-full text-sm text-gray-600">
                        <FaTabletAlt /> Tablet
                      </button>
                    </div>

                    <div className="flex gap-10">
                      {/* Rating Score */}
                      <div className="text-center">
                        <h1 className="text-5xl font-semibold text-gray-800">
                          4.3
                        </h1>
                        <div className="flex justify-center mt-2 text-green-600">
                          {[...Array(4)].map((_, i) => (
                            <FaStar key={i} />
                          ))}
                          <FaStar className="text-gray-300" />
                        </div>
                        <p className="text-sm text-gray-500 mt-2">
                          3.82K reviews
                        </p>
                      </div>

                      {/* Rating Bars */}
                      <div className="flex-1 space-y-2">
                        {[5, 4, 3, 2, 1].map((star, index) => (
                          <div key={index} className="flex items-center gap-3">
                            <span className="text-sm text-gray-600 w-4">
                              {star}
                            </span>
                            <div className="w-full bg-gray-200 rounded-full h-3">
                              <div
                                className={`h-3 rounded-full bg-green-600`}
                                style={{
                                  width:
                                    star === 5
                                      ? "85%"
                                      : star === 4
                                      ? "10%"
                                      : star === 3
                                      ? "8%"
                                      : star === 2
                                      ? "6%"
                                      : "12%",
                                }}
                              ></div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-8 font-sans">
              <ReviewItem
                name="Ramim Ahmed"
                date="December 13, 2025"
                rating={2}
                review={`UI is decent and intuitive, however the app in it's current state is not usable for me. At first I wasn't even receiving any OTP during registration, then an update fixed it. Now I am unable to input almost 90% of the alphabets in the English language while typing in my address. It only accepts a few characters like "A, L, B, N" the rest doesn't appear when I type in. Copying and pasting them also doesn't fix the problem. Unusable!`}
                helpfulCount={45}
                reply={`We sincerely apologize for the inconvenience. To get assistance with this issue, Please feel free to send an email to info@ocv.gov.bd or contacting us at +8809610000105 and let us know in detail about the problem. Our concerned team will definitely try to resolve it. We'll be more than happy to assist you.`}
                replyDate="December 16, 2025"
              />

              <ReviewItem
                name="Md Naim Chowdhury"
                date="December 6, 2025"
                rating={5}
                review={`Issue with image capture. When trying the first phase of Nid verification even though the image is crisp, perfect lighting and most certainly readable complains about taking it at right angle and more light. You should fix this issue. And the top of it there is no option to turn the flash if light is such a major problem. Update: reply was pretty fast and fixed`}
                helpfulCount={190}
                reply={`We apologize that your experience didn’t match with expectation. We request you to send an email to info@ocv.gov.bd or contacting us at +8809610000105. Our concerned team will definitely try to resolve it.`}
                replyDate="December 2, 2025"
              />
            </div>
          </div>

          {/* Right Section - App Icon */}
          <div className="flex w-[30%] md:justify-end">
            <div>
              <div className="w-64 h-64 md:w-64 md:h-64 rounded-2xl shadow-lg overflow-hidden">
                <img
                  src="https://i.ibb.co.com/WvRGSWZj/unnamed-9.webp"
                  alt="app icon"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="mt-18 font-sans">
                {/* ================= App Support ================= */}
                <div className="mb-6">
                  {/* Header (NO button, NO navigation) */}
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
                      <div className="flex items-center gap-3 text-gray-700">
                        <FaGlobe />
                        <span className="text-sm">Website</span>
                      </div>

                      {/* Support Email */}
                      <div className="flex items-center gap-3 text-gray-700">
                        <FaEnvelope />
                        <div>
                          <p className="text-sm">Support email</p>
                          <p className="text-sm text-gray-500">
                            info@ocv.gov.bd
                          </p>
                        </div>
                      </div>

                      {/* Privacy Policy */}
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
                          <p>Bangladesh Election Commission</p>
                          <p>rk_mizan@yahoo.com</p>
                          <p>1207, Nirbachon Bhaban, Agargaon, Dhaka.</p>
                          <p>Dhaka 1207</p>
                          <p>Bangladesh</p>
                          <p>+880 1916-267776</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* ================= Similar Apps ================= */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold text-gray-800">
                      Similar apps
                    </h2>
                    <FaChevronRight className="text-gray-500" />
                  </div>

                  <div className="space-y-5">
                    {/* App Item */}
                    <div className="flex gap-4 items-center">
                      <img
                        src="https://i.ibb.co.com/zTcxmwdt/unnamed.webp"
                        alt=""
                        className="w-16 h-16 rounded-xl object-cover"
                      />
                      <div>
                        <p className="text-lg font-medium text-gray-800">
                          1.1.1.1 + WARP: Safer Internet
                        </p>
                        <p className="text-sm text-gray-500">
                          Cloudflare, Inc.
                        </p>
                        <div className="flex items-center gap-1 text-sm text-gray-600 mt-1">
                          <span>4.3</span>
                          <FaStar className="text-green-600" />
                        </div>
                      </div>
                    </div>

                    {/* App Item */}
                    <div className="flex gap-4 items-center">
                      <img
                        src="https://i.ibb.co.com/PK9YFVR/unnamed-1.webp"
                        alt=""
                        className="w-16 h-16 rounded-xl object-cover"
                      />
                      <div>
                        <p className="text-lg font-medium text-gray-800">
                          Thunder VPN - Fast, Safe VPN
                        </p>
                        <p className="text-sm text-gray-500">
                          Secure Signal Inc.
                        </p>
                        <div className="flex items-center gap-1 text-sm text-gray-600 mt-1">
                          <span>4.4</span>
                          <FaStar className="text-green-600" />
                        </div>
                      </div>
                    </div>

                    {/* App Item */}
                    <div className="flex gap-4 items-center">
                      <img
                        src="https://i.ibb.co.com/gLrRkPW0/unnamed-2.webp"
                        alt=""
                        className="w-16 h-16 rounded-xl object-cover"
                      />
                      <div>
                        <p className="text-lg font-medium text-gray-800">
                          DeRadar
                        </p>
                        <p className="text-sm text-gray-500">
                          Interconsea Inc.
                        </p>
                        <div className="flex items-center gap-1 text-sm text-gray-600 mt-1">
                          <span>4.9</span>
                          <FaStar className="text-green-600" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>{" "}
      {/* Mobile Design */}
      <div className="w-full md:hidden">
        <div className="max-w-6xl mx-auto px-4 py-8 grid md:grid-cols-2 gap-8 items-center">
          {/* -------- MOBILE TOP SECTION -------- */}
          <div className="md:hidden flex items-center gap-4 ">
            <div className="shadow-xl h-22 w-32 p-2 rounded-xl">
              <img
              src="https://i.ibb.co.com/WvRGSWZj/unnamed-9.webp"
              className=" object-cover"
            />
            </div>

            <div>
              <h1 className="text-xl font-bold text-black leading-tight">
                Postal Vote BD
              </h1>

              <Link
                to="/my-apps"
                className="text-sm text-green-700 font-semibold leading-tight"
              >
                Bangladesh Election Commission Secretariat
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
            <button className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold px-8 py-3 rounded-xl">
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
      {/* 🔥 Swiper Images Slider Section */}
      <div className="mt-8 px-2 relative md:hidden">
        {appData.map((app) => (
          <Swiper
            key={app.id}
            spaceBetween={12}
            slidesPerView={3}
            modules={[Navigation]}
            navigation={{
              prevEl: `.prev-${app.id}`,
              nextEl: `.next-${app.id}`,
            }}
          >
            {[app.img1, app.img2, app.img3, app.img4, app.img5].map(
              (img, index) => (
                <SwiperSlide key={index}>
                  <img
                    src={img}
                    className="w-full  h-40 md:h-60 object-cover rounded-xl"
                    alt=""
                  />
                </SwiperSlide>
              )
            )}
          </Swiper>
        ))}
      </div>
      <div className="px-4 md:hidden">
        <div className="font-sans">
          {/* ================= Data Safety ================= */}
          <div className="rounded-lg mt-8">
            <div className="flex gap-6 items-center mb-3">
              <h2 className="text-2xl font-semibold text-gray-800">
                Data safety
              </h2>
              <span className="text-xl text-gray-400 p-2 cursor-pointer hover:bg-gray-200 hover:rounded-full">
                <FaArrowRight />
              </span>
            </div>

            <p className="text-sm text-gray-500 mb-4 leading-relaxed">
              Safety starts with understanding how developers collect and share
              your data. Data privacy and security practices may vary based on
              your use, region, and age. The developer provided this information
              and may update it over time.
            </p>

            <div className="border border-gray-400 rounded-xl ">
              {/* Row 1 */}
              <div className="flex items-start gap-3 p-4">
                <FaShareAlt className="text-gray-600 mt-1" />
                <div>
                  <p className="font-medium text-gray-800">
                    No data shared with third parties
                  </p>
                  <p className="text-sm text-gray-500 hover:underline cursor-pointer">
                    Learn more about how developers declare sharing
                  </p>
                </div>
              </div>

              {/* Row 2 */}
              <div className="flex items-start gap-3 p-4">
                <FaCloud className="text-gray-600 mt-1" />
                <div>
                  <p className="font-medium text-gray-800">No data collected</p>
                  <p className="text-sm text-gray-500 hover:underline cursor-pointer">
                    Learn more about how developers declare collection
                  </p>
                </div>
              </div>
              <p className="text-green-600 text-sm font-medium ml-4 mb-4 px-4 cursor-pointer">
                See details
              </p>
            </div>
          </div>

          {/* ================= Ratings & Reviews ================= */}
          <div>
            <div className="flex gap-6 items-center mt-6 mb-3">
              <h2 className="text-2xl font-semibold text-gray-800">
                Ratings and reviews
              </h2>
              <span className="text-xl text-gray-400 p-2 cursor-pointer hover:bg-gray-200 hover:rounded-full">
                <FaArrowRight />
              </span>
            </div>

            {/* Phone / Tablet Toggle */}
            <div className="flex gap-2 mb-6">
              <button className="flex items-center gap-2 bg-green-100 text-green-700 px-4 py-1.5 rounded-full text-sm font-medium">
                <FaMobileAlt /> Phone
              </button>
              <button className="flex items-center gap-2 border px-4 py-1.5 rounded-full text-sm text-gray-600">
                <FaTabletAlt /> Tablet
              </button>
            </div>

            <div className="flex gap-10">
              {/* Rating Score */}
              <div className="text-center">
                <h1 className="text-5xl font-semibold text-gray-800">4.3</h1>
                <div className="flex justify-center mt-2 text-green-600">
                  {[...Array(4)].map((_, i) => (
                    <FaStar key={i} />
                  ))}
                  <FaStar className="text-gray-300" />
                </div>
                <p className="text-sm text-gray-500 mt-2">3.82K reviews</p>
              </div>

              {/* Rating Bars */}
              <div className="flex-1 space-y-2">
                {[5, 4, 3, 2, 1].map((star, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <span className="text-sm text-gray-600 w-4">{star}</span>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div
                        className={`h-3 rounded-full bg-green-600`}
                        style={{
                          width:
                            star === 5
                              ? "85%"
                              : star === 4
                              ? "10%"
                              : star === 3
                              ? "8%"
                              : star === 2
                              ? "6%"
                              : "12%",
                        }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-8 px-4 font-sans md:hidden">
        <ReviewItem
          name="Ramim Ahmed"
          date="December 13, 2025"
          rating={2}
          review={`UI is decent and intuitive, however the app in it's current state is not usable for me. At first I wasn't even receiving any OTP during registration, then an update fixed it. Now I am unable to input almost 90% of the alphabets in the English language while typing in my address. It only accepts a few characters like "A, L, B, N" the rest doesn't appear when I type in. Copying and pasting them also doesn't fix the problem. Unusable!`}
          helpfulCount={45}
          reply={`We sincerely apologize for the inconvenience. To get assistance with this issue, Please feel free to send an email to info@ocv.gov.bd or contacting us at +8809610000105 and let us know in detail about the problem. Our concerned team will definitely try to resolve it. We'll be more than happy to assist you.`}
          replyDate="December 16, 2025"
        />

        <ReviewItem
          name="Md Naim Chowdhury"
          date="December 6, 2025"
          rating={5}
          review={`Issue with image capture. When trying the first phase of Nid verification even though the image is crisp, perfect lighting and most certainly readable complains about taking it at right angle and more light. You should fix this issue. And the top of it there is no option to turn the flash if light is such a major problem. Update: reply was pretty fast and fixed`}
          helpfulCount={190}
          reply={`We apologize that your experience didn’t match with expectation. We request you to send an email to info@ocv.gov.bd or contacting us at +8809610000105. Our concerned team will definitely try to resolve it.`}
          replyDate="December 2, 2025"
        />
      </div>
      <div className="mt-8 px-4 md:hidden font-sans">
        {/* ================= App Support ================= */}
        <div className="mb-6">
          {/* Header (NO button, NO navigation) */}
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

          {/* Content */}
          {isOpen && (
            <div className="space-y-4">
              {/* Website */}
              <div className="flex items-center gap-3 text-gray-700">
                <FaGlobe />
                <span className="text-sm">Website</span>
              </div>

              {/* Support Email */}
              <div className="flex items-center gap-3 text-gray-700">
                <FaEnvelope />
                <div>
                  <p className="text-sm">Support email</p>
                  <p className="text-sm text-gray-500">info@ocv.gov.bd</p>
                </div>
              </div>

              {/* Privacy Policy */}
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
                  <p>Bangladesh Election Commission</p>
                  <p>rk_mizan@yahoo.com</p>
                  <p>1207, Nirbachon Bhaban, Agargaon, Dhaka.</p>
                  <p>Dhaka 1207</p>
                  <p>Bangladesh</p>
                  <p>+880 1916-267776</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ================= Similar Apps ================= */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-800">
              Similar apps
            </h2>
            <FaChevronRight className="text-gray-500" />
          </div>

          <div className="space-y-5">
            {/* App Item */}
            <div className="flex gap-4 items-center">
              <img
                src="https://i.ibb.co.com/zTcxmwdt/unnamed.webp"
                alt=""
                className="w-14 h-14 rounded-xl object-cover"
              />
              <div>
                <p className="text-md font-medium text-gray-800">
                  1.1.1.1 + WARP: Safer Internet
                </p>
                <p className="text-sm text-gray-500">Cloudflare, Inc.</p>
                <div className="flex items-center gap-1 text-sm text-gray-600 mt-1">
                  <span>4.3</span>
                  <FaStar className="text-green-600" />
                </div>
              </div>
            </div>

            {/* App Item */}
            <div className="flex gap-4 items-center">
              <img
                src="https://i.ibb.co.com/PK9YFVR/unnamed-1.webp"
                alt=""
                className="w-14 h-14 rounded-xl object-cover"
              />
              <div>
                <p className="text-md font-medium text-gray-800">
                  Thunder VPN - Fast, Safe VPN
                </p>
                <p className="text-sm text-gray-500">Secure Signal Inc.</p>
                <div className="flex items-center gap-1 text-sm text-gray-600 mt-1">
                  <span>4.4</span>
                  <FaStar className="text-green-600" />
                </div>
              </div>
            </div>

            {/* App Item */}
            <div className="flex gap-4 items-center">
              <img
                src="https://i.ibb.co.com/gLrRkPW0/unnamed-2.webp"
                alt=""
                className="w-14 h-14 rounded-xl object-cover"
              />
              <div>
                <p className="text-md font-medium text-gray-800">DeRadar</p>
                <p className="text-sm text-gray-500">Interconsea Inc.</p>
                <div className="flex items-center gap-1 text-sm text-gray-600 mt-1">
                  <span>4.9</span>
                  <FaStar className="text-green-600" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AppDetails;
