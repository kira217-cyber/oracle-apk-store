import React from "react";
import { Link } from "react-router";

const AllApps = () => {
  const categories = [
    "Games",
    "Tools",
    "Video App",
    "Betting App",
    "Earning App",
    "Call App",
    "Social Media",
    "Education",
    "Photography",
    "Travel",
    "Health & Fitness",
    "Music & Audio",
    "Finance",
    "Shopping",
    "News & Magazines",
  ];

  const apps = [
    { id: 1, name: "Wuthering Waves", image: "https://i.ibb.co.com/5XmZSPWz/detailed-esports-gaming-logo-template-1029473-588861-ezgif-com-avif-to-jpg-converter.jpg", rating: 4.3 },
    { id: 2, name: "ODIN", image: "https://i.ibb.co.com/Q3FdLyN2/logo-design-technology-company-vector-illustration-1253202-6803-ezgif-com-avif-to-jpg-converter.jpg", rating: 3.6 },
    { id: 3, name: "CookieRun", image: "https://i.ibb.co.com/DDn0L7tp/logo-design-technology-company-vector-illustration-1253202-4950-ezgif-com-avif-to-jpg-converter.jpg", rating: 4.8 },
    { id: 4, name: "BrownDust2", image: "https://i.ibb.co.com/5XmZSPWz/detailed-esports-gaming-logo-template-1029473-588861-ezgif-com-avif-to-jpg-converter.jpg", rating: 4.1 },
    { id: 5, name: "Whiteout Survival", image: "https://i.ibb.co.com/XrR0LRdp/hd-google-play-playstore-logo-symbol-png-701751694777134cuw3jc7voo-removebg-preview.png", rating: 4.3 },
    { id: 6, name: "Genshin Impact", image: "https://i.ibb.co.com/5XmZSPWz/detailed-esports-gaming-logo-template-1029473-588861-ezgif-com-avif-to-jpg-converter.jpg", rating: 4.3 },
    { id: 7, name: "Journey of Monarch", image: "https://i.ibb.co.com/DDn0L7tp/logo-design-technology-company-vector-illustration-1253202-4950-ezgif-com-avif-to-jpg-converter.jpg", rating: 4.6 },

    { id: 8, name: "Wuthering Waves", image: "https://i.ibb.co.com/5XmZSPWz/detailed-esports-gaming-logo-template-1029473-588861-ezgif-com-avif-to-jpg-converter.jpg", rating: 4.3 },
    { id: 9, name: "ODIN", image: "https://i.ibb.co.com/DDn0L7tp/logo-design-technology-company-vector-illustration-1253202-4950-ezgif-com-avif-to-jpg-converter.jpg", rating: 3.6 },
    { id: 10, name: "CookieRun", image: "https://i.ibb.co.com/G4yyryTZ/cyberpunk-assassins-neon-visage-862264-8569-ezgif-com-avif-to-jpg-converter.jpg", rating: 4.8 },
    { id: 11, name: "BrownDust2", image: "https://i.ibb.co.com/5XmZSPWz/detailed-esports-gaming-logo-template-1029473-588861-ezgif-com-avif-to-jpg-converter.jpg", rating: 4.1 },
    { id: 12, name: "Whiteout Survival", image: "https://i.ibb.co.com/XrR0LRdp/hd-google-play-playstore-logo-symbol-png-701751694777134cuw3jc7voo-removebg-preview.png", rating: 4.3 },
    { id: 13, name: "Genshin Impact", image: "https://i.ibb.co.com/5XmZSPWz/detailed-esports-gaming-logo-template-1029473-588861-ezgif-com-avif-to-jpg-converter.jpg", rating: 4.3 },
    { id: 14, name: "Journey of Monarch", image: "https://i.ibb.co.com/DDn0L7tp/logo-design-technology-company-vector-illustration-1253202-4950-ezgif-com-avif-to-jpg-converter.jpg", rating: 4.6 },
  ];

  const chunkApps = (arr, size) =>
    arr.reduce(
      (acc, _, i) => (i % size ? acc : [...acc, arr.slice(i, i + size)]),
      []
    );

  const rows = chunkApps(apps, 7);

  return (
    <div className="max-w-7xl mx-auto px-4 my-10 mt-10">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div className="bg-gradient-to-r from-green-400 to-green-700 text-white px-4 py-2 rounded-md font-bold shadow">
          App Categories
        </div>

        <div className="bg-gradient-to-r from-blue-400 to-blue-700 text-white px-4 py-2 rounded-md font-bold shadow">
          ALL APP ▶
        </div>
      </div>

      <div className="bg-white rounded-b-md py-5">
        {/* Desktop Version Category Buttons */}
        <div className=" hidden md:flex flex-wrap gap-4 justify-start mb-6">
          {[...categories].map((cat, index) => (
            <button
              key={index}
              className="px-6 py-2 rounded-full bg-blue-900 text-white text-sm font-semibold hover:bg-blue-700 transition cursor-pointer"
            >
              {cat}
            </button>
          ))}
        </div>
        {/* Mobile Version Category Buttons */}
        <div
          className="
            flex gap-4 mb-6 md:hidden
            overflow-x-auto sm:overflow-visible
            whitespace-nowrap sm:whitespace-normal
            no-scrollbar

          "
        >
          {[...categories].map((cat, index) => (
            <button
              key={index}
              className="px-6 py-2 rounded-full bg-blue-900 text-white text-sm font-semibold hover:bg-blue-700 transition cursor-pointer flex-shrink-0"
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Apps */}
        {rows.map((row, idx) => (
          <div
            key={idx}
            className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-7 gap-6 mb-10 mt-10"
          >
            {row.map((app) => (
              <div key={app.id} className="text-center">
                <Link to={`/app/${app.id}`} className="cursor-pointer">
                  <img
                    src={app.image}
                    alt={app.name}
                    className="w-20 h-20 sm:w-36 sm:h-36 mx-auto rounded-2xl shadow hover:scale-105 transition"
                  />
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
