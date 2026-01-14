import React from "react";
import { FaWhatsapp, FaTelegramPlane } from "react-icons/fa";

const FloatingSocial = () => {
  const handleWhatsApp = () => {
    // 👉 নিজের WhatsApp number
    const url = `https://wa.me/+447877195509`;
    window.open(url, "_blank");
  };

  const handleTelegram = () => {
    // 👉 নিজের Telegram username
    const url = `https://t.me/oraclesoftworld`;
    window.open(url, "_blank");
  };

  return (
    <div className="fixed bottom-20 right-4 md:right-20 z-50 flex flex-col gap-3 max-w-7xl">
      {/* WhatsApp */}
      <button
        onClick={handleWhatsApp}
        aria-label="WhatsApp"
        className="bg-green-500 hover:bg-green-600 cursor-pointer text-white p-3 rounded-full shadow-lg transition-transform transform hover:scale-110"
      >
        <FaWhatsapp className="text-2xl md:text-3xl" />
      </button>

      {/* Telegram */}
      <button
        onClick={handleTelegram}
        aria-label="Telegram"
        className="bg-blue-500 hover:bg-blue-600 text-white cursor-pointer p-3 rounded-full shadow-lg transition-transform transform hover:scale-110"
      >
        <FaTelegramPlane className="text-2xl md:text-3xl" />
      </button>
    </div>
  );
};

export default FloatingSocial;
