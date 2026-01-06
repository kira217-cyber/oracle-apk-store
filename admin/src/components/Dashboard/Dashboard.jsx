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
    color: "from-orange-500 to-amber-600",
  },
  {
    title: "Free Apps Published",
    value: "3,599",
    icon: <FaMobileAlt />,
    color: "from-orange-600 to-orange-700",
  },
  {
    title: "Total Downloads",
    value: "51,520",
    icon: <FaDownload />,
    color: "from-amber-500 to-orange-600",
  },
  {
    title: "Total Withdrawals",
    value: "$8,920.50",
    icon: <FaMoneyBillWave />,
    color: "from-orange-400 to-amber-500",
  },
  {
    title: "Paid Apps",
    value: "$32,566.67",
    icon: <FaTrophy />,
    color: "from-amber-600 to-orange-600",
  },
  {
    title: "Active Promotions",
    value: "42",
    icon: <FaBullhorn />,
    color: "from-orange-500 to-red-600",
  },
];

const cardAnim = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const Dashboard = () => {
  return (
    <div className="min-h-screenlg:p-8">
      {/* STATS GRID - Premium Dark Orange Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
        {stats.map((item, i) => (
          <motion.div
            key={i}
            variants={cardAnim}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="group relative overflow-hidden bg-gray-900/80 backdrop-blur-xl rounded-2xl shadow-2xl border border-orange-800/40 transition-all duration-500 cursor-pointer"
            whileHover={{ y: -10, scale: 1.02 }}
          >
            <div
              className={`absolute inset-0 bg-gradient-to-br ${item.color} opacity-90`}
            />
            <div className="relative z-10 p-7 flex items-center justify-between">
              <div>
                <p className="text-orange-200/90 text-sm font-medium">
                  {item.title}
                </p>
                <h2 className="text-4xl font-extrabold text-white mt-3">
                  {item.value}
                </h2>
              </div>
              <div className="text-6xl text-white/70 group-hover:scale-110 transition-transform duration-300">
                {item.icon}
              </div>
            </div>
            <div className="absolute bottom-0 left-0 w-full h-1 bg-orange-400/40" />
          </motion.div>
        ))}
      </div>

      {/* MIDDLE SECTION - Enhanced Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
        {/* Progress Analytics */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="bg-gray-900/80 backdrop-blur-xl rounded-2xl shadow-2xl p-7 border border-orange-800/30"
        >
          <h3 className="text-2xl font-bold text-orange-300 mb-6 flex items-center gap-4">
            <FaChartLine className="text-orange-500" />
            Performance Overview
          </h3>
          <div className="space-y-6">
            {[
              {
                label: "Download Growth",
                value: 78,
                color: "bg-gradient-to-r from-orange-500 to-amber-600",
              },
              {
                label: "Revenue Increase",
                value: 65,
                color: "bg-gradient-to-r from-amber-500 to-orange-600",
              },
              {
                label: "User Engagement",
                value: 92,
                color: "bg-gradient-to-r from-orange-600 to-red-600",
              },
            ].map((bar, i) => (
              <div key={i}>
                <div className="flex justify-between text-sm text-gray-300 mb-3">
                  <span>{bar.label}</span>
                  <span className="font-bold text-orange-400">
                    {bar.value}%
                  </span>
                </div>
                <div className="h-4 bg-gray-800 rounded-full overflow-hidden shadow-inner">
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: `${bar.value}%` }}
                    transition={{ duration: 1.4, delay: i * 0.2 }}
                    className={`h-full ${bar.color} rounded-full shadow-lg`}
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
          transition={{ duration: 0.8 }}
          className="bg-gradient-to-br from-orange-600 via-amber-600 to-orange-700 rounded-2xl shadow-2xl p-7 text-white"
        >
          <h3 className="text-2xl font-bold mb-5 flex items-center gap-4">
            <FaUsers className="text-orange-200" />
            User Engagement
          </h3>
          <div className="h-64 bg-black/20 backdrop-blur rounded-2xl flex items-center justify-center border border-orange-400/30">
            <p className="text-3xl font-semibold text-orange-100 opacity-90">
              Analytics Chart
            </p>
          </div>
          <p className="text-sm mt-5 text-orange-200 opacity-90 text-center">
            Real-time data visualization coming soon!
          </p>
        </motion.div>

        {/* Calendar */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="bg-gray-900/80 backdrop-blur-xl rounded-2xl shadow-2xl p-7 border border-orange-800/30"
        >
          <h3 className="text-2xl font-bold text-orange-300 mb-6 flex items-center gap-4">
            <FaCalendarAlt className="text-orange-500" />
            Upcoming Events
          </h3>
          <div className="grid grid-cols-7 gap-2 text-center text-sm font-medium text-gray-400 mb-4">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
              <div key={day}>{day}</div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-3 text-center">
            {Array.from({ length: 35 }, (_, i) => {
              const day = i + 1;
              const isToday = day === 7; // Updated to January 7, 2026
              return (
                <motion.span
                  key={i}
                  whileHover={{ scale: 1.15 }}
                  className={`p-4 rounded-2xl transition-all cursor-pointer ${
                    isToday
                      ? "bg-gradient-to-r from-orange-600 to-amber-600 text-white font-bold shadow-xl shadow-orange-900/50"
                      : day > 31
                      ? "text-gray-600"
                      : "bg-gray-800/50 hover:bg-orange-900/40 text-gray-300 hover:text-orange-300"
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
      <div className="mb-10">
        <h3 className="text-3xl font-bold text-orange-300 mb-7">
          Featured Tutorials
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { title: "How to Boost Your App", views: "12.5K views" },
            { title: "Monetization Strategies", views: "8.2K views" },
            { title: "APK Optimization Tips", views: "15.8K views" },
          ].map((video, i) => (
            <motion.div
              key={i}
              whileHover={{ scale: 1.06 }}
              className="relative overflow-hidden rounded-2xl shadow-2xl cursor-pointer group"
            >
              <div className="bg-gradient-to-br from-orange-600 to-amber-700 h-56 flex items-center justify-center">
                <FaPlay className="text-white text-6xl group-hover:scale-120 transition-transform duration-300" />
              </div>
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                <div className="text-white">
                  <h4 className="font-bold text-xl">{video.title}</h4>
                  <p className="text-sm opacity-90 mt-1">{video.views}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* FOOTER NOTICE - Updated Date */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="bg-gradient-to-r from-orange-600 via-amber-600 to-orange-700 rounded-2xl shadow-2xl p-8 text-white flex flex-col md:flex-row justify-between items-center border border-orange-500/50"
      >
        <div>
          <p className="text-xl font-bold">
            <span className="underline decoration-white/60">
              Important Notice:
            </span>
          </p>
          <p className="mt-3 text-lg opacity-95">
            APK Store will be undergoing scheduled maintenance on January 10,
            2026. Uploads may be temporarily unavailable.
          </p>
        </div>
        <p className="text-sm mt-5 md:mt-0 opacity-90">
          Current Date:{" "}
          <span className="font-bold text-xl">January 07, 2026</span>
        </p>
      </motion.div>
    </div>
  );
};

export default Dashboard;
