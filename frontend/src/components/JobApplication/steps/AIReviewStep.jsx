import React from "react";
import { motion } from "framer-motion";
import {
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  TrendingUp,
  Target,
  Lightbulb,
  ChevronRight,
  ChevronLeft,
} from "lucide-react";

const CircularProgress = ({ value, label, color }) => {
  const radius = 38;
  const circumference = 2 * Math.PI * radius;

  const gradientId = `progress-${label.replace(/\s/g, "")}`;

  const colors = {
    blue: { from: "#3b82f6", to: "#6366f1", bg: "bg-blue-50", text: "text-blue-600" },
    emerald: { from: "#10b981", to: "#14b8a6", bg: "bg-emerald-50", text: "text-emerald-600" },
    purple: { from: "#8b5cf6", to: "#a855f7", bg: "bg-purple-50", text: "text-purple-600" },
  };

  const c = colors[color] || colors.blue;

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-28 h-28">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r={radius} fill="none" stroke="#f3f4f6" strokeWidth="6" />
          <motion.circle
            cx="50"
            cy="50"
            r={radius}
            fill="none"
            stroke={`url(#${gradientId})`}
            strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: circumference * (1 - value / 100) }}
            transition={{ duration: 1.5, ease: "easeOut", delay: 0.3 }}
          />
          <defs>
            <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor={c.from} />
              <stop offset="100%" stopColor={c.to} />
            </linearGradient>
          </defs>
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="text-2xl font-black text-gray-900"
          >
            {value}%
          </motion.span>
        </div>
      </div>
      <span className="mt-2 text-xs font-bold text-gray-600">{label}</span>
    </div>
  );
};

const AIReviewStep = ({ formData, onNext, onBack }) => {
  // Calculate simulated scores based on form completeness
  const calculateCompleteness = () => {
    let filled = 0;
    let total = 0;

    // Basic info
    const bi = formData.basicInfo || {};
    ["firstName", "lastName", "email", "phone", "location"].forEach((f) => {
      total++;
      if (bi[f]) filled++;
    });

    // Resume
    total++;
    if (formData.resume?.uploaded) filled++;

    // Professional
    const pr = formData.professional || {};
    ["currentRole", "experience", "noticePeriod"].forEach((f) => {
      total++;
      if (pr[f]) filled++;
    });

    // Skills
    total++;
    if (formData.skills?.length > 0) filled++;

    // Education
    total++;
    if (formData.education?.[0]?.degree) filled++;

    // Experience
    total++;
    if (formData.experience?.[0]?.company) filled++;

    // Projects
    total++;
    if (formData.projects?.[0]?.name) filled++;

    // Questions
    total += 3;
    const qa = formData.questions || {};
    if (qa.sponsorship) filled++;
    if (qa.whyJoin) filled++;
    if (qa.noticePeriod) filled++;

    return Math.round((filled / total) * 100);
  };

  const completeness = calculateCompleteness();
  const resumeMatch = formData.resume?.score || 78;

  const missingSkills = formData.resume?.missingSkills || ["Docker", "Redis"];

  const suggestions = [
    {
      text: "Add a deployment/DevOps project",
      done: formData.projects?.some((p) =>
        p.techStack?.toLowerCase().includes("docker")
      ),
    },
    {
      text: "Add AWS certification or experience",
      done: formData.skills?.includes("AWS"),
    },
    {
      text: "Include metrics in work achievements",
      done: formData.experience?.some((e) => e.achievements?.length > 20),
    },
    {
      text: "Complete all additional questions",
      done: Object.keys(formData.questions || {}).length >= 5,
    },
    {
      text: "Add LinkedIn profile link",
      done: !!formData.basicInfo?.linkedin,
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -40 }}
      transition={{ duration: 0.35 }}
      className="max-w-2xl mx-auto"
    >
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="h-1 bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600" />

        <div className="p-8">
          <div className="mb-8 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center shadow-lg shadow-purple-200/50">
              <Sparkles size={20} className="text-white" />
            </div>
            <div>
              <h2 className="text-xl font-extrabold text-gray-900 tracking-tight">
                AI Profile Review
              </h2>
              <p className="text-sm text-gray-500">
                Smart analysis of your application
              </p>
            </div>
          </div>

          {/* Score Cards */}
          <div className="flex items-center justify-center gap-12 py-6 mb-6 bg-gray-50/50 rounded-2xl border border-gray-100">
            <CircularProgress
              value={completeness}
              label="Completeness"
              color="blue"
            />
            <CircularProgress
              value={resumeMatch}
              label="Resume Match"
              color="emerald"
            />
          </div>

          {/* Missing Skills */}
          {missingSkills.length > 0 && (
            <div className="mb-6 p-5 bg-amber-50/50 rounded-xl border border-amber-100">
              <div className="flex items-center gap-2 mb-3">
                <AlertTriangle size={16} className="text-amber-600" />
                <h4 className="text-sm font-bold text-amber-900">
                  Missing Skills
                </h4>
              </div>
              <div className="flex flex-wrap gap-2">
                {missingSkills.map((skill) => (
                  <span
                    key={skill}
                    className="px-3 py-1.5 bg-white text-amber-700 text-xs font-bold rounded-lg border border-amber-200"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Suggestions */}
          <div className="p-5 bg-blue-50/30 rounded-xl border border-blue-100">
            <div className="flex items-center gap-2 mb-4">
              <Lightbulb size={16} className="text-blue-600" />
              <h4 className="text-sm font-bold text-blue-900">
                Improvement Suggestions
              </h4>
            </div>
            <div className="space-y-3">
              {suggestions.map((suggestion, i) => (
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

          {/* Overall Assessment */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
            className="mt-6 p-4 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl border border-emerald-100 flex items-center gap-3"
          >
            <TrendingUp size={18} className="text-emerald-600 shrink-0" />
            <p className="text-sm text-emerald-800 font-medium">
              {completeness >= 80
                ? "Your application looks strong! Consider the suggestions above to make it even better."
                : "Complete more sections to improve your application strength. Aim for 80%+ completeness."}
            </p>
          </motion.div>
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
          Continue to Review
          <ChevronRight size={16} />
        </motion.button>
      </div>
    </motion.div>
  );
};

export default AIReviewStep;
