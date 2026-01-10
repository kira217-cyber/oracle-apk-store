import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import Modal from "react-modal";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaPlus,
  FaTrash,
  FaTable,
  FaThLarge,
  FaSpinner,
  FaTimes,
} from "react-icons/fa";
import { toast } from "react-toastify";

Modal.setAppElement("#root");

const fetchMostDownloads = async () => {
  const { data } = await axios.get(
    `${import.meta.env.VITE_API_URL}/api/most-download`
  );
  return data;
};

const addMostDownload = async (app_id) => {
  const { data } = await axios.post(
    `${import.meta.env.VITE_API_URL}/api/most-download`,
    { app_id }
  );
  return data;
};

const removeMostDownload = async (id) => {
  await axios.delete(`${import.meta.env.VITE_API_URL}/api/most-download/${id}`);
};

const MostDownloadPromotionController = () => {
  const queryClient = useQueryClient();
  const [viewMode, setViewMode] = useState("card");
  const [appIdInput, setAppIdInput] = useState("");
  const [inputError, setInputError] = useState("");
  const [deleteModalIsOpen, setDeleteModalIsOpen] = useState(false);
  const [appToDelete, setAppToDelete] = useState(null);

  const { data: mostDownloads = [], isLoading } = useQuery({
    queryKey: ["most-downloads"],
    queryFn: fetchMostDownloads,
  });

  const addMutation = useMutation({
    mutationFn: addMostDownload,
    onSuccess: () => {
      queryClient.invalidateQueries(["most-downloads"]);
      toast.success("App successfully added to Most Download!", {
        position: "top-right",
        autoClose: 3000,
      });
      setAppIdInput("");
      setInputError("");
    },
    onError: () => {
      toast.error("Failed to add app. Please check the App ID.");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: removeMostDownload,
    onSuccess: () => {
      queryClient.invalidateQueries(["most-downloads"]);
      toast.success("App removed from Most Download successfully!", {
        position: "top-right",
      });
      closeDeleteModal();
    },
    onError: () => {
      toast.error("Failed to remove app");
    },
  });

  const handleAdd = (e) => {
    e.preventDefault();
    if (!appIdInput.trim()) {
      setInputError("Please enter a valid App ID");
      return;
    }
    setInputError("");
    addMutation.mutate(appIdInput.trim());
  };

  const openDeleteModal = (app) => {
    setAppToDelete(app);
    setDeleteModalIsOpen(true);
  };

  const closeDeleteModal = () => {
    setDeleteModalIsOpen(false);
    setAppToDelete(null);
  };

  const confirmDelete = () => {
    if (appToDelete) {
      deleteMutation.mutate(appToDelete._id);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
          className="text-6xl text-blue-500"
        >
          <FaSpinner />
        </motion.div>
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-10 max-w-7xl mx-auto">
      {/* Header */}
      <motion.h1
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-4xl md:text-5xl font-extrabold mb-12 bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent"
      >
        Most Download Promotion Management
      </motion.h1>

      {/* Add Form - Glass Effect */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="mb-16 bg-white/10 backdrop-blur-2xl border border-white/20 rounded-3xl p-8 shadow-2xl"
      >
        <h2 className="text-3xl font-bold text-white mb-8 text-center md:text-left">
          Add New App to Most Download
        </h2>

        <form onSubmit={handleAdd} className="flex flex-col sm:flex-row gap-6">
          <div className="flex-1 relative">
            <input
              type="text"
              value={appIdInput}
              onChange={(e) => {
                setAppIdInput(e.target.value);
                setInputError("");
              }}
              placeholder="Enter exact apk_Id (e.g. tornado-501445)"
              className={`w-full px-6 py-5 bg-white/5 border ${
                inputError ? "border-red-500" : "border-white/30"
              } rounded-2xl text-white text-lg placeholder-gray-400 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-500/50 transition-all duration-300 cursor-pointer`}
              required
            />
            {inputError && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-red-400 text-sm mt-2 absolute left-0"
              >
                {inputError}
              </motion.p>
            )}
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            disabled={addMutation.isPending}
            className="px-10 py-5 bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-bold text-lg rounded-2xl shadow-xl hover:shadow-blue-500/40 transition-all duration-300 disabled:opacity-60 flex items-center gap-3 min-w-[220px] justify-center cursor-pointer"
          >
            {addMutation.isPending ? (
              <>
                <FaSpinner className="animate-spin" /> Adding...
              </>
            ) : (
              <>
                <FaPlus size={18} /> Add App
              </>
            )}
          </motion.button>
        </form>
      </motion.div>

      {/* View Toggle */}
      <div className="flex flex-wrap gap-4 mb-12">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setViewMode("card")}
          className={`px-10 py-4 rounded-2xl font-bold text-lg transition-all duration-300 cursor-pointer shadow-md ${
            viewMode === "card"
              ? "bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-blue-500/40"
              : "bg-white/10 backdrop-blur-md text-gray-300 hover:bg-white/20"
          }`}
        >
          <FaThLarge className="inline mr-3" /> Card View
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setViewMode("table")}
          className={`px-10 py-4 rounded-2xl font-bold text-lg transition-all duration-300 cursor-pointer shadow-md ${
            viewMode === "table"
              ? "bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-blue-500/40"
              : "bg-white/10 backdrop-blur-md text-gray-300 hover:bg-white/20"
          }`}
        >
          <FaTable className="inline mr-3" /> Table View
        </motion.button>
      </div>

      {mostDownloads.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center py-32 text-gray-300 text-2xl font-medium bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 shadow-xl"
        >
          No apps added to Most Download yet...
        </motion.div>
      ) : viewMode === "card" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {mostDownloads.map((app) => (
            <motion.div
              key={app._id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl overflow-hidden hover:shadow-blue-500/30 transition-all duration-300 cursor-pointer group"
            >
              <div className="p-8 flex flex-col sm:flex-row items-center sm:items-start gap-6">
                {app.apkLogo ? (
                  <img
                    src={app.apkLogo}
                    alt={app.apkTitle}
                    className="w-28 h-28 rounded-2xl object-cover border-4 border-white/20 shadow-xl group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-28 h-28 bg-gray-700/50 rounded-2xl flex items-center justify-center text-gray-400 text-lg font-medium">
                    No Logo
                  </div>
                )}

                <div className="flex-1 text-center sm:text-left">
                  <h3 className="font-bold text-2xl text-white mb-2 group-hover:text-cyan-300 transition-colors">
                    {app.apkTitle}
                  </h3>
                  <p className="text-base text-gray-300 mb-1">
                    ID: <span className="font-medium">{app.app_id}</span>
                  </p>
                  <p className="text-base text-gray-300">
                    By:{" "}
                    <span className="text-cyan-400 font-medium">
                      {app.author}
                    </span>
                  </p>
                </div>

                <motion.button
                  whileHover={{ scale: 1.15 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={(e) => {
                    e.stopPropagation();
                    openDeleteModal(app);
                  }}
                  className="p-4 rounded-full bg-red-600/80 hover:bg-red-700 text-white transition-colors shadow-lg cursor-pointer"
                >
                  <FaTrash size={20} />
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="overflow-x-auto rounded-3xl border border-white/20 bg-white/5 backdrop-blur-xl shadow-2xl"
        >
          <table className="min-w-full">
            <thead>
              <tr className="border-b border-white/20 bg-white/5">
                <th className="px-10 py-6 text-left text-gray-300 font-semibold text-lg">
                  Logo
                </th>
                <th className="px-10 py-6 text-left text-gray-300 font-semibold text-lg">
                  Title
                </th>
                <th className="px-10 py-6 text-left text-gray-300 font-semibold text-lg">
                  App ID
                </th>
                <th className="px-10 py-6 text-left text-gray-300 font-semibold text-lg">
                  Author
                </th>
                <th className="px-10 py-6 text-center text-gray-300 font-semibold text-lg">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {mostDownloads.map((app) => (
                <tr
                  key={app._id}
                  className="border-b border-white/10 hover:bg-white/10 transition-colors cursor-pointer group"
                >
                  <td className="px-10 py-8 whitespace-nowrap">
                    {app.apkLogo ? (
                      <img
                        src={app.apkLogo}
                        alt={app.apkTitle}
                        className="w-16 h-16 rounded-2xl object-cover border-2 border-white/30 shadow-md group-hover:scale-110 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-16 h-16 bg-gray-700/50 rounded-2xl" />
                    )}
                  </td>
                  <td className="px-10 py-8 font-bold text-white text-lg">
                    {app.apkTitle}
                  </td>
                  <td className="px-10 py-8 text-gray-300 text-base">
                    {app.app_id}
                  </td>
                  <td className="px-10 py-8 text-gray-300 text-base">
                    {app.author}
                  </td>
                  <td className="px-10 py-8 text-center">
                    <motion.button
                      whileHover={{ scale: 1.15 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={(e) => {
                        e.stopPropagation();
                        openDeleteModal(app);
                      }}
                      className="p-4 bg-red-600/80 hover:bg-red-700 rounded-full text-white shadow-lg transition-colors cursor-pointer"
                    >
                      <FaTrash size={20} />
                    </motion.button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </motion.div>
      )}

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {deleteModalIsOpen && (
          <Modal
            isOpen={deleteModalIsOpen}
            onRequestClose={closeDeleteModal}
            className="outline-none"
            overlayClassName="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.85 }}
              transition={{ duration: 0.3 }}
              className="bg-gradient-to-br from-gray-900 to-gray-800 border border-red-600/30 rounded-3xl p-10 max-w-md w-full shadow-2xl relative"
            >
              <button
                onClick={closeDeleteModal}
                className="absolute top-5 right-5 text-gray-400 hover:text-white transition cursor-pointer"
              >
                <FaTimes size={28} />
              </button>

              <div className="text-center">
                <div className="text-7xl text-red-500 mb-6">
                  <FaTrash />
                </div>
                <h3 className="text-3xl font-bold text-white mb-4">
                  Remove App?
                </h3>
                <p className="text-gray-300 mb-10 text-lg">
                  Are you sure you want to remove{" "}
                  <span className="font-bold text-cyan-400">
                    {appToDelete?.apkTitle}
                  </span>{" "}
                  from Most Download?
                </p>

                <div className="flex justify-center gap-6">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={closeDeleteModal}
                    className="px-10 py-4 bg-gray-700 hover:bg-gray-600 text-white font-bold rounded-2xl transition cursor-pointer"
                  >
                    Cancel
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={confirmDelete}
                    disabled={deleteMutation.isPending}
                    className="px-10 py-4 bg-gradient-to-r from-red-600 to-red-700 text-white font-bold rounded-2xl shadow-lg hover:shadow-red-600/40 transition disabled:opacity-50 cursor-pointer flex items-center gap-3"
                  >
                    {deleteMutation.isPending ? (
                      <>
                        <FaSpinner className="animate-spin" /> Removing...
                      </>
                    ) : (
                      "Yes, Remove"
                    )}
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </Modal>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MostDownloadPromotionController;
