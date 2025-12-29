import React from "react";
import { FaStar } from "react-icons/fa";
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

const AppDetails = () => {
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
        <div className="max-w-6xl mx-auto px-4 py-8 flex items-start">
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
          </div>

          {/* Right Section - App Icon */}
          <div className="flex w-[30%] md:justify-end">
            <div className="w-64 h-64 md:w-64 md:h-64 rounded-2xl shadow-lg overflow-hidden">
              <img
                src="https://i.ibb.co.com/WvRGSWZj/unnamed-9.webp"
                alt="app icon"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>{" "}
      {/* Mobile Design */}
      <div className="w-full md:hidden">
        <div className="max-w-6xl mx-auto px-4 py-8 grid md:grid-cols-2 gap-8 items-center">
          {/* -------- MOBILE TOP SECTION -------- */}
          <div className="md:hidden flex items-center gap-4">
            <img
              src="https://i.ibb.co.com/WvRGSWZj/unnamed-9.webp"
              className="w-20 h-20 rounded-xl shadow-black object-cover"
            />

            <div>
              <h1 className="text-xl font-bold text-black leading-tight">
                Postal Vote BD
              </h1>

              <Link to="/my-apps" className="text-sm text-green-700 font-semibold leading-tight">
                Bangladesh Election Commission Secretariat
              </Link>
            </div>
          </div>

          <div className="flex md:hidden gap-6 overflow-x-auto whitespace-nowrap no-scrollbar pb-2">
            <div className="text-center min-w-[70px]">
              <p className="flex items-center gap-1 text-lg font-semibold justify-center">
                4.2 <FaStar className="text-yellow-400" />
              </p>
              <p className="text-xs">3.76K reviews</p>
            </div>

            <div className="text-center min-w-[70px]">
              <RiBankLine size={24} className="mx-auto" />
              <p className="text-xs">Government</p>
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
        </div>
      </div>
      {/* 🔥 Swiper Images Slider Section */}
      <div className="mt-4 relative md:hidden">
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
                    className="w-full h-40 md:h-60 object-cover rounded-xl"
                    alt=""
                  />
                </SwiperSlide>
              )
            )}
          </Swiper>
        ))}

        {appData.map((app) => (
          <div key={`nav-${app.id}`}>
            <button
              className={`prev-${app.id} absolute top-1/2 -left-2 z-10 -translate-y-1/2 w-10 h-10 flex items-center justify-center bg-white rounded-full shadow`}
            >
              <FaChevronLeft />
            </button>
            <button
              className={`next-${app.id} absolute top-1/2 -right-2 z-10 -translate-y-1/2 w-10 h-10 flex items-center justify-center bg-white rounded-full shadow`}
            >
              <FaChevronRight />
            </button>
          </div>
        ))}
      </div>
    </>
  );
};

export default AppDetails;
