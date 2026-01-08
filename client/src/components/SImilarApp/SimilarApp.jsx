import React from "react";
import { FaChevronRight, FaStar } from "react-icons/fa";

const SimilarApp = () => {
  return (
    <div>
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-800">Similar apps</h2>
          <FaChevronRight className="text-gray-500" />
        </div>

        <div className="space-y-5">
          {/* App Item */}
          <div className="flex gap-4 items-center">
            <img
              src="https://i.ibb.co.com/zTcxmwdt/unnamed.webp"
              alt=""
              className="w-16 h-16 rounded-xl object-cover"
            />
            <div>
              <p className="text-lg font-medium text-gray-800">
                1.1.1.1 + WARP: Safer Internet
              </p>
              <p className="text-sm text-gray-500">Cloudflare, Inc.</p>
              <div className="flex items-center gap-1 text-sm text-gray-600 mt-1">
                <span>4.3</span>
                <FaStar className="text-green-600" />
              </div>
            </div>
          </div>

          {/* App Item */}
          <div className="flex gap-4 items-center">
            <img
              src="https://i.ibb.co.com/PK9YFVR/unnamed-1.webp"
              alt=""
              className="w-16 h-16 rounded-xl object-cover"
            />
            <div>
              <p className="text-lg font-medium text-gray-800">
                Thunder VPN - Fast, Safe VPN
              </p>
              <p className="text-sm text-gray-500">Secure Signal Inc.</p>
              <div className="flex items-center gap-1 text-sm text-gray-600 mt-1">
                <span>4.4</span>
                <FaStar className="text-green-600" />
              </div>
            </div>
          </div>

          {/* App Item */}
          <div className="flex gap-4 items-center">
            <img
              src="https://i.ibb.co.com/gLrRkPW0/unnamed-2.webp"
              alt=""
              className="w-16 h-16 rounded-xl object-cover"
            />
            <div>
              <p className="text-lg font-medium text-gray-800">DeRadar</p>
              <p className="text-sm text-gray-500">Interconsea Inc.</p>
              <div className="flex items-center gap-1 text-sm text-gray-600 mt-1">
                <span>4.9</span>
                <FaStar className="text-green-600" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SimilarApp;
