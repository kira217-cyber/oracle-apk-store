// src/pages/Dashboard/Dashboard.jsx

import { motion } from "framer-motion";
import {
  FaDownload,
  FaMoneyBillWave,
  FaMobileAlt,
  FaBullhorn,
  FaPlay,
  FaCalendarAlt,
  FaChartLine,
  FaUsers,
  FaTrophy,
} from "react-icons/fa";

const stats = [
  {
    title: "Total Earnings",
    value: "$12,645.00",
    icon: <FaMoneyBillWave />,
    color: "from-emerald-500 to-teal-600",
  },
  {
    title: "Free Apps Published",
    value: "3,599",
    icon: <FaMobileAlt />,
    color: "from-blue-500 to-cyan-600",
  },
  {
    title: "Total Downloads",
    value: "51,520",
    icon: <FaDownload />,
    color: "from-purple-500 to-pink-600",
  },
  {
    title: "Total Withdrawals",
    value: "$8,920.50",
    icon: <FaMoneyBillWave />,
    color: "from-amber-500 to-orange-600",
  },
  {
    title: "Paid Apps",
    value: "$32,566.67",
    icon: <FaTrophy />,
    color: "from-indigo-500 to-purple-600",
  },
  {
    title: "Active Promotions",
    value: "42",
    icon: <FaBullhorn />,
    color: "from-rose-500 to-pink-600",
  },
];

const cardAnim = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const Dashboard = () => {
  return (
    <div className="min-h-screen  lg:p-8">
      {/* STATS GRID - Premium Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {stats.map((item, i) => (
          <motion.div
            key={i}
            variants={cardAnim}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="group relative overflow-hidden bg-white/80 backdrop-blur-md rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 border border-white/50"
            whileHover={{ y: -8 }}
          >
            <div
              className={`absolute inset-0 bg-gradient-to-br ${item.color} opacity-90`}
            />
            <div className="relative z-10 p-6 flex items-center justify-between">
              <div>
                <p className="text-white/90 text-sm font-medium">
                  {item.title}
                </p>
                <h2 className="text-3xl font-extrabold text-white mt-2">
                  {item.value}
                </h2>
              </div>
              <div className="text-5xl text-white/80 group-hover:scale-110 transition-transform duration-300">
                {item.icon}
              </div>
            </div>
            <div className="absolute bottom-0 left-0 w-full h-1 bg-white/30" />
          </motion.div>
        ))}
      </div>

      {/* MIDDLE SECTION - Enhanced Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Progress Analytics */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="bg-white/80 backdrop-blur-md rounded-2xl shadow-xl p-6 border border-white/30"
        >
          <h3 className="text-xl font-bold text-gray-800 mb-5 flex items-center gap-3">
            <FaChartLine className="text-indigo-600" />
            Performance Overview
          </h3>
          <div className="space-y-5">
            {[
              {
                label: "Download Growth",
                value: 78,
                color: "bg-gradient-to-r from-indigo-500 to-purple-600",
              },
              {
                label: "Revenue Increase",
                value: 65,
                color: "bg-gradient-to-r from-emerald-500 to-teal-600",
              },
              {
                label: "User Engagement",
                value: 92,
                color: "bg-gradient-to-r from-pink-500 to-rose-600",
              },
            ].map((bar, i) => (
              <div key={i}>
                <div className="flex justify-between text-sm text-gray-600 mb-2">
                  <span>{bar.label}</span>
                  <span className="font-semibold">{bar.value}%</span>
                </div>
                <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: `${bar.value}%` }}
                    transition={{ duration: 1.2, delay: i * 0.2 }}
                    className={`h-full ${bar.color} rounded-full shadow-md`}
                  />
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Engagement Chart Placeholder */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 rounded-2xl shadow-2xl p-6 text-white"
        >
          <h3 className="text-xl font-bold mb-4 flex items-center gap-3">
            <FaUsers /> User Engagement
          </h3>
          <div className="h-64 bg-white/10 backdrop-blur rounded-xl flex items-center justify-center">
            <p className="text-2xl font-semibold opacity-80">Analytics Chart</p>
          </div>
          <p className="text-sm mt-4 opacity-90">
            Real-time data visualization coming soon!
          </p>
        </motion.div>

        {/* Calendar */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="bg-white/80 backdrop-blur-md rounded-2xl shadow-xl p-6 border border-white/30"
        >
          <h3 className="text-xl font-bold text-gray-800 mb-5 flex items-center gap-3">
            <FaCalendarAlt className="text-purple-600" />
            Upcoming Events
          </h3>
          <div className="grid grid-cols-7 gap-2 text-center text-sm font-medium text-gray-600 mb-3">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
              <div key={day}>{day}</div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-2 text-center">
            {Array.from({ length: 35 }, (_, i) => {
              const day = i + 1;
              const isToday = day === 5; // Simulate today as 5th
              return (
                <motion.span
                  key={i}
                  whileHover={{ scale: 1.1 }}
                  className={`p-3 rounded-xl transition-all ${
                    isToday
                      ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold shadow-lg"
                      : day > 30
                      ? "text-gray-300"
                      : "bg-gray-100 hover:bg-indigo-100 text-gray-700"
                  }`}
                >
                  {day <= 31 ? day : ""}
                </motion.span>
              );
            })}
          </div>
        </motion.div>
      </div>

      {/* VIDEO / PROMO SECTION */}
      <div className="mb-8">
        <h3 className="text-2xl font-bold text-white mb-5">
          Featured Tutorials
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { title: "How to Boost Your App", views: "12.5K views" },
            { title: "Monetization Strategies", views: "8.2K views" },
            { title: "APK Optimization Tips", views: "15.8K views" },
          ].map((video, i) => (
            <motion.div
              key={i}
              whileHover={{ scale: 1.05 }}
              className="relative overflow-hidden rounded-2xl shadow-xl cursor-pointer group"
            >
              <div className="bg-gradient-to-br from-indigo-600 to-purple-700 h-48 flex items-center justify-center">
                <FaPlay className="text-white text-5xl group-hover:scale-110 transition-transform" />
              </div>
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-5">
                <div className="text-white">
                  <h4 className="font-bold text-lg">{video.title}</h4>
                  <p className="text-sm opacity-90">{video.views}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* FOOTER NOTICE */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-2xl shadow-2xl p-6 text-white flex flex-col md:flex-row justify-between items-center"
      >
        <div>
          <p className="text-lg font-semibold">
            <span className="underline decoration-white/50">
              Important Notice:
            </span>
          </p>
          <p className="mt-2 opacity-90">
            Oracle APK Store will be undergoing scheduled maintenance on January
            10, 2026. Uploads may be temporarily unavailable.
          </p>
        </div>
        <p className="text-sm mt-4 md:mt-0 opacity-80">
          Date: <span className="font-bold">January 05, 2026</span>
        </p>
      </motion.div>
    </div>
  );
};

export default Dashboard;
