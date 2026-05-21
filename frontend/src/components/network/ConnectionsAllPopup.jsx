import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Search, Send, User, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useMessageStore } from "../../store/messageStore";

/**
 * ConnectionsAllPopup
 *
 * A modal dialog that renders ALL connections in a searchable list.
 * Each row shows: profile picture, name, headline, and Message + Profile buttons.
 * Searching filters by name and headline in real time (client-side).
 *
 * Accessibility:
 *   - role="dialog" + aria-modal="true"
 *   - Focus moves to the search input on open
 *   - Escape key closes the modal
 *   - Backdrop click closes the modal
 *
 * @param {{
 *   isOpen: boolean,
 *   onClose: () => void,
 *   connections: object[],
 *   totalCount: number,
 * }} props
 */
const ConnectionsAllPopup = ({ isOpen, onClose, connections, totalCount }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const searchInputRef = useRef(null);
  const dialogRef = useRef(null);
  const navigate = useNavigate();
  const { setActiveConversation } = useMessageStore();

  // Focus search input when popup opens; clear search on close.
  useEffect(() => {
    if (isOpen) {
      // Defer focus so the element is visible before focusing.
      const timer = setTimeout(() => {
        searchInputRef.current?.focus();
      }, 50);
      return () => clearTimeout(timer);
    } else {
      setSearchQuery("");
    }
  }, [isOpen]);

  // Close on Escape key.
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Prevent body scroll while popup is open.
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const handleBackdropClick = useCallback(
    (e) => {
      // Only close if the click is directly on the backdrop, not on the dialog.
      if (e.target === e.currentTarget) onClose();
    },
    [onClose]
  );

  const handleSearchChange = useCallback((e) => {
    setSearchQuery(e.target.value);
  }, []);

  const handleClearSearch = useCallback(() => {
    setSearchQuery("");
    searchInputRef.current?.focus();
  }, []);

  // Memoised filtered list to avoid recomputing on every render.
  const filteredConnections = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return connections;
    return connections.filter(
      (conn) =>
        conn.name?.toLowerCase().includes(query) ||
        conn.headline?.toLowerCase().includes(query)
    );
  }, [connections, searchQuery]);

  if (!isOpen) return null;

  return (
    /* Backdrop */
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-[2px] p-4"
      onClick={handleBackdropClick}
      aria-label="Close connections popup"
    >
      {/* Dialog */}
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="connections-popup-title"
        className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[85vh] flex flex-col overflow-hidden animate-fade-in-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 flex-shrink-0">
          <div>
            <h2
              id="connections-popup-title"
              className="text-lg font-bold text-gray-900 leading-tight"
            >
              Your Connections
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">
              {totalCount} connection{totalCount !== 1 ? "s" : ""}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search bar */}
        <div className="px-5 py-3 border-b border-gray-100 flex-shrink-0">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            <input
              ref={searchInputRef}
              type="text"
              value={searchQuery}
              onChange={handleSearchChange}
              placeholder="Search connections by name or headline…"
              className="w-full pl-9 pr-9 py-2 text-sm bg-gray-50 border border-gray-200 rounded-full focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
              aria-label="Search connections"
            />
            {searchQuery && (
              <button
                onClick={handleClearSearch}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                aria-label="Clear search"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Scrollable connections list */}
        <div className="overflow-y-auto flex-1 hide-scrollbar">
          {filteredConnections.length > 0 ? (
            <>
              {searchQuery && (
                <p className="text-xs text-gray-400 px-5 pt-3">
                  {filteredConnections.length} result
                  {filteredConnections.length !== 1 ? "s" : ""} for &ldquo;
                  {searchQuery}&rdquo;
                </p>
              )}
              <ul role="list" className="divide-y divide-gray-100">
                {filteredConnections.map((conn) => (
                  <li
                    key={conn._id}
                    className="flex items-center gap-4 px-5 py-3.5 hover:bg-gray-50 transition-colors"
                  >
                    {/* Avatar */}
                    <img
                      src={conn.avatar || "/avatar.svg"}
                      alt={conn.name}
                      referrerPolicy="no-referrer"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "/avatar.svg";
                      }}
                      className="w-12 h-12 rounded-full border border-gray-200 object-cover shrink-0"
                    />

                    {/* Name + Headline */}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-gray-900 truncate">
                        {conn.name}
                      </p>
                      <p className="text-xs text-gray-500 truncate mt-0.5">
                        {conn.headline || "No headline available"}
                      </p>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2 shrink-0">
                      <button
                        onClick={() => {
                          setActiveConversation({
                            _id: conn._id,
                            fullName: conn.name,
                            avatar: conn.avatar || "/avatar.svg",
                            headline: conn.headline,
                          });
                          onClose();
                        }}
                        className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-full text-xs font-bold transition-colors flex items-center gap-1.5"
                        aria-label={`Message ${conn.name}`}
                      >
                        <Send className="w-3.5 h-3.5" />
                        Message
                      </button>
                      <button
                        onClick={() => {
                          navigate(`/profile/${conn._id}`);
                          onClose();
                        }}
                        className="px-3.5 py-1.5 border border-blue-600 text-blue-600 hover:bg-blue-50 rounded-full text-xs font-bold transition-colors flex items-center gap-1.5"
                        aria-label={`View ${conn.name}'s profile`}
                      >
                        <User className="w-3.5 h-3.5" />
                        Profile
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 text-gray-400">
              <Search className="w-10 h-10 mb-3 opacity-40" />
              <p className="text-sm font-medium">No connections found</p>
              <p className="text-xs mt-1">
                Try a different name or headline.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ConnectionsAllPopup;
