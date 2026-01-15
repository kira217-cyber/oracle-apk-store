import React, { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router";
import { Search as SearchIcon, LayoutGrid, ListFilter } from "lucide-react";

const Search = () => {
  const navigate = useNavigate();

  const [apks, setApks] = useState([]);
  const [search, setSearch] = useState("");
  const [view, setView] = useState("card");
  const [sort, setSort] = useState("A-Z");

  // Fake data generators
  const getRandomRating = () => (Math.random() * 1.5 + 3.5).toFixed(1); // 3.5 to 5.0
  const getRandomLeft = () => Math.floor(Math.random() * 20) + 1; // 1 to 20
  const getRandomPrice = () => (Math.random() * 80 + 10).toFixed(1); // $10 to $90
  const getRandomBadge = () => {
    const badges = ["New", "Hot", "Sale", "Trending", null];
    return badges[Math.floor(Math.random() * badges.length)];
  };

  const truncateLetters = (text = "", limit = 7) => {
    if (!text) return "";
    return text.length > limit ? text.slice(0, limit) + "..." : text;
  };

  useEffect(() => {
    const fetchApks = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/all-apks`);
        const data = await res.json();

        // Enrich data with fake values (only once when fetching)
        const enriched = data.map((app) => ({
          ...app,
          rating: getRandomRating(),
          left: getRandomLeft(),
          price: getRandomPrice(),
          old: (parseFloat(getRandomPrice()) * 1.3).toFixed(1), // old price ~30% higher
          badge: getRandomBadge(),
        }));

        setApks(enriched);
      } catch (error) {
        console.error("Failed to fetch APKs:", error);
      }
    };

    fetchApks();
  }, []);

  const filteredData = useMemo(() => {
    let result = apks.filter((item) =>
      item.apkTitle.toLowerCase().includes(search.toLowerCase())
    );

    if (sort === "A-Z") {
      result = [...result].sort((a, b) => a.apkTitle.localeCompare(b.apkTitle));
    } else {
      result = [...result].sort((a, b) => b.apkTitle.localeCompare(a.apkTitle));
    }

    return result;
  }, [search, sort, apks]);

  const handleNavigate = (id) => navigate(`/app-details/${id}`);

  return (
    <div className="p-4 block md:hidden">
      {/* Search + Sort */}
      <div className="flex items-center gap-2 bg-gray-100 rounded-xl px-3 py-2">
        <SearchIcon className="text-gray-500" size={20} />
        <input
          type="text"
          placeholder="Search App..."
          className="bg-transparent outline-none w-full text-sm"
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

      {/* View Toggle */}
      <div className="flex justify-end items-center mt-4">
        <div className="flex items-center gap-3">
          <LayoutGrid
            size={22}
            className={`${
              view === "card" ? "text-blue-600" : "text-gray-500"
            } cursor-pointer`}
            onClick={() => setView("card")}
          />
          <ListFilter
            size={22}
            className={`${
              view === "table" ? "text-blue-600" : "text-gray-500"
            } cursor-pointer`}
            onClick={() => setView("table")}
          />
        </div>
      </div>

      {/* CARD VIEW */}
      {view === "card" && (
        <div className="grid grid-cols-2 gap-3 mt-4">
          {filteredData.map((app) => (
            <div
              key={app._id}
              onClick={() => handleNavigate(app.apk_Id)}
              className="rounded-xl shadow-md p-2 cursor-pointer bg-white active:scale-[0.97] transition duration-200"
            >
              {/* Thumbnail */}
              <div className="relative">
                <img
                  src={`${import.meta.env.VITE_API_URL}${app.apkLogo}`}
                  alt={app.apkTitle}
                  className="h-40 w-full rounded-xl object-cover"
                />
                {app.badge && (
                  <span className="absolute top-2 left-2 bg-blue-600 text-white text-[10px] px-2 py-0.5 rounded-md font-medium">
                    {app.badge}
                  </span>
                )}
              </div>

              {/* Info */}
              <h3 className="font-bold text-sm mt-2 line-clamp-1">
                {app.apkTitle}
              </h3>
              <p className="text-xs text-gray-500">
                {truncateLetters(app.user?.email, 12) || "Unknown"}
              </p>

              <div className="flex justify-between items-center mt-1 text-xs">
                <p className="text-green-600 font-semibold">Left: {app.left}</p>
                <span className="text-yellow-500">⭐ {app.rating}</span>
              </div>

              <div className="flex items-center gap-2 mt-1">
                <span className="text-blue-600 font-bold text-sm">
                  ${app.price}
                </span>
                {app.old && (
                  <span className="text-gray-400 line-through text-xs">
                    ${app.old}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TABLE VIEW */}
      {view === "table" && (
        <div className="mt-4 space-y-3">
          {filteredData.map((app) => (
            <div
              key={app._id}
              onClick={() => handleNavigate(app.apk_Id)}
              className="bg-white rounded-xl shadow-md p-3 flex items-center gap-3 active:scale-[0.98] transition cursor-pointer"
            >
              <div className="relative">
                <img
                  src={`${import.meta.env.VITE_API_URL}${app.apkLogo}`}
                  alt={app.apkTitle}
                  className="w-16 h-20 rounded-lg object-cover"
                />
                {app.badge && (
                  <span className="absolute top-1 left-1 bg-blue-600 text-white text-[9px] px-1.5 py-0.5 rounded font-medium">
                    {app.badge}
                  </span>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm truncate">{app.apkTitle}</p>
                <p className="text-xs text-gray-500 truncate">
                  {truncateLetters(app.user?.email, 12) || "Unknown"}
                </p>

                <div className="flex items-center gap-2 mt-1">
                  <span className="text-yellow-500 text-xs">
                    ⭐ {app.rating}
                  </span>
                  <span className="text-green-600 text-xs">
                    Left: {app.left}
                  </span>
                </div>
              </div>

              <div className="text-right">
                <p className="text-blue-600 font-bold text-sm">${app.price}</p>
                {app.old && (
                  <p className="text-gray-400 line-through text-xs">
                    ${app.old}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {filteredData.length === 0 && (
        <p className="text-center text-gray-500 mt-10">No apps found</p>
      )}
    </div>
  );
};

export default Search;
