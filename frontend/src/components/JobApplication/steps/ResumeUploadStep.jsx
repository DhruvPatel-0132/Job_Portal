import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Upload,
  FileText,
  CheckCircle2,
  AlertTriangle,
  X,
  ChevronRight,
  ChevronLeft,
  Sparkles,
  Lightbulb,
} from "lucide-react";

const ResumeUploadStep = ({ formData, setFormData, onNext, onBack }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const resumeData = formData.resume || {};

  const simulateUpload = (file) => {
    setIsAnalyzing(true);
    setFormData((prev) => ({
      ...prev,
      resume: {
        ...prev.resume,
        fileName: file.name,
        fileSize: (file.size / 1024 / 1024).toFixed(2) + " MB",
      },
    }));

    // Simulate AI analysis
    setTimeout(() => {
      setFormData((prev) => ({
        ...prev,
        resume: {
          ...prev.resume,
          uploaded: true,
          score: 87,
          missingSkills: ["Docker", "AWS", "Redis"],
        },
      }));
      setIsAnalyzing(false);
    }, 2000);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) simulateUpload(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) simulateUpload(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleRemove = () => {
    setFormData((prev) => ({
      ...prev,
      resume: {},
    }));
  };

  const getScoreColor = (score) => {
    if (score >= 80) return { text: "text-emerald-600", bg: "bg-emerald-500", ring: "ring-emerald-100", gradient: "from-emerald-500 to-teal-500" };
    if (score >= 60) return { text: "text-amber-600", bg: "bg-amber-500", ring: "ring-amber-100", gradient: "from-amber-500 to-orange-500" };
    return { text: "text-red-600", bg: "bg-red-500", ring: "ring-red-100", gradient: "from-red-500 to-rose-500" };
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -40 }}
      transition={{ duration: 0.35 }}
      className="max-w-2xl mx-auto"
    >
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="h-1 bg-gradient-to-r from-blue-600 to-indigo-600" />

        <div className="p-8">
          <div className="mb-8">
            <h2 className="text-xl font-extrabold text-gray-900 tracking-tight">
              Upload Resume
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Our AI will analyze your resume and provide feedback
            </p>
          </div>

          <AnimatePresence mode="wait">
            {!resumeData.uploaded && !isAnalyzing ? (
              /* Upload Area */
              <motion.div
                key="upload"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <label
                  className={`cursor-pointer block`}
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  onDragLeave={() => setIsDragging(false)}
                >
                  <input
                    type="file"
                    className="hidden"
                    accept=".pdf,.doc,.docx"
                    onChange={handleFileChange}
                  />
                  <div
                    className={`border-2 border-dashed rounded-2xl p-12 flex flex-col items-center justify-center transition-all ${
                      isDragging
                        ? "border-blue-400 bg-blue-50/50 scale-[1.02]"
                        : "border-gray-200 hover:border-blue-300 hover:bg-blue-50/20"
                    }`}
                  >
                    <motion.div
                      animate={isDragging ? { scale: 1.1, y: -5 } : { scale: 1, y: 0 }}
                      className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center mb-4"
                    >
                      <Upload
                        size={28}
                        className={`transition-colors ${
                          isDragging ? "text-blue-600" : "text-blue-400"
                        }`}
                      />
                    </motion.div>
                    <h3 className="text-md font-bold text-gray-900">
                      Drop your resume here or{" "}
                      <span className="text-blue-600">browse</span>
                    </h3>
                    <p className="text-[11px] text-gray-400 mt-2 uppercase tracking-wider font-bold">
                      PDF, DOCX up to 5MB
                    </p>
                  </div>
                </label>
              </motion.div>
            ) : isAnalyzing ? (
              /* Analyzing State */
              <motion.div
                key="analyzing"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center py-12"
              >
                <div className="relative mb-6">
                  <div className="w-20 h-20 rounded-full border-4 border-gray-100 border-t-blue-600 animate-spin" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Sparkles size={24} className="text-blue-600" />
                  </div>
                </div>
                <h3 className="text-lg font-bold text-gray-900">
                  Analyzing your resume...
                </h3>
                <p className="text-sm text-gray-500 mt-1">
                  AI is reviewing your qualifications
                </p>
                <div className="flex items-center gap-2 mt-4 text-xs text-gray-400">
                  <FileText size={14} />
                  <span>{resumeData.fileName}</span>
                  <span>•</span>
                  <span>{resumeData.fileSize}</span>
                </div>
              </motion.div>
            ) : (
              /* Results */
              <motion.div
                key="results"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="space-y-6"
              >
                {/* File Info */}
                <div className="flex items-center justify-between p-4 bg-emerald-50/50 rounded-xl border border-emerald-100">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center">
                      <CheckCircle2 size={20} className="text-emerald-600" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-gray-900">
                        Resume Uploaded Successfully
                      </p>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {resumeData.fileName} • {resumeData.fileSize}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={handleRemove}
                    className="p-2 hover:bg-white rounded-lg transition-colors"
                  >
                    <X size={16} className="text-gray-400" />
                  </button>
                </div>

                {/* AI Score */}
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <Sparkles size={18} className="text-blue-600" />
                    <h4 className="text-sm font-bold text-gray-900">
                      AI Resume Analysis
                    </h4>
                  </div>

                  <div className="flex items-center gap-6 mb-6">
                    <div className={`relative w-24 h-24 rounded-full ring-4 ${getScoreColor(resumeData.score).ring}`}>
                      <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                        <circle cx="50" cy="50" r="42" fill="none" stroke="#f3f4f6" strokeWidth="8" />
                        <motion.circle
                          cx="50"
                          cy="50"
                          r="42"
                          fill="none"
                          stroke="url(#scoreGradient)"
                          strokeWidth="8"
                          strokeLinecap="round"
                          strokeDasharray={`${2 * Math.PI * 42}`}
                          initial={{ strokeDashoffset: 2 * Math.PI * 42 }}
                          animate={{
                            strokeDashoffset: 2 * Math.PI * 42 * (1 - resumeData.score / 100),
                          }}
                          transition={{ duration: 1.5, ease: "easeOut" }}
                        />
                        <defs>
                          <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#3b82f6" />
                            <stop offset="100%" stopColor="#6366f1" />
                          </linearGradient>
                        </defs>
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <motion.span
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.5 }}
                          className="text-2xl font-black text-gray-900"
                        >
                          {resumeData.score}%
                        </motion.span>
                        <span className="text-[8px] font-bold text-gray-400 uppercase tracking-wider">
                          Match
                        </span>
                      </div>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-600 leading-relaxed">
                        Your resume has a strong match with this role. Consider
                        adding the missing skills below to improve your score.
                      </p>
                    </div>
                  </div>

                  {/* Missing Skills */}
                  <div>
                    <h5 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">
                      Missing Skills
                    </h5>
                    <div className="flex flex-wrap gap-2">
                      {resumeData.missingSkills?.map((skill, i) => (
                        <motion.span
                          key={skill}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 0.8 + i * 0.1 }}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-red-50 text-red-600 text-xs font-bold rounded-lg border border-red-100"
                        >
                          <AlertTriangle size={11} />
                          {skill}
                        </motion.span>
                      ))}
                    </div>
                  </div>

                  {/* Suggestions */}
                  <div className="mt-6 p-5 bg-blue-50/30 rounded-xl border border-blue-100">
                    <div className="flex items-center gap-2 mb-4">
                      <Lightbulb size={16} className="text-blue-600" />
                      <h4 className="text-sm font-bold text-blue-900">
                        Improvement Suggestions
                      </h4>
                    </div>
                    <div className="space-y-3">
                      {[
                        { text: "Add more quantifiable metrics to your achievements", done: false },
                        { text: "Include links to relevant projects or portfolio", done: true },
                        { text: "Tailor the summary to this specific role", done: false },
                      ].map((suggestion, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.5 + i * 0.1 }}
                          className="flex items-center gap-3"
                        >
                          {suggestion.done ? (
                            <CheckCircle2
                              size={16}
                              className="text-emerald-500 shrink-0"
                            />
                          ) : (
                            <div className="w-4 h-4 rounded-full border-2 border-gray-300 shrink-0" />
                          )}
                          <span
                            className={`text-sm font-medium ${
                              suggestion.done
                                ? "text-gray-500 line-through"
                                : "text-gray-700"
                            }`}
                          >
                            {suggestion.text}
                          </span>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex items-center gap-3 mt-6">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onBack}
          className="px-6 py-3.5 bg-white border border-gray-200 text-gray-600 rounded-xl text-sm font-bold transition-colors hover:bg-gray-50 flex items-center gap-2"
        >
          <ChevronLeft size={16} />
          Back
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.01, y: -1 }}
          whileTap={{ scale: 0.98 }}
          onClick={onNext}
          className="flex-1 py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl text-sm font-bold shadow-lg shadow-blue-200/50 transition-all flex items-center justify-center gap-2"
        >
          Continue
          <ChevronRight size={16} />
        </motion.button>
      </div>
    </motion.div>
  );
};

export default ResumeUploadStep;
