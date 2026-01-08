import React from "react";
import { FaArrowRight, FaCloud, FaShareAlt } from "react-icons/fa";

const DataSafety = () => {
  return (
    <div>
      {/* ================= Data Safety ================= */}
      <div className="rounded-lg mt-8">
        <div className="flex gap-6 items-center mb-3">
          <h2 className="text-2xl font-semibold text-gray-800">Data safety</h2>
          <span className="text-xl text-gray-400 p-2 cursor-pointer hover:bg-gray-200 hover:rounded-full">
            <FaArrowRight />
          </span>
        </div>

        <p className="text-sm text-gray-500 mb-4 leading-relaxed">
          Safety starts with understanding how developers collect and share your
          data. Data privacy and security practices may vary based on your use,
          region, and age. The developer provided this information and may
          update it over time.
        </p>

        <div className="border border-gray-400 rounded-xl ">
          {/* Row 1 */}
          <div className="flex items-start gap-3 p-4">
            <FaShareAlt className="text-gray-600 mt-1" />
            <div>
              <p className="font-medium text-gray-800">
                No data shared with third parties
              </p>
              <p className="text-sm text-gray-500 hover:underline cursor-pointer">
                Learn more about how developers declare sharing
              </p>
            </div>
          </div>

          {/* Row 2 */}
          <div className="flex items-start gap-3 p-4">
            <FaCloud className="text-gray-600 mt-1" />
            <div>
              <p className="font-medium text-gray-800">No data collected</p>
              <p className="text-sm text-gray-500 hover:underline cursor-pointer">
                Learn more about how developers declare collection
              </p>
            </div>
          </div>
          <p className="text-green-600 text-sm font-medium ml-4 mb-4 px-4 cursor-pointer">
            See details
          </p>
        </div>
      </div>
    </div>
  );
};

export default DataSafety;
