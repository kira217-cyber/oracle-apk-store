import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  FaSearch,
  FaEye,
  FaSyncAlt,
  FaCalendarAlt,
  FaEdit,
  FaTimes, // for clear search
} from "react-icons/fa";
import { toast } from "react-toastify";
import axios from "axios";
import { useAuth } from "../../hooks/useAuth";
import { useNavigate } from "react-router";

const MyApps = () => {
  const { user } = useAuth();
  const userId = user?.id || user?._id;
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [apks, setApks] = useState([]);
  const [loading, setLoading] = useState(true); // start with true
  const [selectedApk, setSelectedApk] = useState(null);

  const API_BASE = import.meta.env.VITE_API_URL;

  const statuses = [
    { value: "all", label: "All Apps" },
    { value: "pending", label: "Pending Apps" },
    { value: "approved", label: "Approved Apps" },
    { value: "rejected", label: "Rejected Apps" },
  ];

  const fetchMyApps = async (querySearch = "", queryStatus = "all") => {
    if (!userId) {
      toast.error("Please log in to view your apps.");
      setLoading(false);
      return;
    }

    setLoading(true);

    try {
      const params = {
        user: userId,
      };

      if (querySearch.trim()) {
        params.search = querySearch.trim();
      }

      if (queryStatus !== "all") {
        params.status = queryStatus;
      }

      const res = await axios.get(`${API_BASE}/api/my-apks`, { params });

      setApks(res.data || []);
    } catch (error) {
      console.error("Failed to fetch my apps:", error);
      toast.error(error.response?.data?.error || "Failed to load your apps");
      setApks([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchMyApps("", "all");
    }
  }, [userId]);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchMyApps(search, selectedStatus);
  };

  const handleClearSearch = () => {
    setSearch("");
    fetchMyApps("", selectedStatus);
  };

  const handleStatusChange = (e) => {
    const newStatus = e.target.value;
    setSelectedStatus(newStatus);
    fetchMyApps(search, newStatus);
  };

  const handleRefresh = () => {
    fetchMyApps(search, selectedStatus);
  };

  const handleViewDetails = (apk) => {
    setSelectedApk(apk);
  };

  const handleUpdate = (id) => {
    navigate(`/update-apk/${id}`);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 },
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="relative min-h-screen pb-12"
    >
      {/* Header */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="flex flex-col md:flex-row items-center justify-between mb-10 gap-6"
      >
        <form onSubmit={handleSearch} className="flex-1 w-full md:max-w-lg relative">
          <div className="relative">
            <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-orange-400 text-xl z-10" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search your apps by title..."
              className="w-full pl-14 pr-12 py-4 bg-gray-800/70 backdrop-blur-md border border-orange-800/40 rounded-2xl focus:outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-500/20 transition-all placeholder-orange-400/60 text-white text-lg"
            />
            {search && (
              <button
                type="button"
                onClick={handleClearSearch}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-orange-400 transition cursor-pointer"
              >
                <FaTimes size={20} />
              </button>
            )}
          </div>
        </form>

        <select
          value={selectedStatus}
          onChange={handleStatusChange}
          className="px-8 py-4 bg-gray-800/70 backdrop-blur-md border border-orange-800/40 rounded-2xl focus:outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-500/20 text-white text-lg cursor-pointer min-w-[220px]"
        >
          {statuses.map((s) => (
            <option key={s.value} value={s.value} className="bg-gray-900 text-white">
              {s.label}
            </option>
          ))}
        </select>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleRefresh}
          disabled={loading}
          className="flex items-center gap-3 bg-gradient-to-r from-orange-600 to-orange-500 px-8 py-4 rounded-2xl font-bold shadow-xl hover:shadow-orange-900/70 text-white cursor-pointer transition disabled:opacity-60 disabled:cursor-not-allowed"
        >
          <FaSyncAlt className={loading ? "animate-spin" : ""} />
          Refresh
        </motion.button>
      </motion.div>

      {/* Loading Overlay */}
      {loading && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-50">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1.2, repeat: Infinity, ease: "linear" }}
            className="text-orange-500 text-6xl"
          >
            <FaSyncAlt />
          </motion.div>
        </div>
      )}

      {/* Content Area */}
      {loading ? null : apks.length > 0 ? (
        <>
          {/* Desktop Table */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="hidden md:block overflow-x-auto rounded-2xl border border-orange-800/30 shadow-2xl mb-10"
          >
            <table className="w-full text-left min-w-[900px]">
              <thead className="bg-gradient-to-r from-orange-900/60 to-orange-800/60 backdrop-blur-md">
                <tr>
                  <th className="p-6 text-orange-300 font-semibold">Logo</th>
                  <th className="p-6 text-orange-300 font-semibold">App Title</th>
                  <th className="p-6 text-orange-300 font-semibold">Submitted</th>
                  <th className="p-6 text-orange-300 font-semibold">Status</th>
                  <th className="p-6 text-orange-300 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {apks.map((apk) => (
                  <motion.tr
                    key={apk._id}
                    variants={itemVariants}
                    className="border-b border-orange-800/20 hover:bg-orange-900/10 transition-all cursor-default"
                  >
                    <td className="p-6">
                      <img
                        src={`${API_BASE}${apk.apkLogo}`}
                        alt={apk.apkTitle}
                        className="w-16 h-16 rounded-xl object-cover shadow-lg border-2 border-orange-700/50"
                        // onError={(e) => (e.target.src = "/placeholder-app.png")}
                      />
                    </td>
                    <td className="p-6 text-white font-bold text-lg">{apk.apkTitle}</td>
                    <td className="p-6 text-gray-300">
                      <div className="flex items-center gap-2">
                        <FaCalendarAlt className="text-orange-400" />
                        {formatDate(apk.createdAt)}
                      </div>
                    </td>
                    <td className="p-6">
                      <span
                        className={`px-4 py-2 rounded-full text-sm font-bold ${
                          apk.status === "approved" || apk.status === "active"
                            ? "bg-green-500/20 text-green-400 border border-green-500/50"
                            : apk.status === "rejected"
                            ? "bg-red-500/20 text-red-400 border border-red-500/50"
                            : "bg-orange-500/20 text-orange-400 border border-orange-500/50"
                        }`}
                      >
                        {apk.status.toUpperCase()}
                      </span>
                    </td>
                    <td className="p-6 flex gap-3">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleViewDetails(apk)}
                        className="flex items-center gap-2 bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-700 hover:to-orange-600 px-5 py-2.5 rounded-xl text-white font-medium shadow-lg transition cursor-pointer"
                      >
                        <FaEye /> View
                      </motion.button>

                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleUpdate(apk._id)}
                        className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 px-5 py-2.5 rounded-xl text-white font-medium shadow-lg transition cursor-pointer"
                      >
                        <FaEdit /> Update
                      </motion.button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </motion.div>

          {/* Mobile Cards */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="md:hidden space-y-6"
          >
            {apks.map((apk) => (
              <motion.div
                key={apk._id}
                variants={itemVariants}
                className="bg-gradient-to-br from-gray-800/60 to-orange-900/20 backdrop-blur-md rounded-2xl shadow-2xl border border-orange-800/40 p-6 cursor-default"
              >
                <div className="flex items-start gap-4 mb-4">
                  <img
                    src={`${API_BASE}${apk.apkLogo}`}
                    alt={apk.apkTitle}
                    className="w-20 h-20 rounded-xl object-cover shadow-xl border-2 border-orange-600/50"
                    onError={(e) => (e.target.src = "/placeholder-app.png")}
                  />
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-white mb-2">{apk.apkTitle}</h3>
                    <p className="flex items-center gap-2 text-gray-400 text-sm mb-3">
                      <FaCalendarAlt className="text-orange-400" />
                      {formatDate(apk.createdAt)}
                    </p>
                    <span
                      className={`inline-block px-4 py-1.5 rounded-full text-sm font-bold ${
                        apk.status === "approved" || apk.status === "active"
                          ? "bg-green-500/20 text-green-400"
                          : apk.status === "rejected"
                          ? "bg-red-500/20 text-red-400"
                          : "bg-orange-500/20 text-orange-400"
                      }`}
                    >
                      {apk.status.toUpperCase()}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => handleViewDetails(apk)}
                    className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-700 hover:to-orange-600 py-3 rounded-xl text-white font-medium transition shadow-lg cursor-pointer"
                  >
                    <FaEye /> View Details
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => handleUpdate(apk._id)}
                    className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 py-3 rounded-xl text-white font-medium transition shadow-lg cursor-pointer"
                  >
                    <FaEdit /> Update App
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-24"
        >
          <div className="text-7xl text-orange-600 mb-6">📱</div>
          <h2 className="text-4xl font-bold text-orange-400 mb-4">No Apps Found</h2>
          <p className="text-xl text-gray-400 mb-8">
            {search || selectedStatus !== "all"
              ? "No matching apps found for your search/filter."
              : "You haven't uploaded any apps yet."}
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate("/upload-apk")}
            className="px-10 py-5 bg-gradient-to-r from-orange-600 to-orange-500 rounded-2xl text-white font-bold text-lg shadow-xl hover:shadow-orange-900/70 transition cursor-pointer"
          >
            Upload Your First App
          </motion.button>
        </motion.div>
      )}

      {/* View Details Modal */}
      {selectedApk && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ scale: 0.7, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-gray-900/95 backdrop-blur-xl rounded-3xl p-8 max-w-2xl w-full border border-orange-800/40 shadow-2xl relative"
          >
            <button
              onClick={() => setSelectedApk(null)}
              className="absolute top-4 right-6 text-gray-400 hover:text-orange-400 text-3xl transition cursor-pointer"
            >
              ×
            </button>

            <div className="flex justify-between items-center mb-6 pr-10">
              <h3 className="text-3xl font-bold text-orange-400">
                {selectedApk.apkTitle}
              </h3>
            </div>

            <div className="space-y-4 text-gray-300">
              <p>
                <strong>Status:</strong>{" "}
                <span
                  className={`ml-2 font-bold ${
                    selectedApk.status === "approved" || selectedApk.status === "active"
                      ? "text-green-400"
                      : selectedApk.status === "rejected"
                      ? "text-red-400"
                      : "text-orange-400"
                  }`}
                >
                  {selectedApk.status.toUpperCase()}
                </span>
              </p>
              <p><strong>Version:</strong> {selectedApk.apkVersion || "N/A"}</p>
              <p><strong>Submitted:</strong> {formatDate(selectedApk.createdAt)}</p>
              <p>
                <strong>Short Description:</strong>{" "}
                {selectedApk.shortDescription || "No description provided"}
              </p>
              <p><strong>Category:</strong> {selectedApk.appCategory || "N/A"}</p>
              <p><strong>Platform:</strong> {selectedApk.appPlatform || "N/A"}</p>
            </div>

            <div className="mt-10 flex justify-end">
              <button
                onClick={() => setSelectedApk(null)}
                className="px-8 py-3 bg-orange-600 hover:bg-orange-700 rounded-xl text-white font-medium transition cursor-pointer"
              >
                Close
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
};

export default MyApps;