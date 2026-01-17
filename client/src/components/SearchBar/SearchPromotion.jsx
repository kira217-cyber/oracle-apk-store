import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import { FaChevronLeft, FaChevronRight, FaStar } from "react-icons/fa";
import "swiper/css";
import "swiper/css/navigation";

const appList = [
  {
    id: 1,
    title: "Discover from Facebook",
    company: "Meta Platforms, Inc.",
    rating: 4.1,
    banner:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/5/51/Facebook_f_logo_%282019%29.svg/512px-Facebook_f_logo_%282019%29.svg.png",
    logo: "https://i.ibb.co.com/Z6P1k04z/unnamed-3.webp",
  },
  {
    id: 2,
    title: "Workplace from Meta",
    company: "Meta Platforms, Inc.",
    rating: 4.6,
    banner: "https://i.ibb.co.com/Z6P1k04z/unnamed-3.webp",
    logo: "https://i.ibb.co.com/Z6P1k04z/unnamed-3.webp",
  },
  {
    id: 3,
    title: "Meta Business Suite",
    company: "Meta Platforms, Inc.",
    rating: 4.5,
    banner: "https://upload.wikimedia.org/wikipedia/commons/a/ab/Meta-Logo.png",
    logo: "https://i.ibb.co.com/Z6P1k04z/unnamed-3.webp",
  },
  {
    id: 4,
    title: "Meta Ads Manager",
    company: "Meta Platforms, Inc.",
    rating: 4.3,
    banner: "https://upload.wikimedia.org/wikipedia/commons/a/ab/Meta-Logo.png",
    logo: "https://i.ibb.co.com/Z6P1k04z/unnamed-3.webp",
  },
];

const SearchPromotion = () => {
  return (
    <div className="hidden lg:block max-w-7xl mx-auto px-6 py-12 relative">
      {/* NAV BUTTONS */}
      <button className="promo-prev cursor-pointer absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white w-10 h-10 flex items-center justify-center rounded-full shadow hover:bg-gray-100">
        <FaChevronLeft />
      </button>

      <button className="promo-next cursor-pointer absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white w-10 h-10 flex items-center justify-center rounded-full shadow hover:bg-gray-100">
        <FaChevronRight />
      </button>

      {/* SWIPER */}
      <Swiper
        spaceBetween={24}
        slidesPerView={3}
        modules={[Navigation]}
        navigation={{
          prevEl: ".promo-prev",
          nextEl: ".promo-next",
        }}
      >
        {appList.map((app) => (
          <SwiperSlide key={app.id}>
            <div className="bg-gray-50/50 cursor-pointer rounded-xl p-4 shadow-sm hover:shadow-md transition h-full">
              {/* BANNER */}
              <div className="h-50 bg-white rounded-lg flex items-center justify-center">
                <img
                  src={app.banner}
                  alt={app.title}
                  className="max-h-24 object-contain"
                />
              </div>

              {/* INFO */}
              <div className="flex items-start gap-3 mt-4">
                <img
                  src={app.logo}
                  alt={app.title}
                  className="w-14 h-14 rounded-sm"
                />
                <div>
                  <h3 className="font-semibold text-sm">{app.title}</h3>
                  <p className="text-xs text-gray-500">{app.company}</p>
                  <div className="flex items-center gap-1 text-xs text-gray-600 mt-1">
                    <span>{app.rating}</span>
                    <FaStar className="text-yellow-400" />
                  </div>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default SearchPromotion;
