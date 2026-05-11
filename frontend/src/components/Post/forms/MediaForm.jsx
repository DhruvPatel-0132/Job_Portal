import React from "react";
import { motion } from "motion/react";
import { Image as ImageIcon, X } from "lucide-react";

const MediaForm = ({ 
  content, setContent, selectedMedia, handleMediaSelect, removeMedia, fileInputRef, setPostType 
}) => {
  return (
    <motion.div
      key="media"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="space-y-4"
    >
      <textarea
        placeholder="What's on your mind? Add a caption to your media..."
        className="w-full min-h-[120px] text-[18px] leading-relaxed resize-none focus:outline-none placeholder-gray-400 font-normal"
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />

      <div
        onClick={() => fileInputRef.current?.click()}
        className="flex flex-col items-center justify-center py-12 border-2 border-dashed border-gray-200 rounded-2xl bg-gray-50 hover:bg-blue-50/50 hover:border-blue-300 transition-all cursor-pointer group"
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleMediaSelect}
          multiple
          accept="image/*,video/*"
          className="hidden"
        />
        <motion.div
          whileHover={{ scale: 1.1, rotate: 5 }}
          className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4"
        >
          <ImageIcon className="w-8 h-8 text-blue-600" />
        </motion.div>
        <h3 className="text-lg font-bold text-gray-900">Select images and videos</h3>
        <p className="text-gray-500 text-sm mt-1">or drag and drop them here</p>
        <button
          onClick={(e) => {
            e.stopPropagation();
            setPostType("regular");
          }}
          className="mt-6 text-blue-600 font-bold hover:underline text-sm"
        >
          Back to text post
        </button>
      </div>

      {selectedMedia.length > 0 && (
        <div className="grid grid-cols-2 gap-4 mt-4">
          {selectedMedia.map((media, index) => (
            <div key={index} className="relative group rounded-xl overflow-hidden aspect-video bg-gray-100 border border-gray-200">
              {media.type === 'image' ? (
                <img src={media.url} alt="Preview" className="w-full h-full object-cover" />
              ) : (
                <video src={media.url} className="w-full h-full object-cover" />
              )}
              <button
                onClick={() => removeMedia(index)}
                className="absolute top-2 right-2 p-1.5 bg-black/50 hover:bg-black/70 text-white rounded-full transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </motion.div>
  );
};

export default MediaForm;
