// src/components/Categories.jsx
import React from "react";
import { useNavigate } from "react-router";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { toast } from "react-toastify";

const fetchCategories = async () => {
  const response = await axios.get(
    `${import.meta.env.VITE_API_URL}/api/categories`
  );
  return response.data;
};

const Categories = () => {
  const navigate = useNavigate(); // Hook for navigation

  const {
    data: categories = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["categories"],
    queryFn: fetchCategories,
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
  });

  const handleCategoryClick = (path) => {
    toast.info(`Navigating to ${path} category coming soon!`);
    // navigate(path); // Navigate to the category's path (e.g., /games)
  };

  if (isLoading) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">Loading categories...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center py-8">
        <p className="text-red-500">Error loading categories</p>
      </div>
    );
  }

  if (categories.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No categories available</p>
      </div>
    );
  }

  return (
    <div>
      {/* Desktop Categories (Image + Name) */}
      <div className="hidden md:flex flex-wrap gap-4 justify-start mb-6">
        {categories.map((cat) => (
          <button
            key={cat._id}
            onClick={() => handleCategoryClick(cat.path)}
            className="flex items-center gap-3 bg-gray-100 hover:bg-gray-200 transition px-4 py-2 rounded-full shadow-sm cursor-pointer"
          >
            <img
              src={`${import.meta.env.VITE_API_URL}${cat.image}`}
              alt={cat.name}
              className="w-8 h-8 rounded-full object-cover"
            />
            <span className="font-semibold text-sm">{cat.name}</span>
          </button>
        ))}
      </div>

      {/* Mobile Swiper Categories (Image + Name) */}
      <div className="md:hidden mb-6">
        <Swiper spaceBetween={15} slidesPerView={3.4} grabCursor>
          {categories.map((cat) => (
            <SwiperSlide key={cat._id}>
              <div
                onClick={() => handleCategoryClick(cat.path)}
                className="flex flex-col items-center cursor-pointer"
              >
                <img
                  src={`${import.meta.env.VITE_API_URL}${cat.image}`}
                  alt={cat.name}
                  className="w-16 h-16 rounded-full object-cover shadow-md"
                />
                <span className="text-xs font-semibold mt-1 text-center">
                  {cat.name}
                </span>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
};

export default Categories;
