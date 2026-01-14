import { FaWhatsappSquare, FaTelegram } from "react-icons/fa";
import { IoLogoWhatsapp } from "react-icons/io";
import { MdEmail } from "react-icons/md";

const SupportSection = () => {
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

  const handleEmail = () => {
    // 👉 নিজের WhatsApp number
    const url = "mailto:oraclesoft.org@gmail.com";
    window.open(url, "_blank");
  };

  return (
    <section className="max-w-7xl mx-auto px-4 py-2">
      <div className="flex flex-col md:flex-row items-center justify-between gap-8">
        {/* Left Side Text */}
        <div className="flex-1 text-center md:text-left">
          <h2 className="text-2xl font-bold mb-3">Need Support!</h2>
        </div>

        {/* Right Side Icon Cards */}
        <div className="flex gap-4">
          {/* WhatsApp */}
          <button
            onClick={handleWhatsApp}
            className="w-10 h-10 flex cursor-pointer items-center text-green-500 justify-center rounded-xl bg-gray-100 
                       hover:bg-green-500 hover:text-white
                       transition-all duration-300 hover:scale-110 shadow"
          >
            <IoLogoWhatsapp size={26} />
          </button>

          {/* Email */}
          <button
            onClick={handleEmail}
            className="w-10 h-10 flex cursor-pointer items-center text-green-500 justify-center rounded-xl bg-gray-100 
                       hover:bg-red-500 hover:text-white
                       transition-all duration-300 hover:scale-110 shadow"
          >
            <MdEmail size={26} />
          </button>

          {/* Telegram */}
          <button
            onClick={handleTelegram}
            className="w-10 h-10 text-green-500 flex cursor-pointer items-center justify-center rounded-xl bg-gray-100 
                       hover:bg-blue-500 hover:text-white
                       transition-all duration-300 hover:scale-110 shadow"
          >
            <FaTelegram size={26} />
          </button>
        </div>
      </div>
    </section>
  );
};

export default SupportSection;
