import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Footer from "./Footer";
import api from "../../api/axios";

const JobRecommendations = () => {
  const [jobs, setJobs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await api.get("/posts/jobs/recommended");
        if (res.data && res.data.success) {
          setJobs(res.data.jobs || []);
        }
      } catch (error) {
        console.error("Error fetching recommended jobs:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchJobs();
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: { opacity: 1, x: 0 },
  };

  return (
    <motion.div 
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="h-full"
    >
      <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm hover:shadow-md transition-shadow duration-300">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-base font-bold text-gray-900 tracking-tight">
            Recommended Jobs
          </h2>
          <motion.div
            whileHover={{ rotate: 15, scale: 1.1 }}
            className="cursor-pointer p-1 rounded-full hover:bg-gray-100 transition-colors"
          >
            <svg
              className="w-5 h-5 text-gray-400"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
          </motion.div>
        </div>

        <div className="space-y-4">
          {isLoading ? (
            Array.from({ length: 5 }).map((_, index) => (
              <div key={index} className="flex items-start animate-pulse">
                <div className="w-10 h-10 bg-gray-200 rounded-lg mr-3 shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-1.5" />
                  <div className="h-3 bg-gray-200 rounded w-1/2 mb-1" />
                  <div className="h-3 bg-gray-200 rounded w-1/3 mb-2" />
                  <div className="h-6 bg-gray-200 rounded-full w-20" />
                </div>
              </div>
            ))
          ) : jobs.length === 0 ? (
            <div className="text-center py-6 text-gray-400 text-xs font-semibold">
              No recommended jobs at the moment
            </div>
          ) : (
            jobs.map((job) => {
              const author = job.author;
              const authorModel = job.authorModel;
              const jobData = job.referenceId; // JobPost details

              let logo = "/company.svg";
              let uploaderName = "Unknown Uploader";
              let title = jobData?.title || job.content || "Job Posting";
              let location = jobData?.location || "Remote";

              // 2. Conditional Rendering: Check uploader's role
              if (authorModel === "Company") {
                const creator = author.createdBy;
                const creatorRole = creator?.role; // "company" or "hire"
                if (creatorRole === "company" || creatorRole === "hire") {
                  uploaderName = author.name || "Unknown Company";
                } else {
                  uploaderName = creator ? `${creator.firstName || ""} ${creator.lastName || ""}`.trim() : "";
                  if (!uploaderName) {
                    uploaderName = author.name || "Unknown Company";
                  }
                }
                if (creatorRole === "hire") {
                  logo = creator?.avatar || "/avatar.svg";
                } else {
                  logo = author.logo || "/company.svg";
                }
              } else if (authorModel === "User") {
                uploaderName = `${author.firstName || ""} ${author.lastName || ""}`.trim() || "Unknown User";
                logo = author.avatar || "/avatar.svg";
              }

              return (
                <motion.div 
                  key={job._id} 
                  variants={itemVariants}
                  whileHover={{ x: 4 }}
                  className="flex items-start group"
                >
                  <motion.img
                    whileHover={{ scale: 1.05 }}
                    src={logo}
                    alt={`${uploaderName} logo`}
                    className="w-10 h-10 object-cover mr-3 bg-gray-50 rounded-lg border border-gray-100 p-0.5 transition-colors group-hover:border-blue-200 group-hover:bg-blue-50"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = authorModel === "Company" ? "/company.svg" : "/avatar.svg";
                    }}
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-semibold text-gray-900 truncate group-hover:text-blue-600 transition-colors cursor-pointer">
                      {title}
                    </h3>
                    <p className="text-xs text-gray-500 truncate">{uploaderName}</p>
                    <p className="text-[11px] text-gray-400 mt-0.5">{location}</p>
                    <motion.button 
                      whileHover={{ scale: 1.02, backgroundColor: "#eff6ff" }}
                      whileTap={{ scale: 0.98 }}
                      className="mt-2 text-blue-600 border border-blue-600 rounded-full px-5 py-1 text-[11px] font-bold hover:border-blue-700 transition-all duration-200 shadow-sm hover:shadow"
                    >
                      Apply
                    </motion.button>
                  </div>
                </motion.div>
              );
            })
          )}
        </div>

        <div className="mt-5 pt-3 border-t border-gray-100">
          <motion.button 
            variants={{
              hovered: { scale: 1.01, backgroundColor: "#f9fafb" }
            }}
            whileHover="hovered"
            whileTap={{ scale: 0.99 }}
            className="text-gray-500 hover:text-gray-900 w-full rounded-xl py-2 text-xs font-bold transition-all flex items-center justify-center gap-1.5 border border-transparent hover:border-gray-200"
          >
            Show all
            <motion.svg
              variants={{
                hovered: { 
                  x: [0, 4, 0],
                  transition: { repeat: Infinity, duration: 1.5, ease: "easeInOut" } 
                }
              }}
              className="w-4 h-4"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </motion.svg>
          </motion.button>
        </div>
      </div>
      <Footer />
    </motion.div>
  );
};

export default JobRecommendations;

