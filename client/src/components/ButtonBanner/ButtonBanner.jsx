import React from 'react';
import { IoIosApps } from "react-icons/io";
import { FaGooglePlay } from "react-icons/fa";

const ButtonBanner = () => {
    return (
        <div>
            {/* mobile Header */}
      <div className="flex flex-col gap-2 md:hidden md:flex-row md:items-stretch md:gap-3">
        <div className="flex gap-2 md:flex-[2]">
          <div className="flex-1 gradient-animate text-white px-2 py-1 md:px-6 md:py-3 rounded-md font-bold shadow flex items-center justify-center">
            <span className="flex gap-2 items-center">
              Oracle Store <FaGooglePlay size={20} />
            </span>
          </div>

          <div className="flex-1 rgb-badge text-white px-2 py-1 md:px-6 md:py-3 rounded-md font-bold shadow flex items-center justify-center">
            <span className="flex gap-2 items-center">
               APPS <IoIosApps size={20} />
            </span>
          </div>
        </div>

        <div className="md:flex-[8] relative bg-white rounded-md shadow flex items-center justify-center">
          <img
            className="h-20 md:h-full w-full object-cover rounded-md"
            src="https://i.ibb.co.com/5XmZSPWz/detailed-esports-gaming-logo-template-1029473-588861-ezgif-com-avif-to-jpg-converter.jpg"
            alt="Logo"
          />
          <span className="bg-white absolute top-0 right-0 px-1 py-[0.5] text-black text-sm">
            Ads
          </span>
        </div>
      </div>

      {/* desktop Header */}
      <div className="hidden md:flex items-stretch gap-3">
        <div className="flex-[2] gradient-animate text-white px-6 py-3 rounded-md font-bold shadow flex items-center justify-center">
          <span className="flex gap-2 items-center">
            Oracle Store <FaGooglePlay size={20} />
          </span>
        </div>

        <div className="flex-[8] relative bg-white rounded-md shadow flex items-center justify-center">
          <img
            className="h-full max-h-14 w-full object-cover rounded-md"
            src="https://i.ibb.co.com/5XmZSPWz/detailed-esports-gaming-logo-template-1029473-588861-ezgif-com-avif-to-jpg-converter.jpg"
            alt="Logo"
          />
          <span className="bg-white absolute top-0 right-0 px-1 py-[0.5] text-black text-sm">
            Ads
          </span>
        </div>

        <div className="flex-[2] rgb-badge text-white px-6 py-3 rounded-md font-bold shadow flex items-center justify-center">
          <span className="flex gap-2 items-center">
            APPS <IoIosApps size={20} />
          </span>
        </div>
      </div>
        </div>
    );
};

export default ButtonBanner;