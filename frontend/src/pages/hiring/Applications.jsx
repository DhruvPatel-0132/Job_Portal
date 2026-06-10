import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ClipboardList, 
  MapPin, 
  Briefcase, 
  GraduationCap, 
  Calendar, 
  FileText, 
  Globe, 
  Code2, 
  Network, 
  DollarSign, 
  Eye, 
  Download, 
  CheckCircle2, 
  XCircle, 
  CalendarPlus, 
  MessageSquare,
  Clock
} from "lucide-react";

/* ── Dummy Data ── */
const DUMMY_APPLICATIONS = [
  // Applied
  {
    id: "app1", name: "Alex Johnson", photo: "https://i.pravatar.cc/150?u=alex",
    experience: "5 Years", skills: ["React", "Node.js", "MongoDB", "AWS"],
    education: "B.S. Computer Science, MIT", appliedDate: "2024-05-15T10:30:00Z",
    resumeUrl: "#", portfolioUrl: "https://alexj.dev", githubUrl: "https://github.com",
    linkedinUrl: "https://linkedin.com", expectedSalary: "$120k - $140k",
    location: "New York, NY", status: "applied"
  },
  {
    id: "app2", name: "Samantha Lee", photo: "https://i.pravatar.cc/150?u=sam",
    experience: "3 Years", skills: ["UI/UX", "Figma", "CSS", "React"],
    education: "B.A. Design, Parsons", appliedDate: "2024-05-14T14:20:00Z",
    resumeUrl: "#", portfolioUrl: "https://samdesign.co", githubUrl: null,
    linkedinUrl: "https://linkedin.com", expectedSalary: "$90k - $110k",
    location: "San Francisco, CA", status: "applied"
  },
  {
    id: "app3", name: "David Chen", photo: "https://i.pravatar.cc/150?u=david",
    experience: "7 Years", skills: ["Python", "Django", "PostgreSQL", "Docker"],
    education: "M.S. Software Eng, Stanford", appliedDate: "2024-05-12T09:15:00Z",
    resumeUrl: "#", portfolioUrl: null, githubUrl: "https://github.com",
    linkedinUrl: "https://linkedin.com", expectedSalary: "$150k - $170k",
    location: "Austin, TX", status: "applied"
  },
  
  // Shortlisted
  {
    id: "app4", name: "Emily Davis", photo: "https://i.pravatar.cc/150?u=emily",
    experience: "4 Years", skills: ["Java", "Spring Boot", "Microservices"],
    education: "B.S. IT, NYU", appliedDate: "2024-05-10T11:00:00Z",
    resumeUrl: "#", portfolioUrl: null, githubUrl: "https://github.com",
    linkedinUrl: "https://linkedin.com", expectedSalary: "$110k - $130k",
    location: "Boston, MA", status: "shortlisted"
  },
  {
    id: "app5", name: "Michael Brown", photo: "https://i.pravatar.cc/150?u=mike",
    experience: "6 Years", skills: ["Go", "Kubernetes", "AWS", "Terraform"],
    education: "B.S. Comp Sci, UC Berkeley", appliedDate: "2024-05-09T16:45:00Z",
    resumeUrl: "#", portfolioUrl: "https://mikeb.dev", githubUrl: "https://github.com",
    linkedinUrl: "https://linkedin.com", expectedSalary: "$140k - $160k",
    location: "Remote", status: "shortlisted"
  },

  // Interview
  {
    id: "app6", name: "Sarah Connor", photo: "https://i.pravatar.cc/150?u=sarah",
    experience: "8 Years", skills: ["Product Management", "Agile", "Jira", "Roadmapping"],
    education: "MBA, Harvard", appliedDate: "2024-05-05T10:00:00Z",
    resumeUrl: "#", portfolioUrl: null, githubUrl: null,
    linkedinUrl: "https://linkedin.com", expectedSalary: "$160k - $180k",
    location: "Los Angeles, CA", status: "interview"
  },
  
  // Selected
  {
    id: "app7", name: "John Wick", photo: "https://i.pravatar.cc/150?u=john",
    experience: "10 Years", skills: ["C++", "System Architecture", "Performance Optimization"],
    education: "Ph.D. Comp Sci, MIT", appliedDate: "2024-04-20T08:30:00Z",
    resumeUrl: "#", portfolioUrl: null, githubUrl: "https://github.com",
    linkedinUrl: "https://linkedin.com", expectedSalary: "$200k+",
    location: "Seattle, WA", status: "selected"
  },

  // Rejected
  {
    id: "app8", name: "Tom Cruise", photo: "https://i.pravatar.cc/150?u=tom",
    experience: "1 Year", skills: ["HTML", "CSS", "JavaScript"],
    education: "Bootcamp Graduate", appliedDate: "2024-05-18T14:00:00Z",
    resumeUrl: "#", portfolioUrl: "https://tomc.dev", githubUrl: "https://github.com",
    linkedinUrl: "https://linkedin.com", expectedSalary: "$70k",
    location: "Chicago, IL", status: "rejected"
  }
];

// We hardcode the counts to match the user's prompt exactly, 
// even though our dummy array above is smaller for performance.
const TABS = [
  { id: "applied", label: "Applied", count: 50, color: "text-gray-600 bg-gray-100" },
  { id: "shortlisted", label: "Shortlisted", count: 15, color: "text-blue-600 bg-blue-100" },
  { id: "interview", label: "Interview", count: 8, color: "text-amber-600 bg-amber-100" },
  { id: "selected", label: "Selected", count: 3, color: "text-emerald-600 bg-emerald-100" },
  { id: "rejected", label: "Rejected", count: 24, color: "text-red-600 bg-red-100" },
];

const timeAgo = (date) => {
  const seconds = Math.floor((new Date() - new Date(date)) / 1000);
  const days = Math.floor(seconds / (3600 * 24));
  if (days === 0) return "Today";
  if (days === 1) return "Yesterday";
  return `${days} days ago`;
};

const Applications = () => {
  const [activeTab, setActiveTab] = useState("applied");
  const [applications, setApplications] = useState(DUMMY_APPLICATIONS);

  const filteredApps = applications.filter((app) => app.status === activeTab);

  // Handlers for the action buttons
  const handleStatusChange = (id, newStatus) => {
    setApplications(prev => prev.map(app => app.id === id ? { ...app, status: newStatus } : app));
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* ── Header ── */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <div className="flex items-center gap-3 mb-1">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-200/50">
            <ClipboardList className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Applications</h1>
            <p className="text-sm text-gray-500 mt-1">
              Review and manage all incoming job applications
            </p>
          </div>
        </div>
      </motion.div>

      {/* ── Tabs ── */}
      <div className="flex overflow-x-auto custom-scrollbar gap-2 mb-6 pb-2 border-b border-gray-100">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-5 py-3 rounded-t-xl text-sm font-bold transition-all relative whitespace-nowrap
              ${activeTab === tab.id ? "text-indigo-700 bg-indigo-50/50" : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"}
            `}
          >
            {tab.label}
            <span className={`px-2 py-0.5 rounded-md text-[11px] font-black ${tab.color}`}>
              {tab.count}
            </span>
            {activeTab === tab.id && (
              <motion.div layoutId="activeTabIndicator" className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600" />
            )}
          </button>
        ))}
      </div>

      {/* ── Applications List ── */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
          className="space-y-5"
        >
          {filteredApps.length > 0 ? (
            filteredApps.map((app) => (
              <div key={app.id} className="bg-white border border-gray-200 rounded-2xl shadow-sm hover:shadow-md transition-shadow p-6">
                
                {/* Top Row: Info */}
                <div className="flex flex-col lg:flex-row gap-6 items-start lg:items-center justify-between border-b border-gray-100 pb-5 mb-5">
                  <div className="flex gap-5 items-start">
                    <img src={app.photo} alt={app.name} className="w-16 h-16 rounded-2xl object-cover shadow-sm border border-gray-100" />
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">{app.name}</h3>
                      <div className="flex flex-wrap items-center gap-3 mt-2 text-sm text-gray-600">
                        <span className="flex items-center gap-1.5"><Briefcase className="h-4 w-4 text-gray-400" /> {app.experience}</span>
                        <span className="flex items-center gap-1.5"><MapPin className="h-4 w-4 text-gray-400" /> {app.location}</span>
                        <span className="flex items-center gap-1.5"><DollarSign className="h-4 w-4 text-gray-400" /> {app.expectedSalary}</span>
                        <span className="flex items-center gap-1.5 text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md text-xs font-semibold">
                          <Clock className="h-3.5 w-3.5" /> Applied {timeAgo(app.appliedDate)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Links Row */}
                  <div className="flex items-center gap-3 shrink-0">
                    {app.portfolioUrl && (
                      <a href={app.portfolioUrl} target="_blank" rel="noreferrer" className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors tooltip-trigger" title="Portfolio">
                        <Globe className="h-5 w-5" />
                      </a>
                    )}
                    {app.githubUrl && (
                      <a href={app.githubUrl} target="_blank" rel="noreferrer" className="p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors" title="GitHub">
                        <Code2 className="h-5 w-5" />
                      </a>
                    )}
                    {app.linkedinUrl && (
                      <a href={app.linkedinUrl} target="_blank" rel="noreferrer" className="p-2 text-gray-400 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors" title="LinkedIn">
                        <Network className="h-5 w-5" />
                      </a>
                    )}
                  </div>
                </div>

                {/* Middle Row: Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <h4 className="text-xs font-black text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                      <GraduationCap className="h-4 w-4" /> Education
                    </h4>
                    <p className="text-sm font-medium text-gray-800">{app.education}</p>
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-gray-400 uppercase tracking-wider mb-3">Top Skills</h4>
                    <div className="flex flex-wrap gap-2">
                      {app.skills.map((skill, i) => (
                        <span key={i} className="text-xs font-semibold text-gray-700 bg-gray-100 px-3 py-1.5 rounded-lg">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Bottom Row: Actions */}
                <div className="flex flex-wrap items-center gap-3 bg-gray-50 -mx-6 -mb-6 px-6 py-4 rounded-b-2xl">
                  <button className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold text-gray-700 bg-white border border-gray-200 hover:bg-gray-50 transition-all shadow-sm">
                    <Eye className="h-4 w-4" /> View Profile
                  </button>
                  <button className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold text-gray-700 bg-white border border-gray-200 hover:bg-gray-50 transition-all shadow-sm">
                    <Download className="h-4 w-4" /> Download Resume
                  </button>
                  <div className="flex-1" />
                  
                  {activeTab !== "rejected" && (
                    <button 
                      onClick={() => handleStatusChange(app.id, "rejected")}
                      className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold text-red-600 bg-red-50 hover:bg-red-100 transition-all"
                    >
                      <XCircle className="h-4 w-4" /> Reject
                    </button>
                  )}

                  <button className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold text-blue-600 bg-blue-50 hover:bg-blue-100 transition-all">
                    <MessageSquare className="h-4 w-4" /> Message
                  </button>

                  {(activeTab === "applied" || activeTab === "interview") && (
                    <button 
                      onClick={() => handleStatusChange(app.id, "shortlisted")}
                      className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 transition-all"
                    >
                      <CheckCircle2 className="h-4 w-4" /> Shortlist
                    </button>
                  )}

                  {(activeTab === "shortlisted" || activeTab === "applied") && (
                    <button 
                      onClick={() => handleStatusChange(app.id, "interview")}
                      className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold text-amber-600 bg-amber-50 hover:bg-amber-100 transition-all"
                    >
                      <CalendarPlus className="h-4 w-4" /> Schedule Interview
                    </button>
                  )}
                </div>

              </div>
            ))
          ) : (
            <div className="py-20 text-center">
              <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-gray-100">
                <FileText className="h-8 w-8 text-gray-300" />
              </div>
              <h3 className="text-lg font-bold text-gray-900">No applications found</h3>
              <p className="text-gray-500 mt-1">There are no candidates in the "{TABS.find(t=>t.id===activeTab)?.label}" stage yet.</p>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default Applications;
