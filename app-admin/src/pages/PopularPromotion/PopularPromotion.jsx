import React, { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import Modal from "react-modal";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaTimes,
  FaThLarge,
  FaTable,
} from "react-icons/fa";
import { toast } from "react-toastify";

Modal.setAppElement("#root");

const fetchPopularPromotions = async () => {
  const { data } = await axios.get(
    `${import.meta.env.VITE_API_URL}/api/popular`
  );
  return data;
};

const createPopularPromotion = async (formData) => {
  const { data } = await axios.post(
    `${import.meta.env.VITE_API_URL}/api/popular`,
    formData,
    { headers: { "Content-Type": "multipart/form-data" } }
  );
  return data;
};

const updatePopularPromotion = async ({ id, formData }) => {
  const { data } = await axios.put(
    `${import.meta.env.VITE_API_URL}/api/popular/${id}`,
    formData,
    { headers: { "Content-Type": "multipart/form-data" } }
  );
  return data;
};

const deletePopularPromotion = async (id) => {
  await axios.delete(`${import.meta.env.VITE_API_URL}/api/popular/${id}`);
};

const PopularPromotion = () => {
  const queryClient = useQueryClient();
  const [viewMode, setViewMode] = useState("card");
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [deleteModalIsOpen, setDeleteModalIsOpen] = useState(false);
  const [promotionToDelete, setPromotionToDelete] = useState(null);
  const [isUpdate, setIsUpdate] = useState(false);
  const [currentPromotion, setCurrentPromotion] = useState(null);
  const [formData, setFormData] = useState({
    app_id: "",
    image: null,
  });
  const [previews, setPreviews] = useState({ image: "" });

  useEffect(() => {
    if (modalIsOpen || deleteModalIsOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => (document.body.style.overflow = "unset");
  }, [modalIsOpen, deleteModalIsOpen]);

  const {
    data: promotions = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["popular-promotions"],
    queryFn: fetchPopularPromotions,
  });

  const createMutation = useMutation({
    mutationFn: createPopularPromotion,
    onSuccess: () => {
      queryClient.invalidateQueries(["popular-promotions"]);
      toast.success("Popular Promotion created successfully! 🎉");
    },
    onError: () => toast.error("Failed to create popular promotion 😔"),
  });

  const updateMutation = useMutation({
    mutationFn: updatePopularPromotion,
    onSuccess: () => {
      queryClient.invalidateQueries(["popular-promotions"]);
      toast.success("Popular Promotion updated successfully! ✨");
    },
    onError: () => toast.error("Failed to update popular promotion 😔"),
  });

  const deleteMutation = useMutation({
    mutationFn: deletePopularPromotion,
    onSuccess: () => {
      queryClient.invalidateQueries(["popular-promotions"]);
      toast.success("Popular Promotion deleted successfully! 🗑️");
    },
    onError: () => toast.error("Failed to delete popular promotion 😔"),
  });

  const openModal = (promotion = null) => {
    setIsUpdate(!!promotion);
    setCurrentPromotion(promotion);
    setFormData({
      app_id: promotion?.app_id || "",
      image: null,
    });
    setPreviews({
      image: promotion?.image
        ? `${import.meta.env.VITE_API_URL}${promotion.image}`
        : "",
    });
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setCurrentPromotion(null);
    setFormData({
      app_id: "",
      image: null,
    });
    setPreviews({ image: "" });
  };

  const openDeleteModal = (promotion) => {
    setPromotionToDelete(promotion);
    setDeleteModalIsOpen(true);
  };

  const closeDeleteModal = () => {
    setDeleteModalIsOpen(false);
    setPromotionToDelete(null);
  };

  const confirmDelete = () => {
    if (promotionToDelete) {
      deleteMutation.mutate(promotionToDelete._id);
      closeDeleteModal();
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    const file = files[0];
    if (file) {
      setFormData((prev) => ({ ...prev, [name]: file }));
      setPreviews((prev) => ({ ...prev, [name]: URL.createObjectURL(file) }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append("app_id", formData.app_id);
    if (formData.image instanceof File) data.append("image", formData.image);

    if (isUpdate) {
      updateMutation.mutate({ id: currentPromotion._id, formData: data });
    } else {
      createMutation.mutate(data);
    }
    closeModal();
  };

  if (isLoading)
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-2xl text-gray-400 animate-pulse">
          Loading popular promotions...
        </p>
      </div>
    );

  if (error)
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-2xl text-red-400">Error: {error.message}</p>
      </div>
    );

  const hasPromotions = promotions.length > 0;

  return (
    <div className="">
      <div className="">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent flex items-center mb-4 md:mb-0">
            Popular Promotion Management
          </h1>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => openModal()}
            className="flex items-center gap-3 bg-gradient-to-r from-[#1d4ed8] to-[#3b82f6] px-8 py-4 rounded-2xl font-bold shadow-2xl hover:shadow-blue-600/60 transition cursor-pointer"
          >
            <FaPlus className="text-xl" />
            Create New Popular Promotion
          </motion.button>
        </div>

        {/* View Toggle */}
        <div className="flex gap-4 mb-10">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setViewMode("card")}
            className={`flex items-center gap-3 px-6 py-3 rounded-2xl font-medium transition cursor-pointer ${
              viewMode === "card"
                ? "bg-gradient-to-r from-[#1d4ed8] to-[#3b82f6] shadow-xl"
                : "bg-white/5 backdrop-blur-sm hover:bg-white/10"
            }`}
          >
            <FaThLarge />
            Card View
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setViewMode("table")}
            className={`flex items-center gap-3 px-6 py-3 rounded-2xl font-medium transition cursor-pointer ${
              viewMode === "table"
                ? "bg-gradient-to-r from-[#1d4ed8] to-[#3b82f6] shadow-xl"
                : "bg-white/5 backdrop-blur-sm hover:bg-white/10"
            }`}
          >
            <FaTable />
            Table View
          </motion.button>
        </div>

        {/* Empty State */}
        {!hasPromotions ? (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-32"
          >
            <div className="text-9xl mb-8 text-gray-700">📭</div>
            <h2 className="text-4xl font-bold text-gray-300 mb-4">
              No popular promotions created yet
            </h2>
            <p className="text-xl text-gray-500 mb-10 max-w-md mx-auto">
              Start promoting your favorite apps with beautiful visuals!
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => openModal()}
              className="flex items-center gap-3 mx-auto bg-gradient-to-r from-[#1d4ed8] to-[#3b82f6] px-10 py-5 rounded-2xl text-lg font-bold shadow-2xl cursor-pointer"
            >
              <FaPlus />
              Create Your First Popular Promotion
            </motion.button>
          </motion.div>
        ) : viewMode === "card" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            <AnimatePresence>
              {promotions.map((promotion, idx) => (
                <motion.div
                  key={promotion._id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ delay: idx * 0.08 }}
                  whileHover={{ y: -12, scale: 1.03 }}
                  className="bg-white/5 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden border border-white/10 cursor-pointer"
                >
                  <div className="relative h-56">
                    {promotion.image ? (
                      <img
                        src={`${import.meta.env.VITE_API_URL}${
                          promotion.image
                        }`}
                        alt="Promotion"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-indigo-600 to-purple-700 flex items-center justify-center">
                        <span className="text-lg font-bold text-white">
                          No Image
                        </span>
                      </div>
                    )}

                    {/* Small circular app logo badge on bottom center */}
                    <div className="absolute -bottom-10 left-1/2 -translate-x-1/2">
                      {promotion.image ? (
                        <img
                          src={`${import.meta.env.VITE_API_URL}${
                            promotion.image
                          }`}
                          alt="App Logo"
                          className="w-20 h-20 object-cover rounded-full border-4 border-[#0f172a] shadow-2xl"
                        />
                      ) : (
                        <div className="w-20 h-20 bg-gray-800 rounded-full flex items-center justify-center text-white font-bold border-4 border-[#0f172a] shadow-2xl">
                          APP
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="pt-16 pb-8 px-6 text-center">
                    <h3 className="text-xl font-bold text-white mb-1 line-clamp-1">
                      {promotion.app_id}
                    </h3>

                    <div className="flex justify-center gap-4 mt-6">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => openModal(promotion)}
                        className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl font-semibold shadow-lg cursor-pointer"
                      >
                        <FaEdit className="text-sm" />
                        Edit
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => openDeleteModal(promotion)}
                        className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-red-600 to-pink-600 rounded-xl font-semibold shadow-lg cursor-pointer"
                      >
                        <FaTrash className="text-sm" />
                        Delete
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        ) : (
          /* Table View */
          <div className="overflow-x-auto rounded-3xl shadow-2xl border border-white/10 bg-white/5 backdrop-blur-xl">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="p-5 text-left text-gray-300 font-semibold">
                    Preview
                  </th>
                  <th className="p-5 text-left text-gray-300 font-semibold">
                    App ID
                  </th>
                  <th className="p-5 text-center text-gray-300 font-semibold">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {promotions.map((promotion) => (
                  <motion.tr
                    key={promotion._id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="border-t border-white/5 hover:bg-white/5 transition"
                  >
                    <td className="p-5">
                      <div className="relative w-32 h-20 rounded-xl overflow-hidden border border-white/20">
                        {promotion.image && (
                          <img
                            src={`${import.meta.env.VITE_API_URL}${
                              promotion.image
                            }`}
                            alt="Promotion"
                            className="w-full h-full object-cover"
                          />
                        )}
                        {promotion.image && (
                          <img
                            src={`${import.meta.env.VITE_API_URL}${
                              promotion.image
                            }`}
                            alt="Logo"
                            className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-10 h-10 rounded-full border-3 border-[#0f172a] shadow-lg"
                          />
                        )}
                      </div>
                    </td>
                    <td className="p-5 text-white font-medium">
                      {promotion.app_id}
                    </td>
                    <td className="p-5">
                      <div className="flex gap-3 justify-center">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => openModal(promotion)}
                          className="px-6 py-2.5 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl font-medium shadow-lg cursor-pointer"
                        >
                          Edit
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => openDeleteModal(promotion)}
                          className="px-6 py-2.5 bg-gradient-to-r from-red-600 to-pink-600 rounded-xl font-medium shadow-lg cursor-pointer"
                        >
                          Delete
                        </motion.button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Create / Update Modal */}
        <AnimatePresence>
          {modalIsOpen && (
            <Modal
              isOpen={modalIsOpen}
              onRequestClose={closeModal}
              className="outline-none"
              overlayClassName="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-gradient-to-br from-[#0f172a]/95 to-[#1e293b]/95 backdrop-blur-2xl rounded-3xl shadow-2xl max-w-lg w-full border border-blue-900/50 overflow-hidden"
              >
                <button
                  onClick={closeModal}
                  className="absolute top-4 right-4 text-gray-400 hover:text-white transition z-10 cursor-pointer"
                >
                  <FaTimes className="text-2xl" />
                </button>

                <div className="p-8">
                  <h2 className="text-3xl font-bold text-center text-white mb-8">
                    {isUpdate
                      ? "Update Popular Promotion"
                      : "Create New Popular Promotion"}
                  </h2>

                  {/* Preview - now matches card style */}
                  <div className="relative mb-12 h-64 rounded-2xl overflow-hidden border-2 border-dashed border-white/30">
                    {previews.image ? (
                      <img
                        src={previews.image}
                        alt="Promotion Preview"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-indigo-600 to-purple-700 flex items-center justify-center">
                        <span className="text-2xl text-white font-bold">
                          Upload Image Preview
                        </span>
                      </div>
                    )}

                    <div className="absolute -bottom-10 left-1/2 -translate-x-1/2">
                      {previews.image ? (
                        <img
                          src={previews.image}
                          alt="Logo Preview"
                          className="w-24 h-24 object-cover rounded-full border-6 border-[#0f172a] shadow-2xl"
                        />
                      ) : (
                        <div className="w-24 h-24 bg-gray-700 rounded-full flex items-center justify-center text-white text-2xl font-bold border-6 border-[#0f172a] shadow-2xl">
                          APP
                        </div>
                      )}
                    </div>
                  </div>

                  <form onSubmit={handleSubmit} className="mt-20 space-y-8">
                    <input
                      name="app_id"
                      value={formData.app_id}
                      onChange={handleInputChange}
                      placeholder="e.g. app-924304 (apk_Id)"
                      required
                      className="w-full text-2xl font-bold text-white bg-transparent text-center border-b-2 border-white/30 focus:border-blue-400 outline-none placeholder-gray-500 py-3 cursor-text"
                    />

                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-2">
                        Promotion Image (used as background & logo)
                      </label>
                      <input
                        type="file"
                        name="image"
                        onChange={handleFileChange}
                        accept="image/*"
                        className="w-full text-white text-sm file:mr-4 file:py-2.5 file:px-5 file:rounded-xl file:bg-gradient-to-r file:from-blue-600 file:to-cyan-600 file:text-white file:font-semibold file:border-0 cursor-pointer"
                      />
                    </div>

                    <div className="flex justify-center gap-6 mt-12">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        type="button"
                        onClick={closeModal}
                        className="px-10 py-3 bg-white/10 backdrop-blur-md rounded-2xl font-bold text-gray-300 hover:bg-white/20 transition cursor-pointer"
                      >
                        Cancel
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        type="submit"
                        disabled={
                          createMutation.isPending || updateMutation.isPending
                        }
                        className="px-12 py-3 bg-gradient-to-r from-[#1d4ed8] to-[#3b82f6] text-white rounded-2xl font-bold shadow-xl hover:shadow-blue-600/60 transition cursor-pointer disabled:opacity-70"
                      >
                        {createMutation.isPending || updateMutation.isPending
                          ? "Saving..."
                          : isUpdate
                          ? "Update Promotion"
                          : "Create Promotion"}
                      </motion.button>
                    </div>
                  </form>
                </div>
              </motion.div>
            </Modal>
          )}
        </AnimatePresence>

        {/* Delete Confirmation Modal */}
        <AnimatePresence>
          {deleteModalIsOpen && (
            <Modal
              isOpen={deleteModalIsOpen}
              onRequestClose={closeDeleteModal}
              className="outline-none"
              overlayClassName="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="bg-gradient-to-br from-[#1e1b2e] to-[#2d1b3d] rounded-3xl shadow-2xl p-10 max-w-md w-full border border-red-900/50 text-center"
              >
                <FaTrash className="text-6xl text-red-500 mx-auto mb-6" />
                <h3 className="text-2xl font-bold text-white mb-4">
                  Delete Popular Promotion?
                </h3>
                <p className="text-gray-300 mb-8">
                  Are you sure you want to delete "
                  <strong>{promotionToDelete?.app_id}</strong>"? This action
                  cannot be undone.
                </p>
                <div className="flex justify-center gap-6">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={closeDeleteModal}
                    className="px-8 py-3 bg-white/10 backdrop-blur-md rounded-2xl font-bold text-gray-300 hover:bg-white/20 transition cursor-pointer"
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={confirmDelete}
                    disabled={deleteMutation.isPending}
                    className="px-8 py-3 bg-gradient-to-r from-red-600 to-pink-600 text-white rounded-2xl font-bold shadow-xl hover:shadow-red-600/60 transition cursor-pointer disabled:opacity-70"
                  >
                    {deleteMutation.isPending ? "Deleting..." : "Yes, Delete"}
                  </motion.button>
                </div>
              </motion.div>
            </Modal>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default PopularPromotion;
