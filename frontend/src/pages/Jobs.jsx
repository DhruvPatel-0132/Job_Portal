import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FileText, 
  Upload, 
  CheckCircle2, 
  MapPin, 
  Briefcase, 
  Building2, 
  DollarSign,
} from "lucide-react";

const JOBS_DATA = [
  {
    id: 1,
    title: "Senior Full Stack Developer",
    company: "Google",
    location: "Mountain View, CA",
    salary: "$150k - $220k",
    type: "Full-time",
    logo: "https://www.google.com/images/branding/googleg/1x/googleg_standard_color_128dp.png",
  },
  {
    id: 2,
    title: "Product Designer",
    company: "Meta",
    location: "Remote",
    salary: "$130k - $190k",
    type: "Contract",
    logo: "https://upload.wikimedia.org/wikipedia/commons/7/7b/Meta_Platforms_Inc._logo.svg",
  },
  {
    id: 3,
    title: "Data Scientist",
    company: "Amazon",
    location: "Seattle, WA",
    salary: "$140k - $210k",
    type: "Full-time",
    logo: "https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg",
  }
];

const Jobs = () => {
  const [isUploading, setIsUploading] = useState(false);
  const [resumeName, setResumeName] = useState(null);
  const [atsScore, setAtsScore] = useState(null);
  const [summary, setSummary] = useState(null);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setIsUploading(true);
      setResumeName(file.name);
      
      // Simulate ATS analysis
      setTimeout(() => {
        setIsUploading(false);
        setAtsScore(Math.floor(Math.random() * (95 - 75 + 1)) + 75);
        setSummary([
          "Expertise in React, Node.js, and Distributed Systems",
          "5+ years of experience in Full Stack Development",
          "Strong background in Cloud Infrastructure (AWS/GCP)",
          "Proven track record of leading cross-functional teams"
        ]);
      }, 2000);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      {/* ─── Header ─── */}
      <div className="text-center mb-10">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-2">Job matches</h1>
        <p className="text-gray-500 text-sm">Upload your resume to see how well you match with current openings</p>
      </div>

      {/* ─── Resume & ATS Section ─── */}
      <section className="mb-12">
        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
          {!resumeName ? (
            <label className="cursor-pointer block group">
              <input type="file" className="hidden" onChange={handleFileUpload} accept=".pdf,.doc,.docx" />
              <div className="border-2 border-dashed border-gray-100 rounded-xl p-8 flex flex-col items-center justify-center transition-all group-hover:border-blue-300 group-hover:bg-blue-50/20">
                <Upload size={24} className="text-gray-400 mb-3 group-hover:text-blue-500 transition-colors" />
                <h3 className="text-md font-bold text-gray-900">Click to upload resume</h3>
                <p className="text-[11px] text-gray-400 mt-1 uppercase tracking-wider font-bold">PDF, DOCX up to 5MB</p>
              </div>
            </label>
          ) : (
            <div className="space-y-6">
              <AnimatePresence mode="wait">
                {isUploading ? (
                  <motion.div 
                    key="uploading"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex flex-col items-center py-6"
                  >
                    <div className="w-10 h-10 border-3 border-gray-100 border-t-blue-600 rounded-full animate-spin mb-3" />
                    <p className="text-sm font-bold text-gray-900">Analyzing resume...</p>
                  </motion.div>
                ) : (
                  <motion.div 
                    key="results"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="divide-y divide-gray-50"
                  >
                    {/* Header: Score & File */}
                    <div className="flex items-center justify-between pb-6">
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 bg-blue-600 text-white rounded-xl flex flex-col items-center justify-center shadow-lg shadow-blue-100">
                          <span className="text-lg font-black leading-none">{atsScore}</span>
                          <span className="text-[8px] font-bold uppercase mt-1 opacity-80">Score</span>
                        </div>
                        <div>
                          <h4 className="font-bold text-gray-900">ATS Match Found</h4>
                          <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                            <FileText size={12} className="text-blue-600" />
                            <span className="truncate max-w-[150px]">{resumeName}</span>
                          </div>
                        </div>
                      </div>
                      <button 
                        onClick={() => { setResumeName(null); setAtsScore(null); setSummary(null); }}
                        className="text-xs font-bold text-blue-600 hover:bg-blue-50 px-3 py-2 rounded-lg transition-colors"
                      >
                        Change File
                      </button>
                    </div>

                    {/* Resume Summary Section */}
                    <div className="pt-6">
                      <h5 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Resume Highlights</h5>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {summary?.map((item, i) => (
                          <div key={i} className="flex gap-3 p-3 bg-gray-50 rounded-xl border border-gray-100/50">
                            <CheckCircle2 size={14} className="text-emerald-500 shrink-0 mt-0.5" />
                            <p className="text-xs text-gray-700 font-medium leading-relaxed">{item}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
        </div>
      </section>

      {/* ─── Jobs List ─── */}
      <section className="space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-gray-100">
          <h2 className="text-xl font-bold text-gray-900">Recommended Jobs</h2>
          <span className="text-[10px] font-black text-gray-400 uppercase tracking-wider">{JOBS_DATA.length} Opportunities</span>
        </div>

        <div className="space-y-4">
          {JOBS_DATA.map((job, index) => (
            <motion.div
              key={job.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -2 }}
              className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all cursor-pointer group"
            >
              <div className="flex items-center gap-5">
                <div className="w-12 h-12 rounded-xl bg-gray-50 p-2 flex items-center justify-center border border-gray-100 group-hover:bg-white transition-colors">
                  <img src={job.logo} alt={job.company} className="w-full h-full object-contain grayscale group-hover:grayscale-0 transition-all duration-300" />
                </div>
                
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-md font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                        {job.title}
                      </h3>
                      <div className="flex items-center gap-2 mt-0.5 text-xs text-gray-500 font-medium">
                        <Building2 size={12} />
                        <span>{job.company}</span>
                      </div>
                    </div>
                    {atsScore && (
                      <div className="bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full text-[10px] font-black">
                        {atsScore - index * 2}% Match
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-4 mt-3 text-[11px] text-gray-400">
                    <div className="flex items-center gap-1.5">
                      <MapPin size={12} />
                      {job.location}
                    </div>
                    <div className="flex items-center gap-1.5 font-bold text-emerald-600">
                      <DollarSign size={12} />
                      {job.salary}
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Briefcase size={12} />
                      {job.type}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <button className="w-full py-4 bg-gray-50 text-gray-500 rounded-2xl font-bold text-sm hover:bg-gray-100 hover:text-gray-700 transition-all">
          View all openings
        </button>
      </section>
    </div>
  );
};

export default Jobs;
