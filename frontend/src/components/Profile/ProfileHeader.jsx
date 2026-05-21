import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Edit2,
  MapPin,
  UserPlus,
  Clock,
  Send,
  MoreVertical,
  UserX,
  Share2,
  AlertTriangle,
} from "lucide-react";

/**
 * ProfileHeader
 *
 * @param {{ profile: object, onEdit?: () => void, isViewOnly?: boolean, connectionStatus?: string, onConnect?: () => void, onMessage?: () => void }} props
 * isViewOnly  — when true, the edit button is hidden (used on public profile pages)
 */
export default function ProfileHeader({
  profile,
  onEdit,
  isViewOnly = false,
  connectionStatus,
  onConnect,
  onMessage,
  onRemoveConnection,
}) {
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    if (showDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showDropdown]);

  return (
    <motion.div className="bg-white rounded-xl shadow relative overflow-visible">
      <div
        className="h-48 bg-cover bg-center relative bg-gray-200 rounded-t-xl overflow-hidden"
        style={
          profile?.banner ? { backgroundImage: `url(${profile.banner})` } : {}
        }
      >
        {/* Gradient Overlay for depth */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
      </div>

      <div className="p-6 relative">
        {/* Edit button — hidden in view-only mode */}
        {!isViewOnly && onEdit && (
          <button
            onClick={onEdit}
            className="absolute top-6 right-6 p-2 rounded-full hover:bg-gray-100 transition-colors z-10"
            aria-label="Edit Profile"
          >
            <Edit2 size={20} className="text-gray-600" />
          </button>
        )}

        <motion.img
          src={profile.avatar || "/avatar.svg"}
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = "/avatar.svg";
          }}
          className="w-24 h-24 rounded-full border-4 border-white absolute -top-12 left-6 object-cover bg-gray-100"
          whileHover={{ scale: 1.05 }}
        />

        <div className="mt-10">
          <h1 className="text-2xl font-bold">{profile.fullName}</h1>
          <p className="text-gray-600">{profile.headline}</p>
          {(profile.address || profile.city || profile.country) && (
            <div className="flex items-center gap-2 text-sm text-gray-500 mt-2">
              <MapPin size={16} className="text-gray-400 shrink-0" />
              <span>
                {profile.address && `${profile.address}, `}
                {[profile.city, profile.country].filter(Boolean).join(", ")}
                {profile.postalCode && ` (${profile.postalCode})`}
              </span>
            </div>
          )}

          {/* Relationship Buttons (Only in public view) */}
          {isViewOnly && connectionStatus && (
            <div className="mt-5 flex gap-3">
              {connectionStatus === "connected" && (
                <div
                  className="relative flex items-center gap-2"
                  ref={dropdownRef}
                >
                  <button
                    onClick={onMessage}
                    className="flex items-center gap-2 px-5 py-1.5 bg-white border border-blue-600 text-blue-600 rounded-full font-semibold hover:bg-blue-50 transition-colors shadow-sm text-sm"
                  >
                    <Send size={16} />
                    Message
                  </button>
                  <button
                    onClick={() => setShowDropdown(!showDropdown)}
                    className="p-1.5 rounded-full border border-gray-300 text-gray-600 hover:bg-gray-100 transition-colors shadow-sm bg-white"
                  >
                    <MoreVertical size={18} />
                  </button>

                  <AnimatePresence>
                    {showDropdown && (
                      <motion.div
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 5 }}
                        className="absolute top-full mt-2 left-0 w-64 bg-white rounded-xl shadow-lg border border-gray-200 z-50 overflow-hidden"
                      >
                        <button
                          onClick={() => {
                            setShowDropdown(false);
                            onRemoveConnection && onRemoveConnection();
                          }}
                          className="w-full text-left px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 flex items-center gap-3 transition-colors border-b border-gray-100"
                        >
                          <UserX size={16} className="text-gray-500" />
                          Remove Connection
                        </button>
                        <button
                          onClick={() => setShowDropdown(false)}
                          className="w-full text-left px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 flex items-center gap-3 transition-colors border-b border-gray-100"
                        >
                          <Share2 size={16} className="text-gray-500" />
                          Send Profile in Message
                        </button>
                        <button
                          onClick={() => setShowDropdown(false)}
                          className="w-full text-left px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-50 flex items-center gap-3 transition-colors"
                        >
                          <AlertTriangle size={16} className="text-red-500" />
                          Report/Block
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}
              {connectionStatus === "none" && (
                <button
                  onClick={onConnect}
                  className="flex items-center gap-2 px-5 py-1.5 bg-blue-600 text-white rounded-full font-semibold hover:bg-blue-700 transition-colors shadow-sm text-sm"
                >
                  <UserPlus size={16} />
                  Connect
                </button>
              )}
              {(connectionStatus === "pending_sent" ||
                connectionStatus === "pending_received" ||
                connectionStatus === "pending") && (
                <button
                  disabled
                  className="flex items-center gap-2 px-5 py-1.5 bg-gray-100 text-gray-500 border border-gray-300 rounded-full font-semibold cursor-not-allowed text-sm"
                >
                  <Clock size={16} />
                  Pending
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
