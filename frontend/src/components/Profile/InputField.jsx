import React from "react";

const InputField = ({
  label,
  field,
  value,
  onChange,
  type = "text",
  placeholder,
  icon: Icon,
  className = "",
  isTextarea = false,
  rows = 4,
}) => {
  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      <label className="text-[13px] font-medium text-gray-700 flex items-center gap-1.5">
        {label}
      </label>
      <div className="relative group">
        {Icon && !isTextarea && (
          <Icon
            size={16}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-black transition-colors"
          />
        )}
        {Icon && isTextarea && (
          <Icon
            size={16}
            className="absolute left-3.5 top-3.5 text-gray-400 group-focus-within:text-black transition-colors"
          />
        )}
        {isTextarea ? (
          <textarea
            value={value || ""}
            placeholder={placeholder}
            onChange={(e) => onChange(field, e.target.value)}
            rows={rows}
            className={`w-full rounded-xl border border-gray-200/80 bg-white
                       ${Icon ? "pl-10 pr-4" : "px-4"} py-2.5 text-[15px] text-gray-900 shadow-[0_2px_4px_rgba(0,0,0,0.02)]
                       focus:border-black focus:ring-1 focus:ring-black outline-none transition-all duration-200
                       hover:border-gray-300 placeholder:text-gray-400 resize-none`}
          />
        ) : (
          <input
            type={type}
            value={value || ""}
            placeholder={placeholder}
            onChange={(e) => onChange(field, e.target.value)}
            className={`w-full rounded-xl border border-gray-200/80 bg-white
                       ${Icon ? "pl-10 pr-4" : "px-4"} py-2.5 text-[15px] text-gray-900 shadow-[0_2px_4px_rgba(0,0,0,0.02)]
                       focus:border-black focus:ring-1 focus:ring-black outline-none transition-all duration-200
                       hover:border-gray-300 placeholder:text-gray-400`}
          />
        )}
      </div>
    </div>
  );
};

export default InputField;
