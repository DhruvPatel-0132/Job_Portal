import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Sparkles, 
  Briefcase, 
  MapPin, 
  ChevronDown, 
  Eye, 
  MessageSquare,
  CheckCircle2,
  BrainCircuit,
  Zap,
  Target
} from "lucide-react";

const DUMMY_AI_CANDIDATES = [
  {
    id: "ai_1",
    name: "Alex Johnson",
    photo: "https://i.pravatar.cc/150?u=alex",
    role: "Senior Frontend Developer",
    location: "New York, NY",
    experience: "5 Years",
    matchScore: 98,
    rank: 1,
    aiSummary: "Exceptional candidate. Alex has extensive experience with React and modern frontend architectures perfectly matching the job description. The candidate shows strong leadership skills from their previous role at TechCorp and has a proven track record of optimizing web performance by 40%.",
    keyStrengths: ["React Performance", "Team Leadership", "System Design"],
    concerns: ["Slightly higher salary expectations"]
  },
  {
    id: "ai_2",
    name: "Emily Davis",
    photo: "https://i.pravatar.cc/150?u=emily",
    role: "Frontend Engineer",
    location: "London, UK",
    experience: "4 Years",
    matchScore: 94,
    rank: 2,
    aiSummary: "Strong technical fit. Emily's portfolio demonstrates excellent UI/UX sensibilities alongside robust coding practices. While she has less formal leadership experience than the top candidate, her technical assessment scores were outstanding, specifically in CSS architecture and accessibility.",
    keyStrengths: ["UI/UX Implementation", "Accessibility (a11y)", "Vue.js / React"],
    concerns: ["Limited team lead experience"]
  },
  {
    id: "ai_3",
    name: "David Chen",
    photo: "https://i.pravatar.cc/150?u=david",
    role: "Full Stack Developer",
    location: "Austin, TX",
    experience: "7 Years",
    matchScore: 89,
    rank: 3,
    aiSummary: "Solid candidate with broader experience. David brings valuable backend knowledge (Node.js/Python) which could be beneficial for cross-functional collaboration. However, his recent roles have been less focused strictly on frontend performance, which is a core requirement for this specific position.",
    keyStrengths: ["Cross-stack Knowledge", "API Design", "Mentorship"],
    concerns: ["Frontend skills might be slightly rusty"]
  },
  {
    id: "ai_4",
    name: "Sarah Parker",
    photo: "https://i.pravatar.cc/150?u=sarah",
    role: "React Developer",
    location: "Remote",
    experience: "3 Years",
    matchScore: 82,
    rank: 4,
    aiSummary: "Promising mid-level candidate. Sarah shows great enthusiasm and a rapid learning curve. Her recent projects use the exact modern stack required (Next.js, Tailwind). She would be an excellent fit if the role has room for growth, though she may need support with complex architectural decisions initially.",
    keyStrengths: ["Next.js", "Modern CSS", "Fast Learner"],
    concerns: ["Needs architectural guidance"]
  }
];

const DUMMY_JOBS = [
  { id: "job_1", title: "Senior Frontend Developer", analyzed: 142, topMatch: 98 },
  { id: "job_2", title: "Product Manager", analyzed: 84, topMatch: 92 },
  { id: "job_3", title: "UX/UI Designer", analyzed: 215, topMatch: 96 },
  { id: "job_4", title: "Backend Engineer", analyzed: 67, topMatch: 89 },
];

const AIListing = () => {
  const [selectedJobId, setSelectedJobId] = useState(DUMMY_JOBS[0].id);
  const [expandedId, setExpandedId] = useState(DUMMY_AI_CANDIDATES[0].id);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const selectedJob = DUMMY_JOBS.find(j => j.id === selectedJobId);

  const displayCandidates = React.useMemo(() => {
    if (selectedJobId === "job_1") return DUMMY_AI_CANDIDATES;
    return [...DUMMY_AI_CANDIDATES].reverse().map((c, i) => ({
      ...c,
      rank: i + 1,
      matchScore: c.matchScore - (i * 2)
    }));
  }, [selectedJobId]);

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      {/* ── Header ── */}
      <div className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="h-5 w-5 text-black" />
            <h1 className="text-2xl font-bold text-gray-900">AI Candidate Ranking</h1>
          </div>
          <div className="flex items-center gap-3 relative">
            <span className="text-sm font-medium text-gray-500">Job Role:</span>
            
            {/* Custom Dropdown */}
            <div className="relative">
              <button 
                className="flex items-center gap-2 bg-white border border-gray-200 text-gray-900 font-bold px-4 py-2 rounded-xl hover:border-indigo-300 hover:bg-indigo-50/30 transition-all shadow-sm outline-none focus:ring-2 focus:ring-indigo-500/20"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              >
                {selectedJob.title}
                <ChevronDown className={`h-4 w-4 text-gray-400 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              <AnimatePresence>
                {isDropdownOpen && (
                  <motion.div 
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 5 }}
                    transition={{ duration: 0.15 }}
                    className="absolute top-full left-0 mt-2 w-64 bg-white border border-gray-200 rounded-xl shadow-xl z-50 overflow-hidden"
                  >
                    {DUMMY_JOBS.map(job => (
                      <button
                        key={job.id}
                        className={`w-full text-left px-4 py-3 text-sm font-semibold transition-colors ${
                          selectedJobId === job.id 
                            ? "bg-indigo-50 text-indigo-700" 
                            : "text-gray-700 hover:bg-gray-50 hover:text-indigo-600"
                        }`}
                        onClick={() => {
                          setSelectedJobId(job.id);
                          setExpandedId(null);
                          setIsDropdownOpen(false);
                        }}
                      >
                        {job.title}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-6 bg-gray-50 px-6 py-4 rounded-xl border border-gray-200">
          <div>
            <p className="text-xs text-gray-500 font-semibold mb-0.5">ANALYZED</p>
            <p className="text-xl font-bold text-gray-900">{selectedJob.analyzed}</p>
          </div>
          <div className="w-px h-10 bg-gray-300" />
          <div>
            <p className="text-xs text-gray-500 font-semibold mb-0.5">TOP MATCH</p>
            <p className="text-xl font-bold text-black">{selectedJob.topMatch}%</p>
          </div>
        </div>
      </div>

      {/* ── Insight Banner ── */}
      <div className="mb-8 bg-indigo-50/50 rounded-xl p-5 border border-indigo-100 flex gap-4 items-start">
        <BrainCircuit className="h-5 w-5 text-indigo-600 shrink-0 mt-0.5" />
        <div>
          <h3 className="text-sm font-bold text-indigo-900 mb-1">TalentForge AI Analysis</h3>
          <p className="text-sm text-indigo-800/80 leading-relaxed max-w-2xl">
            Candidates are ranked by analyzing their resumes and technical assessments against the job description. 
            Emphasis is placed on <strong className="text-indigo-900">React Performance</strong> and <strong className="text-indigo-900">Leadership</strong>.
          </p>
        </div>
      </div>

      {/* ── Candidate List ── */}
      <div className="space-y-4">
        {displayCandidates.map((cand) => {
          const isExpanded = expandedId === cand.id;
          
          return (
            <div 
              key={cand.id}
              className={`bg-white rounded-xl border transition-all duration-200 overflow-hidden ${
                isExpanded ? "border-indigo-400 shadow-md ring-2 ring-indigo-50" : "border-gray-200 hover:border-indigo-300 hover:shadow-sm cursor-pointer"
              }`}
              onClick={() => !isExpanded && setExpandedId(cand.id)}
            >
              {/* Card Header */}
              <div className="p-5 flex flex-col md:flex-row gap-5 justify-between">
                
                {/* Left: Info */}
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 shrink-0 rounded bg-gray-100 flex items-center justify-center border border-gray-200 text-gray-900 font-bold text-lg">
                    #{cand.rank}
                  </div>
                  <img src={cand.photo} alt={cand.name} className="w-12 h-12 rounded-full object-cover border border-gray-200" />
                  
                  <div>
                    <h2 className="text-base font-bold text-gray-900">{cand.name}</h2>
                    <div className="flex items-center gap-2 mt-1 text-xs text-gray-500 font-medium">
                      <span>{cand.role}</span>
                      <span>•</span>
                      <span className="flex items-center gap-1"><MapPin className="h-3 w-3" /> {cand.location}</span>
                    </div>
                  </div>
                </div>

                {/* Right: Score */}
                <div className="flex items-center gap-6 justify-between md:justify-end border-t md:border-t-0 border-gray-100 pt-4 md:pt-0">
                  <div className="flex flex-col items-end">
                    <span className="text-xs font-semibold text-gray-400 mb-1">Match Score</span>
                    <div className="flex items-center gap-3">
                      <div className="w-32 h-2 bg-gray-100 rounded-full overflow-hidden hidden sm:block">
                        <div 
                          className="h-full bg-indigo-500 transition-all duration-1000 ease-out" 
                          style={{ width: `${cand.matchScore}%` }}
                        />
                      </div>
                      <span className={`text-base font-black ${cand.matchScore >= 95 ? "text-emerald-600" : cand.matchScore >= 90 ? "text-indigo-600" : "text-gray-900"}`}>
                        {cand.matchScore}%
                      </span>
                    </div>
                  </div>
                  
                  <button 
                    onClick={(e) => { e.stopPropagation(); setExpandedId(isExpanded ? null : cand.id); }}
                    className="p-2 text-gray-400 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    <ChevronDown className={`h-5 w-5 transition-transform duration-300 ${isExpanded ? "rotate-180" : ""}`} />
                  </button>
                </div>
              </div>

              {/* Expanded Area */}
              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="px-5 pb-5 pt-4 border-t border-gray-100 bg-gray-50/50">
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-6">
                        {/* Summary */}
                        <div className="md:col-span-2">
                          <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                            <Target className="h-3.5 w-3.5" /> AI Summary
                          </h4>
                          <p className="text-sm text-gray-700 leading-relaxed">
                            {cand.aiSummary}
                          </p>
                        </div>
                        
                        {/* Tags */}
                        <div className="space-y-5">
                          <div>
                            <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Strengths</h4>
                            <div className="flex flex-wrap gap-2">
                              {cand.keyStrengths.map((str, i) => (
                                <span key={i} className="text-[11px] font-semibold text-gray-700 bg-gray-200/60 px-2.5 py-1 rounded">
                                  {str}
                                </span>
                              ))}
                            </div>
                          </div>
                          <div>
                            <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Concerns</h4>
                            <div className="flex flex-wrap gap-2">
                              {cand.concerns.map((con, i) => (
                                <span key={i} className="text-[11px] font-medium text-gray-600 bg-white border border-gray-200 px-2.5 py-1 rounded">
                                  {con}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex flex-wrap gap-3 pt-5 border-t border-gray-200">
                        <button className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 transition-colors shadow-sm">
                          <CheckCircle2 className="h-4 w-4" /> Shortlist
                        </button>
                        <button className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 transition-colors shadow-sm">
                          <Eye className="h-4 w-4" /> Profile
                        </button>
                        <button className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 transition-colors">
                          <MessageSquare className="h-4 w-4" /> Message
                        </button>
                      </div>

                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

            </div>
          );
        })}
      </div>
      
    </div>
  );
};

export default AIListing;
