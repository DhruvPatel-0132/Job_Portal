import React from "react";
import { motion } from "framer-motion";
import {
  MessageSquare,
  ChevronRight,
  ChevronLeft,
} from "lucide-react";

const QUESTIONS = [
  {
    id: "sponsorship",
    type: "yesno",
    question: "Do you need visa sponsorship?",
    category: "Eligibility",
  },
  {
    id: "remote",
    type: "yesno",
    question: "Have you worked remotely before?",
    category: "Eligibility",
  },
  {
    id: "relocate",
    type: "yesno",
    question: "Are you willing to relocate?",
    category: "Eligibility",
  },
  {
    id: "noticePeriod",
    type: "mcq",
    question: "What is your notice period?",
    category: "Availability",
    options: ["Immediately", "15 Days", "30 Days", "60 Days"],
  },
  {
    id: "whyJoin",
    type: "longAnswer",
    question: "Why do you want to join us?",
    category: "Motivation",
    placeholder: "Share your motivation for applying to this role...",
  },
  {
    id: "achievement",
    type: "longAnswer",
    question: "Describe your biggest professional achievement.",
    category: "Motivation",
    placeholder: "Tell us about a project or accomplishment you're proud of...",
  },
];

const YesNoQuestion = ({ question, value, onChange }) => (
  <div className="space-y-3">
    <p className="text-sm font-bold text-gray-900">{question.question}</p>
    <div className="flex gap-3">
      {["Yes", "No"].map((opt) => (
        <motion.button
          key={opt}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => onChange(opt)}
          className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all border ${
            value === opt
              ? opt === "Yes"
                ? "bg-emerald-600 text-white border-emerald-600 shadow-lg shadow-emerald-200/50"
                : "bg-red-500 text-white border-red-500 shadow-lg shadow-red-200/50"
              : "bg-white text-gray-600 border-gray-200 hover:border-gray-300"
          }`}
        >
          {opt}
        </motion.button>
      ))}
    </div>
  </div>
);

const MCQQuestion = ({ question, value, onChange }) => (
  <div className="space-y-3">
    <p className="text-sm font-bold text-gray-900">{question.question}</p>
    <div className="grid grid-cols-2 gap-2">
      {question.options.map((opt) => (
        <motion.button
          key={opt}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => onChange(opt)}
          className={`py-3 px-4 rounded-xl text-xs font-bold transition-all border text-left ${
            value === opt
              ? "bg-blue-600 text-white border-blue-600 shadow-lg shadow-blue-200/50"
              : "bg-white text-gray-600 border-gray-200 hover:border-blue-200 hover:bg-blue-50/30"
          }`}
        >
          {opt}
        </motion.button>
      ))}
    </div>
  </div>
);

const LongAnswerQuestion = ({ question, value, onChange }) => (
  <div className="space-y-3">
    <p className="text-sm font-bold text-gray-900">{question.question}</p>
    <textarea
      value={value || ""}
      onChange={(e) => onChange(e.target.value)}
      placeholder={question.placeholder}
      rows={4}
      className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50/50 text-sm font-medium text-gray-900 placeholder:text-gray-400 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 outline-none transition-all resize-none"
    />
    <div className="text-right">
      <span className="text-[10px] font-bold text-gray-400">
        {(value || "").length} / 500 characters
      </span>
    </div>
  </div>
);

const QuestionsStep = ({ formData, setFormData, onNext, onBack }) => {
  const answers = formData.questions || {};

  const updateAnswer = (id, value) => {
    setFormData((prev) => ({
      ...prev,
      questions: { ...prev.questions, [id]: value },
    }));
  };

  // Group questions by category
  const categories = {};
  QUESTIONS.forEach((q) => {
    if (!categories[q.category]) categories[q.category] = [];
    categories[q.category].push(q);
  });

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
            <div className="flex items-center gap-2 mb-2">
              <MessageSquare size={20} className="text-blue-600" />
              <h2 className="text-xl font-extrabold text-gray-900 tracking-tight">
                Additional Questions
              </h2>
            </div>
            <p className="text-sm text-gray-500">
              Company-specific questions to help evaluate your fit
            </p>
          </div>

          <div className="space-y-8">
            {Object.entries(categories).map(([category, questions]) => (
              <div key={category}>
                <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4 pb-2 border-b border-gray-100">
                  {category}
                </h3>
                <div className="space-y-6">
                  {questions.map((q) => {
                    const Component =
                      q.type === "yesno"
                        ? YesNoQuestion
                        : q.type === "mcq"
                        ? MCQQuestion
                        : LongAnswerQuestion;

                    return (
                      <Component
                        key={q.id}
                        question={q}
                        value={answers[q.id]}
                        onChange={(val) => updateAnswer(q.id, val)}
                      />
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
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

export default QuestionsStep;
