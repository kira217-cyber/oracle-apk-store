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

const fetchAdsPromotions = async () => {
  const { data } = await axios.get(
    `${import.meta.env.VITE_API_URL}/api/ads-promotion-two`
  );
  return data;
};

const createAdsPromotion = async (formData) => {
  const { data } = await axios.post(
    `${import.meta.env.VITE_API_URL}/api/ads-promotion-two`,
    formData,
    { headers: { "Content-Type": "multipart/form-data" } }
  );
  return data;
};

const updateAdsPromotion = async ({ id, formData }) => {
  const { data } = await axios.put(
    `${import.meta.env.VITE_API_URL}/api/ads-promotion-two/${id}`,
    formData,
    { headers: { "Content-Type": "multipart/form-data" } }
  );
  return data;
};

const deleteAdsPromotion = async (id) => {
  await axios.delete(
    `${import.meta.env.VITE_API_URL}/api/ads-promotion-two/${id}`
  );
};

const AdsPromotionTwoController = () => {
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
    queryKey: ["ads-promotion-two"],
    queryFn: fetchAdsPromotions,
  });

  const createMutation = useMutation({
    mutationFn: createAdsPromotion,
    onSuccess: () => {
      queryClient.invalidateQueries(["ads-promotion-two"]);
      toast.success("Ads Promotion Two created successfully! 🎉");
    },
    onError: () => toast.error("Failed to create ads promotion 😔"),
  });

  const updateMutation = useMutation({
    mutationFn: updateAdsPromotion,
    onSuccess: () => {
      queryClient.invalidateQueries(["ads-promotion-two"]);
      toast.success("Ads Promotion Two updated successfully! ✨");
    },
    onError: () => toast.error("Failed to update ads promotion 😔"),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteAdsPromotion,
    onSuccess: () => {
      queryClient.invalidateQueries(["ads-promotion-two"]);
      toast.success("Ads Promotion Two deleted successfully! 🗑️");
    },
    onError: () => toast.error("Failed to delete ads promotion 😔"),
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
    setFormData({ app_id: "", image: null });
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

  if (isLoading) return <div className="text-center py-10">Loading...</div>;
  if (error)
    return (
      <div className="text-center py-10 text-red-500">
        Error loading promotions
      </div>
    );

  const hasPromotions = promotions.length > 0;

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-12">
        <h1 className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
          Ads Promotion Two Management
        </h1>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => openModal()}
          className="mt-4 sm:mt-0 flex items-center gap-3 bg-gradient-to-r from-purple-600 to-pink-600 px-8 py-4 rounded-2xl font-bold text-white shadow-xl hover:shadow-purple-600/50 transition"
        >
          <FaPlus /> Create New Ads Promotion
        </motion.button>
      </div>

      {/* View Toggle */}
      <div className="flex gap-4 mb-10">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setViewMode("card")}
          className={`px-6 py-3 rounded-xl cursor-pointer font-medium ${
            viewMode === "card" ? "bg-purple-600 text-white" : "bg-gray-800/50"
          }`}
        >
          <FaThLarge className="inline mr-2" /> Card View
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setViewMode("table")}
          className={`px-6 py-3 rounded-xl font-medium cursor-pointer ${
            viewMode === "table" ? "bg-purple-600 text-white" : "bg-gray-800/50"
          }`}
        >
          <FaTable className="inline mr-2" /> Table View
        </motion.button>
      </div>

      {!hasPromotions ? (
        <div className="text-center py-20">
          <div className="text-8xl mb-6">📭</div>
          <h2 className="text-3xl font-bold mb-4">No Ads Promotions Yet</h2>
          <p className="text-gray-400 mb-8">
            Create your first promotion to showcase apps!
          </p>
          <button
            onClick={() => openModal()}
            className="bg-gradient-to-r from-purple-600 to-pink-600 px-10 py-4 rounded-2xl text-white font-bold"
          >
            <FaPlus className="inline mr-2" /> Create First Promotion
          </button>
        </div>
      ) : viewMode === "card" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {promotions.map((promotion) => (
            <div
              key={promotion._id}
              className="bg-gray-900/60 backdrop-blur-md rounded-2xl overflow-hidden border border-purple-500/30 shadow-xl hover:shadow-purple-500/40 transition"
            >
              <div className="relative h-48">
                <img
                  src={`${import.meta.env.VITE_API_URL}${promotion.image}`}
                  alt="Promotion"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-6 text-center">
                <h3 className="text-xl font-bold text-white mb-4">
                  {promotion.app_id}
                </h3>
                <div className="flex justify-center gap-4">
                  <button
                    onClick={() => openModal(promotion)}
                    className="bg-blue-600 cursor-pointer hover:bg-blue-700 px-5 py-2 rounded-lg"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => openDeleteModal(promotion)}
                    className="bg-red-600 cursor-pointer hover:bg-red-700 px-5 py-2 rounded-lg"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-purple-500/30">
                <th className="p-4">Preview</th>
                <th className="p-4">App ID</th>
                <th className="p-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {promotions.map((promotion) => (
                <tr
                  key={promotion._id}
                  className="border-b border-gray-800 hover:bg-gray-800/30"
                >
                  <td className="p-4">
                    <img
                      src={`${import.meta.env.VITE_API_URL}${promotion.image}`}
                      alt="Preview"
                      className="w-24 h-16 object-cover rounded"
                    />
                  </td>
                  <td className="p-4 font-medium">{promotion.app_id}</td>
                  <td className="p-4 text-center">
                    <button
                      onClick={() => openModal(promotion)}
                      className="bg-blue-600 cursor-pointer hover:bg-blue-700 px-4 py-1.5 rounded mr-2"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => openDeleteModal(promotion)}
                      className="bg-red-600 cursor-pointer hover:bg-red-700 px-4 py-1.5 rounded"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal - Create/Update */}
      <AnimatePresence>
        {modalIsOpen && (
          <Modal
            isOpen={modalIsOpen}
            onRequestClose={closeModal}
            className="outline-none"
            overlayClassName="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="bg-gray-900 border border-purple-600/40 rounded-2xl p-8 max-w-lg w-full"
            >
              <h2 className="text-2xl font-bold text-center text-white mb-6">
                {isUpdate ? "Update" : "Create"} Ads Promotion Two
              </h2>

              <form onSubmit={handleSubmit} className="space-y-6">
                <input
                  name="app_id"
                  value={formData.app_id}
                  onChange={handleInputChange}
                  placeholder="Enter App ID (e.g. gracho-924304)"
                  required
                  className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400"
                />

                <div>
                  <label className="block text-sm text-gray-300 mb-2">
                    Banner Image
                  </label>
                  <input
                    type="file"
                    name="image"
                    onChange={handleFileChange}
                    accept="image/*"
                    className="w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:bg-purple-600 cursor-pointer file:text-white hover:file:bg-purple-700"
                  />
                </div>

                {previews.image && (
                  <div className="mt-4">
                    <img
                      src={previews.image}
                      alt="Preview"
                      className="w-full h-48 object-cover rounded-lg border border-purple-500/30"
                    />
                  </div>
                )}

                <div className="flex justify-end gap-4 mt-8">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="px-6 py-2 bg-gray-700 cursor-pointer text-white hover:bg-gray-600 rounded-lg"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={
                      createMutation.isPending || updateMutation.isPending
                    }
                    className="px-6 py-2 bg-gradient-to-r text-white cursor-pointer from-purple-600 to-pink-600 rounded-lg font-medium disabled:opacity-50"
                  >
                    {createMutation.isPending || updateMutation.isPending
                      ? "Saving..."
                      : isUpdate
                      ? "Update"
                      : "Create"}
                  </button>
                </div>
              </form>
            </motion.div>
          </Modal>
        )}
      </AnimatePresence>

      {/* Delete Confirmation */}
      <AnimatePresence>
        {deleteModalIsOpen && (
          <Modal
            isOpen={deleteModalIsOpen}
            onRequestClose={closeDeleteModal}
            className="outline-none"
            overlayClassName="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="bg-gray-900 border border-red-600/40 rounded-2xl p-8 max-w-md w-full text-center"
            >
              <h3 className="text-2xl font-bold cursor-pointer text-red-400 mb-4">
                Confirm Delete
              </h3>
              <p className="text-gray-300 mb-8">
                Are you sure you want to delete this promotion?
              </p>
              <div className="flex justify-center gap-6">
                <button
                  onClick={closeDeleteModal}
                  className="px-8 py-3 bg-gray-700 cursor-pointer text-white hover:bg-gray-600 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  disabled={deleteMutation.isPending}
                  className="px-8 py-3 cursor-pointer bg-red-600 text-white hover:bg-red-700 rounded-lg disabled:opacity-50"
                >
                  {deleteMutation.isPending ? "Deleting..." : "Delete"}
                </button>
              </div>
            </motion.div>
          </Modal>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdsPromotionTwoController;
