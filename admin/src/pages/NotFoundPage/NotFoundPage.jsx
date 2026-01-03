import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router";

const NotFoundPage = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-white px-4">
      <div className="text-center max-w-xl">

        {/* Floating Cartoon Illustration */}
        <motion.div
          initial={{ y: -20 }}
          animate={{ y: [0, -20, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="flex justify-center"
        >
          <img
            src="https://i.ibb.co.com/Kz9wVW8H/page-found-concept-illustration-114360-1869.avif"
            alt="404 Illustration"
            className="w-64 sm:w-80 drop-shadow-2xl"
          />
        </motion.div>

        {/* Big 404 Text */}
        <motion.h1
          initial={{ opacity: 0, scale: 0.6 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="text-black text-5xl sm:text-7xl font-extrabold mt-6"
        >
          404
        </motion.h1>

        {/* Small Description */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="text-black text-lg sm:text-xl mt-4"
        >
          Oops! The page you are looking for doesn’t exist 💔
        </motion.p>

        {/* Home Button */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.9, type: "spring" }}
          className="mt-6"
        >
          <Link to="/">
            <button className="bg-white cursor-pointer text-blue-600 px-6 py-3 rounded-full font-bold text-lg shadow-lg hover:bg-blue-700 hover:text-white transition-all duration-300">
              Go Back Home
            </button>
          </Link>
        </motion.div>

      </div>
    </div>
  );
};

export default NotFoundPage;
