import React from "react";
import { Edit2 } from "lucide-react";

export default function CompanyServices({ services, onEdit }) {
  if (!services?.length && !onEdit) return null;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 relative">
      {onEdit && (
        <button
          onClick={onEdit}
          className="absolute top-6 right-6 p-2 rounded-full hover:bg-gray-100 transition-colors z-10"
          aria-label="Edit Services"
        >
          <Edit2 size={20} className="text-gray-600" />
        </button>
      )}
      <h2 className="text-xl font-semibold text-gray-900 mb-4">Services</h2>
      
      {!services?.length ? (
        <p className="text-[13px] text-gray-500 italic">No services added yet.</p>
      ) : (
        <div className="flex flex-wrap gap-2">
          {services.map((service, idx) => (
            <span
              key={idx}
              className="px-4 py-1.5 bg-blue-50 text-blue-700 rounded-full text-sm font-medium border border-blue-100"
            >
              {service}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
