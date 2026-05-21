import React, { useCallback } from "react";
import { Send, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useMessageStore } from "../../store/messageStore";

/**
 * ConnectionCard
 *
 * Displays a single connected user as a card with:
 *   - Banner (gradient fallback when none provided)
 *   - Circular avatar overlapping the banner
 *   - Name + headline
 *   - "Message" action (opens chat via messageStore)
 *   - "Profile" action (navigates to /profile/:id)
 *
 * @param {{ connection: object }} props
 */
const ConnectionCard = ({ connection }) => {
  const navigate = useNavigate();
  const { setActiveConversation } = useMessageStore();

  const handleMessage = useCallback(() => {
    setActiveConversation({
      _id: connection._id,
      fullName: connection.name,
      avatar: connection.avatar || "/avatar.svg",
      headline: connection.headline,
    });
  }, [connection, setActiveConversation]);

  const handleProfile = useCallback(() => {
    navigate(`/profile/${connection._id}`);
  }, [connection._id, navigate]);

  const handleAvatarError = useCallback((e) => {
    e.target.onerror = null;
    e.target.src = "/avatar.svg";
  }, []);

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden flex flex-col items-center text-center relative group hover:shadow-md transition-shadow duration-300">
      {/* Banner */}
      <div
        className="h-14 w-full bg-cover bg-center"
        style={
          connection.banner
            ? { backgroundImage: `url(${connection.banner})` }
            : {
                backgroundImage:
                  "linear-gradient(to bottom right, #a1c4fd, #c2e9fb)",
              }
        }
        aria-hidden="true"
      />

      {/* Avatar */}
      <div className="relative -mt-9 mb-2">
        <img
          src={connection.avatar || "/avatar.svg"}
          alt={connection.name}
          referrerPolicy="no-referrer"
          onError={handleAvatarError}
          className="w-[72px] h-[72px] rounded-full border-2 border-white shadow-sm object-cover bg-white"
        />
      </div>

      {/* User Info */}
      <div className="px-3 pb-4 flex-1 flex flex-col w-full">
        <h3
          onClick={handleProfile}
          className="text-[14px] font-bold text-gray-900 line-clamp-1 hover:text-blue-600 hover:underline cursor-pointer leading-snug"
        >
          {connection.name}
        </h3>
        <p
          className="text-[11px] text-gray-500 mt-1 px-1"
          style={{
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
            lineHeight: "15px",
            height: "30px",
          }}
        >
          {connection.headline || "No headline available"}
        </p>

        {/* Action Buttons */}
        <div className="mt-auto pt-3 flex flex-col gap-2">
          <button
            onClick={handleMessage}
            className="w-full py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-full text-xs font-bold transition-colors flex items-center justify-center gap-1.5"
            aria-label={`Message ${connection.name}`}
          >
            <Send className="w-3.5 h-3.5" />
            Message
          </button>
          <button
            onClick={handleProfile}
            className="w-full py-1.5 border border-blue-600 text-blue-600 hover:bg-blue-50 rounded-full text-xs font-bold transition-colors flex items-center justify-center gap-1.5"
            aria-label={`View ${connection.name}'s profile`}
          >
            <User className="w-3.5 h-3.5" />
            Profile
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConnectionCard;
