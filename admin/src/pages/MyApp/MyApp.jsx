import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  FaSearch,
  FaEye,
  FaSyncAlt,
  FaUser,
  FaEnvelope,
  FaBuilding,
  FaGlobe,
  FaPhoneAlt,
  FaCalendarAlt,
} from "react-icons/fa";
import { toast } from "react-toastify";
import axios from "axios";
import { useAuth } from "../../hooks/useAuth";

const MyApps = () => {
  const { user } = useAuth();
  const userId = user?.id;

  const [search, setSearch] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [apks, setApks] = useState([]);
  const [loading, setLoading] = useState(false);

  const API_BASE = import.meta.env.VITE_API_URL;

  const statuses = [
    { value: "all", label: "All Apps" },
    { value: "pending", label: "Pending" },
    { value: "approved", label: "Approved" },
    { value: "rejected", label: "Rejected" },
  ];

  const fetchMyApps = async (querySearch = "", queryStatus = "all") => {
    if (!userId) {
      toast.error("Please log in to view your apps.");
      return;
    }

    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE}/api/my-apks`, {
        params: {
          user: userId,
          search: querySearch,
          status: queryStatus === "all" ? "" : queryStatus,
        },
      });

      const processedApks = res.data.map((apk) => {
        let developerDetails = {
          fullName: "You",
          email: user?.email || "N/A",
          companyName: "N/A",
          country: "N/A",
          whatsapp: "N/A",
        };

        return { ...apk, developerDetails };
      });

      setApks(processedApks);
    } catch (error) {
      toast.error("Failed to load your apps");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyApps("", "all");
  }, [userId]);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchMyApps(search, selectedStatus);
  };

  const handleStatusChange = (e) => {
    const newStatus = e.target.value;
    setSelectedStatus(newStatus);
    fetchMyApps(search, newStatus);
  };

  const handleViewDetails = () => {
    toast.info("View Details feature is coming soon!");
  };

  const formatDate = (date) => new Date(date).toLocaleString();

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
      className="relative "
    >
      {/* Header */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="flex flex-col md:flex-row items-center justify-between mb-10 gap-6"
      >
        <form onSubmit={handleSearch} className="flex-1 w-full md:max-w-lg">
          <div className="relative">
            <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-orange-400 text-xl z-10" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search your apps by title..."
              className="w-full pl-14 pr-6 py-4 bg-gray-800/70 backdrop-blur-md border border-orange-800/40 rounded-2xl focus:outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-500/20 transition-all placeholder-orange-400/60 text-white text-lg cursor-text"
            />
          </div>
        </form>

        <select
          value={selectedStatus}
          onChange={handleStatusChange}
          className="px-8 py-4 bg-gray-800/70 backdrop-blur-md border border-orange-800/40 rounded-2xl focus:outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-500/20 text-white text-lg cursor-pointer"
        >
          {statuses.map((s) => (
            <option key={s.value} value={s.value} className="bg-black text-white">
              {s.label}
            </option>
          ))}
        </select>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => fetchMyApps(search, selectedStatus)}
          className="flex items-center gap-3 bg-gradient-to-r from-orange-600 to-orange-500 px-8 py-4 rounded-2xl font-bold shadow-xl hover:shadow-orange-900/70 text-white cursor-pointer transition"
        >
          <FaSyncAlt className={loading ? "animate-spin" : ""} />
          Refresh
        </motion.button>
      </motion.div>

      {/* Loading */}
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/70 z-50 backdrop-blur-sm">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="text-orange-500 text-6xl"
          >
            <FaSyncAlt />
          </motion.div>
        </div>
      )}

      {/* Content */}
      {!loading && apks.length > 0 ? (
        <>
          {/* Desktop Table */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="hidden md:block overflow-x-auto rounded-2xl border border-orange-800/30 shadow-2xl"
          >
            <table className="w-full text-left">
              <thead className="bg-gradient-to-r from-orange-900/50 to-orange-800/50 backdrop-blur-md">
                <tr>
                  <th className="p-6 text-orange-300 font-semibold">Logo</th>
                  <th className="p-6 text-orange-300 font-semibold">App Title</th>
                  <th className="p-6 text-orange-300 font-semibold">Submitted</th>
                  <th className="p-6 text-orange-300 font-semibold">Status</th>
                  <th className="p-6 text-orange-300 font-semibold">Action</th>
                </tr>
              </thead>
              <tbody>
                {apks.map((apk) => (
                  <motion.tr
                    key={apk._id}
                    variants={itemVariants}
                    className="border-b border-orange-800/20 hover:bg-orange-900/10 transition-all"
                  >
                    <td className="p-6">
                      <img
                        src={`${API_BASE}${apk.apkLogo}`}
                        alt={apk.apkTitle}
                        className="w-16 h-16 rounded-xl object-cover shadow-lg border-2 border-orange-700/50"
                      />
                    </td>
                    <td className="p-6 text-white font-bold text-lg">
                      {apk.apkTitle}
                    </td>
                    <td className="p-6 text-gray-300 mt-5 flex items-center gap-2">
                      <FaCalendarAlt className="text-orange-400" />
                      {formatDate(apk.createdAt)}
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
                    <td className="p-6">
                      <motion.button
                        whileHover={{ scale: 1.08 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleViewDetails}
                        className="flex items-center gap-2 bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-700 hover:to-orange-600 px-6 py-3 rounded-xl text-white font-medium shadow-lg cursor-pointer transition"
                      >
                        <FaEye /> View Details
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
                className="bg-gradient-to-br from-gray-800/50 to-orange-900/20 backdrop-blur-md rounded-2xl shadow-2xl border border-orange-800/40 p-6"
              >
                <div className="flex items-start gap-4">
                  <img
                    src={`${API_BASE}${apk.apkLogo}`}
                    alt={apk.apkTitle}
                    className="w-20 h-20 rounded-2xl object-cover shadow-xl border-2 border-orange-600/50"
                  />
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-white mb-2">
                      {apk.apkTitle}
                    </h3>
                    <p className="flex items-center gap-2 text-gray-400 text-sm mb-3">
                      <FaCalendarAlt className="text-orange-400" />
                      {formatDate(apk.createdAt)}
                    </p>
                    <span
                      className={`inline-block px-4 py-2 rounded-full text-sm font-bold ${
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

                <div className="mt-6">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleViewDetails}
                    className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-700 hover:to-orange-600 py-4 rounded-xl text-white font-bold cursor-pointer transition shadow-lg"
                  >
                    <FaEye /> View Details
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </>
      ) : !loading ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-20"
        >
          <div className="text-6xl text-orange-600 mb-6">📱</div>
          <h2 className="text-3xl font-bold text-orange-400 mb-4">
            No Apps Found
          </h2>
          <p className="text-xl text-gray-400">
            You haven't uploaded any apps yet.
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => window.location.href = "/upload-apk"}
            className="mt-8 px-8 py-4 bg-gradient-to-r from-orange-600 to-orange-500 rounded-xl text-white font-bold cursor-pointer shadow-xl"
          >
            Upload Your First App
          </motion.button>
        </motion.div>
      ) : null}
    </motion.div>
  );
};

export default MyApps;