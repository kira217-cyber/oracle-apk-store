import React from "react";
import { Link } from "react-router";
import { IoIosApps } from "react-icons/io";
import { FaGooglePlay } from "react-icons/fa";

const AllApps = () => {
 
  const apps = [
    {
      id: 1,
      name: "Wuthering Waves",
      image:
        "https://i.ibb.co/5XmZSPWz/detailed-esports-gaming-logo-template-1029473-588861-ezgif-com-avif-to-jpg-converter.jpg",
      rating: 4.3,
    },
    {
      id: 2,
      name: "ODIN",
      image:
        "https://i.ibb.co/Q3FdLyN2/logo-design-technology-company-vector-illustration-1253202-6803-ezgif-com-avif-to-jpg-converter.jpg",
      rating: 3.6,
    },
    {
      id: 3,
      name: "CookieRun",
      image:
        "https://i.ibb.co/DDn0L7tp/logo-design-technology-company-vector-illustration-1253202-4950-ezgif-com-avif-to-jpg-converter.jpg",
      rating: 4.8,
    },
    {
      id: 4,
      name: "BrownDust2",
      image:
        "https://i.ibb.co/5XmZSPWz/detailed-esports-gaming-logo-template-1029473-588861-ezgif-com-avif-to-jpg-converter.jpg",
      rating: 4.1,
    },
    {
      id: 5,
      name: "Whiteout Survival",
      image:
        "https://i.ibb.co/XrR0LRdp/hd-google-play-playstore-logo-symbol-png-701751694777134cuw3jc7voo-removebg-preview.png",
      rating: 4.3,
    },
    {
      id: 6,
      name: "Genshin Impact",
      image:
        "https://i.ibb.co/5XmZSPWz/detailed-esports-gaming-logo-template-1029473-588861-ezgif-com-avif-to-jpg-converter.jpg",
      rating: 4.3,
    },
    {
      id: 7,
      name: "Journey of Monarch",
      image:
        "https://i.ibb.co/DDn0L7tp/logo-design-technology-company-vector-illustration-1253202-4950-ezgif-com-avif-to-jpg-converter.jpg",
      rating: 4.6,
    },
    {
      id: 8,
      name: "Wuthering Waves",
      image:
        "https://i.ibb.co/5XmZSPWz/detailed-esports-gaming-logo-template-1029473-588861-ezgif-com-avif-to-jpg-converter.jpg",
      rating: 4.3,
    },
    {
      id: 9,
      name: "ODIN",
      image:
        "https://i.ibb.co/DDn0L7tp/logo-design-technology-company-vector-illustration-1253202-4950-ezgif-com-avif-to-jpg-converter.jpg",
      rating: 3.6,
    },
    {
      id: 10,
      name: "CookieRun",
      image:
        "https://i.ibb.co/G4yyryTZ/cyberpunk-assassins-neon-visage-862264-8569-ezgif-com-avif-to-jpg-converter.jpg",
      rating: 4.8,
    },
    {
      id: 11,
      name: "BrownDust2",
      image:
        "https://i.ibb.co/5XmZSPWz/detailed-esports-gaming-logo-template-1029473-588861-ezgif-com-avif-to-jpg-converter.jpg",
      rating: 4.1,
    },
    {
      id: 12,
      name: "Whiteout Survival",
      image:
        "https://i.ibb.co/XrR0LRdp/hd-google-play-playstore-logo-symbol-png-701751694777134cuw3jc7voo-removebg-preview.png",
      rating: 4.3,
    },
    {
      id: 13,
      name: "Genshin Impact",
      image:
        "https://i.ibb.co/5XmZSPWz/detailed-esports-gaming-logo-template-1029473-588861-ezgif-com-avif-to-jpg-converter.jpg",
      rating: 4.3,
    },
    {
      id: 14,
      name: "Journey of Monarch",
      image:
        "https://i.ibb.co/DDn0L7tp/logo-design-technology-company-vector-illustration-1253202-4950-ezgif-com-avif-to-jpg-converter.jpg",
      rating: 4.6,
    },
  ];

  const chunkApps = (arr, size) =>
    arr.reduce(
      (acc, _, i) => (i % size ? acc : [...acc, arr.slice(i, i + size)]),
      []
    );
  const rows = chunkApps(apps, 7);

  return (
    <div className="mt-10">

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
              ALL APP <IoIosApps size={20} />
            </span>
          </div>
        </div>

        <div className="md:flex-[8] relative bg-white rounded-md shadow flex items-center justify-center">
          <img
            className="h-20 md:h-full w-full object-cover rounded-md"
            src="https://i.ibb.co.com/5XmZSPWz/detailed-esports-gaming-logo-template-1029473-588861-ezgif-com-avif-to-jpg-converter.jpg"
            alt="Logo"
          />
         <span className="bg-white absolute top-0 right-0 px-1 py-[0.5] text-black text-sm">
            Ads
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
           <span className="bg-white absolute top-0 right-0 px-1 py-[0.5] text-black text-sm">
            Ads
          </span>
        </div>

        <div className="flex-[2] rgb-badge text-white px-6 py-3 rounded-md font-bold shadow flex items-center justify-center">
          <span className="flex gap-2 items-center">
            ALL APP <IoIosApps size={20} />
          </span>
        </div>
      </div>
      
      <div className="rounded-b-md py-5">
        

        {/* Apps */}
        {rows.map((row, idx) => (
          <div
            key={idx}
            className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-7 gap-2 md:gap-2 mb-6 mt-6"
          >
            {row.map((app) => (
              <div
                key={app.id}
                className="text-center backdrop-blur-xl bg-white/30 p-1 md:p-2 rounded-lg shadow-md hover:shadow-md transition"
              >
                <Link to={`/app/${app.id}`} className="cursor-pointer">
                  <div className="auto-shine shine-animate rounded-2xl">
                    <img
                      src={app.image}
                      alt={app.name}
                      className="w-24 h-22 md:w-36 md:h-36 mx-auto rounded-md md:rounded-2xl shadow hover:scale-105 transition"
                    />
                    <span className="shine-layer"></span>
                  </div>
                </Link>
                <Link
                  to={`/app/${app.id}`}
                  className="block mt-2 text-sm font-semibold hover:text-blue-600 cursor-pointer"
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

export default AllApps;
