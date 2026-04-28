import { motion, AnimatePresence } from "framer-motion";
import { useState, useRef } from "react";
import {
  X,
  User,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  GraduationCap,
  Calendar,
  Globe,
  Building2,
  Hash,
  Sparkles,
  Camera,
  CheckCircle2,
} from "lucide-react";

/* ───────────────────────────── constants ────────────────────────────── */

const SECTIONS = [
  { id: "basic", label: "General", icon: User, desc: "Personal information" },
  { id: "contact", label: "Contact", icon: Mail, desc: "How to reach you" },
  { id: "location", label: "Location", icon: MapPin, desc: "Your address details" },
  { id: "professional", label: "Professional", icon: Briefcase, desc: "Career & Education" },
];

/* ──────────────────────── reusable input ──────────────────── */

const InputField = ({ label, field, value, onChange, type = "text", placeholder, icon: Icon, className = "" }) => {
  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      <label className="text-[13px] font-medium text-gray-700 flex items-center gap-1.5">
        {label}
      </label>
      <div className="relative group">
        {Icon && (
          <Icon
            size={16}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-black transition-colors"
          />
        )}
        <input
          type={type}
          value={value || ""}
          placeholder={placeholder}
          onChange={(e) => onChange(field, e.target.value)}
          className={`w-full rounded-xl border border-gray-200/80 bg-white
                     ${Icon ? "pl-10 pr-4" : "px-4"} py-2.5 text-[15px] text-gray-900 shadow-[0_2px_4px_rgba(0,0,0,0.02)]
                     focus:border-black focus:ring-1 focus:ring-black outline-none transition-all duration-200
                     hover:border-gray-300 placeholder:text-gray-400`}
        />
      </div>
    </div>
  );
};

/* ─────────────────────────── section forms ──────────────────────────── */

function BasicSection({ editData, update }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.2 }}
      className="space-y-6"
    >
      {/* Avatar Quick Edit */}
      <div className="flex items-center gap-5 pb-6 border-b border-gray-100">
        <div className="relative group cursor-pointer">
          <div className="w-20 h-20 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center text-2xl font-bold text-gray-400 overflow-hidden">
            {editData.avatar ? (
              <img src={editData.avatar} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              editData.firstName?.[0] || "?"
            )}
          </div>
          <div className="absolute inset-0 bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <Camera size={20} className="text-white" />
          </div>
        </div>
        <div>
          <h3 className="text-sm font-semibold text-gray-900">Profile Picture</h3>
          <p className="text-[13px] text-gray-500 mt-0.5">PNG, JPG under 5MB</p>
          <button className="mt-2 text-[13px] font-medium text-black hover:text-gray-600 transition-colors">
            Upload new picture
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <InputField label="First Name" field="firstName" value={editData.firstName} onChange={update} icon={User} />
        <InputField label="Last Name" field="lastName" value={editData.lastName} onChange={update} icon={User} />
        <InputField label="Professional Headline" field="headline" value={editData.headline} onChange={update} icon={Sparkles} className="sm:col-span-2" placeholder="e.g. Full Stack Developer" />
        <InputField label="Date of Birth" field="birthday" value={editData.birthday} onChange={update} type="date" icon={Calendar} />
      </div>
    </motion.div>
  );
}

function ContactSection({ editData, update }) {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }} className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <InputField label="Email Address" field="email" value={editData.email} onChange={update} type="email" icon={Mail} />
        <InputField label="Phone Number" field="phone" value={editData.phone} onChange={update} type="tel" icon={Phone} />
      </div>
    </motion.div>
  );
}

function LocationSection({ editData, update }) {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }} className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <InputField label="Country" field="country" value={editData.country} onChange={update} icon={Globe} />
        <InputField label="City" field="city" value={editData.city} onChange={update} icon={Building2} />
        <InputField label="Postal Code" field="postalCode" value={editData.postalCode} onChange={update} icon={Hash} />
        <InputField label="Detailed Address" field="address" value={editData.address} onChange={update} icon={MapPin} className="sm:col-span-2" />
      </div>
    </motion.div>
  );
}

function ProfessionalSection({ editData, update }) {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }} className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <InputField label="Primary Industry" field="industry" value={editData.industry} onChange={update} icon={Briefcase} />
        <InputField label="Highest Education" field="education" value={editData.education} onChange={update} icon={GraduationCap} />
      </div>
    </motion.div>
  );
}

const SECTION_MAP = {
  basic: BasicSection,
  contact: ContactSection,
  location: LocationSection,
  professional: ProfessionalSection,
};

/* ────────────────────────────── modal ───────────────────────────────── */

export default function EditProfileModal({
  isOpen,
  setIsOpen,
  editData,
  setEditData,
}) {
  const [activeSection, setActiveSection] = useState("basic");
  const [isSaving, setIsSaving] = useState(false);

  const update = (field, value) => setEditData((prev) => ({ ...prev, [field]: value }));

  const currentIdx = SECTIONS.findIndex((s) => s.id === activeSection);
  const ActiveForm = SECTION_MAP[activeSection];

  const handleSave = () => {
    setIsSaving(true);
    // Simulate API call
    setTimeout(() => {
      console.log("Saved:", editData);
      setIsSaving(false);
      setIsOpen(false);
    }, 600);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 sm:py-12">
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-black/20 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
          />

          {/* Modal Container */}
          <motion.div
            className="relative z-10 w-full max-w-4xl bg-white rounded-[24px] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.15)] flex flex-col md:flex-row overflow-hidden border border-gray-100"
            initial={{ opacity: 0, scale: 0.96, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 20 }}
            transition={{ type: "spring", bounce: 0, duration: 0.4 }}
            onClick={(e) => e.stopPropagation()}
            style={{ maxHeight: "calc(100vh - 40px)" }}
          >
            {/* ── SIDEBAR ── */}
            <div className="w-full md:w-[260px] bg-gray-50/50 flex flex-col border-r border-gray-100 shrink-0">
              <div className="p-6 md:p-8">
                <div className="w-10 h-10 rounded-xl bg-black text-white flex items-center justify-center mb-4 shadow-sm">
                  <User size={20} />
                </div>
                <h2 className="text-xl font-semibold tracking-tight text-gray-900">Settings</h2>
                <p className="text-[13px] text-gray-500 mt-1">Manage your public profile and private details.</p>
              </div>

              <nav className="flex-1 px-4 pb-6 space-y-1 overflow-x-auto md:overflow-visible flex md:flex-col hide-scrollbar">
                {SECTIONS.map((section) => {
                  const Icon = section.icon;
                  const isActive = activeSection === section.id;
                  
                  return (
                    <button
                      key={section.id}
                      onClick={() => setActiveSection(section.id)}
                      className="relative flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-colors whitespace-nowrap md:whitespace-normal group shrink-0"
                    >
                      {isActive && (
                        <motion.div
                          layoutId="active-pill"
                          className="absolute inset-0 bg-white shadow-sm border border-gray-200/60 rounded-xl"
                          transition={{ type: "spring", bounce: 0.2, duration: 0.5 }}
                        />
                      )}
                      <Icon
                        size={16}
                        className={`relative z-10 transition-colors ${isActive ? "text-black" : "text-gray-400 group-hover:text-gray-600"}`}
                      />
                      <div className="relative z-10">
                        <p className={`text-[14px] font-medium transition-colors ${isActive ? "text-black" : "text-gray-600 group-hover:text-gray-900"}`}>
                          {section.label}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </nav>
            </div>

            {/* ── MAIN CONTENT ── */}
            <div className="flex-1 flex flex-col min-w-0 bg-white">
              {/* Header */}
              <div className="flex items-center justify-between px-8 py-6 border-b border-gray-100">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{SECTIONS[currentIdx]?.label}</h3>
                  <p className="text-[13px] text-gray-500 mt-0.5">{SECTIONS[currentIdx]?.desc}</p>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="w-8 h-8 flex items-center justify-center rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Form Area */}
              <div className="flex-1 overflow-y-auto p-8">
                <AnimatePresence mode="wait">
                  {ActiveForm && <ActiveForm key={activeSection} editData={editData} update={update} />}
                </AnimatePresence>
              </div>

              {/* Footer */}
              <div className="px-8 py-5 bg-gray-50/50 border-t border-gray-100 flex items-center justify-end gap-3">
                <button
                  onClick={() => setIsOpen(false)}
                  className="px-5 py-2.5 text-[14px] font-medium text-gray-600 rounded-xl hover:bg-gray-200/50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="relative px-6 py-2.5 text-[14px] font-medium text-white bg-black rounded-xl overflow-hidden shadow-md shadow-black/10 hover:shadow-lg hover:-translate-y-0.5 transition-all active:translate-y-0 disabled:opacity-70 disabled:hover:translate-y-0"
                >
                  <div className="flex items-center gap-2">
                    {isSaving ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        Save Changes
                        <CheckCircle2 size={16} className="opacity-80" />
                      </>
                    )}
                  </div>
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}