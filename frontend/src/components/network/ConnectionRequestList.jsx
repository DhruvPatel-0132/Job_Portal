import React from "react";
import { X, UserPlus } from "lucide-react";

const ConnectionRequestList = ({ requests, onAccept, onReject }) => {
  if (!requests || requests.length === 0) return null;

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden mb-4">
      <div className="p-4 border-b border-gray-100 flex justify-between items-center">
        <h2 className="text-[16px] font-bold text-gray-900">Invitations</h2>
        <button className="text-sm font-bold text-gray-500 hover:text-blue-600 transition-colors">
          Manage
        </button>
      </div>
      <div className="flex flex-col">
        {requests.map((request) => (
          <div
            key={request._id}
            className="p-4 flex items-center gap-3 border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-colors"
          >
            <img
              src={request.senderId?.avatar || "/avatar.svg"}
              alt={request.senderId?.firstName}
              className="w-14 h-14 rounded-full border border-gray-100 shadow-sm object-cover"
            />
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-bold text-gray-900 truncate hover:text-blue-600 hover:underline cursor-pointer">
                {request.senderId?.firstName} {request.senderId?.lastName}
              </h3>
              <p className="text-xs text-gray-500 truncate">
                {request.senderId?.headline || "No headline available"}
              </p>
              <p className="text-[10px] text-gray-400 mt-0.5 flex items-center gap-1">
                <UserPlus className="w-3 h-3" />
                Sent recently
              </p>
            </div>
            <div className="flex gap-2 ml-4">
              <button
                onClick={() => onReject(request._id)}
                className="p-1.5 rounded-full text-gray-500 hover:bg-gray-100 transition-all"
                title="Ignore"
              >
                <X className="w-5 h-5" />
              </button>
              <button
                onClick={() => onAccept(request._id)}
                className="px-4 py-1.5 rounded-full border border-blue-600 text-blue-600 text-sm font-bold hover:bg-blue-50 transition-all"
              >
                Accept
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ConnectionRequestList;
