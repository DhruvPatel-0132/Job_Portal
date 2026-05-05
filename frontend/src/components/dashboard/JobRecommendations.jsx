import React from "react";
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

  return (
    <div className="h-full">
      <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-base font-semibold text-gray-900">
            Recommended Jobs
          </h2>
          <svg
            className="w-5 h-5 text-gray-500 cursor-pointer hover:bg-gray-100 rounded-full p-0.5 transition-colors"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
        </div>

        <div className="space-y-4">
          {jobs.map((job) => (
            <div key={job.id} className="flex items-start">
              <img
                src={job.logo}
                alt={`${job.company} logo`}
                className="w-10 h-10 object-contain mr-3 bg-gray-50 rounded border border-gray-100 p-1"
              />
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-semibold text-gray-900 truncate hover:text-blue-600 hover:underline cursor-pointer">
                  {job.title}
                </h3>
                <p className="text-xs text-gray-500 truncate">{job.company}</p>
                <p className="text-xs text-gray-400 mt-0.5">{job.location}</p>
                <button className="mt-2 text-blue-600 border border-blue-600 rounded-full px-4 py-1 text-sm font-semibold hover:bg-blue-50 hover:border-blue-700 transition-colors">
                  Apply
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 pt-3 border-t border-gray-100">
          <button className="text-gray-500 hover:bg-gray-100 hover:text-gray-900 w-full rounded-md py-1.5 text-sm font-medium transition-colors flex items-center justify-center">
            Show all
            <svg
              className="w-4 h-4 ml-1"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default JobRecommendations;
