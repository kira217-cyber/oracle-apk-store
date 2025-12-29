import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";
import { useNavigate } from "react-router";

const bannerData = [
  {
    id: 1,
    title: "Emily and the Backbone",
    image:
      "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=800&q=80",
    badge: "Hot",
  },
  {
    id: 2,
    title: "Tech Revolution",
    image:
      "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80",
    badge: "New",
  },
  {
    id: 3,
    title: "Future Apps",
    image:
      "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=800&q=80",
    badge: "Hot",
  },
  {
    id: 4,
    title: "Creative Studio",
    image:
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=800&q=80",
    badge: "Trending",
  },
];

const PromoBanner = () => {
  const navigate = useNavigate();

  return (
    <section className="">
      <Swiper
        modules={[Autoplay]}
        spaceBetween={16}
        slidesPerView={1}
        loop={true}
        autoplay={{ delay: 3000, disableOnInteraction: false }}
        className="rounded-xl"
      >
        {bannerData.map((banner) => (
          <SwiperSlide key={banner.id}>
            <div
              onClick={() => navigate(`/banner/${banner.id}`)}
              className="relative cursor-pointer w-full h-48 md:h-80 rounded-xl overflow-hidden shadow-lg"
            >
              {/* Background Image */}
              <img
                src={banner.image}
                alt={banner.title}
                className="w-full h-full object-cover"
              />

              {/* Badge */}
                <span className="bg-white absolute top-0 right-0 px-1 py-[0.5] text-black text-sm">
                  Ads
                </span>
             

              {/* Title */}
              <div className="absolute bottom-4 left-4 text-white md:text-lg font-bold shadow-lg">
                {banner.title}
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
};

export default PromoBanner;
