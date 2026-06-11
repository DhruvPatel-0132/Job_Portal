import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Briefcase,
  MapPin,
  Calendar,
  CheckCircle2,
  Clock,
  Building2,
  AlertCircle,
  FileText,
  ChevronRight,
  TrendingUp,
  Search,
  MessageSquare,
} from "lucide-react";

// Dummy Data
const MY_APPLICATIONS = [
  {
    id: 1,
    company: "Google",
    logo: "https://www.google.com/images/branding/googleg/1x/googleg_standard_color_128dp.png",
    title: "Senior Full Stack Developer",
    location: "Mountain View, CA",
    appliedDate: "Jun 10, 2026",
    status: "Interviewing",
    matchScore: 92,
    stages: [
      { name: "Applied", completed: true },
      { name: "Under Review", completed: true },
      { name: "Interview", completed: true, active: true },
      { name: "Offer", completed: false },
    ],
  },
  {
    id: 2,
    company: "Meta",
    logo: "https://upload.wikimedia.org/wikipedia/commons/7/7b/Meta_Platforms_Inc._logo.svg",
    title: "Product Designer",
    location: "Remote",
    appliedDate: "Jun 05, 2026",
    status: "Under Review",
    matchScore: 88,
    stages: [
      { name: "Applied", completed: true },
      { name: "Under Review", completed: true, active: true },
      { name: "Interview", completed: false },
      { name: "Offer", completed: false },
    ],
  },
  {
    id: 3,
    company: "Amazon",
    logo: "https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg",
    title: "Data Scientist",
    location: "Seattle, WA",
    appliedDate: "May 28, 2026",
    status: "Rejected",
    matchScore: 75,
    stages: [
      { name: "Applied", completed: true },
      { name: "Under Review", completed: true },
      { name: "Interview", completed: false },
      { name: "Offer", completed: false },
    ],
  },
  {
    id: 4,
    company: "Netflix",
    logo: "https://upload.wikimedia.org/wikipedia/commons/0/08/Netflix_2015_logo.svg",
    title: "Backend Engineer",
    location: "Los Gatos, CA",
    appliedDate: "Jun 11, 2026",
    status: "Applied",
    matchScore: 95,
    stages: [
      { name: "Applied", completed: true, active: true },
      { name: "Under Review", completed: false },
      { name: "Interview", completed: false },
      { name: "Offer", completed: false },
    ],
  },
];

const StatusBadge = ({ status }) => {
  const getStyles = () => {
    switch (status) {
      case "Applied":
        return "bg-blue-50 text-blue-700 border-blue-200";
      case "Under Review":
        return "bg-amber-50 text-amber-700 border-amber-200";
      case "Interviewing":
        return "bg-purple-50 text-purple-700 border-purple-200";
      case "Offer":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "Rejected":
        return "bg-red-50 text-red-700 border-red-200";
      default:
        return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };

  const getIcon = () => {
    switch (status) {
      case "Applied":
        return <FileText size={12} />;
      case "Under Review":
        return <Clock size={12} />;
      case "Interviewing":
        return <MessageSquare size={12} />;
      case "Offer":
        return <CheckCircle2 size={12} />;
      case "Rejected":
        return <AlertCircle size={12} />;
      default:
        return null;
    }
  };

  // Safe fallback if MessageSquare is not imported but others are
  const icon = getIcon() || <Clock size={12} />;

  return (
    <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-[11px] font-bold uppercase tracking-wider ${getStyles()}`}>
      {icon}
      {status}
    </div>
  );
};

const ProgressTracker = ({ stages, status }) => {
  const isRejected = status === "Rejected";

  return (
    <div className="relative mt-6 mb-2">
      {/* Background Line */}
      <div className="absolute top-3 left-0 w-full h-1 bg-gray-100 rounded-full" />

      <div className="relative flex justify-between w-full">
        {stages.map((stage, i) => {
          const isCompleted = stage.completed;
          const isActive = stage.active && !isRejected;
          const isFailed = isRejected && stage.active;

          let nodeColor = "bg-white border-gray-200 text-gray-400";
          if (isCompleted && !isRejected) nodeColor = "bg-blue-600 border-blue-600 text-white";
          if (isCompleted && isRejected && !stage.active) nodeColor = "bg-blue-600 border-blue-600 text-white";
          if (isActive) nodeColor = "bg-white border-blue-600 text-blue-600 ring-4 ring-blue-50";
          if (isFailed) nodeColor = "bg-red-50 border-red-500 text-red-500 ring-4 ring-red-50";

          return (
            <div key={stage.name} className="flex flex-col items-center relative z-10 w-24">
              <div
                className={`w-7 h-7 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${nodeColor}`}
              >
                {isCompleted && !isFailed ? (
                  <CheckCircle2 size={14} className="text-current" />
                ) : isFailed ? (
                  <AlertCircle size={14} className="text-current" />
                ) : (
                  <div className={`w-2 h-2 rounded-full ${isActive ? "bg-blue-600" : "bg-transparent"}`} />
                )}
              </div>
              <span
                className={`mt-2 text-[10px] font-bold uppercase tracking-wider text-center ${isActive ? "text-blue-600" : isFailed ? "text-red-500" : isCompleted ? "text-gray-900" : "text-gray-400"
                  }`}
              >
                {stage.name}
              </span>
            </div>
          );
        })}
      </div>

      {/* Active Line Fill */}
      <div className="absolute top-3 left-0 h-1 bg-blue-600 rounded-full transition-all duration-500" style={{
        width: `${Math.max(0, stages.findIndex(s => s.active) !== -1 ? stages.findIndex(s => s.active) : stages.filter(s => s.completed).length - 1) / (stages.length - 1) * 100}%`,
        zIndex: 0
      }} />
    </div>
  );
};

const MyApplications = () => {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");

  const filteredApps = MY_APPLICATIONS.filter((app) => {
    const matchesSearch = app.title.toLowerCase().includes(search.toLowerCase()) || app.company.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === "All" || app.status === filter;
    return matchesSearch && matchesFilter;
  });

  const stats = {
    total: MY_APPLICATIONS.length,
    active: MY_APPLICATIONS.filter(a => ["Applied", "Under Review", "Interviewing"].includes(a.status)).length,
    interviews: MY_APPLICATIONS.filter(a => a.status === "Interviewing").length,
  };

  return (
    <div className="min-h-screen bg-gray-50/50 py-8 px-4">
      <div className="max-w-5xl mx-auto space-y-6">

        {/* Header & Stats */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
          <div>
            <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">My Applications</h1>
            <p className="text-sm text-gray-500 mt-1">Track and manage your job applications</p>
          </div>

          <div className="flex items-center gap-4">
            <div className="bg-white p-3 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4 min-w-[120px]">
              <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
                <Briefcase size={18} className="text-blue-600" />
              </div>
              <div>
                <p className="text-xl font-black text-gray-900">{stats.active}</p>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Active</p>
              </div>
            </div>
            <div className="bg-white p-3 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4 min-w-[120px]">
              <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center">
                <TrendingUp size={18} className="text-purple-600" />
              </div>
              <div>
                <p className="text-xl font-black text-gray-900">{stats.interviews}</p>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Interviews</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full md:w-96 group">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-600 transition-colors" size={18} />
            <input
              type="text"
              placeholder="Search by role or company..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50/50 text-sm font-medium text-gray-900 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 outline-none transition-all"
            />
          </div>

          <div className="flex gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 hide-scrollbar">
            {["All", "Applied", "Under Review", "Interviewing", "Offer"].map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors shrink-0 ${filter === f ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* Application List */}
        <div className="space-y-4">
          {filteredApps.length > 0 ? (
            filteredApps.map((app, index) => (
              <motion.div
                key={app.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 hover:shadow-md transition-shadow group cursor-pointer"
              >
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                  {/* Info */}
                  <div className="flex gap-4 items-start">
                    <div className="w-14 h-14 rounded-xl border border-gray-100 p-2.5 bg-white shrink-0 shadow-sm">
                      <img src={app.logo} alt={app.company} className="w-full h-full object-contain" />
                    </div>
                    <div>
                      <h3 className="text-lg font-extrabold text-gray-900 group-hover:text-blue-600 transition-colors">
                        {app.title}
                      </h3>
                      <div className="flex items-center gap-3 mt-1 text-sm font-medium text-gray-600">
                        <span className="flex items-center gap-1"><Building2 size={14} className="text-gray-400" /> {app.company}</span>
                        <span>•</span>
                        <span className="flex items-center gap-1"><MapPin size={14} className="text-gray-400" /> {app.location}</span>
                        <span>•</span>
                        <span className="flex items-center gap-1"><Calendar size={14} className="text-gray-400" /> {app.appliedDate}</span>
                      </div>

                      <div className="flex items-center gap-3 mt-4">
                        <StatusBadge status={app.status} />
                        <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg uppercase tracking-wider border border-emerald-100 flex items-center gap-1">
                          <TrendingUp size={12} />
                          {app.matchScore}% Match
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Action */}
                  <div className="shrink-0 flex items-center justify-end">
                    <button className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-colors">
                      View Details
                      <ChevronRight size={16} />
                    </button>
                  </div>
                </div>

                {/* Progress */}
                <div className="mt-8 pt-6 border-t border-gray-50">
                  <ProgressTracker stages={app.stages} status={app.status} />
                </div>
              </motion.div>
            ))
          ) : (
            <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
              <div className="w-16 h-16 mx-auto rounded-2xl bg-gray-50 flex items-center justify-center mb-4">
                <Briefcase size={24} className="text-gray-400" />
              </div>
              <h3 className="text-lg font-extrabold text-gray-900">No applications found</h3>
              <p className="text-sm text-gray-500 mt-1">We couldn't find any applications matching your criteria.</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default MyApplications;
