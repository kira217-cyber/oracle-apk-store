import React from "react";
import { useNavigate } from "react-router";
import { FaStar } from "react-icons/fa";

// Swiper Imports
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";

const appData = [
  {
    id: 1,
    name: "App One",
    logo: "https://i.ibb.co.com/vxMMMrWy/unnamed-10.webp",
    img1: "https://i.ibb.co.com/qFCfQPfP/unnamed-11.webp",
    img2: "https://i.ibb.co.com/N2V7xw4v/unnamed-12.webp",
    img3: "https://i.ibb.co.com/wFJX44tp/unnamed-13.webp",
    img4: "https://i.ibb.co.com/mV11K5DP/unnamed-14.webp",
    img5: "https://i.ibb.co.com/gFHxgvzx/unnamed-15.webp",
    img6: "https://i.ibb.co.com/TBRTkHmc/unnamed-16.webp",
    ratting: 4.5,
    author: "Tom Hardy",
  },
  {
    id: 2,
    name: "App Two",
    logo: "https://i.ibb.co.com/jPGBr2Y7/unnamed-17.webp",
    img1: "https://i.ibb.co.com/nsr3kYG0/unnamed-18.webp",
    img2: "https://i.ibb.co.com/JFBzTsxL/unnamed-19.webp",
    img3: "https://i.ibb.co.com/ccD4jZFq/unnamed-20.webp",
    img4: "https://i.ibb.co.com/3YdSjfHf/unnamed-21.webp",
    img5: "https://i.ibb.co.com/C3MvV22x/unnamed-22.webp",
    img6: "https://i.ibb.co.com/LXHjV4vz/unnamed-23.webp",
    ratting: 4.5,
    author: "Smith Johnson",
  },
];

const SingleApp = () => {
  const navigate = useNavigate();

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl md:text-2xl font-bold text-gray-900">
          Most Download
        </h2>
      </div>

      <div className="flex justify-center items-center ">
        <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-6">
          {appData.map((app) => (
            <div key={app.id} className="rounded-2xl bg-[#d4f1f3] p-4 shadow-md">
              {/* Top Section */}
              <div className="flex items-center gap-4">
                <img
                  onClick={() => navigate(`/app/${app.id}`)}
                  src={app.logo}
                  alt={app.name}
                  className="w-18 h-18 cursor-pointer rounded-2xl object-cover"
                />

                <div className="flex-1">
                  <h1
                    onClick={() => navigate(`/app/${app.id}`)}
                    className="text-lg cursor-pointer font-semibold"
                  >
                    {app.name}
                  </h1>
                  <p
                    onClick={() => navigate(`/app/${app.id}`)}
                    className="text-gray-500 cursor-pointer text-sm"
                  >
                    {app.author}
                  </p>

                  <div className="flex items-center gap-1 mt-1">
                    <FaStar className="text-yellow-400" />
                    <span className="text-gray-700 font-medium">
                      {app.ratting}
                    </span>
                    <span className="text-gray-500 text-sm">(3.7k)</span>
                  </div>
                </div>

                {/* INSTALL Button */}
                <button
                  onClick={() => navigate(`/app/${app.id}`)}
                  className="px-4 py-1 cursor-pointer bg-blue-600 text-white rounded-full font-semibold hover:bg-blue-700 text-sm transition"
                >
                  INSTALL
                </button>
              </div>

              {/* 🔥 Swiper Images Slider Section */}
              <div className="mt-5">
                <Swiper
                  spaceBetween={12}
                  slidesPerView={3}
                >
                  {[app.img1, app.img2, app.img3, app.img4, app.img5,app.img6].map(
                    (img, index) => (
                      <SwiperSlide key={index}>
                        <img
                          src={img}
                          className="w-full h-40 md:h-80 object-fill rounded-xl"
                          alt=""
                        />
                      </SwiperSlide>
                    )
                  )}
                </Swiper>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SingleApp;
