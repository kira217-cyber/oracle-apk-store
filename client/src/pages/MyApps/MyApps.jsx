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
    logo: "https://i.ibb.co.com/DDn0L7tp/logo-design-technology-company-vector-illustration-1253202-4950-ezgif-com-avif-to-jpg-converter.jpg",
    img1: "https://i.ibb.co.com/DDn0L7tp/logo-design-technology-company-vector-illustration-1253202-4950-ezgif-com-avif-to-jpg-converter.jpg",
    img2: "https://i.ibb.co.com/DDn0L7tp/logo-design-technology-company-vector-illustration-1253202-4950-ezgif-com-avif-to-jpg-converter.jpg",
    img3: "https://i.ibb.co.com/DDn0L7tp/logo-design-technology-company-vector-illustration-1253202-4950-ezgif-com-avif-to-jpg-converter.jpg",
    img4: "https://i.ibb.co.com/DDn0L7tp/logo-design-technology-company-vector-illustration-1253202-4950-ezgif-com-avif-to-jpg-converter.jpg",
    img5: "https://i.ibb.co.com/DDn0L7tp/logo-design-technology-company-vector-illustration-1253202-4950-ezgif-com-avif-to-jpg-converter.jpg",
    rating: 4.5,
  },
  {
    id: 2,
    name: "App Two",
    logo: "https://i.ibb.co.com/Q3FdLyN2/logo-design-technology-company-vector-illustration-1253202-6803-ezgif-com-avif-to-jpg-converter.jpg",
    img1: "https://i.ibb.co.com/Q3FdLyN2/logo-design-technology-company-vector-illustration-1253202-6803-ezgif-com-avif-to-jpg-converter.jpg",
    img2: "https://i.ibb.co.com/Q3FdLyN2/logo-design-technology-company-vector-illustration-1253202-6803-ezgif-com-avif-to-jpg-converter.jpg",
    img3: "https://i.ibb.co.com/Q3FdLyN2/logo-design-technology-company-vector-illustration-1253202-6803-ezgif-com-avif-to-jpg-converter.jpg",
    img4: "https://i.ibb.co.com/Q3FdLyN2/logo-design-technology-company-vector-illustration-1253202-6803-ezgif-com-avif-to-jpg-converter.jpg",
    img5: "https://i.ibb.co.com/Q3FdLyN2/logo-design-technology-company-vector-illustration-1253202-6803-ezgif-com-avif-to-jpg-converter.jpg",
    rating: 4.6,
  },
  {
    id: 3,
    name: "App Three",
    logo: "https://i.ibb.co.com/Q3FdLyN2/logo-design-technology-company-vector-illustration-1253202-6803-ezgif-com-avif-to-jpg-converter.jpg",
    img1: "https://i.ibb.co.com/Q3FdLyN2/logo-design-technology-company-vector-illustration-1253202-6803-ezgif-com-avif-to-jpg-converter.jpg",
    img2: "https://i.ibb.co.com/Q3FdLyN2/logo-design-technology-company-vector-illustration-1253202-6803-ezgif-com-avif-to-jpg-converter.jpg",
    img3: "https://i.ibb.co.com/DDn0L7tp/logo-design-technology-company-vector-illustration-1253202-4950-ezgif-com-avif-to-jpg-converter.jpg",
    img4: "https://i.ibb.co.com/DDn0L7tp/logo-design-technology-company-vector-illustration-1253202-4950-ezgif-com-avif-to-jpg-converter.jpg",
    img5: "https://i.ibb.co.com/DDn0L7tp/logo-design-technology-company-vector-illustration-1253202-4950-ezgif-com-avif-to-jpg-converter.jpg",
    rating: 4.2,
  },
  {
    id: 4,
    name: "App Four",
    logo: "https://i.ibb.co.com/8m2Y8LQ/app4.jpg",
    img1: "https://i.ibb.co.com/8m2Y8LQ/app4.jpg",
    img2: "https://i.ibb.co.com/8m2Y8LQ/app4.jpg",
    img3: "https://i.ibb.co.com/8m2Y8LQ/app4.jpg",
    img4: "https://i.ibb.co.com/8m2Y8LQ/app4.jpg",
    img5: "https://i.ibb.co.com/8m2Y8LQ/app4.jpg",
    rating: 4.7,
  },
  {
    id: 5,
    name: "App Five",
    logo: "https://i.ibb.co.com/VV1f6mS/app5.jpg",
    img1: "https://i.ibb.co.com/VV1f6mS/app5.jpg",
    img2: "https://i.ibb.co.com/VV1f6mS/app5.jpg",
    img3: "https://i.ibb.co.com/VV1f6mS/app5.jpg",
    img4: "https://i.ibb.co.com/VV1f6mS/app5.jpg",
    img5: "https://i.ibb.co.com/VV1f6mS/app5.jpg",
    rating: 4.8,
  },
  {
    id: 6,
    name: "App Six",
    logo: "https://i.ibb.co.com/TkJfz9T/app6.jpg",
    img1: "https://i.ibb.co.com/TkJfz9T/app6.jpg",
    img2: "https://i.ibb.co.com/TkJfz9T/app6.jpg",
    img3: "https://i.ibb.co.com/TkJfz9T/app6.jpg",
    img4: "https://i.ibb.co.com/TkJfz9T/app6.jpg",
    img5: "https://i.ibb.co.com/TkJfz9T/app6.jpg",
    rating: 4.4,
  },
  {
    id: 7,
    name: "App Seven",
    logo: "https://i.ibb.co.com/n7pfqKw/app7.jpg",
    img1: "https://i.ibb.co.com/n7pfqKw/app7.jpg",
    img2: "https://i.ibb.co.com/n7pfqKw/app7.jpg",
    img3: "https://i.ibb.co.com/n7pfqKw/app7.jpg",
    img4: "https://i.ibb.co.com/n7pfqKw/app7.jpg",
    img5: "https://i.ibb.co.com/n7pfqKw/app7.jpg",
    rating: 4.1,
  },
  {
    id: 8,
    name: "App Eight",
    logo: "https://i.ibb.co.com/5YR0DgD/app8.jpg",
    img1: "https://i.ibb.co.com/5YR0DgD/app8.jpg",
    img2: "https://i.ibb.co.com/5YR0DgD/app8.jpg",
    img3: "https://i.ibb.co.com/5YR0DgD/app8.jpg",
    img4: "https://i.ibb.co.com/5YR0DgD/app8.jpg",
    img5: "https://i.ibb.co.com/5YR0DgD/app8.jpg",
    rating: 4.9,
  },
  {
    id: 9,
    name: "App Nine",
    logo: "https://i.ibb.co.com/0b1xM3t/app9.jpg",
    img1: "https://i.ibb.co.com/0b1xM3t/app9.jpg",
    img2: "https://i.ibb.co.com/0b1xM3t/app9.jpg",
    img3: "https://i.ibb.co.com/0b1xM3t/app9.jpg",
    img4: "https://i.ibb.co.com/0b1xM3t/app9.jpg",
    img5: "https://i.ibb.co.com/0b1xM3t/app9.jpg",
    rating: 4.3,
  },
];

const MyApps = () => {
  const navigate = useNavigate();

  return (
    <div className="max-w-7xl mx-auto px-2 md:px-0">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 mt-4">
        <h2 className="text-xl md:text-2xl font-bold text-gray-900">
          Company Name
        </h2>
      </div>

      <div className="flex justify-center items-center ">
        <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-6">
          {appData.map((app) => (
            <div
              key={app.id}
              className="rounded-2xl bg-[#d4f1f3] p-4 shadow-md"
            >
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
                      {app.rating}
                    </span>
                    <span className="text-gray-500 text-sm">(3.7k)</span>
                  </div>
                </div>

                {/* INSTALL Button */}
                <button
                  onClick={() => navigate(`/app/${app.id}`)}
                  className="px-2 py-1 md:px-4 md:py-2 cursor-pointer gradient-animate text-white rounded-full font-semibold hover:bg-blue-700 text-sm transition"
                >
                  View App
                </button>
              </div>

              {/* 🔥 Swiper Images Slider Section */}
              <div className="mt-5">
                <Swiper spaceBetween={12} slidesPerView={3}>
                  {[app.img1, app.img2, app.img3, app.img4, app.img5].map(
                    (img, index) => (
                      <SwiperSlide key={index}>
                        <img
                          src={img}
                          className="w-full h-40 md:h-80 object-cover rounded-xl"
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

export default MyApps;
