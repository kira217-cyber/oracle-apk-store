import React from "react";
import { useNavigate } from "react-router";
import { FaStar } from "react-icons/fa";

const appData = [
  {
    id: 1,
    name: "App One",
    logo: "https://i.ibb.co.com/DDn0L7tp/logo-design-technology-company-vector-illustration-1253202-4950-ezgif-com-avif-to-jpg-converter.jpg",
    img1: "https://i.ibb.co.com/DDn0L7tp/logo-design-technology-company-vector-illustration-1253202-4950-ezgif-com-avif-to-jpg-converter.jpg",
    img2: "https://i.ibb.co.com/DDn0L7tp/logo-design-technology-company-vector-illustration-1253202-4950-ezgif-com-avif-to-jpg-converter.jpg",
    img3: "https://i.ibb.co.com/DDn0L7tp/logo-design-technology-company-vector-illustration-1253202-4950-ezgif-com-avif-to-jpg-converter.jpg",
    ratting: 4.5,
    author: "Tom Hardy",
  },
  {
    id: 2,
    name: "App Two",
    logo: "https://i.ibb.co.com/Q3FdLyN2/logo-design-technology-company-vector-illustration-1253202-6803-ezgif-com-avif-to-jpg-converter.jpg",
    img1: "https://i.ibb.co.com/Q3FdLyN2/logo-design-technology-company-vector-illustration-1253202-6803-ezgif-com-avif-to-jpg-converter.jpg",
    img2: "https://i.ibb.co.com/Q3FdLyN2/logo-design-technology-company-vector-illustration-1253202-6803-ezgif-com-avif-to-jpg-converter.jpg",
    img3: "https://i.ibb.co.com/Q3FdLyN2/logo-design-technology-company-vector-illustration-1253202-6803-ezgif-com-avif-to-jpg-converter.jpg",
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
                  className="w-18 h-18 cursor-pointer rounded-2xl object-cover "
                />

                <div
                  
                  className="flex-1"
                >
                  <h1 onClick={() => navigate(`/app/${app.id}`)} className="text-lg cursor-pointer font-semibold">{app.name}</h1>
                  <p onClick={() => navigate(`/app/${app.id}`)} className="text-gray-500 cursor-pointer text-sm">{app.author}</p>

                  <div className="flex items-center gap-1 mt-1">
                    <FaStar className="text-yellow-400" />
                    <span className="text-gray-700 font-medium">
                      {app.ratting}
                    </span>
                    <span className="text-gray-500 text-sm">(3.7k)</span>
                  </div>
                </div>

                {/* GET Button */}
                <button
                  onClick={() => navigate(`/app/${app.id}`)}
                  className="px-4 py-1 cursor-pointer bg-blue-600 text-white rounded-full font-semibold hover:bg-blue-700 text-sm transition"
                >
                  INSTALL
                </button>
              </div>

              {/* Images Section */}
              <div className="mt-5 grid grid-cols-3 gap-3">
                <img
                  src={app.img1}
                  className="w-full h-40 md:h-60 object-cover rounded-xl "
                  alt=""
                />
                <img
                  src={app.img2}
                  className="w-full h-40 md:h-60 object-cover rounded-xl "
                  alt=""
                />
                <img
                  src={app.img3}
                  className="w-full h-40 md:h-60 object-cover rounded-xl "
                  alt=""
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SingleApp;
