import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router";
import { Search as SearchIcon, LayoutGrid, ListFilter } from "lucide-react";

const Search = () => {
  const navigate = useNavigate();

  const appData = [
    {
      id: 1,
      title: "Emily and the Backbone",
      author: "Christophel H.",
      bgColor: "bg-emerald-600",
      badge: "Sale",
      left: 12,
      price: 76.1,
      old: 87.7,
      rating: 4.3,
    },
    {
      id: 2,
      title: "HOMIE",
      author: "Jamed Gruns",
      bgColor: "bg-yellow-400",
      badge: "Hot",
      left: 4,
      price: 44.9,
      old: 60,
      rating: 4.6,
    },
    {
      id: 3,
      title: "Night Stories",
      author: "Alex Moon",
      bgColor: "bg-indigo-600",
      badge: "New",
      left: 9,
      price: 32.5,
      old: 45,
      rating: 4.8,
    },
    {
      id: 4,
      title: "Mindful Life",
      author: "Sarah Dean",
      bgColor: "bg-pink-500",
      badge: null,
      left: 6,
      price: 52,
      old: 65,
      rating: 4.1,
    },
    {
      id: 5,
      title: "Emily and the Backbone",
      author: "Christophel H.",
      bgColor: "bg-emerald-600",
      badge: "Sale",
      left: 12,
      price: 76.1,
      old: 87.7,
      rating: 4.3,
    },
    {
      id: 6,
      title: "HOMIE",
      author: "Jamed Gruns",
      bgColor: "bg-yellow-400",
      badge: "Hot",
      left: 4,
      price: 44.9,
      old: 60,
      rating: 4.6,
    },
    {
      id: 7,
      title: "Night Stories",
      author: "Alex Moon",
      bgColor: "bg-indigo-600",
      badge: "New",
      left: 9,
      price: 32.5,
      old: 45,
      rating: 4.8,
    },
    {
      id: 8,
      title: "Mindful Life",
      author: "Sarah Dean",
      bgColor: "bg-pink-500",
      badge: null,
      left: 6,
      price: 52,
      old: 65,
      rating: 4.1,
    },
  ];

  const [search, setSearch] = useState("");
  const [view, setView] = useState("card");
  const [sort, setSort] = useState("A-Z");

  const filteredData = useMemo(() => {
    let result = appData.filter((item) =>
      item.title.toLowerCase().includes(search.toLowerCase())
    );

    if (sort === "A-Z") result.sort((a, b) => a.title.localeCompare(b.title));
    else result.sort((a, b) => b.title.localeCompare(a.title));

    return result;
  }, [search, sort]);

  const handleNavigate = (id) => navigate(`/app/${id}`);

  return (
    <div className="p-4 block md:hidden">
      {/* Search */}
      <div className="flex items-center gap-2 bg-gray-100 rounded-xl px-3 py-2">
        <SearchIcon className="text-gray-500" size={20} />
        <input
          type="text"
          placeholder="Search App..."
          className="bg-transparent outline-none w-full text-sm "
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button
          onClick={() => setSort(sort === "A-Z" ? "Z-A" : "A-Z")}
          className="text-blue-600 font-semibold text-xs whitespace-nowrap"
        >
          {sort}
        </button>
      </div>

      {/* header */}
      <div className="flex justify-end items-center mt-4">
        <div className="flex items-center gap-3">
          <LayoutGrid
            size={22}
            className={`${view === "card" ? "text-blue-600" : "text-gray-500"}`}
            onClick={() => setView("card")}
          />
          <ListFilter
            size={22}
            className={`${
              view === "table" ? "text-blue-600" : "text-gray-500"
            }`}
            onClick={() => setView("table")}
          />
        </div>
      </div>

      {/* ---------------- CARD VIEW ---------------- */}
      {view === "card" && (
        <div className="grid grid-cols-2 gap-3 mt-4">
          {filteredData.map((app) => (
            <div
              key={app.id}
              onClick={() => handleNavigate(app.id)}
              className="rounded-xl shadow-md p-2 cursor-pointer bg-white active:scale-[.97] transition duration-200"
            >
              {/* Thumbnail */}
              <div
                className={`h-40 rounded-xl ${app.bgColor} flex items-center justify-center text-white text-[11px] font-semibold relative`}
              >
                {app.title}

                {app.badge && (
                  <span className="absolute top-2 left-2 bg-blue-600 text-white text-[10px] px-2 py-[2px] rounded-md">
                    {app.badge}
                  </span>
                )}
              </div>

              {/* Text */}
              <h3 className="font-bold text-sm mt-2">{app.title}</h3>
              <p className="text-xs text-gray-500">{app.author}</p>

              <div className="flex justify-between items-center mt-1">
                <p className="text-green-600 text-xs font-semibold">
                  Left: {app.left}
                </p>

                <span className="text-yellow-500 text-xs">⭐ {app.rating}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ---------------- TABLE VIEW ---------------- */}
      {view === "table" && (
        <div className="mt-4 space-y-3">
          {filteredData.map((app) => (
            <div
              key={app.id}
              className="bg-white rounded-xl shadow-md p-3 flex items-center gap-3 active:scale-[.98] transition cursor-pointer"
              onClick={() => handleNavigate(app.id)}
            >
              <div
                className={`w-16 h-20 rounded-lg ${app.bgColor} flex items-center justify-center text-[10px] text-white font-semibold`}
              >
                {app.title.slice(0, 8)}..
              </div>

              <div className="flex-1">
                <p className="font-semibold text-sm">{app.title}</p>
                <p className="text-xs text-gray-500">{app.author}</p>

                <div className="flex items-center gap-2 mt-1">
                  {app.badge && (
                    <span className="text-[10px] bg-blue-600 text-white px-2 py-[2px] rounded-lg">
                      {app.badge}
                    </span>
                  )}

                  <span className="text-yellow-500 text-xs">
                    ⭐ {app.rating}
                  </span>
                </div>
              </div>

              <div className="text-right">
                <p className="text-blue-600 font-bold text-sm">${app.price}</p>
                <p className="text-gray-400 line-through text-xs">${app.old}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Search;
