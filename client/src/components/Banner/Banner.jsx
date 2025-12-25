import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router";
const bannerData = [
  {
    id: 1,
    logoUrl:
      "https://i.ibb.co/album/hd-google-play-playstore-logo-symbol-png-701751694777134cuw3jc7voo.png",
    title: "This is Oracle Store",
    bgUrl: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f",
  },
  {
    id: 2,
    logoUrl:
      "https://i.ibb.co/album/hd-google-play-playstore-logo-symbol-png-701751694777134cuw3jc7voo.png",
    title: "Amazing Apps Here",
    bgUrl: "https://images.unsplash.com/photo-1518770660439-4636190af475",
  },
  {
    id: 3,
    logoUrl:
      "https://i.ibb.co/album/hd-google-play-playstore-logo-symbol-png-701751694777134cuw3jc7voo.png",
    title: "Oracle Store Downloads",
    bgUrl: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d",
  },
  {
    id: 4,
    logoUrl:
      "https://i.ibb.co/album/hd-google-play-playstore-logo-symbol-png-701751694777134cuw3jc7voo.png",
    title: "Best Games & Apps",
    bgUrl: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee",
  },
];

const Banner = () => {
  const [index, setIndex] = useState(0);
  const navigate = useNavigate();

  // Auto slide every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % bannerData.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [bannerData.length]);

  const banner = bannerData[index];

  return (
    <div className="relative w-full h-[220px] sm:h-[280px] md:h-[360px] lg:h-[420px] overflow-hidden  shadow-lg">
      <AnimatePresence mode="wait">
        <motion.div
          key={banner.id}
          initial={{ opacity: 0, scale: 1.08 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.7, ease: "easeInOut" }}
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${banner.bgUrl})` }}
        >
          {/* Dark Overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/30" />

          {/* Content */}
          <div className="relative md:max-w-7xl md:mx-auto z-10 h-full flex items-center justify-between px-4 sm:px-8 md:px-12">
            {/* LEFT CONTENT */}
            <motion.div
              initial={{ x: -40, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.6 }}
              className="text-white max-w-[70%] sm:max-w-xl"
            >
              <h1 className="text-lg sm:text-2xl md:text-4xl font-bold leading-tight">
                {banner.title}
              </h1>
              <p className="hidden sm:block mt-2 text-gray-200 text-sm md:text-base">
                Download apps & games safely from Oracle Store
              </p>
            </motion.div>

            {/* RIGHT CONTENT */}
            <motion.div
              initial={{ x: 40, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.6 }}
              className="flex flex-col items-center gap-3"
            >
              <img
                src={banner.logoUrl}
                alt="App Logo"
                className="w-14 sm:w-20 md:w-28 rounded-xl bg-white p-1 shadow-xl"
              />

              <button
                onClick={() => navigate(`/app/${banner.id}`)}
                className="px-5 py-2 text-sm sm:text-base rounded-full bg-sky-500 hover:bg-sky-600 active:scale-95 cursor-pointer text-white font-semibold transition-all"
              >
                Download
              </button>
            </motion.div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* DOT INDICATORS */}
      <div className="absolute bottom-3 cursor-pointer left-1/2 -translate-x-1/2 flex gap-2 z-20">
        {bannerData.map((_, i) => (
          <button
            key={i}
            onClick={() => setIndex(i)}
            className={`w-3 cursor-pointer h-3 rounded-full transition-all duration-300 ${
              index === i ? "bg-green-700 scale-110" : "bg-white/60"
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default Banner;
