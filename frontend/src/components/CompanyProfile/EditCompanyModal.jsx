import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { X, Building2, CheckCircle2, LayoutTemplate, Briefcase, MapPin, ListPlus } from "lucide-react";
import GeneralCompanySection from "./sections/GeneralCompanySection";
import AboutCompanySection from "./sections/AboutCompanySection";
import LocationCompanySection from "./sections/LocationCompanySection";
import SpecialtiesCompanySection from "./sections/SpecialtiesCompanySection";
import ServicesCompanySection from "./sections/ServicesCompanySection";

const COMPANY_SECTIONS = [
  { id: "general", label: "General", icon: Building2, desc: "Basic company details" },
  { id: "about", label: "About Us", icon: LayoutTemplate, desc: "Company overview" },
  { id: "location", label: "Location & Contact", icon: MapPin, desc: "Headquarters and links" },
  { id: "specialties", label: "Specialties", icon: Briefcase, desc: "Key focus areas" },
  { id: "services", label: "Services", icon: ListPlus, desc: "What you offer" },
];

const SECTION_MAP = {
  general: GeneralCompanySection,
  about: AboutCompanySection,
  location: LocationCompanySection,
  specialties: SpecialtiesCompanySection,
  services: ServicesCompanySection,
};

export default function EditCompanyModal({
  isOpen,
  setIsOpen,
  editData,
  setEditData,
  onSave,
  initialSection = "general",
}) {
  const [activeSection, setActiveSection] = useState(initialSection);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setActiveSection(initialSection);
    }
  }, [isOpen, initialSection]);

  const update = (field, value) =>
    setEditData((prev) => ({ ...prev, [field]: value }));

  const currentIdx = COMPANY_SECTIONS.findIndex((s) => s.id === activeSection);
  const ActiveForm = SECTION_MAP[activeSection];

  const handleSave = async () => {
    setIsSaving(true);
    if (onSave) {
      await onSave(editData);
    }
    setIsSaving(false);
    setIsOpen(false);
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
                  <Building2 size={20} />
                </div>
                <h2 className="text-xl font-semibold tracking-tight text-gray-900">
                  Company
                </h2>
                <p className="text-[13px] text-gray-500 mt-1">
                  Manage your company profile and details.
                </p>
              </div>

              <nav className="flex-1 px-4 pb-6 space-y-1 overflow-x-auto md:overflow-visible flex md:flex-col hide-scrollbar">
                {COMPANY_SECTIONS.map((section) => {
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
                          layoutId="company-active-pill"
                          className="absolute inset-0 bg-white shadow-sm border border-gray-200/60 rounded-xl"
                          transition={{
                            type: "spring",
                            bounce: 0.2,
                            duration: 0.5,
                          }}
                        />
                      )}
                      <Icon
                        size={16}
                        className={`relative z-10 transition-colors ${isActive ? "text-black" : "text-gray-400 group-hover:text-gray-600"}`}
                      />
                      <div className="relative z-10">
                        <p
                          className={`text-[14px] font-medium transition-colors ${isActive ? "text-black" : "text-gray-600 group-hover:text-gray-900"}`}
                        >
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
                  <h3 className="text-lg font-semibold text-gray-900">
                    {COMPANY_SECTIONS[currentIdx]?.label}
                  </h3>
                  <p className="text-[13px] text-gray-500 mt-0.5">
                    {COMPANY_SECTIONS[currentIdx]?.desc}
                  </p>
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
                  {ActiveForm && (
                    <ActiveForm
                      key={activeSection}
                      editData={editData}
                      update={update}
                    />
                  )}
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
