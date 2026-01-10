import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  FaSearch,
  FaEye,
  FaCheckCircle,
  FaTimesCircle,
  FaToggleOn,
  FaToggleOff,
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

const AllApk = () => {
  const [search, setSearch] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("pending");
  const [apks, setApks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedApk, setSelectedApk] = useState(null);
  const [actionType, setActionType] = useState("");
  const [message, setMessage] = useState("");

  const API_BASE = import.meta.env.VITE_API_URL;

  const statuses = [
    { value: "all", label: "All Apps" },
    { value: "active", label: "Active Apps" },
    { value: "deactive", label: "Deactive Apps" },
    { value: "rejected", label: "Rejected Apps" },
    { value: "pending", label: "Pending Apps" },
  ];
  console.log(apks);

  const fetchApks = async (querySearch = "", queryStatus = "pending") => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE}/api/admin/apks`, {
        params: {
          search: querySearch,
          status: queryStatus === "all" ? "" : queryStatus,
        },
      });

      const processedApks = res.data.map((apk) => {
        let developerDetails = {
          fullName: "Unknown Developer",
          email: "N/A",
          companyName: "N/A",
          country: "N/A",
          whatsapp: "N/A",
        };

        if (apk.user && typeof apk.user === "object") {
          developerDetails = {
            fullName: apk.user.fullName?.trim() || "Unknown Developer",
            email: apk.user.email || "N/A",
            companyName: apk.user.companyName?.trim() || "N/A",
            country: apk.user.country || "N/A",
            whatsapp: apk.user.whatsapp || "N/A",
          };
        }

        return { ...apk, developerDetails };
      });

      setApks(processedApks);
    } catch (error) {
      toast.error("Failed to load APKs");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApks("", "pending");
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchApks(search, selectedStatus);
  };

  const handleStatusChange = (e) => {
    const newStatus = e.target.value;
    setSelectedStatus(newStatus);
    fetchApks(search, newStatus);
  };

  const openModal = (apk, type) => {
    setSelectedApk(apk);
    setActionType(type);
    setMessage(apk.adminMessage || "");
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedApk(null);
    setActionType("");
    setMessage("");
  };

  const handleSubmit = async () => {
    if (!selectedApk) return;

    setLoading(true);
    try {
      let newStatus = "";
      if (actionType === "accept") newStatus = "approved";
      else if (actionType === "reject") newStatus = "rejected";
      else if (actionType === "active") newStatus = "active";
      else if (actionType === "deactive") newStatus = "deactive";

      await axios.post(
        `${API_BASE}/api/admin/update-status/${selectedApk._id}`,
        { status: newStatus, message }
      );

      toast.success("Status updated & email sent!");
      fetchApks(search, selectedStatus);
      closeModal();
    } catch (error) {
      const errMsg = error.response?.data?.error || "Failed to update status";
      toast.error(errMsg);
    } finally {
      setLoading(false);
    }
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
      className="relative"
    >
      {/* Header */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="flex flex-col md:flex-row items-center justify-between mb-10 gap-6"
      >
        <form onSubmit={handleSearch} className="flex-1 w-full md:max-w-lg">
          <div className="relative">
            <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-400 text-xl z-10" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by Title or Developer..."
              className="w-full pl-14 pr-6 py-4 bg-white/5 backdrop-blur-md border border-blue-800/40 rounded-2xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition-all placeholder-blue-400/70 text-white text-lg cursor-text"
            />
          </div>
        </form>

        <select
          value={selectedStatus}
          onChange={handleStatusChange}
          className="px-8 py-4 bg-white/5 backdrop-blur-md border border-blue-800/40 rounded-2xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 text-white text-lg cursor-pointer"
        >
          {statuses.map((s) => (
            <option
              key={s.value}
              value={s.value}
              className="bg-black text-white"
            >
              {s.label}
            </option>
          ))}
        </select>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => fetchApks(search, selectedStatus)}
          className="flex items-center gap-3 bg-gradient-to-r from-[#1d4ed8] to-[#3b82f6] px-8 py-4 rounded-2xl font-bold shadow-xl hover:shadow-blue-600/60 text-white cursor-pointer"
        >
          <FaSyncAlt className={loading ? "animate-spin" : ""} />
          Refresh
        </motion.button>
      </motion.div>

      {/* Loading Overlay */}
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/70 z-50 backdrop-blur-sm">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="text-blue-400 text-6xl"
          >
            <FaSyncAlt />
          </motion.div>
        </div>
      )}

      {/* Content Area */}
      {!loading && apks.length > 0 ? (
        <>
          {/* Desktop Table */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="hidden md:block overflow-x-auto rounded-2xl border border-blue-800/30 shadow-2xl"
          >
            <table className="w-full text-left">
              <thead className="bg-gradient-to-r from-blue-900/50 to-blue-800/50 backdrop-blur-md">
                <tr>
                  <th className="p-6 text-blue-300 font-semibold">Logo</th>
                  <th className="p-6 text-blue-300 font-semibold">Developer</th>
                  <th className="p-6 text-blue-300 font-semibold">APK Title</th>
                  <th className="p-6 text-blue-300 font-semibold">Submitted</th>
                  <th className="p-6 text-blue-300 font-semibold">Status</th>
                  <th className="p-6 text-blue-300 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {apks.map((apk) => (
                  <motion.tr
                    key={apk._id}
                    variants={itemVariants}
                    className="border-b border-blue-800/20 hover:bg-white/5 transition-all"
                  >
                    <td className="p-6">
                      <img
                        src={`${API_BASE}${apk.apkLogo}`}
                        alt={apk.apkTitle}
                        className="w-16 h-16 rounded-xl object-cover shadow-lg border border-blue-700/50"
                      />
                    </td>
                    <td className="p-6">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-white font-semibold">
                          <FaUser className="text-blue-400" />
                          {apk.developerDetails.fullName}
                        </div>
                        <div className="flex items-center gap-2 text-gray-400 text-sm">
                          <FaEnvelope className="text-blue-400" />
                          {apk.developerDetails.email}
                        </div>
                        {apk.developerDetails.companyName !== "N/A" && (
                          <div className="flex items-center gap-2 text-gray-400 text-sm">
                            <FaBuilding className="text-blue-400" />
                            {apk.developerDetails.companyName}
                          </div>
                        )}
                        {apk.developerDetails.country !== "N/A" && (
                          <div className="flex items-center gap-2 text-gray-400 text-sm">
                            <FaGlobe className="text-blue-400" />
                            {apk.developerDetails.country}
                          </div>
                        )}
                        {apk.developerDetails.whatsapp !== "N/A" && (
                          <div className="flex items-center gap-2 text-gray-400 text-sm">
                            <FaPhoneAlt className="text-blue-400" />
                            {apk.developerDetails.whatsapp}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="p-6 text-white font-bold text-lg">
                      {apk.apkTitle}
                    </td>
                    <td className="p-6 text-gray-300 mt-10 flex items-center gap-2">
                      <FaCalendarAlt />
                      {formatDate(apk.createdAt)}
                    </td>
                    <td className="p-6">
                      <span
                        className={`px-4 py-2 rounded-full text-sm font-bold ${
                          apk.status === "active"
                            ? "bg-green-500/20 text-green-400 border border-green-500/50"
                            : apk.status === "deactive"
                            ? "bg-yellow-500/20 text-yellow-400 border border-yellow-500/50"
                            : apk.status === "rejected"
                            ? "bg-red-500/20 text-red-400 border border-red-500/50"
                            : "bg-blue-500/20 text-blue-400 border border-blue-500/50"
                        }`}
                      >
                        {apk.status.toUpperCase()}
                      </span>
                    </td>
                    <td className="p-6">
                      <div className="flex gap-3">
                        {apk.status === "pending" ||
                        apk.status === "rejected" ? (
                          <>
                            <motion.button
                              whileHover={{ scale: 1.08 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => openModal(apk, "accept")}
                              className="flex items-center gap-2 bg-green-600 hover:bg-green-700 px-5 py-3 rounded-xl text-white font-medium shadow-lg cursor-pointer transition"
                            >
                              <FaCheckCircle /> Accept
                            </motion.button>
                            <motion.button
                              whileHover={{ scale: 1.08 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => openModal(apk, "reject")}
                              className="flex items-center gap-2 bg-red-600 hover:bg-red-700 px-5 py-3 rounded-xl text-white font-medium shadow-lg cursor-pointer transition"
                            >
                              <FaTimesCircle /> Reject
                            </motion.button>
                          </>
                        ) : (
                          <motion.button
                            whileHover={{ scale: 1.08 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() =>
                              openModal(
                                apk,
                                apk.status === "active" ? "deactive" : "active"
                              )
                            }
                            className={`flex items-center gap-2 px-5 py-3 rounded-xl text-white font-medium shadow-lg cursor-pointer transition ${
                              apk.status === "active"
                                ? "bg-yellow-600 hover:bg-yellow-700"
                                : "bg-green-600 hover:bg-green-700"
                            }`}
                          >
                            {apk.status === "active" ? (
                              <FaToggleOff />
                            ) : (
                              <FaToggleOn />
                            )}
                            {apk.status === "active"
                              ? "Deactivate"
                              : "Activate"}
                          </motion.button>
                        )}
                        <motion.button
                          whileHover={{ scale: 1.08 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={handleViewDetails}
                          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 px-5 py-3 rounded-xl text-white font-medium shadow-lg cursor-pointer transition"
                        >
                          <FaEye /> View Details
                        </motion.button>
                      </div>
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
                className="bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-md rounded-2xl shadow-2xl border border-blue-800/40 p-6"
              >
                <div className="flex items-start gap-4">
                  <img
                    src={`${API_BASE}${apk.apkLogo}`}
                    alt={apk.apkTitle}
                    className="w-20 h-20 rounded-2xl object-cover shadow-xl border-2 border-blue-600/50"
                  />
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-white mb-2">
                      {apk.apkTitle}
                    </h3>
                    <div className="space-y-2 text-sm">
                      <p className="flex items-center gap-2 text-gray-300">
                        <FaUser className="text-blue-400" />
                        {apk.developerDetails.fullName}
                      </p>
                      <p className="flex items-center gap-2  text-gray-400">
                        <FaEnvelope className="text-blue-400" />
                        <span className="truncate max-w-[120px]">
                          {" "}
                          {apk.developerDetails.email}
                        </span>
                      </p>
                      {apk.developerDetails.companyName !== "N/A" && (
                        <p className="flex items-center gap-2 text-gray-400">
                          <FaBuilding className="text-blue-400" />
                          {apk.developerDetails.companyName}
                        </p>
                      )}
                      {apk.developerDetails.country !== "N/A" && (
                        <p className="flex items-center gap-2 text-gray-400">
                          <FaGlobe className="text-blue-400" />
                          {apk.developerDetails.country}
                        </p>
                      )}
                      {apk.developerDetails.whatsapp !== "N/A" && (
                        <p className="flex items-center gap-2 text-gray-400">
                          <FaPhoneAlt className="text-blue-400" />
                          {apk.developerDetails.whatsapp}
                        </p>
                      )}
                      <p className="flex items-center gap-2 text-gray-400 mt-3">
                        <FaCalendarAlt className="text-blue-400" />
                        <span className="truncate max-w-[120px]">
                          {formatDate(apk.createdAt)}
                        </span>
                      </p>
                    </div>
                    <div className="mt-4">
                      <span
                        className={`inline-block px-4 py-2 rounded-full text-sm font-bold ${
                          apk.status === "active"
                            ? "bg-green-500/20 text-green-400"
                            : apk.status === "deactive"
                            ? "bg-yellow-500/20 text-yellow-400"
                            : apk.status === "rejected"
                            ? "bg-red-500/20 text-red-400"
                            : "bg-blue-500/20 text-blue-400"
                        }`}
                      >
                        {apk.status.toUpperCase()}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex flex-wrap gap-3">
                  {apk.status === "pending" || apk.status === "rejected" ? (
                    <>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => openModal(apk, "accept")}
                        className="flex-1 flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 py-3 rounded-xl text-white font-medium cursor-pointer transition"
                      >
                        <FaCheckCircle /> Accept
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => openModal(apk, "reject")}
                        className="flex-1 flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 py-3 rounded-xl text-white font-medium cursor-pointer transition"
                      >
                        <FaTimesCircle /> Reject
                      </motion.button>
                    </>
                  ) : (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() =>
                        openModal(
                          apk,
                          apk.status === "active" ? "deactive" : "active"
                        )
                      }
                      className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-white font-medium cursor-pointer transition ${
                        apk.status === "active"
                          ? "bg-yellow-600 hover:bg-yellow-700"
                          : "bg-green-600 hover:bg-green-700"
                      }`}
                    >
                      {apk.status === "active" ? (
                        <FaToggleOff />
                      ) : (
                        <FaToggleOn />
                      )}
                      {apk.status === "active" ? "Deactivate" : "Activate"}
                    </motion.button>
                  )}
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleViewDetails}
                    className="flex-1 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 py-3 rounded-xl text-white font-medium cursor-pointer transition"
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
          <div className="text-6xl text-gray-600 mb-6">📭</div>
          <h2 className="text-3xl font-bold text-gray-400 mb-4">
            No Apps Found
          </h2>
          <p className="text-xl text-gray-500">
            {selectedStatus === "pending"
              ? "There are no pending apps for review at the moment."
              : `No ${selectedStatus} apps match your criteria.`}
          </p>
        </motion.div>
      ) : null}

      {/* Action Modal */}
      {modalOpen && selectedApk && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/80 z-50 p-4">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-gradient-to-br from-[#0f172a] to-[#1e293b] p-8 rounded-3xl shadow-2xl border border-blue-900/60 max-w-lg w-full"
          >
            <h2 className="text-2xl font-bold text-white mb-6">
              {actionType === "accept" && "Accept APK"}
              {actionType === "reject" && "Reject APK"}
              {actionType === "active" && "Activate APK"}
              {actionType === "deactive" && "Deactivate APK"}:{" "}
              {selectedApk.apkTitle}
            </h2>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Write a message to the developer (optional but recommended)..."
              className="w-full h-32 p-4 bg-white/5 backdrop-blur-md border border-blue-800/40 rounded-2xl focus:outline-none focus:border-blue-500 text-white resize-none cursor-text"
            />
            <div className="mt-8 flex justify-end gap-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                onClick={closeModal}
                className="px-8 py-4 bg-gray-700 hover:bg-gray-600 rounded-xl text-white font-medium cursor-pointer transition"
              >
                Cancel
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                onClick={handleSubmit}
                disabled={loading}
                className="px-10 py-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 rounded-xl text-white font-bold cursor-pointer transition disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? "Processing..." : "Confirm & Send Email"}
              </motion.button>
            </div>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
};

export default AllApk;
