import React, { useState, useEffect } from "react";
import { Bar, Doughnut, Line } from "react-chartjs-2";
import Calendar from "react-calendar";
import { motion } from "framer-motion";
import "react-calendar/dist/Calendar.css";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Tooltip,
  Legend
);

const Dashboard = () => {
  const [date, setDate] = useState(new Date());
  const [time, setTime] = useState(new Date());

  // Live clock update
  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const barData = {
    labels: ["JAN", "FEB", "MAR", "APR", "MAY", "JUNE", "JULY", "AUG"],
    datasets: [
      {
        label: "2019",
        data: [25, 45, 30, 35, 20, 55, 40, 38],
        backgroundColor: "#0D2E63",
      },
      {
        label: "2020",
        data: [18, 30, 28, 40, 25, 48, 30, 43],
        backgroundColor: "#F9B127",
      },
    ],
  };

  const areaData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [
      {
        label: "Lorem ipsum",
        data: [30, 50, 35, 60, 45, 70],
        borderColor: "#F9B127",
        backgroundColor: "rgba(249,177,39,.4)",
        tension: 0.4,
        fill: true,
      },
      {
        label: "Dolor Amet",
        data: [20, 40, 25, 50, 40, 55],
        borderColor: "#0D2E63",
        backgroundColor: "rgba(13,46,99,.4)",
        tension: 0.4,
        fill: true,
      },
    ],
  };

  const donutData = {
    datasets: [
      {
        data: [45, 55],
        backgroundColor: ["#F9B127", "#0D2E63"],
      },
    ],
  };

  return (
    <div className="p-5 md:p-10 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-5">Dashboard User</h1>

      {/* Top Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-[#0D2E63] text-white rounded-xl p-6 shadow-lg"
        >
          <p className="text-sm">Earning</p>
          <h1 className="text-3xl font-bold mt-2">$ 628</h1>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl p-6 shadow-lg"
        >
          <p className="text-gray-500 text-sm">Share</p>
          <h1 className="text-3xl font-bold">2434</h1>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl p-6 shadow-lg"
        >
          <p className="text-gray-500 text-sm">Likes</p>
          <h1 className="text-3xl font-bold">1259</h1>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl p-6 shadow-lg"
        >
          <p className="text-gray-500 text-sm">Rating</p>
          <h1 className="text-3xl font-bold">8.5</h1>
        </motion.div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mt-6">
        {/* Bar Chart */}
        <motion.div
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="bg-white p-5 rounded-xl shadow-lg col-span-2"
        >
          <div className="flex justify-between items-center mb-3">
            <h2 className="font-bold">Result</h2>
            <button className="bg-orange-400 text-white px-4 py-1 rounded">
              Check Now
            </button>
          </div>
          <Bar data={barData} />
        </motion.div>

        {/* Donut */}
        <motion.div
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="bg-white p-5 rounded-xl shadow-lg"
        >
          <div className="w-40 mx-auto">
            <Doughnut data={donutData} />
          </div>

          <ul className="mt-5 space-y-2 text-gray-600">
            <li>Lorem ipsum</li>
            <li>Lorem ipsum</li>
            <li>Lorem ipsum</li>
            <li>Lorem ipsum</li>
          </ul>

          <button className="bg-orange-400 mt-4 w-full text-white py-2 rounded">
            Check Now
          </button>
        </motion.div>
      </div>

      {/* Area & Calendar */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mt-6">
        <motion.div
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="bg-white p-5 rounded-xl shadow-lg"
        >
          <Line data={areaData} />
        </motion.div>

        {/* Stylish Calendar */}
        <motion.div
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="bg-white p-6 rounded-xl shadow-lg"
        >
          <div className="text-center mb-4">
            <h2 className="text-lg font-semibold text-gray-700">Today</h2>
            <p className="text-xl font-bold text-[#0D2E63]">
              {time.toLocaleDateString()}
            </p>
            <p className="text-2xl font-semibold text-orange-500">
              {time.toLocaleTimeString()}
            </p>
          </div>

          <div className="custom-calendar border rounded-xl overflow-hidden shadow">
            <Calendar
              value={date}
              onChange={setDate}
              className="w-full p-3 rounded-xl"
            />
          </div>
        </motion.div>
      </div>

      {/* Calendar Custom Styling */}
      <style>
        {`
        .react-calendar {
          width: 100%;
          border: none;
          background: #f7f9fc;
          border-radius: 15px;
        }
        
        .react-calendar__tile {
          border-radius: 8px;
          padding: 12px 0;
        }

        .react-calendar__tile--now {
          background: #F9B127 !important;
          color: white !important;
          border-radius: 10px;
        }

        .react-calendar__tile--active {
          background: #0D2E63 !important;
          color: white !important;
        }

        .react-calendar__navigation button {
          color: #0D2E63;
          font-weight: bold;
        }
      `}
      </style>
    </div>
  );
};

export default Dashboard;
