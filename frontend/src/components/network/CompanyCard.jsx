import React from "react";
import { X, UserPlus, CheckCircle2 } from "lucide-react";

const CompanyCard = ({
  company,
  isFollowed,
  onFollow,
  onUnfollow,
}) => {
  let actionText = isFollowed ? "Unfollow" : "Follow";
  let actionHandler = isFollowed ? onUnfollow : onFollow;

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden flex flex-col items-center text-center relative group hover:shadow-md transition-shadow duration-300">
      {/* Banner */}
      <div
        className={`h-14 w-full bg-cover bg-center ${!company.banner ? "opacity-40" : ""}`}
        style={
          company.banner
            ? { backgroundImage: `url(${company.banner})` }
            : { backgroundImage: "linear-gradient(to bottom right, #a1c4fd, #c2e9fb)" }
        }
      />

      {/* Close button */}
      <button className="absolute top-2 right-2 p-1 bg-black/50 hover:bg-black/70 text-white rounded-full transition-colors z-10">
        <X className="w-3.5 h-3.5" />
      </button>

      {/* Avatar */}
      <div className="relative -mt-9 mb-2">
        <img
          src={company.avatar || "/avatar.svg"}
          alt={company.name}
          referrerPolicy="no-referrer"
          onError={(e) => {
            e.target.onerror = null; 
            e.target.src = "/avatar.svg";
          }}
          className="w-18 h-18 rounded-md border-2 border-white shadow-sm object-cover bg-white"
        />

      </div>

      {/* Content */}
      <div className="px-3 pb-4 flex-1 flex flex-col w-full">
        <div className="flex items-center justify-center gap-1">
          <h3 className="text-[15px] font-bold text-gray-900 line-clamp-1 hover:text-blue-600 hover:underline cursor-pointer">
            {company.name}
          </h3>
          {company.isVerified && (
            <CheckCircle2 className="w-3.5 h-3.5 text-gray-400" />
          )}
        </div>
        <p
          className="text-[12px] text-gray-500 mt-0.5 px-2"
          style={{
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
            lineHeight: "16px",
            height: "32px",
          }}
        >
          {company.headline || company.industry || "Company profile"}
        </p>

        {/* Followers / Info Section */}
        <div className="mt-auto pt-3 pb-4">
          <div className="flex items-center justify-center gap-1.5 text-gray-500">
            <span className="text-[10px] font-medium line-clamp-1">
              {company.followersCount || 0} followers
            </span>
          </div>
        </div>

        {/* Follow Button */}
        <button
          onClick={actionHandler}
          className={`w-[90%] mx-auto py-1.5 border rounded-full text-sm font-bold transition-all flex items-center justify-center gap-1 group cursor-pointer ${
            isFollowed
              ? "bg-blue-600 text-white border-blue-600 hover:bg-blue-700 hover:border-blue-700"
              : "border-blue-600 text-blue-600 hover:bg-blue-50 hover:border-blue-700"
          }`}
        >
          {isFollowed ? (
            <CheckCircle2 className="w-4 h-4" />
          ) : (
            <UserPlus className="w-4 h-4" />
          )}
          {actionText}
        </button>
      </div>
    </div>
  );
};

export default CompanyCard;
