import { Mic, Search } from "lucide-react";
import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router";
import axios from "axios";
import { debounce } from "lodash"; // npm install lodash

const SearchBar = () => {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const wrapperRef = useRef(null);
  const navigate = useNavigate();

  // Debounce API call – wait 300ms after last keystroke
  const fetchSuggestions = debounce(async (searchText) => {
    if (searchText.length < 2) {
      setSuggestions([]);
      return;
    }

    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/search?q=${encodeURIComponent(
          searchText
        )}`
      );
      setSuggestions(res.data);
    } catch (err) {
      console.error("Search failed", err);
      setSuggestions([]);
    }
  }, 300);

  useEffect(() => {
    fetchSuggestions(query);
  }, [query]);

  // Click outside → hide suggestions
  useEffect(() => {
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (app) => {
    setQuery(app.apkTitle);
    setShowSuggestions(false);
    navigate(`/search-app/${app.apk_Id}`);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && query.trim()) {
      // Optional: redirect to first suggestion or search results page
      if (suggestions.length > 0) {
        navigate(`${import.meta.env.VITE_API_URL}/api/apk/${suggestions[0].apk_Id}`);
      } else {
        // fallback – you can create /search?q=xxx page later
        navigate(`${import.meta.env.VITE_API_URL}/search?q=${encodeURIComponent(query)}`);
      }
      setShowSuggestions(false);
    }
  };

  return (
    <div ref={wrapperRef} className="relative w-full md:w-94 mx-2">
      <div className="hidden md:flex items-center bg-gray-100 rounded-full px-5 py-2">
        <Mic size={20} className="text-gray-500 mr-3 cursor-pointer" />
        <input
          type="text"
          placeholder="Search apps..."
          className="flex-1 bg-transparent outline-none text-base"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setShowSuggestions(true);
          }}
          onFocus={() => setShowSuggestions(true)}
          onKeyDown={handleKeyDown}
        />
        <Search size={22} className="text-gray-500 cursor-pointer ml-3" />
      </div>

      {/* Autocomplete dropdown */}
      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute z-50 w-full mt-1 bg-white rounded-lg shadow-lg border border-gray-200 max-h-80 overflow-auto">
          {suggestions.map((app) => (
            <div
              key={app.apk_Id}
              className="flex items-center px-4 py-3 hover:bg-gray-100 cursor-pointer"
              onClick={() => handleSelect(app)}
            >
              <img
                src={`${import.meta.env.VITE_API_URL}${app.apkLogo}`}
                alt={app.apkTitle}
                className="w-10 h-10 rounded-md object-cover mr-3"
                onError={(e) => (e.target.src = "/fallback-app-icon.png")}
              />
              <span className="text-gray-900 font-medium">{app.apkTitle}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
