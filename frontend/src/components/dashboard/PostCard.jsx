import React from "react";
import { ThumbsUp, MessageSquare, Repeat, Send } from "lucide-react";

const PostCard = ({ post }) => {
  return (
    <div className="bg-white rounded-lg border border-gray-200 mb-4 shadow-sm">
      {/* Post Header */}
      <div className="flex items-center px-4 py-3">
        <img
          src={post.author.avatar}
          alt={post.author.name}
          className="w-12 h-12 rounded-full object-cover mr-3"
        />
        <div className="flex-1">
          <h3 className="text-sm font-semibold text-gray-900 hover:text-blue-600 hover:underline cursor-pointer">
            {post.author.name}
          </h3>
          <p className="text-xs text-gray-500">{post.author.headline}</p>
          <p className="text-xs text-gray-400 flex items-center mt-0.5">
            {post.timeAgo} •
            <svg
              className="w-3 h-3 ml-1"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9V8h2v8zm4 0h-2V8h2v8z" />
            </svg>
          </p>
        </div>
        <button className="text-gray-400 hover:bg-gray-100 p-1 rounded-full transition-colors focus:outline-none">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z" />
          </svg>
        </button>
      </div>

      {/* Post Content */}
      <div className="px-4 pb-2">
        <p className="text-sm text-gray-800 whitespace-pre-line">
          {post.content}
        </p>
      </div>

      {/* Post Image (optional) */}
      {post.image && (
        <div className="mt-2">
          <img
            src={post.image}
            alt="Post content"
            className="w-full h-auto object-contain max-h-[500px] bg-gray-50 border-t border-b border-gray-100"
          />
        </div>
      )}

      {/* Post Stats */}
      <div className="px-4 py-2 flex items-center justify-between border-b border-gray-100 text-xs text-gray-500">
        <div className="flex items-center space-x-1">
          <span className="flex items-center justify-center w-4 h-4 bg-blue-100 rounded-full">
            <ThumbsUp className="w-2.5 h-2.5 text-blue-600" />
          </span>
          <span>{post.likesCount}</span>
        </div>
        <div className="flex space-x-3">
          <span className="hover:text-blue-600 hover:underline cursor-pointer">
            {post.commentsCount} comments
          </span>
          {/* <span className="hover:text-blue-600 hover:underline cursor-pointer">{post.sharesCount} shares</span> */}
        </div>
      </div>

      {/* Post Actions */}
      <div className="px-2 py-1 flex items-center justify-between sm:justify-start sm:space-x-2">
        <ActionButton icon={<ThumbsUp className="w-5 h-5" />} label="Like" />
        <ActionButton
          icon={<MessageSquare className="w-5 h-5" />}
          label="Comment"
        />
        <ActionButton icon={<Repeat className="w-5 h-5" />} label="Repost" />
        <ActionButton icon={<Send className="w-5 h-5" />} label="Send" />
      </div>
    </div>
  );
};

const ActionButton = ({ icon, label }) => (
  <button className="flex-1 sm:flex-none flex items-center justify-center space-x-2 px-3 py-2.5 rounded-md hover:bg-gray-100 text-gray-500 font-medium transition-colors">
    {icon}
    <span className="text-sm hidden sm:block">{label}</span>
  </button>
);

export default PostCard;
