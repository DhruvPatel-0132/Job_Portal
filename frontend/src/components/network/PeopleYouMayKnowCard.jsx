import React from "react";
import { X, UserPlus, CheckCircle2 } from "lucide-react";

const PeopleYouMayKnowCard = ({
  person,
  isConnected,
  isPending,
  isFollowed,
  onConnect,
  onFollow,
  onUnfollow,
}) => {
  const isCompany = person.role === "company";

  let actionText = "Connect";
  let actionHandler = onConnect;
  let isActionDisabled = false;

  if (isCompany) {
    if (isFollowed) {
      actionText = "Unfollow";
      actionHandler = onUnfollow;
    } else {
      actionText = "Follow";
      actionHandler = onFollow;
    }
  } else {
    if (isConnected) {
      actionText = "Connected";
      isActionDisabled = true;
    } else if (isPending) {
      actionText = "Pending";
      isActionDisabled = true;
    }
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden flex flex-col items-center text-center relative group hover:shadow-md transition-shadow duration-300">
      {/* Banner */}
      <div
        className={`h-14 w-full bg-cover bg-center ${!person.banner ? "opacity-40" : ""}`}
        style={
          person.banner
            ? { backgroundImage: `url(${person.banner})` }
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
          src={person.avatar || "/avatar.svg"}
          alt={person.name}
          className="w-18 h-18 rounded-full border-2 border-white shadow-sm object-cover bg-white"
        />
      </div>

      {/* Content */}
      <div className="px-3 pb-4 flex-1 flex flex-col w-full">
        <div className="flex items-center justify-center gap-1">
          <h3 className="text-[15px] font-bold text-gray-900 line-clamp-1 hover:text-blue-600 hover:underline cursor-pointer">
            {person.name}
          </h3>
          {person.isVerified && (
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
          {person.headline || "No headline available"}
        </p>

        {/* Mutual Connections - mock data or hidden if not available */}
        <div className="mt-auto pt-3 pb-4">
          <div className="flex items-center justify-center gap-1.5 text-gray-500">
            {person.mutualName ? (
              <>
                <img
                  src={person.avatar || "/avatar.svg"}
                  className="w-4 h-4 rounded-full border border-white flex-shrink-0"
                  alt=""
                />
                <span className="text-[10px] font-medium line-clamp-1">
                  {person.mutualName} and {person.mutualConnectionsCount} other
                  mutual connections
                </span>
              </>
            ) : (
              <span className="text-[10px] font-medium line-clamp-1 h-[16px]">
                {/* Empty placeholder for alignment */}
              </span>
            )}
          </div>
        </div>

        {/* Connect / Follow Button */}
        <button
          onClick={actionHandler}
          disabled={isActionDisabled}
          className={`w-[90%] mx-auto py-1.5 border rounded-full text-sm font-bold transition-all flex items-center justify-center gap-1 group ${
            isActionDisabled
              ? "bg-gray-100 text-gray-500 border-gray-300 cursor-not-allowed"
              : "border-blue-600 text-blue-600 hover:bg-blue-50 hover:border-blue-700 cursor-pointer"
          }`}
        >
          <UserPlus className="w-4 h-4" />
          {actionText}
        </button>
      </div>
    </div>
  );
};

export default PeopleYouMayKnowCard;
