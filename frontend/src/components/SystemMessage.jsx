import React from "react";

const SystemMessage = ({ message, isMe }) => {
  // Exiting user sees "You left the group", others see "<username> has left the group"
  const text = isMe ? "You left the group" : message;

  return (
    <div className="flex justify-center my-2.5 w-full">
      <div className="bg-[#f0f2f5] text-gray-600 text-xs px-3 py-1.5 rounded-lg shadow-sm border border-gray-200 text-center font-medium max-w-[85%] whitespace-pre-wrap select-none leading-relaxed">
        {text}
      </div>
    </div>
  );
};

export default SystemMessage;
