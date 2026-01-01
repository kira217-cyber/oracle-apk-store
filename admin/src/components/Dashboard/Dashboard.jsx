import { motion } from "framer-motion";
import {
  FaDownload,
  FaMoneyBillWave,
  FaMobileAlt,
  FaBullhorn,
  FaPlay,
  FaCalendarAlt,
} from "react-icons/fa";

const stats = [
  { title: "Total Earning", value: "$126.45", icon: <FaMoneyBillWave /> },
  { title: "Total Free Publish App", value: "3599", icon: <FaMobileAlt /> },
  { title: "Total Download", value: "5,152", icon: <FaDownload /> },
  { title: "Total Withdraw", value: "$126.45", icon: <FaMoneyBillWave /> },
  { title: "Total Paid App", value: "3,256.67", icon: <FaMobileAlt /> },
  { title: "Total Promotion", value: "5,152", icon: <FaBullhorn /> },
];

const cardAnim = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
};

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-6">
      {/* STATS GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {stats.map((item, i) => (
          <motion.div
            key={i}
            variants={cardAnim}
            initial="hidden"
            animate="visible"
            transition={{ delay: i * 0.1 }}
            className="bg-white rounded-xl shadow-md p-5 flex items-center justify-between"
          >
            <div>
              <p className="text-sm text-gray-500">{item.title}</p>
              <h2 className="text-2xl font-bold text-indigo-600">
                {item.value}
              </h2>
            </div>
            <div className="text-3xl text-indigo-500">{item.icon}</div>
          </motion.div>
        ))}
      </div>

      {/* MIDDLE SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-6">
        {/* SLIDERS / INFO */}
        <motion.div
          className="bg-white rounded-xl shadow-md p-5"
          whileHover={{ scale: 1.02 }}
        >
          <p className="font-semibold mb-3">Progress</p>
          {[60, 40, 80].map((v, i) => (
            <div key={i} className="mb-3">
              <div className="h-2 bg-gray-200 rounded">
                <div
                  className="h-2 bg-indigo-600 rounded"
                  style={{ width: `${v}%` }}
                />
              </div>
            </div>
          ))}
          <p className="text-xs text-gray-400">
            Lorem ipsum dolor sit amet consectetur adipisicing elit.
          </p>
        </motion.div>

        {/* CHART PLACEHOLDER */}
        <motion.div
          className="bg-white rounded-xl shadow-md p-5 col-span-1 lg:col-span-1"
          whileHover={{ scale: 1.02 }}
        >
          <p className="font-semibold mb-3">Engagement</p>
          <div className="h-40 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center text-white font-bold">
            Chart Area
          </div>
        </motion.div>

        {/* CALENDAR */}
        <motion.div
          className="bg-white rounded-xl shadow-md p-5"
          whileHover={{ scale: 1.02 }}
        >
          <p className="font-semibold mb-3 flex items-center gap-2">
            <FaCalendarAlt /> Calendar
          </p>
          <div className="grid grid-cols-7 gap-2 text-center text-sm">
            {Array.from({ length: 30 }).map((_, i) => (
              <span
                key={i}
                className={`p-2 rounded ${
                  i === 0 ? "bg-indigo-600 text-white" : "bg-gray-100"
                }`}
              >
                {i + 1}
              </span>
            ))}
          </div>
        </motion.div>
      </div>

      {/* VIDEO SECTION */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
        {[1, 2, 3].map((_, i) => (
          <motion.div
            key={i}
            className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl h-36 flex items-center justify-center shadow-md"
            whileHover={{ scale: 1.05 }}
          >
            <FaPlay className="text-white text-4xl" />
          </motion.div>
        ))}
      </div>

      {/* FOOTER NOTICE */}
      <motion.div
        className="bg-white rounded-xl shadow-md mt-6 p-4 flex flex-col md:flex-row justify-between items-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <p>
          <span className="font-semibold text-indigo-600">Notice:</span> Oracle
          Apk Store.....
        </p>
        <p className="text-sm text-gray-500 mt-2 md:mt-0">
          Date: <span className="font-semibold">12/12/2025</span>
        </p>
      </motion.div>
    </div>
  );
};

export default Dashboard;
