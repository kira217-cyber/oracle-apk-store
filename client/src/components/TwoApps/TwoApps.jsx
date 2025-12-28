import React from "react";

const appData = [
  {
    id: 1,
    title: "Emily and the Backbone",
    author: "Christophel H.",
    bgColor: "bg-emerald-600",
    badge: null,
    left: 12,
  },
  {
    id: 2,
    title: "HOMIE",
    author: "Jamed Gruns",
    bgColor: "bg-yellow-400",
    badge: "Sale",
    left: 4,
  },
  {
    id: 3,
    title: "Night Stories",
    author: "Alex Moon",
    bgColor: "bg-indigo-600",
    badge: "New",
    left: 9,
  },
  {
    id: 4,
    title: "Mindful Life",
    author: "Sarah Dean",
    bgColor: "bg-pink-500",
    badge: "Hot",
    left: 6,
  },
  {
    id: 5,
    title: "Emily and the Backbone",
    author: "Christophel H.",
    bgColor: "bg-emerald-600",
    badge: null,
    left: 12,
  },
  {
    id: 6,
    title: "HOMIE",
    author: "Jamed Gruns",
    bgColor: "bg-yellow-400",
    badge: "Sale",
    left: 4,
  },
  {
    id: 7,
    title: "Night Stories",
    author: "Alex Moon",
    bgColor: "bg-indigo-600",
    badge: "New",
    left: 9,
  },
  {
    id: 8,
    title: "Mindful Life",
    author: "Sarah Dean",
    bgColor: "bg-pink-500",
    badge: "Hot",
    left: 6,
  },
];

const TwoApps = () => {
  return (
    <section className="">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {appData.map((app) => (
          <div key={app.id} className="w-full">
            {/* Card */}
            <div
              className={`relative h-[220px] rounded-2xl shadow-lg flex items-center justify-center text-center p-4 ${app.bgColor}`}
            >
              {/* Badge */}
              {app.badge && (
                <span className="absolute top-3 right-3 bg-blue-600 text-white text-xs font-semibold px-3 py-1 rounded-full">
                  {app.badge}
                </span>
              )}

              {/* Content */}
              <h3 className="text-white text-lg font-bold leading-tight">
                {app.title}
              </h3>
            </div>

            {/* Progress
            <div className="mt-2">
              <div className="w-full h-1 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-orange-500"
                  style={{ width: `${(app.left / 12) * 100}%` }}
                />
              </div>

              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>{app.left} Left</span>
              </div>
            </div> */}

            {/* App Info */}
            <div className="mt-2">
              <h4 className="text-sm font-semibold text-gray-900 truncate">
                {app.title}
              </h4>
              <p className="text-xs text-gray-500">{app.author}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default TwoApps;
