import React from "react";
import { motion, AnimatePresence } from "motion/react";
import { Plus, X } from "lucide-react";

const ArticleForm = ({ 
  articleData, setArticleData, tagInput, setTagInput, handleAddTag, removeTag 
}) => {
  return (
    <motion.div key="article" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
      <motion.div whileHover={{ scale: 1.01 }} className="w-full h-48 bg-gray-50 border-2 border-dashed border-gray-200 rounded-2xl flex flex-col items-center justify-center text-gray-400 hover:bg-gray-100 transition-all cursor-pointer">
        <Plus className="w-8 h-8 mb-2" />
        <span className="text-sm font-bold">Add a cover image</span>
      </motion.div>
      <input
        className="w-full px-0 py-2 text-3xl font-extrabold placeholder-gray-300 focus:outline-none"
        placeholder="Article Title"
        value={articleData.title}
        onChange={(e) => setArticleData({ ...articleData, title: e.target.value })}
      />
      <input
        className="w-full px-4 py-2 border border-gray-200 rounded-xl text-sm outline-none"
        placeholder="Short Summary (SEO)"
        value={articleData.summary}
        onChange={(e) => setArticleData({ ...articleData, summary: e.target.value })}
      />
      <div className="space-y-3">
        <input
          className="w-full px-4 py-2 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all focus:border-emerald-500"
          placeholder="Add tags (press Enter)..."
          value={tagInput}
          onChange={(e) => setTagInput(e.target.value)}
          onKeyDown={handleAddTag}
        />
        <div className="flex flex-wrap gap-2 min-h-[20px]">
          <AnimatePresence>
            {articleData.tags.map((tag, index) => (
              <motion.span
                key={tag}
                layout
                initial={{ scale: 0.5, opacity: 0, y: 10 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.5, opacity: 0, transition: { duration: 0.2 } }}
                whileHover={{ scale: 1.05, backgroundColor: "#ecfdf5" }}
                className="bg-emerald-50 text-emerald-600 px-3 py-1.5 rounded-full text-sm font-bold flex items-center gap-2 border border-emerald-100 shadow-sm"
              >
                #{tag}
                <motion.button 
                  whileHover={{ scale: 1.2, color: "#065f46" }}
                  whileTap={{ scale: 0.8 }}
                  onClick={() => removeTag(tag)} 
                  className="text-emerald-400 transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                </motion.button>
              </motion.span>
            ))}
          </AnimatePresence>
        </div>
      </div>
      <textarea
        className="w-full min-h-[250px] text-lg focus:outline-none resize-none leading-relaxed"
        placeholder="Write your thoughts..."
        value={articleData.content}
        onChange={(e) => setArticleData({ ...articleData, content: e.target.value })}
      />
    </motion.div>
  );
};

export default ArticleForm;
