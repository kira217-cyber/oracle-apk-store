import React from "react";
import {
  FaArrowRight,
  FaEllipsisV,
  FaMobileAlt,
  FaStar,
  FaTabletAlt,
  FaUserCircle,
} from "react-icons/fa";

const RatingsAndReviews = () => {
  const ReviewItem = ({
    name,
    date,
    rating,
    review,
    helpfulCount,
    reply,
    replyDate,
  }) => {
    return (
      <div className="border-b border-gray-200 pb-6 mb-6">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <FaUserCircle className="text-3xl text-gray-400" />
            <div>
              <p className="text-sm font-medium text-gray-800">{name}</p>
              <div className="flex items-center gap-1 mt-1">
                {[...Array(5)].map((_, i) => (
                  <FaStar
                    key={i}
                    className={`text-sm ${
                      i < rating ? "text-green-600" : "text-gray-300"
                    }`}
                  />
                ))}
                <span className="text-xs text-gray-500 ml-2">{date}</span>
              </div>
            </div>
          </div>

          <FaEllipsisV className="text-gray-500 text-sm" />
        </div>

        {/* Review Text */}
        <p className="text-sm text-gray-700 mt-3 leading-relaxed">{review}</p>

        {/* Helpful */}
        <p className="text-xs text-gray-500 mt-3">
          {helpfulCount} people found this review helpful
        </p>

        <div className="flex items-center gap-3 mt-2">
          <span className="text-sm text-gray-600">
            Did you find this helpful?
          </span>
          <button className="border px-4 py-1 rounded-full text-sm">Yes</button>
          <button className="border px-4 py-1 rounded-full text-sm">No</button>
        </div>

        {/* Developer Reply */}
        {reply && (
          <div className="bg-gray-50/20 rounded-lg p-4 mt-4">
            <div className="flex justify-between mb-2">
              <p className="text-sm font-medium text-gray-800">
                Bangladesh Election Commission Secretariat
              </p>
              <span className="text-xs text-gray-500">{replyDate}</span>
            </div>

            <p className="text-sm text-gray-700 leading-relaxed">{reply}</p>
          </div>
        )}
      </div>
    );
  };
  return (
    <>
      {" "}
      <div>
        {/* ================= Ratings & Reviews ================= */}
        <div>
          <div className="flex gap-6 items-center mt-6 mb-3">
            <h2 className="text-2xl font-semibold text-gray-800">
              Ratings and reviews
            </h2>
            <span className="text-xl text-gray-400 p-2 cursor-pointer hover:bg-gray-200 hover:rounded-full">
              <FaArrowRight />
            </span>
          </div>

          {/* Phone / Tablet Toggle */}
          <div className="flex gap-2 mb-6">
            <button className="flex items-center gap-2 bg-green-100 text-green-700 px-4 py-1.5 rounded-full text-sm font-medium">
              <FaMobileAlt /> Phone
            </button>
            <button className="flex items-center gap-2 border px-4 py-1.5 rounded-full text-sm text-gray-600">
              <FaTabletAlt /> Tablet
            </button>
          </div>

          <div className="flex gap-10">
            {/* Rating Score */}
            <div className="text-center">
              <h1 className="text-5xl font-semibold text-gray-800">4.3</h1>
              <div className="flex justify-center mt-2 text-green-600">
                {[...Array(4)].map((_, i) => (
                  <FaStar key={i} />
                ))}
                <FaStar className="text-gray-300" />
              </div>
              <p className="text-sm text-gray-500 mt-2">3.82K reviews</p>
            </div>

            {/* Rating Bars */}
            <div className="flex-1 space-y-2">
              {[5, 4, 3, 2, 1].map((star, index) => (
                <div key={index} className="flex items-center gap-3">
                  <span className="text-sm text-gray-600 w-4">{star}</span>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className={`h-3 rounded-full bg-green-600`}
                      style={{
                        width:
                          star === 5
                            ? "85%"
                            : star === 4
                            ? "10%"
                            : star === 3
                            ? "8%"
                            : star === 2
                            ? "6%"
                            : "12%",
                      }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="mt-8 font-sans">
          <ReviewItem
            name="Ramim Ahmed"
            date="December 13, 2025"
            rating={2}
            review={`UI is decent and intuitive, however the app in it's current state is not usable for me. At first I wasn't even receiving any OTP during registration, then an update fixed it. Now I am unable to input almost 90% of the alphabets in the English language while typing in my address. It only accepts a few characters like "A, L, B, N" the rest doesn't appear when I type in. Copying and pasting them also doesn't fix the problem. Unusable!`}
            helpfulCount={45}
            reply={`We sincerely apologize for the inconvenience. To get assistance with this issue, Please feel free to send an email to info@ocv.gov.bd or contacting us at +8809610000105 and let us know in detail about the problem. Our concerned team will definitely try to resolve it. We'll be more than happy to assist you.`}
            replyDate="December 16, 2025"
          />

          <ReviewItem
            name="Md Naim Chowdhury"
            date="December 6, 2025"
            rating={5}
            review={`Issue with image capture. When trying the first phase of Nid verification even though the image is crisp, perfect lighting and most certainly readable complains about taking it at right angle and more light. You should fix this issue. And the top of it there is no option to turn the flash if light is such a major problem. Update: reply was pretty fast and fixed`}
            helpfulCount={190}
            reply={`We apologize that your experience didn’t match with expectation. We request you to send an email to info@ocv.gov.bd or contacting us at +8809610000105. Our concerned team will definitely try to resolve it.`}
            replyDate="December 2, 2025"
          />
        </div>
        <div className="hidden md:block mt-8 mb-4">
          <h1 className="text-2xl font-bold text-gray-800">What’s new</h1>
          <p className="text-gray-500 text-sm mt-4">
            Bug fixes and performance improvements. <br />
            Our continuous efforts are to improve and the app more rewarding.
          </p>
        </div>
      </div>{" "}
    </>
  );
};

export default RatingsAndReviews;
