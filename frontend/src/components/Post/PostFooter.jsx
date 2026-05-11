import React from "react";
import { motion } from "motion/react";
import { 
  Image as ImageIcon, Briefcase, FileText, Code, Award, MessageSquare 
} from "lucide-react";
import ToolbarButton from "./ToolbarButton";

const PostFooter = ({ postType, setPostType, role, handlePost, loading }) => {

  const getPostButtonLabel = () => {
    switch (postType) {
      case "job_post": return "Post Job";
      case "article": return "Publish";
      case "project": return "Showcase";
      case "achievement": return "Add";
      default: return "Post";
    }
  };

  return (
    <div className="px-6 py-4 border-t border-gray-100 bg-white">
      <div className="flex items-center justify-between">
        <div className="flex gap-1">
          <ToolbarButton
            icon={<ImageIcon className="w-6 h-6" />}
            color="blue"
            onClick={() => setPostType("media")}
            title="Add Photo"
          />

          {role === "company" ? (
            <>
              <ToolbarButton
                icon={<Briefcase className="w-6 h-6" />}
                color="orange"
                onClick={() => setPostType("job_post")}
                title="Post a Job"
              />
              <ToolbarButton
                icon={<FileText className="w-6 h-6" />}
                color="gray"
                onClick={() => setPostType("article")}
                title="Write Article"
              />
            </>
          ) : (
            <>
              <ToolbarButton
                icon={<Code className="w-6 h-6" />}
                color="indigo"
                onClick={() => setPostType("project")}
                title="Showcase Project"
              />
              <ToolbarButton
                icon={<Award className="w-6 h-6" />}
                color="purple"
                onClick={() => setPostType("achievement")}
                title="Add Achievement"
              />
            </>
          )}

          <ToolbarButton
            icon={<MessageSquare className="w-6 h-6" />}
            color="gray"
            onClick={() => setPostType("regular")}
            title="Text Post"
          />
        </div>

        <motion.button
          whileHover={!loading ? { scale: 1.05 } : {}}
          whileTap={!loading ? { scale: 0.95 } : {}}
          onClick={handlePost}
          disabled={loading}
          className={`px-8 py-2.5 bg-blue-600 text-white font-bold rounded-full transition-all shadow-lg shadow-blue-200 ${
            loading ? "opacity-70 cursor-not-allowed" : "hover:bg-blue-700"
          }`}
        >
          {loading ? "Posting..." : getPostButtonLabel()}
        </motion.button>

      </div>
    </div>
  );
};

export default PostFooter;
