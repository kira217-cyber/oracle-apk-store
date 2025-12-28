import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";
import { FaStar } from "react-icons/fa";
import { useNavigate } from "react-router";

const appData = [
  {
    id: 1,
    name: "App One",
    image:
      "https://i.ibb.co.com/5XmZSPWz/detailed-esports-gaming-logo-template-1029473-588861-ezgif-com-avif-to-jpg-converter.jpg",
    rating: 4.5,
  },
  {
    id: 2,
    name: "App Two",
    image:
      "https://i.ibb.co.com/G4yyryTZ/cyberpunk-assassins-neon-visage-862264-8569-ezgif-com-avif-to-jpg-converter.jpg",
    rating: 4.8,
  },
  {
    id: 3,
    name: "App Three",
    image:
      "https://i.ibb.co.com/DDn0L7tp/logo-design-technology-company-vector-illustration-1253202-4950-ezgif-com-avif-to-jpg-converter.jpg",
    rating: 4.7,
  },
  {
    id: 4,
    name: "App Four",
    image:
      "https://i.ibb.co.com/Q3FdLyN2/logo-design-technology-company-vector-illustration-1253202-6803-ezgif-com-avif-to-jpg-converter.jpg",
    rating: 4.9,
  },
  {
    id: 5,
    name: "App One",
    image:
      "https://i.ibb.co.com/5XmZSPWz/detailed-esports-gaming-logo-template-1029473-588861-ezgif-com-avif-to-jpg-converter.jpg",
    rating: 4.5,
  },
  {
    id: 6,
    name: "App Two",
    image:
      "https://i.ibb.co.com/G4yyryTZ/cyberpunk-assassins-neon-visage-862264-8569-ezgif-com-avif-to-jpg-converter.jpg",
    rating: 4.8,
  },
];

const PopularApps = () => {
  const navigate = useNavigate();

  return (
    <section className="">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl md:text-2xl font-bold text-gray-900">Popular</h2>
      </div>

      {/* Swiper Slider */}
      <Swiper
        modules={[Autoplay]}
        spaceBetween={16}
        slidesPerView={2}
        breakpoints={{
          640: { slidesPerView: 2 },
          768: { slidesPerView: 3 },
          1024: { slidesPerView: 4 },
        }}
        loop={true}
        autoplay={{ delay: 3000, disableOnInteraction: false }}
        className="py-4"
      >
        {appData.map((app) => (
          <SwiperSlide key={app.id}>
            <div
              onClick={() => navigate(`/apps/${app.id}`)}
              className="cursor-pointer  rounded-2xl shadow-md overflow-hidden hover:scale-105 transition-transform duration-300 mb-2"
            >
              {/* Image */}
              <div className="w-full h-[190px] rounded-t-xl overflow-hidden">
                <img
                  src={app.image}
                  alt={app.name}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* App Info */}
              <div className="mt-3 px-3 pb-3">
                <h3 className="text-sm font-semibold text-gray-900 truncate">
                  {app.name}
                </h3>

                {/* Rating */}
                <div className="flex items-center gap-1 mt-1">
                  <FaStar className="text-yellow-400 text-xs" />
                  <span className="text-xs text-gray-700">{app.rating}</span>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
};

export default PopularApps;
