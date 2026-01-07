// src/pages/admin/AddCategory.jsx
import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaTable,
  FaThLarge,
  FaTimes,
} from "react-icons/fa";

const API_BASE = `${import.meta.env.VITE_API_URL}/api/categories`;
const BASE_URL = import.meta.env.VITE_API_URL;

// API Functions
const fetchCategories = async () => {
  const { data } = await axios.get(API_BASE);
  return data;
};

const createCategory = async (formData) => {
  const data = new FormData();
  data.append("name", formData.name);
  data.append("path", formData.path);
  if (formData.image?.[0]) data.append("image", formData.image[0]);
  await axios.post(API_BASE, data);
};

const updateCategory = async ({ id, formData }) => {
  const data = new FormData();
  data.append("name", formData.name);
  data.append("path", formData.path);
  if (formData.image?.[0]) data.append("image", formData.image[0]);
  await axios.put(`${API_BASE}/${id}`, data);
};

const deleteCategory = async (id) => {
  await axios.delete(`${API_BASE}/${id}`);
};

const AddCategory = () => {
  const [viewMode, setViewMode] = useState("card");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);

  // Image preview states
  const [createPreview, setCreatePreview] = useState(null);
  const [updatePreview, setUpdatePreview] = useState(null);

  const queryClient = useQueryClient();

  const {
    data: categories = [],
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["categories"],
    queryFn: fetchCategories,
    placeholderData: [],
  });

  const createMutation = useMutation({
    mutationFn: createCategory,
    onSuccess: () => {
      queryClient.invalidateQueries(["categories"]);
      setShowCreateModal(false);
      resetCreateForm();
      setCreatePreview(null);
      toast.success("Category created successfully!");
    },
    onError: () => toast.error("Failed to create category."),
  });

  const updateMutation = useMutation({
    mutationFn: updateCategory,
    onSuccess: () => {
      queryClient.invalidateQueries(["categories"]);
      setShowUpdateModal(false);
      resetUpdateForm();
      setUpdatePreview(null);
      toast.success("Category updated successfully!");
    },
    onError: () => toast.error("Failed to update category."),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteCategory,
    onSuccess: () => {
      queryClient.invalidateQueries(["categories"]);
      setShowDeleteModal(false);
      toast.success("Category deleted successfully!");
    },
    onError: () => toast.error("Failed to delete category."),
  });

  // Forms
  const {
    register: registerCreate,
    handleSubmit: handleCreateSubmit,
    reset: resetCreateForm,
    setValue: setCreateValue,
    formState: { errors: createErrors },
  } = useForm();

  const {
    register: registerUpdate,
    handleSubmit: handleUpdateSubmit,
    reset: resetUpdateForm,
    setValue: setUpdateValue,
    formState: { errors: updateErrors },
  } = useForm();

  const openUpdateModal = (cat) => {
    setSelectedCategory(cat);
    setUpdateValue("name", cat.name);
    setUpdateValue("path", cat.path);
    setUpdatePreview(`${BASE_URL}${cat.image}`);
    setShowUpdateModal(true);
  };

  const openDeleteModal = (cat) => {
    setSelectedCategory(cat);
    setShowDeleteModal(true);
  };

  const onCreateSubmit = (data) => createMutation.mutate(data);
  const onUpdateSubmit = (data) =>
    updateMutation.mutate({ id: selectedCategory._id, formData: data });
  const onDeleteConfirm = () => deleteMutation.mutate(selectedCategory._id);

  // Handle image preview and removal
  const handleCreateImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCreatePreview(URL.createObjectURL(file));
      setCreateValue("image", e.target.files);
    }
  };

  const handleUpdateImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setUpdatePreview(URL.createObjectURL(file));
      setUpdateValue("image", e.target.files);
    }
  };

  const removeCreateImage = () => {
    setCreatePreview(null);
    setCreateValue("image", null);
  };

  const removeUpdateImage = () => {
    setUpdatePreview(`${BASE_URL}${selectedCategory.image}`);
    setUpdateValue("image", null);
  };

  const hasCategories = categories.length > 0;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[70vh]">
        <p className="text-2xl text-blue-400 font-bold animate-pulse">
          Loading categories...
        </p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] gap-6">
        <p className="text-2xl text-red-500 font-bold">
          Failed to load categories
        </p>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => refetch()}
          className="px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-800 rounded-xl text-white font-bold shadow-xl hover:shadow-blue-600/50 transition cursor-pointer"
        >
          Retry
        </motion.button>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Header Section */}
      <div className="mb-10">
        <h1 className="text-4xl font-extrabold bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent mb-4">
          Manage Categories
        </h1>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-3 bg-gradient-to-r from-[#1d4ed8] to-[#3b82f6] px-8 py-4 rounded-xl font-bold text-white shadow-xl hover:shadow-blue-600/50 transition cursor-pointer"
          >
            <FaPlus className="text-xl" />
            Create New Category
          </motion.button>

          <div className="flex gap-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setViewMode("table")}
              className={`flex items-center gap-3 px-6 py-3 rounded-xl font-semibold transition cursor-pointer ${
                viewMode === "table"
                  ? "bg-gradient-to-r from-blue-600 to-blue-800 text-white shadow-lg"
                  : "bg-white/5 backdrop-blur-md text-gray-400 border border-blue-900/30"
              }`}
            >
              <FaTable />
              Table
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setViewMode("card")}
              className={`flex items-center gap-3 px-6 py-3 rounded-xl font-semibold transition cursor-pointer ${
                viewMode === "card"
                  ? "bg-gradient-to-r from-blue-600 to-blue-800 text-white shadow-lg"
                  : "bg-white/5 backdrop-blur-md text-gray-400 border border-blue-900/30"
              }`}
            >
              <FaThLarge />
              Cards
            </motion.button>
          </div>
        </div>
      </div>

      {/* Empty State */}
      {!hasCategories ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-20"
        >
          <div className="text-6xl text-gray-600 mb-6">📂</div>
          <h2 className="text-3xl font-bold text-gray-400 mb-4">
            No Categories Yet
          </h2>
          <p className="text-xl text-gray-500">
            Create your first category to get started!
          </p>
        </motion.div>
      ) : viewMode === "table" ? (
        <div className="bg-white/5 backdrop-blur-xl rounded-3xl shadow-2xl border border-blue-900/40 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gradient-to-r from-blue-900/50 to-blue-800/30">
                  <th className="px-8 py-6 text-left font-bold text-blue-300">
                    Name
                  </th>
                  <th className="px-8 py-6 text-left font-bold text-blue-300">
                    Path
                  </th>
                  <th className="px-8 py-6 text-left font-bold text-blue-300">
                    Image
                  </th>
                  <th className="px-8 py-6 text-left font-bold text-blue-300">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {categories.map((cat, index) => (
                  <motion.tr
                    key={cat._id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="border-t border-blue-900/20 hover:bg-white/5 transition cursor-default"
                  >
                    <td className="px-8 py-6 font-medium">{cat.name}</td>
                    <td className="px-8 py-6 font-mono text-sm text-blue-400">
                      {cat.path}
                    </td>
                    <td className="px-8 py-6">
                      <img
                        src={`${BASE_URL}${cat.image}`}
                        alt={cat.name}
                        className="w-20 h-20 object-cover rounded-xl shadow-lg border border-blue-800/50"
                      />
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex gap-3">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => openUpdateModal(cat)}
                          className="bg-gradient-to-r from-yellow-600 to-amber-600 px-5 py-3 rounded-xl text-white font-semibold shadow-lg cursor-pointer"
                        >
                          <FaEdit />
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => openDeleteModal(cat)}
                          className="bg-gradient-to-r from-red-600 to-pink-600 px-5 py-3 rounded-xl text-white font-semibold shadow-lg cursor-pointer"
                        >
                          <FaTrash />
                        </motion.button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {categories.map((cat, index) => (
            <motion.div
              key={cat._id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white/5 backdrop-blur-xl rounded-3xl shadow-2xl border border-blue-900/40 overflow-hidden hover:shadow-blue-600/30 hover:scale-105 transition-all duration-300 cursor-pointer"
            >
              <div className="h-56 overflow-hidden">
                <img
                  src={`${BASE_URL}${cat.image}`}
                  alt={cat.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-8">
                <h3 className="text-2xl font-bold text-white mb-3">
                  {cat.name}
                </h3>
                <p className="text-blue-400 font-mono text-sm mb-8">
                  {cat.path}
                </p>
                <div className="flex gap-4">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => openUpdateModal(cat)}
                    className="flex-1 bg-gradient-to-r from-yellow-600 to-amber-600 py-4 rounded-xl text-white font-bold shadow-lg cursor-pointer"
                  >
                    Update
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => openDeleteModal(cat)}
                    className="flex-1 bg-gradient-to-r from-red-600 to-pink-600 py-4 rounded-xl text-white font-bold shadow-lg cursor-pointer"
                  >
                    Delete
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Create Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 cursor-default">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-gradient-to-br from-[#0f172a] to-[#1e293b] p-10 rounded-3xl shadow-2xl border border-blue-900/60 w-full max-w-lg relative"
          >
            <h2 className="text-3xl font-bold text-white mb-8 text-center">
              Create Category
            </h2>
            <form
              onSubmit={handleCreateSubmit(onCreateSubmit)}
              className="space-y-6"
            >
              <input
                {...registerCreate("name", { required: "Name is required" })}
                type="text"
                placeholder="Category Name"
                className="w-full px-6 py-4 bg-white/10 backdrop-blur-md border border-blue-800/50 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/30"
              />
              {createErrors.name && (
                <p className="text-red-400 text-sm">
                  {createErrors.name.message}
                </p>
              )}

              <input
                {...registerCreate("path", { required: "Path is required" })}
                type="text"
                placeholder="Path (e.g., /games)"
                className="w-full px-6 py-4 bg-white/10 backdrop-blur-md border border-blue-800/50 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/30"
              />
              {createErrors.path && (
                <p className="text-red-400 text-sm">
                  {createErrors.path.message}
                </p>
              )}

              <div className="relative">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleCreateImageChange}
                  className="w-full px-6 py-4 bg-white/10 backdrop-blur-md border border-blue-800/50 rounded-xl text-gray-300 file:bg-blue-600 file:text-white file:px-6 file:py-2 file:rounded-lg file:border-0 cursor-pointer"
                />
                {createPreview && (
                  <div className="mt-4 relative inline-block">
                    <img
                      src={createPreview}
                      alt="Preview"
                      className="w-32 h-32 object-cover rounded-xl shadow-lg"
                    />
                    <button
                      type="button"
                      onClick={removeCreateImage}
                      className="absolute top-0 right-0 bg-red-600 text-white p-2 rounded-full shadow-lg hover:bg-red-700 transition cursor-pointer"
                    >
                      <FaTimes />
                    </button>
                  </div>
                )}
              </div>
              {createErrors.image && (
                <p className="text-red-400 text-sm">
                  {createErrors.image.message}
                </p>
              )}

              <div className="flex justify-end gap-4 mt-8">
                <button
                  type="button"
                  onClick={() => {
                    setShowCreateModal(false);
                    resetCreateForm();
                    setCreatePreview(null);
                  }}
                  className="px-8 py-4 bg-gray-700/70 text-white rounded-xl hover:bg-gray-600 transition cursor-pointer"
                >
                  Cancel
                </button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  type="submit"
                  disabled={createMutation.isPending}
                  className="px-8 py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl font-bold shadow-xl disabled:opacity-70 cursor-pointer"
                >
                  {createMutation.isPending ? "Creating..." : "Create Category"}
                </motion.button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* Update Modal */}
      {showUpdateModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 cursor-default">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-gradient-to-br from-[#0f172a] to-[#1e293b] p-10 rounded-3xl shadow-2xl border border-blue-900/60 w-full max-w-lg relative"
          >
            <h2 className="text-3xl font-bold text-white mb-8 text-center">
              Update Category
            </h2>
            <form
              onSubmit={handleUpdateSubmit(onUpdateSubmit)}
              className="space-y-6"
            >
              <input
                {...registerUpdate("name", { required: "Name is required" })}
                type="text"
                placeholder="Category Name"
                className="w-full px-6 py-4 bg-white/10 backdrop-blur-md border border-blue-800/50 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/30"
              />
              {updateErrors.name && (
                <p className="text-red-400 text-sm">
                  {updateErrors.name.message}
                </p>
              )}

              <input
                {...registerUpdate("path", { required: "Path is required" })}
                type="text"
                placeholder="Path (e.g., /games)"
                className="w-full px-6 py-4 bg-white/10 backdrop-blur-md border border-blue-800/50 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/30"
              />
              {updateErrors.path && (
                <p className="text-red-400 text-sm">
                  {updateErrors.path.message}
                </p>
              )}

              <div className="relative">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleUpdateImageChange}
                  className="w-full px-6 py-4 bg-white/10 backdrop-blur-md border border-blue-800/50 rounded-xl text-gray-300 file:bg-blue-600 file:text-white file:px-6 file:py-2 file:rounded-lg file:border-0 cursor-pointer"
                />
                {updatePreview && (
                  <div className="mt-4 relative inline-block">
                    <img
                      src={updatePreview}
                      alt="Preview"
                      className="w-32 h-32 object-cover rounded-xl shadow-lg"
                    />
                    <button
                      type="button"
                      onClick={removeUpdateImage}
                      className="absolute top-0 right-0 bg-red-600 text-white p-2 rounded-full shadow-lg hover:bg-red-700 transition cursor-pointer"
                    >
                      <FaTimes />
                    </button>
                  </div>
                )}
              </div>
              <p className="text-gray-400 text-sm">
                Leave empty to keep current image
              </p>

              <div className="flex justify-end gap-4 mt-8">
                <button
                  type="button"
                  onClick={() => {
                    setShowUpdateModal(false);
                    setUpdatePreview(null);
                  }}
                  className="px-8 py-4 bg-gray-700/70 text-white rounded-xl hover:bg-gray-600 transition cursor-pointer"
                >
                  Cancel
                </button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  type="submit"
                  disabled={updateMutation.isPending}
                  className="px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-800 text-white rounded-xl font-bold shadow-xl disabled:opacity-70 cursor-pointer"
                >
                  {updateMutation.isPending ? "Updating..." : "Update Category"}
                </motion.button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* Delete Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 cursor-default">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-gradient-to-br from-[#0f172a] to-[#1e293b] p-10 rounded-3xl shadow-2xl border border-red-900/60 max-w-md text-center"
          >
            <h2 className="text-3xl font-bold text-white mb-6">
              Confirm Delete
            </h2>
            <p className="text-xl text-gray-300 mb-10">
              Are you sure you want to delete{" "}
              <span className="text-red-400 font-bold">
                {selectedCategory?.name}
              </span>
              ?
            </p>
            <div className="flex justify-center gap-6">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-8 py-4 bg-gray-700/70 text-white rounded-xl hover:bg-gray-600 transition cursor-pointer"
              >
                Cancel
              </button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onDeleteConfirm}
                disabled={deleteMutation.isPending}
                className="px-8 py-4 bg-gradient-to-r from-red-600 to-pink-600 text-white rounded-xl font-bold shadow-xl disabled:opacity-70 cursor-pointer"
              >
                {deleteMutation.isPending ? "Deleting..." : "Yes, Delete"}
              </motion.button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default AddCategory;
