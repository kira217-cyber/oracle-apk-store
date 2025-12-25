import React from "react";
import { Link } from "react-router";

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
    { id: 8, name: "App Eight", image: "https://i.ibb.co.com/5XmZSPWz/detailed-esports-gaming-logo-template-1029473-588861-ezgif-com-avif-to-jpg-converter.jpg", rating: 4.3 },
    { id: 9, name: "App Nine", image: "https://i.ibb.co.com/5XmZSPWz/detailed-esports-gaming-logo-template-1029473-588861-ezgif-com-avif-to-jpg-converter.jpg", rating: 4.4 },
    { id: 10, name: "App Ten", image: "https://i.ibb.co.com/DDn0L7tp/logo-design-technology-company-vector-illustration-1253202-4950-ezgif-com-avif-to-jpg-converter.jpg", rating: 4.8 },
    { id: 11, name: "App Eleven", image: "https://i.ibb.co.com/5XmZSPWz/detailed-esports-gaming-logo-template-1029473-588861-ezgif-com-avif-to-jpg-converter.jpg", rating: 4.6 },
    { id: 12, name: "App Twelve", image: "https://i.ibb.co.com/DDn0L7tp/logo-design-technology-company-vector-illustration-1253202-4950-ezgif-com-avif-to-jpg-converter.jpg", rating: 4.5 },
    { id: 13, name: "App Thirteen", image: "https://i.ibb.co.com/5XmZSPWz/detailed-esports-gaming-logo-template-1029473-588861-ezgif-com-avif-to-jpg-converter.jpg", rating: 4.9 },
    { id: 14, name: "App Fourteen", image: "https://i.ibb.co.com/DDn0L7tp/logo-design-technology-company-vector-illustration-1253202-4950-ezgif-com-avif-to-jpg-converter.jpg", rating: 4.7 },
  ];

  const chunkApps = (arr, size) =>
    arr.reduce(
      (acc, _, i) => (i % size ? acc : [...acc, arr.slice(i, i + size)]),
      []
    );

  const rows = chunkApps(appData, 7); // 7 apps per row

  return (
    <div className="max-w-7xl mx-auto px-4 my-10 mt-10">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div className="bg-gradient-to-r from-green-400 to-green-700 text-white px-6 py-3 rounded-md font-bold shadow">
          Oracle Store
        </div>

        <div className="bg-gradient-to-r from-blue-400 to-blue-700 text-white px-6 py-3 rounded-md font-bold shadow">
          TOP APP ▶
        </div>
      </div>

      {/* Apps Section */}
      <div className="bg-white pt-5">
        {rows.map((row, index) => (
          <div
            key={index}
            className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-7 gap-2 md:gap-6 mb-8 mt-8"
          >
            {row.map((app) => (
              <div
                key={app.id}
                className="text-center bg-gray-50 md:p-2 rounded-lg shadow-sm hover:shadow-md transition"
              >
                <Link to={`/app/${app.id}`} className="cursor-pointer">
                  <img
                    src={app.image}
                    alt={app.name}
                    className="w-24 h-24 sm:w-36 sm:h-36 mx-auto rounded-t-2xl md:rounded-2xl shadow hover:scale-105 transition"
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

export default TopApps;
