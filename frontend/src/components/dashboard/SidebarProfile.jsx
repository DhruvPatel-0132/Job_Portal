import React from "react";

const SidebarProfile = ({ profile }) => {
  const safeProfile = profile || {};

  const fullName = safeProfile.fullName || "Loading...";
  const avatar = safeProfile.avatar || "/avatar.svg";
  const headline = safeProfile.headline || "";

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm">
      <div className="flex justify-center pt-6 pb-2">
        <img
          src={avatar}
          alt="Profile Avatar"
          className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover"
        />
      </div>

      <div className="text-center px-4 pb-4 border-b border-gray-100">
        <h2 className="text-base font-semibold text-gray-900 hover:underline cursor-pointer">
          {fullName}
        </h2>
        <p className="text-xs text-gray-500 mt-1">{headline}</p>
      </div>

      <div className="py-3 border-b border-gray-100">
        <div className="px-4 py-1 hover:bg-gray-100 cursor-pointer flex justify-between items-center transition-colors">
          <span className="text-xs text-gray-500 font-medium">
            Profile viewers
          </span>
          <span className="text-xs text-blue-600 font-semibold">
            {safeProfile.profileViews || 0}
          </span>
        </div>

        <div className="px-4 py-1 hover:bg-gray-100 cursor-pointer flex justify-between items-center transition-colors">
          <span className="text-xs text-gray-500 font-medium">
            Connections
          </span>
          <span className="text-xs text-blue-600 font-semibold">
            {safeProfile.connections || 0}
          </span>
        </div>
      </div>

      <div className="px-4 py-3 hover:bg-gray-100 cursor-pointer transition-colors">
        <span className="text-xs text-gray-800 font-medium flex items-center">
          <svg
            className="w-4 h-4 mr-2 text-gray-500"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z" />
          </svg>
          My items
        </span>
      </div>
    </div>
  );
};

export default SidebarProfile;  