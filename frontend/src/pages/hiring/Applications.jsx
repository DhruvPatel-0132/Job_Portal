import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ClipboardList, Inbox, Sparkles, MapPin, Briefcase, ChevronDown, CheckCircle2, XCircle, Clock } from "lucide-react";

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

const DUMMY_APPLICATIONS = [
  {
    id: "app1",
    applicantName: "Alex Johnson",
    applicantAvatar: "https://i.pravatar.cc/150?u=alex",
    jobTitle: "Senior Frontend Developer",
    appliedDate: "2024-05-15T10:30:00Z",
    status: "pending",
    resumeLink: "#",
    matchScore: 92,
    location: "New York, NY",
    experience: "5 years",
  },
  {
    id: "app2",
    applicantName: "Samantha Lee",
    applicantAvatar: "https://i.pravatar.cc/150?u=sam",
    jobTitle: "Product Manager",
    appliedDate: "2024-05-14T14:20:00Z",
    status: "reviewed",
    resumeLink: "#",
    matchScore: 85,
    location: "San Francisco, CA",
    experience: "4 years",
  },
  {
    id: "app3",
    applicantName: "Michael Chen",
    applicantAvatar: "https://i.pravatar.cc/150?u=mike",
    jobTitle: "Senior Frontend Developer",
    appliedDate: "2024-05-10T09:15:00Z",
    status: "rejected",
    resumeLink: "#",
    matchScore: 65,
    location: "Austin, TX",
    experience: "2 years",
  }
];

const STATUS_COLORS = {
  pending: "bg-amber-50 text-amber-600 ring-amber-200/50",
  reviewed: "bg-blue-50 text-blue-600 ring-blue-200/50",
  accepted: "bg-emerald-50 text-emerald-600 ring-emerald-200/50",
  rejected: "bg-red-50 text-red-600 ring-red-200/50",
};

const Applications = () => {
  const [applications, setApplications] = useState(DUMMY_APPLICATIONS);
  
  const timeAgo = (date) => {
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);
    const days = Math.floor(seconds / (3600 * 24));
    if (days === 0) return "Today";
    if (days === 1) return "Yesterday";
    return `${days} days ago`;
  };

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
            className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center shadow-lg shadow-amber-200/50"
            whileHover={{ rotate: [0, -8, 8, 0], scale: 1.05 }}
            transition={{ duration: 0.4 }}
          >
            <ClipboardList className="h-5 w-5 text-white" />
          </motion.div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Applications</h1>
            <p className="text-sm text-gray-500">
              Review and manage applications from candidates
            </p>
          </div>
        </div>
      </motion.div>

      {/* Applications List */}
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
        {applications.length > 0 ? (
          applications.map((app) => (
            <motion.div
              key={app.id}
              variants={cardVariants}
              whileHover={{ y: -2, boxShadow: "0 8px 30px -12px rgba(0,0,0,0.12)" }}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 cursor-pointer flex items-center justify-between group"
            >
              <div className="flex items-center gap-4">
                <img src={app.applicantAvatar} alt={app.applicantName} className="w-12 h-12 rounded-full object-cover" />
                <div>
                  <h3 className="text-base font-bold text-gray-900 group-hover:text-amber-600 transition-colors">
                    {app.applicantName}
                  </h3>
                  <div className="flex flex-wrap items-center gap-2 mt-1 text-xs text-gray-500">
                    <span className="font-medium text-gray-700">{app.jobTitle}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{app.location}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1"><Briefcase className="h-3 w-3" />{app.experience}</span>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col items-end gap-2">
                <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider ring-1 ${STATUS_COLORS[app.status]}`}>
                  {app.status}
                </span>
                <div className="flex items-center gap-3 text-xs text-gray-400">
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" /> {timeAgo(app.appliedDate)}
                  </span>
                  <span className="font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">
                    {app.matchScore}% Match
                  </span>
                </div>
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
              className="w-20 h-20 bg-gradient-to-br from-amber-50 to-orange-100 rounded-2xl flex items-center justify-center mb-5"
              animate={{ rotate: [0, 3, -3, 0], scale: [1, 1.02, 1] }}
              transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
            >
              <Inbox className="h-10 w-10 text-amber-600" />
            </motion.div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              No applications yet
            </h3>
            <p className="text-sm text-gray-500 max-w-sm leading-relaxed">
              Once candidates apply to your job posts, their applications will
              appear here for you to review and manage.
            </p>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default Applications;
