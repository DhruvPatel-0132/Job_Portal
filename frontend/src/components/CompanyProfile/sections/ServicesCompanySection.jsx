import React, { useState } from "react";
import { X, Plus } from "lucide-react";

export default function ServicesCompanySection({ editData, update }) {
  const [newService, setNewService] = useState("");
  const services = editData.services || [];

  const handleAdd = (e) => {
    e.preventDefault();
    if (newService.trim()) {
      update("services", [...services, newService.trim()]);
      setNewService("");
    }
  };

  const handleRemove = (idxToRemove) => {
    update(
      "services",
      services.filter((_, idx) => idx !== idxToRemove)
    );
  };

  return (
    <div className="space-y-5">
      <div>
        <label className="block text-[13px] font-medium text-gray-700 mb-1">Services</label>
        <div className="flex gap-2">
          <input
            type="text"
            value={newService}
            onChange={(e) => setNewService(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAdd(e)}
            className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-[14px] focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all"
            placeholder="Add a service you offer..."
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
        {services.map((service, idx) => (
          <span
            key={idx}
            className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-[13px] flex items-center gap-2"
          >
            {service}
            <button
              type="button"
              onClick={() => handleRemove(idx)}
              className="text-gray-500 hover:text-red-500 transition-colors"
            >
              <X size={14} />
            </button>
          </span>
        ))}
        {services.length === 0 && (
          <p className="text-[13px] text-gray-500 italic">No services added yet.</p>
        )}
      </div>
    </div>
  );
}
