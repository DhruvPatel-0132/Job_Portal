import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FileText,
  MapPin,
  Briefcase,
  Clock,
  Users,
  DollarSign,
  Eye,
  ChevronDown,
  Sparkles,
  TrendingUp,
  Zap,
  ArrowRight,
  Calendar,
} from "lucide-react";
import usePostStore from "../../store/postStore";

/* ── Label maps ── */
const EMPLOYMENT_LABELS = {
  full_time: "Full-time",
  part_time: "Part-time",
  internship: "Internship",
  contract: "Contract",
  freelance: "Freelance",
};
const WORK_MODE_LABELS = { on_site: "On-site", remote: "Remote", hybrid: "Hybrid" };
const EXPERIENCE_LABELS = {
  fresher: "Fresher",
  junior: "Junior",
  mid: "Mid-level",
  senior: "Senior",
  lead: "Lead",
  executive: "Executive",
};

/* ── Helpers ── */
const formatSalary = (salary) => {
  if (!salary || salary.hideSalary) return null;
  const { min, max, currency = "INR", period = "yearly" } = salary;
  if (!min && !max) return null;
  const fmt = (n) => {
    if (n >= 100000) return `${(n / 100000).toFixed(1)}L`;
    if (n >= 1000) return `${(n / 1000).toFixed(0)}K`;
    return n.toString();
  };
  const range =
    min && max ? `${fmt(min)} – ${fmt(max)}` : min ? `${fmt(min)}+` : `Up to ${fmt(max)}`;
  return `${currency} ${range} / ${period}`;
};

const timeAgo = (date) => {
  const seconds = Math.floor((new Date() - new Date(date)) / 1000);
  if (seconds < 60) return "Just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  return `${Math.floor(days / 30)}mo ago`;
};

/* ── Animation Variants ── */
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.15 },
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

const headerVariants = {
  hidden: { opacity: 0, y: -20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 200, damping: 20 },
  },
};

const statVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { type: "spring", stiffness: 300, damping: 20 },
  },
};

/* ── Skeleton Loader ── */
const SkeletonCard = ({ index }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: index * 0.1 }}
    className="bg-white rounded-2xl border border-gray-100 p-5"
  >
    <div className="animate-pulse space-y-3">
      <div className="flex items-start justify-between">
        <div className="space-y-2 flex-1">
          <div className="h-5 bg-gray-100 rounded-lg w-3/5" />
          <div className="flex gap-2">
            <div className="h-3.5 bg-gray-100 rounded-full w-20" />
            <div className="h-3.5 bg-gray-100 rounded-full w-16" />
            <div className="h-3.5 bg-gray-100 rounded-full w-14" />
          </div>
        </div>
        <div className="h-6 bg-gray-100 rounded-full w-16" />
      </div>
      <div className="h-4 bg-gray-50 rounded-lg w-32" />
      <div className="flex gap-1.5">
        <div className="h-5 bg-gray-50 rounded-full w-14" />
        <div className="h-5 bg-gray-50 rounded-full w-18" />
        <div className="h-5 bg-gray-50 rounded-full w-12" />
      </div>
      <div className="border-t border-gray-50 pt-3 flex gap-6">
        <div className="h-3 bg-gray-50 rounded w-14" />
        <div className="h-3 bg-gray-50 rounded w-16" />
        <div className="h-3 bg-gray-50 rounded w-20" />
      </div>
    </div>
  </motion.div>
);

/* ── Stat Pill Component ── */
const StatPill = ({ icon: Icon, value, label, color = "gray" }) => {
  const colorClasses = {
    blue: "bg-blue-50 text-blue-700",
    emerald: "bg-emerald-50 text-emerald-700",
    amber: "bg-amber-50 text-amber-700",
    gray: "bg-gray-50 text-gray-600",
  };

  return (
    <motion.div
      variants={statVariants}
      whileHover={{ scale: 1.05 }}
      className={`flex items-center gap-2 px-3.5 py-2 rounded-xl ${colorClasses[color]} transition-colors`}
    >
      <Icon className="h-4 w-4" />
      <div className="text-left">
        <p className="text-sm font-bold leading-none">{value}</p>
        <p className="text-[10px] font-medium opacity-70 mt-0.5">{label}</p>
      </div>
    </motion.div>
  );
};

/* ── Job Card Component ── */
const JobCard = ({ post, index }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const job = post.referenceId;

  if (!job) return null;

  const isActive = job.isActive !== false;
  const salary = formatSalary(job.salary);

  return (
    <motion.div
      variants={cardVariants}
      layout
      whileHover={{
        y: -2,
        boxShadow: "0 8px 30px -12px rgba(0,0,0,0.12), 0 4px 12px -4px rgba(0,0,0,0.05)",
      }}
      className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden group cursor-pointer"
      onClick={() => setIsExpanded((p) => !p)}
    >
      {/* Active indicator line at top */}
      <motion.div
        className={`h-0.5 ${isActive ? "bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500" : "bg-gray-200"}`}
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ delay: index * 0.08 + 0.3, duration: 0.5, ease: "easeOut" }}
        style={{ transformOrigin: "left" }}
      />

      <div className="p-5">
        {/* Top Row */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <motion.h3
                className="text-base font-bold text-gray-900 truncate group-hover:text-blue-700 transition-colors duration-200"
                layout="position"
              >
                {job.title}
              </motion.h3>
              {isActive && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", delay: index * 0.08 + 0.4 }}
                >
                  <Zap className="h-3.5 w-3.5 text-amber-500 fill-amber-500" />
                </motion.div>
              )}
            </div>

            {/* Meta tags row */}
            <div className="flex flex-wrap items-center gap-2 mt-2">
              {job.location && (
                <motion.span
                  className="inline-flex items-center gap-1 text-xs text-gray-500 bg-gray-50 px-2.5 py-1 rounded-lg"
                  whileHover={{ backgroundColor: "#eff6ff", color: "#2563eb" }}
                  transition={{ duration: 0.15 }}
                >
                  <MapPin className="h-3 w-3" />
                  {job.location}
                </motion.span>
              )}
              {job.employmentType && (
                <motion.span
                  className="inline-flex items-center gap-1 text-xs text-gray-500 bg-gray-50 px-2.5 py-1 rounded-lg"
                  whileHover={{ backgroundColor: "#f0fdf4", color: "#16a34a" }}
                  transition={{ duration: 0.15 }}
                >
                  <Briefcase className="h-3 w-3" />
                  {EMPLOYMENT_LABELS[job.employmentType] || job.employmentType}
                </motion.span>
              )}
              {job.workMode && (
                <motion.span
                  className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-lg"
                  whileHover={{ scale: 1.05 }}
                >
                  {WORK_MODE_LABELS[job.workMode] || job.workMode}
                </motion.span>
              )}
              {job.experienceLevel && (
                <span className="text-xs text-gray-400 bg-gray-50 px-2.5 py-1 rounded-lg">
                  {EXPERIENCE_LABELS[job.experienceLevel] || job.experienceLevel}
                </span>
              )}
            </div>
          </div>

          {/* Status + Expand */}
          <div className="flex items-center gap-2 shrink-0">
            <motion.span
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`inline-flex items-center gap-1.5 text-[11px] font-bold px-3 py-1.5 rounded-full uppercase tracking-wider ${
                isActive
                  ? "text-emerald-700 bg-emerald-50 ring-1 ring-emerald-200/50"
                  : "text-gray-500 bg-gray-100 ring-1 ring-gray-200/50"
              }`}
            >
              <motion.span
                className={`w-1.5 h-1.5 rounded-full ${isActive ? "bg-emerald-500" : "bg-gray-400"}`}
                animate={isActive ? { scale: [1, 1.4, 1] } : {}}
                transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
              />
              {isActive ? "Active" : "Closed"}
            </motion.span>

            <motion.div
              animate={{ rotate: isExpanded ? 180 : 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className="p-1 rounded-full text-gray-400 group-hover:text-gray-600 transition-colors"
            >
              <ChevronDown className="h-4 w-4" />
            </motion.div>
          </div>
        </div>

        {/* Salary */}
        {salary && (
          <motion.div
            className="mt-3 inline-flex items-center gap-1.5 text-sm font-bold text-emerald-700 bg-emerald-50/70 px-3 py-1.5 rounded-xl"
            whileHover={{ scale: 1.02, backgroundColor: "rgba(16,185,129,0.15)" }}
          >
            <DollarSign className="h-3.5 w-3.5" />
            {salary}
            {job.salary?.isNegotiable && (
              <span className="text-[10px] font-medium text-emerald-500 ml-1.5 inline-flex items-center gap-1"><span className="w-1 h-1 rounded-full bg-emerald-400" />Negotiable</span>
            )}
          </motion.div>
        )}

        {/* Skills */}
        {job.skillsRequired?.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {job.skillsRequired.slice(0, 6).map((skill, i) => (
              <motion.span
                key={i}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 + i * 0.03 + 0.3 }}
                whileHover={{
                  scale: 1.08,
                  backgroundColor: "#eff6ff",
                  color: "#2563eb",
                }}
                className="text-[11px] font-medium text-gray-600 bg-gray-100 px-2.5 py-1 rounded-full cursor-default transition-colors"
              >
                {skill}
              </motion.span>
            ))}
            {job.skillsRequired.length > 6 && (
              <span className="text-[11px] font-semibold text-blue-500 px-2 py-1">
                +{job.skillsRequired.length - 6} more
              </span>
            )}
          </div>
        )}

        {/* Expanded Content */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="overflow-hidden"
            >
              <div className="mt-4 pt-4 border-t border-gray-100">
                {/* Description */}
                {(job.description || post.content) && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="mb-4"
                  >
                    <p className="text-[11px] font-black text-gray-400 uppercase tracking-widest mb-2">
                      Description
                    </p>
                    <p className="text-sm text-gray-600 leading-relaxed line-clamp-4">
                      {job.description || post.content}
                    </p>
                  </motion.div>
                )}

                {/* Benefits */}
                {job.benefits?.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15 }}
                    className="mb-4"
                  >
                    <p className="text-[11px] font-black text-gray-400 uppercase tracking-widest mb-2">
                      Benefits
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {job.benefits.map((b, i) => (
                        <span
                          key={i}
                          className="text-xs text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full font-medium"
                        >
                          {b}
                        </span>
                      ))}
                    </div>
                  </motion.div>
                )}

                {/* Extra details row */}
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="flex flex-wrap gap-3"
                >
                  {job.educationLevel && (
                    <span className="text-xs text-gray-500 bg-gray-50 px-3 py-1.5 rounded-lg">
                      🎓 {job.educationLevel}
                    </span>
                  )}
                  {job.applicationDeadline && (
                    <span className="text-xs text-orange-600 bg-orange-50 px-3 py-1.5 rounded-lg font-medium">
                      ⏰ Deadline: {new Date(job.applicationDeadline).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </span>
                  )}
                  {job.applicationUrl && (
                    <a
                      href={job.applicationUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-blue-600 bg-blue-50 px-3 py-1.5 rounded-lg font-medium inline-flex items-center gap-1 hover:bg-blue-100 transition-colors"
                      onClick={(e) => e.stopPropagation()}
                    >
                      External link <ArrowRight className="h-3 w-3" />
                    </a>
                  )}
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Bottom Stats Row */}
        <div className="mt-4 pt-3 border-t border-gray-50 flex items-center justify-between">
          <div className="flex items-center gap-4 text-xs text-gray-400">
            <motion.span
              className="flex items-center gap-1 hover:text-gray-600 transition-colors"
              whileHover={{ scale: 1.05 }}
            >
              <Clock className="h-3 w-3" />
              {timeAgo(post.createdAt)}
            </motion.span>
            <motion.span
              className="flex items-center gap-1 hover:text-blue-600 transition-colors"
              whileHover={{ scale: 1.05 }}
            >
              <Eye className="h-3 w-3" />
              {post.stats?.viewsCount || 0} views
            </motion.span>
            <motion.span
              className="flex items-center gap-1 hover:text-emerald-600 transition-colors"
              whileHover={{ scale: 1.05 }}
            >
              <Users className="h-3 w-3" />
              {job.totalApplicants || 0} applicants
            </motion.span>
            {/* {job.applicationDeadline && (
              <motion.span
                className="flex items-center gap-1 hover:text-orange-600 transition-colors"
                whileHover={{ scale: 1.05 }}
              >
                <Calendar className="h-3 w-3" />
                {new Date(job.applicationDeadline).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
              </motion.span>
            )} */}
          </div>

          <motion.span
            className="text-xs text-gray-400 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            animate={{ x: isExpanded ? 0 : 0 }}
          >
            {isExpanded ? "Click to collapse" : "Click for details"}
            <ChevronDown className={`h-3 w-3 transition-transform ${isExpanded ? "rotate-180" : ""}`} />
          </motion.span>
        </div>
      </div>
    </motion.div>
  );
};

/* ── Main Page ── */
const MyJobPosts = () => {
  const { myJobPosts, loading, fetchMyJobPosts } = usePostStore();

  useEffect(() => {
    fetchMyJobPosts();
  }, [fetchMyJobPosts]);

  const activeCount = myJobPosts.filter((p) => p.referenceId?.isActive !== false).length;
  const totalViews = myJobPosts.reduce((sum, p) => sum + (p.stats?.viewsCount || 0), 0);
  const totalApplicants = myJobPosts.reduce(
    (sum, p) => sum + (p.referenceId?.totalApplicants || 0),
    0
  );

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      {/* ── Header ── */}
      <motion.div
        variants={headerVariants}
        initial="hidden"
        animate="visible"
        className="mb-8"
      >
        <div className="flex items-center gap-3 mb-1">
          <motion.div
            className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-200/50"
            whileHover={{ rotate: [0, -8, 8, 0], scale: 1.05 }}
            transition={{ duration: 0.4 }}
          >
            <Briefcase className="h-5 w-5 text-white" />
          </motion.div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">My Job Posts</h1>
            <p className="text-sm text-gray-500">
              Manage and track all your job listings
            </p>
          </div>
        </div>
      </motion.div>

      {/* ── Stats Bar ── */}
      {!loading && myJobPosts.length > 0 && (
        <motion.div
          className="grid grid-cols-3 gap-3 mb-6"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <StatPill
            icon={FileText}
            value={myJobPosts.length}
            label={myJobPosts.length === 1 ? "Total Job" : "Total Jobs"}
            color="blue"
          />
          <StatPill
            icon={Sparkles}
            value={activeCount}
            label="Active Now"
            color="emerald"
          />
          <StatPill
            icon={TrendingUp}
            value={totalApplicants}
            label="Total Applicants"
            color="amber"
          />
        </motion.div>
      )}

      {/* ── Loading State ── */}
      {loading && (
        <div className="space-y-4">
          {[0, 1, 2].map((i) => (
            <SkeletonCard key={i} index={i} />
          ))}
        </div>
      )}

      {/* ── Empty State ── */}
      <AnimatePresence>
        {!loading && myJobPosts.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.97 }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
            className="bg-white rounded-2xl border border-gray-100 shadow-sm p-14 flex flex-col items-center justify-center text-center"
          >
            <motion.div
              className="w-20 h-20 bg-gradient-to-br from-blue-50 to-indigo-100 rounded-2xl flex items-center justify-center mb-5"
              animate={{
                rotate: [0, 5, -5, 0],
                scale: [1, 1.03, 1],
              }}
              transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
            >
              <FileText className="h-10 w-10 text-blue-600" />
            </motion.div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              No job posts yet
            </h3>
            <p className="text-sm text-gray-500 max-w-sm leading-relaxed">
              Create your first job posting from the dashboard to start
              attracting talented candidates to your company.
            </p>
            <motion.div
              className="mt-6 text-xs text-gray-400 flex items-center gap-2"
              animate={{ opacity: [0.4, 1, 0.4] }}
              transition={{ repeat: Infinity, duration: 2 }}
            >
              <Sparkles className="h-3.5 w-3.5" />
              Go to Dashboard → Create Post → Job Post
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Job Posts List ── */}
      {!loading && myJobPosts.length > 0 && (
        <motion.div
          className="space-y-4"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {myJobPosts.map((post, index) => (
            <JobCard key={post._id} post={post} index={index} />
          ))}
        </motion.div>
      )}
    </div>
  );
};

export default MyJobPosts;
