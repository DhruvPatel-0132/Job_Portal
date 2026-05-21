import React, { useCallback, useState } from "react";
import ConnectionCard from "./ConnectionCard";
import ConnectionsAllPopup from "./ConnectionsAllPopup";

/**
 * The maximum number of connection cards displayed inline before
 * the overflow "+N" tile is shown.
 */
const PREVIEW_COUNT = 5;

/**
 * OverflowTile
 *
 * A card-shaped tile shown after the first PREVIEW_COUNT cards when
 * there are more connections than PREVIEW_COUNT. Clicking it opens
 * the full connections popup.
 *
 * @param {{ remainingCount: number, onClick: () => void }} props
 */
const OverflowTile = ({ remainingCount, onClick }) => (
  <button
    onClick={onClick}
    aria-label={`Show ${remainingCount} more connections`}
    className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border-2 border-dashed border-blue-200 shadow-sm overflow-hidden flex flex-col items-center justify-center text-center cursor-pointer hover:shadow-md hover:border-blue-400 hover:from-blue-100 hover:to-indigo-100 transition-all duration-300 min-h-[180px] group"
  >
    <span className="text-3xl font-extrabold text-blue-600 group-hover:scale-110 transition-transform duration-200">
      +{remainingCount}
    </span>
    <span className="text-xs font-semibold text-blue-500 mt-1.5 px-3 leading-tight">
      more connection{remainingCount !== 1 ? "s" : ""}
    </span>
    <span className="text-[10px] text-blue-400 mt-1 px-3">
      Click to view all
    </span>
  </button>
);

/**
 * ConnectionsSection
 *
 * Displays the logged-in user's connections as a card grid.
 *
 * Behaviour:
 *   - Renders nothing if the connections array is empty.
 *   - Shows at most PREVIEW_COUNT cards inline.
 *   - If connections.length > PREVIEW_COUNT, an OverflowTile is appended
 *     as the (PREVIEW_COUNT + 1)th grid cell.
 *   - Clicking the OverflowTile or the "Show all connections" header
 *     button opens ConnectionsAllPopup with real-time search.
 *
 * @param {{ connections: object[] }} props
 */
const ConnectionsSection = ({ connections }) => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const openPopup = useCallback(() => setIsPopupOpen(true), []);
  const closePopup = useCallback(() => setIsPopupOpen(false), []);

  if (!connections || connections.length === 0) return null;

  const hasOverflow = connections.length > PREVIEW_COUNT;
  const visibleConnections = hasOverflow
    ? connections.slice(0, PREVIEW_COUNT)
    : connections;
  const remainingCount = connections.length - PREVIEW_COUNT;

  return (
    <>
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden mb-4">
        {/* Section Header */}
        <div className="flex justify-between items-center px-4 py-3 border-b border-gray-100">
          <h2 className="text-[16px] font-bold text-gray-900">
            Your Connections{" "}
            <span className="text-gray-400 font-semibold">
              ({connections.length})
            </span>
          </h2>
          <button
            onClick={openPopup}
            className="text-sm font-bold text-gray-500 hover:text-black hover:underline transition-colors"
            aria-label="Show all connections"
          >
            Show all
          </button>
        </div>

        {/* Card Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 p-3">
          {visibleConnections.map((conn) => (
            <ConnectionCard key={conn._id} connection={conn} />
          ))}

          {hasOverflow && (
            <OverflowTile remainingCount={remainingCount} onClick={openPopup} />
          )}
        </div>
      </div>

      {/* Full Connections Popup */}
      <ConnectionsAllPopup
        isOpen={isPopupOpen}
        onClose={closePopup}
        connections={connections}
        totalCount={connections.length}
      />
    </>
  );
};

export default ConnectionsSection;
