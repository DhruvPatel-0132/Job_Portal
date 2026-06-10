import React, { useState } from "react";
import { motion } from "framer-motion";
import { UserCheck, MapPin, Briefcase, Mail, GripVertical } from "lucide-react";

const STAGES = [
  { id: "applied", label: "Applied", color: "bg-gray-100 text-gray-700 border-gray-200" },
  { id: "screening", label: "Resume Screening", color: "bg-blue-50 text-blue-700 border-blue-200" },
  { id: "technical", label: "Technical Round", color: "bg-purple-50 text-purple-700 border-purple-200" },
  { id: "hr", label: "HR Round", color: "bg-amber-50 text-amber-700 border-amber-200" },
  { id: "offer", label: "Offer", color: "bg-indigo-50 text-indigo-700 border-indigo-200" },
  { id: "hired", label: "Hired", color: "bg-emerald-50 text-emerald-700 border-emerald-200" },
];

const INITIAL_CANDIDATES = [
  // Applied Stage
  { id: "cand1", name: "David Smith", avatar: "https://i.pravatar.cc/150?u=david", role: "Full Stack Engineer", location: "Remote", experience: "6 yrs", stage: "applied" },
  { id: "cand7", name: "Chris Evans", avatar: "https://i.pravatar.cc/150?u=chris", role: "Frontend Dev", location: "Remote", experience: "2 yrs", stage: "applied" },
  { id: "cand8", name: "Jessica Alba", avatar: "https://i.pravatar.cc/150?u=jess", role: "React Developer", location: "Austin, TX", experience: "3 yrs", stage: "applied" },
  { id: "cand9", name: "Tom Holland", avatar: "https://i.pravatar.cc/150?u=tom", role: "Junior QA Engineer", location: "London, UK", experience: "1 yr", stage: "applied" },
  { id: "cand10", name: "Zendaya", avatar: "https://i.pravatar.cc/150?u=zendaya", role: "UI/UX Intern", location: "San Francisco, CA", experience: "Fresher", stage: "applied" },
  
  // Screening Stage
  { id: "cand2", name: "Emily Davis", avatar: "https://i.pravatar.cc/150?u=emily", role: "UX/UI Designer", location: "London, UK", experience: "3 yrs", stage: "screening" },
  { id: "cand11", name: "Mark Ruffalo", avatar: "https://i.pravatar.cc/150?u=mark", role: "Backend Engineer", location: "New York, NY", experience: "5 yrs", stage: "screening" },
  { id: "cand12", name: "Scarlett J.", avatar: "https://i.pravatar.cc/150?u=scarlett", role: "Product Designer", location: "Remote", experience: "4 yrs", stage: "screening" },
  { id: "cand13", name: "Paul Rudd", avatar: "https://i.pravatar.cc/150?u=paul", role: "Marketing Manager", location: "Chicago, IL", experience: "7 yrs", stage: "screening" },
  
  // Technical Round
  { id: "cand3", name: "James Wilson", avatar: "https://i.pravatar.cc/150?u=james", role: "DevOps Engineer", location: "Berlin, DE", experience: "8 yrs", stage: "technical" },
  { id: "cand14", name: "Chadwick B.", avatar: "https://i.pravatar.cc/150?u=chad", role: "System Architect", location: "Seattle, WA", experience: "10 yrs", stage: "technical" },
  { id: "cand15", name: "Brie Larson", avatar: "https://i.pravatar.cc/150?u=brie", role: "Security Analyst", location: "Remote", experience: "6 yrs", stage: "technical" },

  // HR Round
  { id: "cand4", name: "Sarah Parker", avatar: "https://i.pravatar.cc/150?u=sarah", role: "Product Manager", location: "New York, NY", experience: "5 yrs", stage: "hr" },
  { id: "cand16", name: "Chris H.", avatar: "https://i.pravatar.cc/150?u=chrish", role: "Project Manager", location: "Sydney, AU", experience: "9 yrs", stage: "hr" },

  // Offer Stage
  { id: "cand5", name: "Michael Chen", avatar: "https://i.pravatar.cc/150?u=michael", role: "Backend Dev", location: "Austin, TX", experience: "4 yrs", stage: "offer" },
  { id: "cand17", name: "Elizabeth O.", avatar: "https://i.pravatar.cc/150?u=elizabeth", role: "Data Analyst", location: "Boston, MA", experience: "3 yrs", stage: "offer" },
  { id: "cand18", name: "Benedict C.", avatar: "https://i.pravatar.cc/150?u=ben", role: "Machine Learning Eng", location: "London, UK", experience: "6 yrs", stage: "offer" },

  // Hired Stage
  { id: "cand6", name: "Anna Lee", avatar: "https://i.pravatar.cc/150?u=anna", role: "Data Scientist", location: "San Francisco, CA", experience: "7 yrs", stage: "hired" },
  { id: "cand19", name: "Robert Downey", avatar: "https://i.pravatar.cc/150?u=robert", role: "CTO", location: "Los Angeles, CA", experience: "15 yrs", stage: "hired" },
  { id: "cand20", name: "Gwyneth P.", avatar: "https://i.pravatar.cc/150?u=gwyneth", role: "VP of Engineering", location: "Remote", experience: "12 yrs", stage: "hired" }
];

const CandidatesATS = () => {
  const [candidates, setCandidates] = useState(INITIAL_CANDIDATES);
  const [draggedCandId, setDraggedCandId] = useState(null);

  const handleDragStart = (e, id) => {
    setDraggedCandId(id);
    e.dataTransfer.effectAllowed = "move";
    // For firefox compatibility
    e.dataTransfer.setData("text/plain", id);
    // Make it look slightly transparent while dragging
    setTimeout(() => {
      e.target.style.opacity = "0.5";
    }, 0);
  };

  const handleDragEnd = (e) => {
    setDraggedCandId(null);
    e.target.style.opacity = "1";
  };

  const handleDragOver = (e) => {
    e.preventDefault(); // Necessary to allow dropping
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = (e, targetStageId) => {
    e.preventDefault();
    if (!draggedCandId) return;

    setCandidates((prev) =>
      prev.map((c) =>
        c.id === draggedCandId ? { ...c, stage: targetStageId } : c
      )
    );
    setDraggedCandId(null);
  };

  return (
    <div className="max-w-[1400px] mx-auto px-4 py-8 h-[calc(100vh-80px)] flex flex-col">
      {/* Header */}
      <div className="mb-6 shrink-0">
        <div className="flex items-center gap-3 mb-1">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center shadow-lg shadow-emerald-200/50">
            <UserCheck className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">ATS Pipeline</h1>
            <p className="text-sm text-gray-500">
              Drag and drop candidates across hiring stages
            </p>
          </div>
        </div>
      </div>

      {/* Kanban Board */}
      <div className="flex-1 overflow-x-auto pb-4 custom-scrollbar">
        <div className="flex gap-4 h-full min-w-max items-start">
          {STAGES.map((stage) => {
            const stageCandidates = candidates.filter((c) => c.stage === stage.id);
            return (
              <div
                key={stage.id}
                className="w-80 flex flex-col h-full bg-gray-50/50 rounded-2xl border border-gray-100 p-3"
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, stage.id)}
              >
                {/* Stage Header */}
                <div className={`mb-3 px-3 py-2 rounded-xl border ${stage.color} flex items-center justify-between shadow-sm`}>
                  <h3 className="font-bold text-sm">{stage.label}</h3>
                  <span className="bg-white/50 px-2 py-0.5 rounded-md text-xs font-bold">
                    {stageCandidates.length}
                  </span>
                </div>

                {/* Candidate Cards Container */}
                <div className="flex-1 overflow-y-auto custom-scrollbar space-y-3 pr-1 pb-2">
                  {stageCandidates.map((cand) => (
                    <motion.div
                      key={cand.id}
                      layoutId={cand.id}
                      draggable
                      onDragStart={(e) => handleDragStart(e, cand.id)}
                      onDragEnd={handleDragEnd}
                      className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 cursor-grab active:cursor-grabbing hover:shadow-md transition-shadow group relative"
                    >
                      <div className="flex items-start gap-3">
                        <img
                          src={cand.avatar}
                          alt={cand.name}
                          className="w-10 h-10 rounded-full object-cover border border-gray-100"
                        />
                        <div className="flex-1 min-w-0">
                          <h4 className="font-bold text-sm text-gray-900 truncate">
                            {cand.name}
                          </h4>
                          <p className="text-xs font-medium text-gray-600 truncate mt-0.5">
                            {cand.role}
                          </p>
                          <div className="flex items-center gap-2 mt-2 text-[10px] text-gray-400 font-medium">
                            <span className="flex items-center gap-1">
                              <MapPin className="h-3 w-3" /> {cand.location}
                            </span>
                            <span className="flex items-center gap-1">
                              <Briefcase className="h-3 w-3" /> {cand.experience}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="mt-3 pt-3 border-t border-gray-50 flex items-center justify-between">
                        <button className="text-[10px] font-bold text-emerald-600 bg-emerald-50 hover:bg-emerald-100 px-2.5 py-1 rounded-md transition-colors flex items-center gap-1">
                          <Mail className="h-3 w-3" /> Message
                        </button>
                        <GripVertical className="h-4 w-4 text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                    </motion.div>
                  ))}
                  
                  {stageCandidates.length === 0 && (
                    <div className="h-full flex items-center justify-center p-4">
                      <div className="border-2 border-dashed border-gray-200 rounded-xl w-full h-24 flex items-center justify-center text-xs font-medium text-gray-400 text-center px-4">
                        Drop candidate here
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default CandidatesATS;
