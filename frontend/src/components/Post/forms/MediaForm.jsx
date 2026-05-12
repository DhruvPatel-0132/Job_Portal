import React from "react";
import { motion, AnimatePresence } from "motion/react";
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
          accept="image/*,video/*"
          className="hidden"
        />
        <motion.div
          whileHover={{ scale: 1.1, rotate: 5 }}
          className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4"
        >
          <ImageIcon className="w-8 h-8 text-blue-600" />
        </motion.div>
        <h3 className="text-lg font-bold text-gray-900">Select image or video</h3>
        <p className="text-gray-500 text-sm mt-1">Click to browse your files</p>
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

      <AnimatePresence>
        {selectedMedia.length > 0 && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="relative mt-4 group flex justify-center"
          >
            <div className="w-[85%] max-w-[500px] relative">
              {selectedMedia[0].type === 'image' ? (
                <img 
                  src={selectedMedia[0].url} 
                  alt="Preview" 
                  className="w-full h-auto rounded-xl shadow-xl border border-gray-100" 
                />
              ) : (
                <video 
                  src={selectedMedia[0].url} 
                  controls 
                  className="w-full h-auto rounded-xl shadow-xl border border-gray-100" 
                />
              )}

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  removeMedia(0);
                }}
                className="absolute top-3 right-3 p-2 bg-white/90 hover:bg-white text-gray-900 rounded-full shadow-lg transition-all transform hover:scale-110 active:scale-95 z-10"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="absolute bottom-3 left-3 px-3 py-1 bg-black/50 backdrop-blur-md rounded-full text-white text-[10px] font-bold uppercase tracking-widest pointer-events-none">
                {selectedMedia[0].type} Preview
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default MediaForm;
