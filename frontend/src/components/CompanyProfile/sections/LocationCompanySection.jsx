import React from "react";

export default function LocationCompanySection({ editData, update }) {
  return (
    <div className="space-y-5">
      <div>
        <label className="block text-[13px] font-medium text-gray-700 mb-1">Website URL</label>
        <input
          type="url"
          value={editData.website || ""}
          onChange={(e) => update("website", e.target.value)}
          className="w-full px-3 py-2 border border-gray-200 rounded-lg text-[14px] focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all"
          placeholder="https://www.example.com"
        />
      </div>

      <div>
        <label className="block text-[13px] font-medium text-gray-700 mb-1">Phone Number</label>
        <input
          type="tel"
          value={editData.phone || ""}
          onChange={(e) => update("phone", e.target.value)}
          className="w-full px-3 py-2 border border-gray-200 rounded-lg text-[14px] focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all"
          placeholder="+1 (800) 123-4567"
        />
      </div>

      <div>
        <label className="block text-[13px] font-medium text-gray-700 mb-1">General Location</label>
        <input
          type="text"
          value={editData.location || ""}
          onChange={(e) => update("location", e.target.value)}
          className="w-full px-3 py-2 border border-gray-200 rounded-lg text-[14px] focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all"
          placeholder="e.g. San Francisco, CA"
        />
      </div>

      <div>
        <label className="block text-[13px] font-medium text-gray-700 mb-1">Headquarters</label>
        <textarea
          value={editData.headquarters || ""}
          onChange={(e) => update("headquarters", e.target.value)}
          rows={3}
          className="w-full px-3 py-2 border border-gray-200 rounded-lg text-[14px] focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all resize-y"
          placeholder="Full address of your headquarters..."
        />
      </div>
    </div>
  );
}
