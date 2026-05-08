import React from "react";
import { motion } from "framer-motion";
import Footer from "./Footer";

const JobRecommendations = () => {
  const jobs = [
    {
      id: 1,
      title: "Senior Frontend Developer",
      company: "TechNova",
      location: "Remote",
      logo: "/company.svg",
    },
    {
      id: 2,
      title: "React Native Engineer",
      company: "AppWorks",
      location: "San Francisco, CA",
      logo: "/company.svg",
    },
    {
      id: 3,
      title: "Full Stack Developer",
      company: "InnovateTech",
      location: "New York, NY",
      logo: "/company.svg",
    },
    {
      id: 4,
      title: "UI/UX Designer",
      company: "Creative Solutions",
      location: "London, UK",
      logo: "/company.svg",
    },
    {
      id: 5,
      title: "DevOps Engineer",
      company: "CloudSystems",
      location: "Remote",
      logo: "/company.svg",
    },
  ];

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
          {jobs.map((job) => (
            <motion.div 
              key={job.id} 
              variants={itemVariants}
              whileHover={{ x: 4 }}
              className="flex items-start group"
            >
              <motion.img
                whileHover={{ scale: 1.05 }}
                src={job.logo}
                alt={`${job.company} logo`}
                className="w-10 h-10 object-contain mr-3 bg-gray-50 rounded-lg border border-gray-100 p-1.5 transition-colors group-hover:border-blue-200 group-hover:bg-blue-50"
              />
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-semibold text-gray-900 truncate group-hover:text-blue-600 transition-colors cursor-pointer">
                  {job.title}
                </h3>
                <p className="text-xs text-gray-500 truncate">{job.company}</p>
                <p className="text-[11px] text-gray-400 mt-0.5">{job.location}</p>
                <motion.button 
                  whileHover={{ scale: 1.02, backgroundColor: "#eff6ff" }}
                  whileTap={{ scale: 0.98 }}
                  className="mt-2 text-blue-600 border border-blue-600 rounded-full px-5 py-1 text-[11px] font-bold hover:border-blue-700 transition-all duration-200 shadow-sm hover:shadow"
                >
                  Apply
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-5 pt-3 border-t border-gray-100">
          <motion.button 
            whileHover={{ scale: 1.01, backgroundColor: "#f9fafb" }}
            whileTap={{ scale: 0.99 }}
            className="text-gray-500 hover:text-gray-900 w-full rounded-xl py-2 text-xs font-bold transition-all flex items-center justify-center gap-1.5 border border-transparent hover:border-gray-200"
          >
            Show all
            <motion.svg
              animate={{ x: [0, 4, 0] }}
              transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
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

