import React, { useState } from "react";
import { motion } from "framer-motion";
import { UserCheck, Search, Sparkles, MapPin, Briefcase, Mail } from "lucide-react";

const headerVariants = {
  hidden: { opacity: 0, y: -20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 200, damping: 20 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 24, scale: 0.97 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: "spring", stiffness: 260, damping: 24 },
  },
};

const DUMMY_CANDIDATES = [
  {
    id: "cand1",
    name: "David Smith",
    avatar: "https://i.pravatar.cc/150?u=david",
    role: "Full Stack Engineer",
    location: "Remote",
    experience: "6 years",
    skills: ["React", "Node.js", "MongoDB", "AWS"],
    status: "Shortlisted",
  },
  {
    id: "cand2",
    name: "Emily Davis",
    avatar: "https://i.pravatar.cc/150?u=emily",
    role: "UX/UI Designer",
    location: "London, UK",
    experience: "3 years",
    skills: ["Figma", "Sketch", "Prototyping"],
    status: "Interviewing",
  },
  {
    id: "cand3",
    name: "James Wilson",
    avatar: "https://i.pravatar.cc/150?u=james",
    role: "DevOps Engineer",
    location: "Berlin, DE",
    experience: "8 years",
    skills: ["Docker", "Kubernetes", "CI/CD"],
    status: "New",
  }
];

const STATUS_COLORS = {
  "New": "bg-blue-50 text-blue-600 ring-blue-200/50",
  "Shortlisted": "bg-purple-50 text-purple-600 ring-purple-200/50",
  "Interviewing": "bg-amber-50 text-amber-600 ring-amber-200/50",
  "Hired": "bg-emerald-50 text-emerald-600 ring-emerald-200/50",
};

const Candidates = () => {
  const [candidates, setCandidates] = useState(DUMMY_CANDIDATES);

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      {/* Header */}
      <motion.div
        variants={headerVariants}
        initial="hidden"
        animate="visible"
        className="mb-8"
      >
        <div className="flex items-center gap-3 mb-1">
          <motion.div
            className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center shadow-lg shadow-emerald-200/50"
            whileHover={{ rotate: [0, -8, 8, 0], scale: 1.05 }}
            transition={{ duration: 0.4 }}
          >
            <UserCheck className="h-5 w-5 text-white" />
          </motion.div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Candidates</h1>
            <p className="text-sm text-gray-500">
              Browse and manage your candidate pipeline
            </p>
          </div>
        </div>
      </motion.div>

      {/* Candidates List */}
      <motion.div 
        className="space-y-4"
        initial="hidden"
        animate="visible"
        variants={{
          hidden: { opacity: 0 },
          visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1 },
          },
        }}
      >
        {candidates.length > 0 ? (
          candidates.map((cand) => (
            <motion.div
              key={cand.id}
              variants={cardVariants}
              whileHover={{ y: -2, boxShadow: "0 8px 30px -12px rgba(0,0,0,0.12)" }}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 cursor-pointer flex flex-col md:flex-row items-start md:items-center justify-between group gap-4"
            >
              <div className="flex items-center gap-4">
                <img src={cand.avatar} alt={cand.name} className="w-14 h-14 rounded-full object-cover" />
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold text-gray-900 group-hover:text-emerald-600 transition-colors">
                      {cand.name}
                    </h3>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ring-1 ${STATUS_COLORS[cand.status] || STATUS_COLORS["New"]}`}>
                      {cand.status}
                    </span>
                  </div>
                  <div className="text-sm font-medium text-gray-700 mt-0.5">{cand.role}</div>
                  <div className="flex flex-wrap items-center gap-2 mt-1 text-xs text-gray-500">
                    <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{cand.location}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1"><Briefcase className="h-3 w-3" />{cand.experience}</span>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col items-start md:items-end gap-3 w-full md:w-auto">
                <div className="flex flex-wrap gap-1.5 justify-start md:justify-end">
                  {cand.skills.map((skill, i) => (
                    <span key={i} className="text-[10px] font-medium text-gray-600 bg-gray-100 px-2 py-1 rounded-md">
                      {skill}
                    </span>
                  ))}
                </div>
                <button className="text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 px-4 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors">
                  <Mail className="h-3 w-3" /> Contact
                </button>
              </div>
            </motion.div>
          ))
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            className="bg-white rounded-2xl border border-gray-100 shadow-sm p-14 flex flex-col items-center justify-center text-center"
          >
            <motion.div
              className="w-20 h-20 bg-gradient-to-br from-emerald-50 to-teal-100 rounded-2xl flex items-center justify-center mb-5"
              animate={{ rotate: [0, 3, -3, 0], scale: [1, 1.02, 1] }}
              transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
            >
              <Search className="h-10 w-10 text-emerald-600" />
            </motion.div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              No candidates yet
            </h3>
            <p className="text-sm text-gray-500 max-w-sm leading-relaxed">
              Candidates who match your job requirements will show up here. Start by
              posting a job to attract talent.
            </p>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default Candidates;
