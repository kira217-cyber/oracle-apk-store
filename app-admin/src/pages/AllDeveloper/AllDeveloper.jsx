import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import Modal from "react-modal";
import { toast } from "react-toastify";
import { FaSync } from "react-icons/fa";
import { motion } from "framer-motion";

Modal.setAppElement("#root");

// FIXED FETCH FUNCTION
const fetchDevelopers = async ({ queryKey }) => {
  const [, filter, search] = queryKey;
  const params = new URLSearchParams();
  if (filter && filter !== "all" && filter.trim() !== "") {
    params.append("filter", filter.trim());
  }
  if (search && search.trim() !== "") {
    params.append("search", search.trim());
  }
  const url = `${import.meta.env.VITE_API_URL}/api/developer/all${
    params.toString() ? `?${params.toString()}` : ""
  }`;
  const res = await axios.get(url);
  return res.data;
};

const updateStatus = async ({ id, status, message }) => {
  const res = await axios.put(
    `${import.meta.env.VITE_API_URL}/api/developer/${id}/status`,
    { status, message }
  );
  return res.data;
};

const AllDeveloper = () => {
  const [filter, setFilter] = useState("pending"); // Default: show pending
  const [search, setSearch] = useState("");
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedDev, setSelectedDev] = useState(null);
  const [newStatus, setNewStatus] = useState("");
  const [message, setMessage] = useState("");

  const queryClient = useQueryClient();

  const {
    data: developers = [],
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["developers", filter, search],
    queryFn: fetchDevelopers,
    keepPreviousData: true,
  });

  const mutation = useMutation({
    mutationFn: updateStatus,
    onSuccess: () => {
      toast.success("Status updated successfully! Email sent to developer.");
      queryClient.invalidateQueries(["developers"]); // Better than manual refetch
      closeModal();
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || "Failed to update status");
    },
  });

  const openModal = (dev, status) => {
    setSelectedDev(dev);
    setNewStatus(status);
    setMessage(""); // Clear previous message
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setSelectedDev(null);
    setNewStatus("");
    setMessage("");
  };

  const handleSubmit = () => {
    if (!selectedDev) return;
    mutation.mutate({
      id: selectedDev._id,
      status: newStatus,
      message: message.trim(),
    });
  };

  const handleSearch = (e) => {
    setSearch(e.target.value);
  };

  const handleFilterChange = (e) => {
    setFilter(e.target.value);
  };

  const handleReload = () => {
    refetch();
    toast.info("Developers list reloaded!");
  };

  // Helper to get display name
  const getDeveloperName = (dev) => {
    return (
      dev.fullName || dev.companyName || `${dev.firstName} ${dev.lastName}`
    );
  };

  return (
    <div className=" text-gray-100">
      <div className="">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#1e3a8a] to-[#1d4ed8]">
            All Developers
          </h1>
          <motion.button
            whileHover={{ scale: 1.1, rotate: 180 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleReload}
            className="text-blue-400 hover:text-blue-300 transition cursor-pointer"
            title="Reload Developers"
          >
            <FaSync className="text-2xl" />
          </motion.button>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col md:flex-row justify-between gap-4 mb-8">
          <input
            type="text"
            placeholder="Search by company name, full name, or email..."
            value={search}
            onChange={handleSearch}
            className="px-6 py-4 border border-blue-900/40 rounded-2xl bg-white/5 backdrop-blur-md text-gray-300 placeholder-gray-500 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 outline-none transition-all cursor-text flex-1"
          />
          <select
            value={filter}
            onChange={handleFilterChange}
            className="px-6 py-4 border border-blue-900/40 rounded-2xl bg-gray-800/70 backdrop-blur-md text-gray-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 outline-none transition-all cursor-pointer"
          >
            <option className="" value="all">All Developers</option>
            <option value="pending">Pending Developers</option>
            <option className="" value="active">Active Developers</option>
            <option className="" value="deactive">Deactive Developers</option>
            <option className="" value="rejected">Rejected Developers</option>
          </select>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="text-center py-10 text-gray-400 text-xl flex items-center justify-center gap-2">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            >
              <FaSync className="text-2xl" />
            </motion.div>
            Loading developers...
          </div>
        )}

        {/* Empty State */}
        {!isLoading && developers.length === 0 && (
          <div className="text-center py-10 text-gray-400 text-xl">
            No developers found matching your criteria.
          </div>
        )}

        {/* Desktop Table */}
        {!isLoading && developers.length > 0 && (
          <div className="hidden md:block overflow-x-auto rounded-2xl border border-blue-900/40 shadow-lg backdrop-blur-sm">
            <table className="min-w-full bg-black/50">
              <thead className="bg-gradient-to-r from-[#0f172a] to-[#1e293b]">
                <tr>
                  <th className="px-6 py-4 text-left text-blue-300 font-semibold border-b border-blue-900/50">
                    Name
                  </th>
                  <th className="px-6 py-4 text-left text-blue-300 font-semibold border-b border-blue-900/50">
                    Email
                  </th>
                  <th className="px-6 py-4 text-left text-blue-300 font-semibold border-b border-blue-900/50">
                    Requested At
                  </th>
                  <th className="px-6 py-4 text-left text-blue-300 font-semibold border-b border-blue-900/50">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-blue-300 font-semibold border-b border-blue-900/50">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {developers.map((dev) => (
                  <motion.tr
                    key={dev._id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                    className="hover:bg-white/5 transition duration-300"
                  >
                    <td className="px-6 py-4 border-b border-blue-900/50 text-gray-200">
                      {getDeveloperName(dev)}
                    </td>
                    <td className="px-6 py-4 border-b border-blue-900/50 text-gray-200">
                      {dev.email}
                    </td>
                    <td className="px-6 py-4 border-b border-blue-900/50 text-gray-400 text-sm">
                      {new Date(dev.createdAt).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 border-b border-blue-900/50">
                      <span
                        className={`inline-block px-4 py-2 rounded-full text-sm font-medium ${
                          dev.status === "active"
                            ? "bg-green-900/50 text-green-300"
                            : dev.status === "pending"
                            ? "bg-yellow-900/50 text-yellow-300"
                            : dev.status === "rejected"
                            ? "bg-red-900/50 text-red-300"
                            : "bg-gray-700/50 text-gray-300"
                        }`}
                      >
                        {dev.status.charAt(0).toUpperCase() +
                          dev.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 border-b border-blue-900/50">
                      <div className="flex gap-3">
                        {dev.status === "pending" ? (
                          <>
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => openModal(dev, "active")}
                              className="flex items-center gap-2 bg-gradient-to-r from-green-800 to-green-600 hover:from-green-700 hover:to-green-500 text-white px-4 py-2 rounded-xl font-semibold shadow-lg hover:shadow-green-600/50 transition duration-300 cursor-pointer"
                            >
                              Accept
                            </motion.button>
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => openModal(dev, "rejected")}
                              className="flex items-center gap-2 bg-gradient-to-r from-red-800 to-red-600 hover:from-red-700 hover:to-red-500 text-white px-4 py-2 rounded-xl font-semibold shadow-lg hover:shadow-red-600/50 transition duration-300 cursor-pointer"
                            >
                              Reject
                            </motion.button>
                          </>
                        ) : (
                          <>
                            {dev.status === "active" && (
                              <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => openModal(dev, "deactive")}
                                className="flex items-center gap-2 bg-gradient-to-r from-yellow-800 to-yellow-600 hover:from-yellow-700 hover:to-yellow-500 text-white px-4 py-2 rounded-xl font-semibold shadow-lg hover:shadow-yellow-600/50 transition duration-300 cursor-pointer"
                              >
                                Deactivate
                              </motion.button>
                            )}
                            {dev.status === "deactive" && (
                              <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => openModal(dev, "active")}
                                className="flex items-center gap-2 bg-gradient-to-r from-green-800 to-green-600 hover:from-green-700 hover:to-green-500 text-white px-4 py-2 rounded-xl font-semibold shadow-lg hover:shadow-green-600/50 transition duration-300 cursor-pointer"
                              >
                                Activate
                              </motion.button>
                            )}
                            {dev.status === "rejected" && (
                              <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => openModal(dev, "active")}
                                className="flex items-center gap-2 bg-gradient-to-r from-green-800 to-green-600 hover:from-green-700 hover:to-green-500 text-white px-4 py-2 rounded-xl font-semibold shadow-lg hover:shadow-green-600/50 transition duration-300 cursor-pointer"
                              >
                                Reactivate
                              </motion.button>
                            )}
                          </>
                        )}
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() =>
                            toast.info("View details feature coming soon!")
                          }
                          className="flex items-center gap-2 bg-gradient-to-r from-[#1d4ed8] to-[#3b82f6] hover:from-[#1e40af] hover:to-[#1d4ed8] text-white px-4 py-2 rounded-xl font-semibold shadow-lg hover:shadow-blue-600/50 transition duration-300 cursor-pointer"
                        >
                          View Details
                        </motion.button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Mobile Cards */}
        {!isLoading && developers.length > 0 && (
          <div className="md:hidden space-y-6">
            {developers.map((dev) => (
              <motion.div
                key={dev._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="bg-gradient-to-br from-[#0a0e1a]/95 via-[#0f172a]/98 to-[#111827]/95 rounded-2xl shadow-2xl border border-blue-900/40 backdrop-blur-xl p-6"
              >
                <p className="text-white font-bold text-lg mb-2">
                  {getDeveloperName(dev)}
                </p>
                <p className="text-gray-400 text-sm mb-1">Email: {dev.email}</p>
                <p className="text-gray-500 text-xs mb-4">
                  Requested: {new Date(dev.createdAt).toLocaleDateString()}
                </p>
                <div className="mb-4">
                  <span
                    className={`inline-block px-4 py-2 rounded-full text-sm font-medium ${
                      dev.status === "active"
                        ? "bg-green-900/50 text-green-300"
                        : dev.status === "pending"
                        ? "bg-yellow-900/50 text-yellow-300"
                        : dev.status === "rejected"
                        ? "bg-red-900/50 text-red-300"
                        : "bg-gray-700/50 text-gray-300"
                    }`}
                  >
                    {dev.status.charAt(0).toUpperCase() + dev.status.slice(1)}
                  </span>
                </div>
                <div className="flex flex-wrap gap-3">
                  {dev.status === "pending" ? (
                    <>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => openModal(dev, "active")}
                        className="bg-gradient-to-r from-green-800 to-green-600 hover:from-green-700 hover:to-green-500 text-white px-4 py-2 rounded-xl font-semibold shadow-lg hover:shadow-green-600/50 transition duration-300 cursor-pointer"
                      >
                        Accept
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => openModal(dev, "rejected")}
                        className="bg-gradient-to-r from-red-800 to-red-600 hover:from-red-700 hover:to-red-500 text-white px-4 py-2 rounded-xl font-semibold shadow-lg hover:shadow-red-600/50 transition duration-300 cursor-pointer"
                      >
                        Reject
                      </motion.button>
                    </>
                  ) : (
                    <>
                      {dev.status === "active" && (
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => openModal(dev, "deactive")}
                          className="bg-gradient-to-r from-yellow-800 to-yellow-600 hover:from-yellow-700 hover:to-yellow-500 text-white px-4 py-2 rounded-xl font-semibold shadow-lg hover:shadow-yellow-600/50 transition duration-300 cursor-pointer"
                        >
                          Deactivate
                        </motion.button>
                      )}
                      {dev.status === "deactive" && (
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => openModal(dev, "active")}
                          className="bg-gradient-to-r from-green-800 to-green-600 hover:from-green-700 hover:to-green-500 text-white px-4 py-2 rounded-xl font-semibold shadow-lg hover:shadow-green-600/50 transition duration-300 cursor-pointer"
                        >
                          Activate
                        </motion.button>
                      )}
                      {dev.status === "rejected" && (
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => openModal(dev, "active")}
                          className="bg-gradient-to-r from-green-800 to-green-600 hover:from-green-700 hover:to-green-500 text-white px-4 py-2 rounded-xl font-semibold shadow-lg hover:shadow-green-600/50 transition duration-300 cursor-pointer"
                        >
                          Reactivate
                        </motion.button>
                      )}
                    </>
                  )}
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() =>
                      toast.info("View details feature coming soon!")
                    }
                    className="bg-gradient-to-r from-[#1d4ed8] to-[#3b82f6] hover:from-[#1e40af] hover:to-[#1d4ed8] text-white px-4 py-2 rounded-xl font-semibold shadow-lg hover:shadow-blue-600/50 transition duration-300 cursor-pointer"
                  >
                    View Details
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Status Update Modal */}
        <Modal
          isOpen={modalIsOpen}
          onRequestClose={closeModal}
          className="bg-black/95 backdrop-blur-2xl rounded-3xl shadow-2xl border border-blue-950/50 max-w-md mx-auto p-8 text-gray-100 outline-none"
          overlayClassName="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
        >
          <h2 className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#1e3a8a] to-[#1d4ed8] mb-6">
            Update Status to{" "}
            {newStatus.charAt(0).toUpperCase() + newStatus.slice(1)}
          </h2>
          <p className="text-gray-400 mb-4">
            Developer:{" "}
            <strong className="text-white">
              {selectedDev && getDeveloperName(selectedDev)}
            </strong>
            <br />
            Email: <strong className="text-white">{selectedDev?.email}</strong>
          </p>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Write a message to send via email (optional but recommended)"
            className="w-full px-6 py-4 border border-blue-900/30 rounded-2xl bg-white/5 backdrop-blur-md text-gray-300 placeholder-gray-500 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 outline-none transition-all cursor-text mb-6"
            rows={5}
          />
          <div className="flex justify-end gap-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={closeModal}
              className="px-6 py-3 bg-gradient-to-r from-red-800/80 to-pink-800/80 hover:from-red-700 hover:to-pink-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-red-900/50 transition duration-300 cursor-pointer border border-red-900/30"
            >
              Cancel
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleSubmit}
              disabled={mutation.isPending}
              className="px-6 py-3 bg-gradient-to-r from-[#1d4ed8] to-[#3b82f6] hover:from-[#1e40af] hover:to-[#1d4ed8] text-white font-semibold rounded-xl shadow-lg hover:shadow-blue-600/50 transition duration-300 disabled:opacity-50 cursor-pointer"
            >
              {mutation.isPending ? "Updating..." : "Confirm & Send Email"}
            </motion.button>
          </div>
        </Modal>
      </div>
    </div>
  );
};

export default AllDeveloper;
