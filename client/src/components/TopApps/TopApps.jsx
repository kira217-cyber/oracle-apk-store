import React from "react";
import { Link } from "react-router";
import { IoIosApps } from "react-icons/io";
import { FaGooglePlay } from "react-icons/fa";

const TopApps = () => {
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
        "https://i.ibb.co.com/5XmZSPWz/detailed-esports-gaming-logo-template-1029473-588861-ezgif-com-avif-to-jpg-converter.jpg",
      rating: 4.1,
    },
    {
      id: 4,
      name: "App Four",
      image:
        "https://i.ibb.co.com/DDn0L7tp/logo-design-technology-company-vector-illustration-1253202-4950-ezgif-com-avif-to-jpg-converter.jpg",
      rating: 4.6,
    },
    {
      id: 5,
      name: "App Five",
      image:
        "https://i.ibb.co.com/Q3FdLyN2/logo-design-technology-company-vector-illustration-1253202-6803-ezgif-com-avif-to-jpg-converter.jpg",
      rating: 4.9,
    },
    {
      id: 6,
      name: "App Six",
      image:
        "https://i.ibb.co.com/5XmZSPWz/detailed-esports-gaming-logo-template-1029473-588861-ezgif-com-avif-to-jpg-converter.jpg",
      rating: 4.2,
    },
    {
      id: 7,
      name: "App Seven",
      image:
        "https://i.ibb.co.com/G4yyryTZ/cyberpunk-assassins-neon-visage-862264-8569-ezgif-com-avif-to-jpg-converter.jpg",
      rating: 4.7,
    },
    {
      id: 8,
      name: "App Eight",
      image:
        "https://i.ibb.co.com/5XmZSPWz/detailed-esports-gaming-logo-template-1029473-588861-ezgif-com-avif-to-jpg-converter.jpg",
      rating: 4.3,
    },
    {
      id: 9,
      name: "App Nine",
      image:
        "https://i.ibb.co.com/5XmZSPWz/detailed-esports-gaming-logo-template-1029473-588861-ezgif-com-avif-to-jpg-converter.jpg",
      rating: 4.4,
    },
    {
      id: 10,
      name: "App Ten",
      image:
        "https://i.ibb.co.com/DDn0L7tp/logo-design-technology-company-vector-illustration-1253202-4950-ezgif-com-avif-to-jpg-converter.jpg",
      rating: 4.8,
    },
    {
      id: 11,
      name: "App Eleven",
      image:
        "https://i.ibb.co.com/5XmZSPWz/detailed-esports-gaming-logo-template-1029473-588861-ezgif-com-avif-to-jpg-converter.jpg",
      rating: 4.6,
    },
    {
      id: 12,
      name: "App Twelve",
      image:
        "https://i.ibb.co.com/DDn0L7tp/logo-design-technology-company-vector-illustration-1253202-4950-ezgif-com-avif-to-jpg-converter.jpg",
      rating: 4.5,
    },
    {
      id: 13,
      name: "App Thirteen",
      image:
        "https://i.ibb.co.com/5XmZSPWz/detailed-esports-gaming-logo-template-1029473-588861-ezgif-com-avif-to-jpg-converter.jpg",
      rating: 4.9,
    },
    {
      id: 14,
      name: "App Fourteen",
      image:
        "https://i.ibb.co.com/DDn0L7tp/logo-design-technology-company-vector-illustration-1253202-4950-ezgif-com-avif-to-jpg-converter.jpg",
      rating: 4.7,
    },
  ];

  const chunkApps = (arr, size) =>
    arr.reduce(
      (acc, _, i) => (i % size ? acc : [...acc, arr.slice(i, i + size)]),
      []
    );

  const rows = chunkApps(appData, 7);

  return (
    <div>
      {/* ⭐ 120 Degree Shine Effect */}
      <style>{`
        .auto-shine {
          position: relative;
          overflow: hidden;
          border-radius: 16px;
        }

        .shine-layer {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            120deg,
            transparent 30%,
            rgba(255,255,255,0.9) 50%,
            transparent 70%
          );
          transform: translateX(-150%);
          pointer-events: none;
          border-radius: inherit;
        }

        .shine-animate .shine-layer {
          animation: shineSwipe 1.4s ease-out infinite;
        }

        @keyframes shineSwipe {
          0% { transform: translateX(-150%) skewX(-15deg); }
          100% { transform: translateX(150%) skewX(-15deg); }
        }
      `}</style>

      {/* mobile Header */}
      <div className="flex flex-col gap-2 md:hidden md:flex-row md:items-stretch md:gap-3">
        <div className="flex gap-2 md:flex-[2]">
          <div className="flex-1 gradient-animate text-white px-2 py-1 md:px-6 md:py-3 rounded-md font-bold shadow flex items-center justify-center">
            <span className="flex gap-2 items-center">
              Oracle Store <FaGooglePlay size={20} />
            </span>
          </div>

          <div className="flex-1 rgb-badge text-white px-2 py-1 md:px-6 md:py-3 rounded-md font-bold shadow flex items-center justify-center">
            <span className="flex gap-2 items-center">
              TOP APP <IoIosApps size={20} />
            </span>
          </div>
        </div>

        <div className="md:flex-[8] relative bg-white rounded-md shadow flex items-center justify-center">
          <img
            className="h-20 md:h-full w-full object-cover rounded-md"
            src="https://i.ibb.co.com/5XmZSPWz/detailed-esports-gaming-logo-template-1029473-588861-ezgif-com-avif-to-jpg-converter.jpg"
            alt="Logo"
          />
          <span className="bg-gradient-to-r from-cyan-400 to-pink-500 absolute top-2 right-0 px-3 py-1 text-white font-bold text-sm shadow-lg">
            Boost
          </span>
        </div>
      </div>

      {/* desktop Header */}
      <div className="hidden md:flex items-stretch gap-3">
        <div className="flex-[2] gradient-animate text-white px-6 py-3 rounded-md font-bold shadow flex items-center justify-center">
          <span className="flex gap-2 items-center">
            Oracle Store <FaGooglePlay size={20} />
          </span>
        </div>

        <div className="flex-[8] relative bg-white rounded-md shadow flex items-center justify-center">
          <img
            className="h-full max-h-14 w-full object-cover rounded-md"
            src="https://i.ibb.co.com/5XmZSPWz/detailed-esports-gaming-logo-template-1029473-588861-ezgif-com-avif-to-jpg-converter.jpg"
            alt="Logo"
          />
          <span className="bg-gradient-to-r from-cyan-400 to-pink-500 absolute top-1 right-0 px-3 py-1 text-white font-semibold rounded-l-sm text-lg">
            Boost
          </span>
        </div>

        <div className="flex-[2] rgb-badge text-white px-6 py-3 rounded-md font-bold shadow flex items-center justify-center">
          <span className="flex gap-2 items-center">
            TOP APP <IoIosApps size={20} />
          </span>
        </div>
      </div>

      {/* Apps */}
      <div className="">
        {rows.map((row, index) => (
          <div
            key={index}
            className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-7 gap-2 md:gap-2 mb-6 mt-6"
          >
            {row.map((app) => (
              <div
                key={app.id}
                className="text-center backdrop-blur-xl bg-white/30 p-1 md:p-2 rounded-lg shadow-sm hover:shadow-md transition"
              >
                <Link to={`/app/${app.id}`}>
                  <div className="auto-shine shine-animate">
                    <img
                      src={app.image}
                      alt={app.name}
                      className="w-24 h-24 md:w-36 md:h-36 mx-auto rounded-md md:rounded-2xl shadow"
                    />
                    <div className="shine-layer"></div>
                  </div>
                </Link>

                <Link
                  to={`/app/${app.id}`}
                  className="block mt-2 text-sm font-semibold hover:text-blue-600"
                >
                  {app.name}
                </Link>

                <p className="text-gray-500 text-sm">{app.rating} ★</p>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default TopApps;
