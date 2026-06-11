import React from "react";
import { motion } from "framer-motion";
import {
  MapPin,
  Briefcase,
  Building2,
  DollarSign,
  Clock,
  Monitor,
  Award,
  Calendar,
  Zap,
  Star,
  ChevronRight,
} from "lucide-react";

const JobDetailsStep = ({ job, onNext }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4 }}
      className="max-w-3xl mx-auto"
    >
      {/* Header Card */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden mb-6">
        {/* Top gradient banner */}
        <div className="h-2 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600" />

        <div className="p-8">
          <div className="flex items-start gap-5">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200 p-3 flex items-center justify-center shrink-0">
              <img
                src={job.logo}
                alt={job.company}
                className="w-full h-full object-contain"
              />
            </div>
            <div className="flex-1">
              <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">
                {job.title}
              </h1>
              <div className="flex items-center gap-3 mt-2">
                <span className="flex items-center gap-1.5 text-sm text-gray-600 font-medium">
                  <Building2 size={14} className="text-gray-400" />
                  {job.company}
                </span>
                <span className="w-1 h-1 bg-gray-300 rounded-full" />
                <span className="flex items-center gap-1.5 text-sm text-gray-600 font-medium">
                  <MapPin size={14} className="text-gray-400" />
                  {job.location}
                </span>
              </div>
            </div>
          </div>

          {/* Tags row */}
          <div className="flex flex-wrap gap-2 mt-6">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold">
              <DollarSign size={12} />
              {job.salary}
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-blue-50 text-blue-700 text-xs font-bold">
              <Briefcase size={12} />
              {job.type}
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-purple-50 text-purple-700 text-xs font-bold">
              <Monitor size={12} />
              {job.workMode || "Remote"}
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-50 text-amber-700 text-xs font-bold">
              <Clock size={12} />
              {job.experience || "3-5 years"}
            </span>
          </div>
        </div>
      </div>

      {/* Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {/* Description */}
        <div className="md:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-3">
            About the Role
          </h3>
          <p className="text-sm text-gray-700 leading-relaxed">
            {job.description}
          </p>
        </div>

        {/* Skills Required */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-3">
            Skills Required
          </h3>
          <div className="flex flex-wrap gap-2">
            {job.skills?.map((skill, i) => (
              <span
                key={i}
                className="px-3 py-1.5 bg-gray-50 text-gray-700 text-xs font-bold rounded-lg border border-gray-100 capitalize"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>

        {/* Benefits */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-3">
            Benefits
          </h3>
          <div className="space-y-2">
            {(
              job.benefits || [
                "Health Insurance",
                "Flexible Hours",
                "Remote Work",
                "Stock Options",
                "Learning Budget",
              ]
            ).map((benefit, i) => (
              <div
                key={i}
                className="flex items-center gap-2 text-sm text-gray-700"
              >
                <Star size={12} className="text-amber-500" />
                <span className="font-medium">{benefit}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Application Info */}
        <div className="md:col-span-2 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl border border-blue-100/50 p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/80 flex items-center justify-center border border-blue-100">
                <Calendar size={18} className="text-blue-600" />
              </div>
              <div>
                <p className="text-xs font-bold text-blue-900/60 uppercase tracking-wider">
                  Application Deadline
                </p>
                <p className="text-sm font-extrabold text-blue-900 mt-0.5">
                  {job.deadline || "July 15, 2026"}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-xs font-bold text-blue-600">
              <Zap size={14} />
              <span>Early applications preferred</span>
            </div>
          </div>
        </div>
      </div>

      {/* Apply Button */}
      <motion.button
        whileHover={{ scale: 1.01, y: -2 }}
        whileTap={{ scale: 0.98 }}
        onClick={onNext}
        className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl text-sm font-bold shadow-lg shadow-blue-200/50 hover:shadow-xl hover:shadow-blue-200/60 transition-all flex items-center justify-center gap-2"
      >
        <span>Continue Application</span>
        <ChevronRight size={16} />
      </motion.button>
    </motion.div>
  );
};

export default JobDetailsStep;
