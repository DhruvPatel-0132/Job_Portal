import React, { useState, useRef } from "react";
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
  { id: "cand1", name: "David Smith", avatar: "https://i.pravatar.cc/150?u=david", role: "Full Stack Engineer", appliedRole: "Senior Tech Lead", location: "Remote", experience: "6 yrs", stage: "applied" },
  { id: "cand7", name: "Chris Evans", avatar: "https://i.pravatar.cc/150?u=chris", role: "Frontend Dev", appliedRole: "UI Developer", location: "Remote", experience: "2 yrs", stage: "applied" },
  { id: "cand8", name: "Jessica Alba", avatar: "https://i.pravatar.cc/150?u=jess", role: "React Developer", appliedRole: "Frontend Engineer", location: "Austin, TX", experience: "3 yrs", stage: "applied" },
  { id: "cand9", name: "Tom Holland", avatar: "https://i.pravatar.cc/150?u=tom", role: "Junior QA Engineer", appliedRole: "QA Automation", location: "London, UK", experience: "1 yr", stage: "applied" },
  { id: "cand10", name: "Zendaya", avatar: "https://i.pravatar.cc/150?u=zendaya", role: "UI/UX Intern", appliedRole: "Product Designer", location: "San Francisco, CA", experience: "Fresher", stage: "applied" },

  // Screening Stage
  { id: "cand2", name: "Emily Davis", avatar: "https://i.pravatar.cc/150?u=emily", role: "UX/UI Designer", appliedRole: "UX Researcher", location: "London, UK", experience: "3 yrs", stage: "screening" },
  { id: "cand11", name: "Mark Ruffalo", avatar: "https://i.pravatar.cc/150?u=mark", role: "Backend Engineer", appliedRole: "Backend Dev", location: "New York, NY", experience: "5 yrs", stage: "screening" },
  { id: "cand12", name: "Scarlett J.", avatar: "https://i.pravatar.cc/150?u=scarlett", role: "Product Designer", appliedRole: "Product Manager", location: "Remote", experience: "4 yrs", stage: "screening" },
  { id: "cand13", name: "Paul Rudd", avatar: "https://i.pravatar.cc/150?u=paul", role: "Marketing Manager", appliedRole: "Head of Marketing", location: "Chicago, IL", experience: "7 yrs", stage: "screening" },

  // Technical Round
  { id: "cand3", name: "James Wilson", avatar: "https://i.pravatar.cc/150?u=james", role: "DevOps Engineer", appliedRole: "Cloud Architect", location: "Berlin, DE", experience: "8 yrs", stage: "technical" },
  { id: "cand14", name: "Chadwick B.", avatar: "https://i.pravatar.cc/150?u=chad", role: "System Architect", appliedRole: "System Architect", location: "Seattle, WA", experience: "10 yrs", stage: "technical" },
  { id: "cand15", name: "Brie Larson", avatar: "https://i.pravatar.cc/150?u=brie", role: "Security Analyst", appliedRole: "Cybersecurity Lead", location: "Remote", experience: "6 yrs", stage: "technical" },

  // HR Round
  { id: "cand4", name: "Sarah Parker", avatar: "https://i.pravatar.cc/150?u=sarah", role: "Product Manager", appliedRole: "Product Owner", location: "New York, NY", experience: "5 yrs", stage: "hr" },
  { id: "cand16", name: "Chris H.", avatar: "https://i.pravatar.cc/150?u=chrish", role: "Project Manager", appliedRole: "Scrum Master", location: "Sydney, AU", experience: "9 yrs", stage: "hr" },

  // Offer Stage
  { id: "cand5", name: "Michael Chen", avatar: "https://i.pravatar.cc/150?u=michael", role: "Backend Dev", appliedRole: "Data Engineer", location: "Austin, TX", experience: "4 yrs", stage: "offer" },
  { id: "cand17", name: "Elizabeth O.", avatar: "https://i.pravatar.cc/150?u=elizabeth", role: "Data Analyst", appliedRole: "Business Analyst", location: "Boston, MA", experience: "3 yrs", stage: "offer" },
  { id: "cand18", name: "Benedict C.", avatar: "https://i.pravatar.cc/150?u=ben", role: "Machine Learning Eng", appliedRole: "AI Researcher", location: "London, UK", experience: "6 yrs", stage: "offer" },

  // Hired Stage
  { id: "cand6", name: "Anna Lee", avatar: "https://i.pravatar.cc/150?u=anna", role: "Data Scientist", appliedRole: "Lead Data Scientist", location: "San Francisco, CA", experience: "7 yrs", stage: "hired" },
  { id: "cand19", name: "Robert Downey", avatar: "https://i.pravatar.cc/150?u=robert", role: "CTO", appliedRole: "VP of Engineering", location: "Los Angeles, CA", experience: "15 yrs", stage: "hired" },
  { id: "cand20", name: "Gwyneth P.", avatar: "https://i.pravatar.cc/150?u=gwyneth", role: "VP of Engineering", appliedRole: "Engineering Director", location: "Remote", experience: "12 yrs", stage: "hired" }
];

const CandidatesATS = () => {
  const [candidates, setCandidates] = useState(INITIAL_CANDIDATES);
  const [draggedCandId, setDraggedCandId] = useState(null);
  const [dropIndicator, setDropIndicator] = useState(null); // { stageId, index }

  const handleDragStart = (e, id) => {
    setDraggedCandId(id);
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", id);
    setTimeout(() => {
      e.target.style.opacity = "0.5";
    }, 0);
  };

  const handleDragEnd = (e) => {
    setDraggedCandId(null);
    setDropIndicator(null);
    e.target.style.opacity = "1";
  };

  // Drag over a card — figure out if we should insert above or below
  const handleCardDragOver = (e, stageId, cardIndex, cardElement) => {
    e.preventDefault();
    e.stopPropagation();
    e.dataTransfer.dropEffect = "move";

    const rect = cardElement.getBoundingClientRect();
    const midY = rect.top + rect.height / 2;
    const insertIndex = e.clientY < midY ? cardIndex : cardIndex + 1;

    setDropIndicator({ stageId, index: insertIndex });
  };

  // Drag over the empty area at the bottom of a column
  const handleColumnDragOver = (e, stageId, totalCards) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    // Only set indicator if not already set by a card hover
    setDropIndicator({ stageId, index: totalCards });
  };

  const handleDrop = (e, targetStageId) => {
    e.preventDefault();
    e.stopPropagation();
    if (!draggedCandId) return;

    const insertIndex = dropIndicator?.stageId === targetStageId ? dropIndicator.index : null;

    setCandidates((prev) => {
      // 1. Remove dragged candidate from the list
      const draggedCand = prev.find((c) => c.id === draggedCandId);
      if (!draggedCand) return prev;

      const withoutDragged = prev.filter((c) => c.id !== draggedCandId);

      // 2. Get candidates in target stage (without the dragged one)
      const targetStageCands = withoutDragged.filter((c) => c.stage === targetStageId);
      const otherCands = withoutDragged.filter((c) => c.stage !== targetStageId);

      // 3. Insert at the correct position
      const updatedDragged = { ...draggedCand, stage: targetStageId };
      let finalInsertIndex = insertIndex;

      // Adjust index if dragging within same stage and moving down
      if (draggedCand.stage === targetStageId && insertIndex !== null) {
        const originalIndex = prev.filter((c) => c.stage === targetStageId).findIndex((c) => c.id === draggedCandId);
        if (originalIndex < insertIndex) {
          finalInsertIndex = insertIndex - 1;
        }
      }

      if (finalInsertIndex !== null && finalInsertIndex >= 0) {
        targetStageCands.splice(Math.min(finalInsertIndex, targetStageCands.length), 0, updatedDragged);
      } else {
        targetStageCands.push(updatedDragged);
      }

      // 4. Rebuild the full list preserving stage order
      const result = [];
      const stageOrder = STAGES.map((s) => s.id);
      const candsByStage = {};

      // Collect non-target stage candidates
      for (const c of otherCands) {
        if (!candsByStage[c.stage]) candsByStage[c.stage] = [];
        candsByStage[c.stage].push(c);
      }
      candsByStage[targetStageId] = targetStageCands;

      for (const stageId of stageOrder) {
        if (candsByStage[stageId]) {
          result.push(...candsByStage[stageId]);
        }
      }

      return result;
    });

    setDraggedCandId(null);
    setDropIndicator(null);
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
                onDragOver={(e) => handleColumnDragOver(e, stage.id, stageCandidates.length)}
                onDrop={(e) => handleDrop(e, stage.id)}
                onDragLeave={(e) => {
                  // Clear indicator when leaving the column
                  const rect = e.currentTarget.getBoundingClientRect();
                  if (e.clientX < rect.left || e.clientX > rect.right || e.clientY < rect.top || e.clientY > rect.bottom) {
                    setDropIndicator(null);
                  }
                }}
              >
                {/* Stage Header */}
                <div className={`mb-3 px-3 py-2 rounded-xl border ${stage.color} flex items-center justify-between shadow-sm`}>
                  <h3 className="font-bold text-sm">{stage.label}</h3>
                  <span className="bg-white/50 px-2 py-0.5 rounded-md text-xs font-bold">
                    {stageCandidates.length}
                  </span>
                </div>

                {/* Candidate Cards Container */}
                <div className="flex-1 overflow-y-auto custom-scrollbar pr-1 pb-2">
                  {stageCandidates.map((cand, cardIndex) => (
                    <div key={cand.id}>
                      {/* Drop indicator line — shown ABOVE this card */}
                      {dropIndicator?.stageId === stage.id && dropIndicator?.index === cardIndex && draggedCandId && draggedCandId !== cand.id && (
                        <div className="flex items-center gap-1 py-1">
                          <div className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
                          <div className="h-[2px] flex-1 bg-emerald-500 rounded-full" />
                          <div className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
                        </div>
                      )}

                      <motion.div
                        layoutId={cand.id}
                        draggable
                        onDragStart={(e) => handleDragStart(e, cand.id)}
                        onDragEnd={handleDragEnd}
                        onDragOver={(e) => handleCardDragOver(e, stage.id, cardIndex, e.currentTarget)}
                        className={`bg-white p-4 rounded-xl shadow-sm border border-gray-100 cursor-grab active:cursor-grabbing hover:shadow-md transition-shadow group relative mb-3 ${
                          draggedCandId === cand.id ? "opacity-50" : ""
                        }`}
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
                          <div className="text-[10px] font-semibold text-indigo-700 bg-indigo-50 px-2 py-1 rounded-md border border-indigo-100 truncate max-w-[85%]">
                            Applied: {cand.appliedRole || cand.role}
                          </div>
                          <GripVertical className="h-4 w-4 text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                        </div>
                      </motion.div>
                    </div>
                  ))}

                  {/* Drop indicator at the END of the list */}
                  {dropIndicator?.stageId === stage.id && dropIndicator?.index === stageCandidates.length && draggedCandId && (
                    <div className="flex items-center gap-1 py-1">
                      <div className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
                      <div className="h-[2px] flex-1 bg-emerald-500 rounded-full" />
                      <div className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
                    </div>
                  )}

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
