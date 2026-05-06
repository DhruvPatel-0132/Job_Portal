import React from "react";

export default function AboutCompanySection({ editData, update }) {
  return (
    <div className="space-y-5">
      <div>
        <label className="block text-[13px] font-medium text-gray-700 mb-1">About Us</label>
        <textarea
          value={editData.about || ""}
          onChange={(e) => update("about", e.target.value)}
          rows={8}
          className="w-full px-3 py-2 border border-gray-200 rounded-lg text-[14px] focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all resize-y"
          placeholder="Describe your company, mission, and vision..."
        />
        <p className="text-xs text-gray-500 mt-1">
          Tell people what your company does and what makes it unique.
        </p>
      </div>
    </div>
  );
}
