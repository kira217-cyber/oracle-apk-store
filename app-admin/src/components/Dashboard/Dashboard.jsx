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
  Filler,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Tooltip,
  Legend,
  Filler
);

const Dashboard = () => {
  const [date, setDate] = useState(new Date());
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Chart Data
  const barData = {
    labels: ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG"],
    datasets: [
      {
        label: "Revenue 2024",
        data: [45, 62, 58, 75, 68, 90, 82, 88],
        backgroundColor: "#1d4ed8",
        borderRadius: 10,
        barThickness: 24,
      },
      {
        label: "Revenue 2025",
        data: [38, 52, 48, 65, 60, 85, 75, 92],
        backgroundColor: "#3b82f6",
        borderRadius: 10,
        barThickness: 24,
      },
    ],
  };

  const lineData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"],
    datasets: [
      {
        label: "App Downloads",
        data: [30, 55, 45, 70, 60, 85, 95],
        borderColor: "#3b82f6",
        backgroundColor: "rgba(59, 130, 246, 0.15)",
        tension: 0.4,
        fill: true,
        pointBackgroundColor: "#3b82f6",
        pointBorderColor: "#fff",
        pointBorderWidth: 2,
        pointRadius: 6,
      },
      {
        label: "Active Users",
        data: [20, 40, 35, 55, 50, 70, 80],
        borderColor: "#1d4ed8",
        backgroundColor: "rgba(29, 78, 216, 0.15)",
        tension: 0.4,
        fill: true,
        pointBackgroundColor: "#1d4ed8",
        pointBorderColor: "#fff",
        pointBorderWidth: 2,
        pointRadius: 6,
      },
    ],
  };

  const doughnutData = {
    labels: ["Approved", "Pending"],
    datasets: [
      {
        data: [68, 32],
        backgroundColor: ["#1d4ed8", "#3b82f6"],
        borderWidth: 0,
        cutout: "78%",
        borderRadius: 10,
      },
    ],
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false }, tooltip: { enabled: true } },
  };

  return (
    <div className="min-h-screen text-white">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 text-center sm:text-left"
      >
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-[#1d4ed8] to-[#60a5fa] bg-clip-text text-transparent">
          Admin Dashboard
        </h1>
        <p className="text-blue-300 mt-3 text-base sm:text-lg">
          Welcome back! Here's your system overview.
        </p>
      </motion.div>

      {/* Stats Cards - Fully Responsive */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6 mb-10">
        {[
          { label: "Total Revenue", value: "$48,927", icon: "💰" },
          { label: "Total Users", value: "12,845", icon: "👥" },
          { label: "Total Apps", value: "568", icon: "📱" },
          { label: "Active Today", value: "3,421", icon: "🔥" },
        ].map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white/5 backdrop-blur-2xl border border-blue-900/40 rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-2xl hover:shadow-blue-800/40 transition-all duration-300"
          >
            <div className="text-3xl sm:text-4xl mb-3 sm:mb-4">{stat.icon}</div>
            <p className="text-blue-300 text-sm sm:text-base font-medium">
              {stat.label}
            </p>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold mt-3 bg-gradient-to-r from-[#3b82f6] to-[#60a5fa] bg-clip-text text-transparent">
              {stat.value}
            </h2>
          </motion.div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 mb-10">
        {/* Revenue Bar Chart */}
        <motion.div
          initial={{ x: -60, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="lg:col-span-2 bg-white/5 backdrop-blur-2xl rounded-3xl p-6 sm:p-8 border border-blue-900/30 shadow-2xl"
        >
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 sm:mb-8 gap-4">
            <h3 className="text-xl sm:text-2xl font-bold">Revenue Overview</h3>
            <button className="bg-gradient-to-r from-[#1d4ed8] to-[#3b82f6] px-5 sm:px-6 py-2.5 sm:py-3 rounded-2xl font-semibold hover:shadow-xl transition text-sm sm:text-base">
              View Full Report
            </button>
          </div>
          <div className="h-64 sm:h-80">
            <Bar
              data={barData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: "top",
                    labels: { color: "#e2e8f0", font: { size: 13 } },
                  },
                },
                scales: {
                  x: { grid: { display: false }, ticks: { color: "#94a3b8" } },
                  y: {
                    grid: { color: "#1e293b" },
                    ticks: { color: "#94a3b8" },
                  },
                },
              }}
            />
          </div>
        </motion.div>

        {/* Approval Status */}
        <motion.div
          initial={{ x: 60, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="bg-white/5 backdrop-blur-2xl rounded-3xl p-6 sm:p-8 border border-blue-900/30 shadow-2xl flex flex-col items-center justify-center"
        >
          <h3 className="text-xl sm:text-2xl font-bold mb-6 sm:mb-8">
            App Approval Status
          </h3>
          <div className="relative w-56 h-56 sm:w-64 sm:h-64">
            <Doughnut data={doughnutData} options={doughnutOptions} />
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <p className="text-4xl sm:text-5xl font-extrabold text-white">
                68%
              </p>
              <p className="text-blue-300 text-base sm:text-lg mt-2">
                Approved
              </p>
            </div>
          </div>
          <button className="mt-8 sm:mt-10 w-full bg-gradient-to-r from-[#1d4ed8] to-[#3b82f6] py-3.5 sm:py-4 rounded-2xl font-bold hover:shadow-xl transition">
            Review Pending Apps
          </button>
        </motion.div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
        {/* User Growth */}
        <motion.div
          initial={{ y: 60, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="bg-white/5 backdrop-blur-2xl rounded-3xl p-6 sm:p-8 border border-blue-900/30 shadow-2xl"
        >
          <h3 className="text-xl sm:text-2xl font-bold mb-6 sm:mb-8">
            User Growth Trend
          </h3>
          <div className="h-64 sm:h-80">
            <Line
              data={lineData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: { position: "top", labels: { color: "#e2e8f0" } },
                },
                scales: {
                  x: { grid: { display: false }, ticks: { color: "#94a3b8" } },
                  y: {
                    grid: { color: "#1e293b" },
                    ticks: { color: "#94a3b8" },
                  },
                },
              }}
            />
          </div>
        </motion.div>

        {/* Calendar & Clock */}
        <motion.div
          initial={{ y: 60, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="bg-white/5 backdrop-blur-2xl rounded-3xl p-6 sm:p-10 border border-blue-900/30 shadow-2xl"
        >
          <div className="text-center mb-8 sm:mb-10">
            <h3 className="text-2xl sm:text-3xl font-bold">Current Time</h3>
            <p className="text-lg sm:text-2xl text-blue-300 mt-3 sm:mt-4 font-medium">
              {time.toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
            <p className="text-4xl sm:text-5xl font-extrabold bg-gradient-to-r from-[#3b82f6] to-[#60a5fa] bg-clip-text text-transparent mt-4 sm:mt-6">
              {time.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
              })}
            </p>
          </div>

          <div className="bg-black/40 backdrop-blur-xl rounded-3xl p-4 sm:p-6 shadow-2xl flex justify-center">
            <Calendar
              value={date}
              onChange={setDate}
              tileClassName={({ date: tileDate, view }) => {
                if (view === "month") {
                  const today = new Date();
                  const isToday =
                    tileDate.getDate() === today.getDate() &&
                    tileDate.getMonth() === today.getMonth() &&
                    tileDate.getFullYear() === today.getFullYear();

                  if (isToday) {
                    return "bg-gradient-to-br from-orange-500 to-amber-400 text-white font-extrabold rounded-xl shadow-lg shadow-orange-600/50 scale-110 z-10";
                  }
                  return "text-gray-300 hover:bg-blue-900/60 hover:text-white rounded-xl transition-all duration-200";
                }
                return "";
              }}
              navigationLabel={({ date }) => (
                <span className="text-blue-300 text-lg sm:text-xl font-bold">
                  {date.toLocaleDateString("en-US", {
                    month: "long",
                    year: "numeric",
                  })}
                </span>
              )}
              prevLabel={
                <span className="text-2xl text-blue-400 hover:text-blue-300">
                  ‹
                </span>
              }
              nextLabel={
                <span className="text-2xl text-blue-400 hover:text-blue-300">
                  ›
                </span>
              }
              prev2Label={null}
              next2Label={null}
              showNeighboringMonth={false}
              className="custom-calendar w-full"
            />
          </div>
        </motion.div>
      </div>

      {/* Custom Calendar Styles */}
      <style jsx global>{`
        .custom-calendar {
          background: transparent !important;
          border: none !important;
          font-family: inherit;
        }
        .custom-calendar .react-calendar__navigation {
          margin-bottom: 1rem;
        }
        .custom-calendar .react-calendar__navigation button {
          color: #60a5fa !important;
          background: transparent !important;
          font-size: 1.5rem !important;
        }
        .custom-calendar .react-calendar__month-view__weekdays {
          text-transform: uppercase;
          font-weight: bold;
          color: #94a3b8 !important;
          font-size: 0.8rem sm:0.9rem;
          margin-bottom: 1rem;
        }
        .custom-calendar .react-calendar__month-view__weekdays__weekday abbr {
          text-decoration: none !important;
        }
        .custom-calendar .react-calendar__tile {
          padding: 0.8rem !important;
          border-radius: 12px !important;
          transition: all 0.3s ease !important;
          font-weight: 500;
          font-size: 0.9rem sm:1rem;
        }
        .custom-calendar .react-calendar__tile:enabled:hover {
          background: rgba(59, 130, 246, 0.3) !important;
        }
        .custom-calendar .react-calendar__tile--now {
          background: transparent !important;
        }
      `}</style>
    </div>
  );
};

export default Dashboard;
