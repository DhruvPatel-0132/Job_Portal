import React from "react";
import { motion, AnimatePresence } from "motion/react";
import { Plus, X, Type, AlignLeft, Hash } from "lucide-react";

const ArticleForm = ({
  articleData, setArticleData, tagInput, setTagInput, handleAddTag, removeTag,
  articleImageRef, handleArticleCoverSelect, removeArticleCover
}) => {
  const wordCount = articleData.content?.trim().split(/\s+/).filter(Boolean).length || 0;
  const readTime = Math.max(1, Math.ceil(wordCount / 200));

  return (
    <motion.div
      key="article"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="flex justify-between text-[10px] text-gray-400 font-bold uppercase px-1">
        <span>Drafting Article</span>
        <span>{wordCount} words • {readTime} min read</span>
      </div>
      {/* Cover Image Section */}
      <div className="relative">
        {articleData.coverImage ? (
          <div className="relative w-full h-56 rounded-2xl overflow-hidden group shadow-lg border border-gray-100">
            <img src={articleData.coverImage.url} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" alt="Article cover" />
            <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <button
                onClick={removeArticleCover}
                className="p-3 bg-white/90 hover:bg-white text-red-500 rounded-full shadow-xl transform transition-all hover:scale-110 active:scale-95"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>
        ) : (
          <motion.div
            whileHover={{ scale: 1.005, borderColor: "#10b981" }}
            onClick={() => articleImageRef.current?.click()}
            className="w-full h-56 bg-gradient-to-br from-gray-50 to-gray-100 border-2 border-dashed border-gray-200 rounded-2xl flex flex-col items-center justify-center text-gray-400 hover:bg-emerald-50/30 hover:text-emerald-500 transition-all cursor-pointer group"
          >
            <div className="p-4 bg-white rounded-full shadow-sm mb-3 group-hover:shadow-md transition-all">
              <Plus className="w-8 h-8" />
            </div>
            <span className="text-sm font-bold tracking-tight uppercase">Add a compelling cover image</span>
            <p className="text-xs mt-1 text-gray-400 font-medium">1200 x 630 recommended</p>
            <input
              type="file"
              ref={articleImageRef}
              onChange={handleArticleCoverSelect}
              accept="image/*"
              className="hidden"
            />
          </motion.div>
        )}
      </div>

      {/* Article Header Inputs */}
      <div className="space-y-4">
        <div className="relative group">
          <input
            className="w-full px-0 py-2 text-4xl font-black placeholder-gray-200 focus:outline-none bg-transparent border-none tracking-tight"
            placeholder="Article Title..."
            value={articleData.title}
            onChange={(e) => setArticleData({ ...articleData, title: e.target.value })}
          />
          <div className="h-0.5 w-0 group-focus-within:w-full bg-emerald-400 transition-all duration-300" />
        </div>

        <div className="relative">
          <div className="absolute left-3 top-3.5">
            <AlignLeft className="w-4 h-4 text-gray-400" />
          </div>
          <textarea
            className="w-full pl-10 pr-4 py-3 border border-gray-100 bg-gray-50/50 rounded-xl text-sm outline-none focus:ring-2 focus:ring-emerald-500/10 focus:bg-white transition-all resize-none font-medium text-gray-600"
            placeholder="Write a brief, catchy summary for your readers..."
            rows={2}
            maxLength={500}
            value={articleData.summary}
            onChange={(e) => setArticleData({ ...articleData, summary: e.target.value })}
          />
          <div className="absolute bottom-2 right-3 text-[10px] font-bold text-gray-400 uppercase">
            {articleData.summary?.length || 0}/500
          </div>
        </div>
      </div>

      {/* Tags Section */}
      <div className="space-y-3 p-4 bg-gray-50/50 rounded-2xl border border-gray-100">
        <div className="flex items-center gap-2 mb-1">
          <Hash className="w-4 h-4 text-emerald-500" />
          <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Discoverability Tags</span>
        </div>
        <input
          className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all focus:border-emerald-500"
          placeholder="Add tags (e.g. Technology, Career) and press Enter..."
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
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                className="bg-white text-emerald-600 px-3 py-1.5 rounded-lg text-sm font-bold flex items-center gap-2 border border-emerald-100 shadow-sm hover:border-emerald-300 transition-all"
              >
                #{tag}
                <button
                  onClick={() => removeTag(tag)}
                  className="hover:text-red-500 transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </motion.span>
            ))}
          </AnimatePresence>
        </div>
      </div>

      {/* Content Area */}
      <div className="relative min-h-[300px]">
        <textarea
          className="w-full min-h-[350px] text-lg focus:outline-none resize-none leading-relaxed font-serif text-gray-800 bg-transparent placeholder-gray-300"
          placeholder="Start writing your masterpiece..."
          value={articleData.content}
          onChange={(e) => setArticleData({ ...articleData, content: e.target.value })}
        />
      </div>
    </motion.div>
  );
};

export default ArticleForm;
