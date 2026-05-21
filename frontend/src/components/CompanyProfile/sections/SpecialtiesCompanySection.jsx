import React, { useState } from "react";
import { X, Plus } from "lucide-react";

export default function SpecialtiesCompanySection({ editData, update }) {
  const [newSpecialty, setNewSpecialty] = useState("");
  const specialties = editData.specialties || [];

  const handleAdd = (e) => {
    e.preventDefault();
    if (newSpecialty.trim()) {
      update("specialties", [...specialties, newSpecialty.trim()]);
      setNewSpecialty("");
    }
  };

  const handleRemove = (idxToRemove) => {
    update(
      "specialties",
      specialties.filter((_, idx) => idx !== idxToRemove)
    );
  };

  return (
    <div className="space-y-5">
      <div>
        <label className="block text-[13px] font-medium text-gray-700 mb-1">Specialties</label>
        <div className="flex gap-2">
          <input
            type="text"
            value={newSpecialty}
            onChange={(e) => setNewSpecialty(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAdd(e)}
            className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-[14px] focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all"
            placeholder="Add a specialty..."
          />
          <button
            type="button"
            onClick={handleAdd}
            className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors flex items-center gap-1"
          >
            <Plus size={16} /> Add
          </button>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {specialties.map((specialty, idx) => (
          <span
            key={idx}
            className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-[13px] flex items-center gap-2"
          >
            {specialty}
            <button
              type="button"
              onClick={() => handleRemove(idx)}
              className="text-gray-500 hover:text-red-500 transition-colors"
            >
              <X size={14} />
            </button>
          </span>
        ))}
        {specialties.length === 0 && (
          <p className="text-[13px] text-gray-500 italic">No specialties added yet.</p>
        )}
      </div>
    </div>
  );
}
