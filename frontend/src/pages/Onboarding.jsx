import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import api from "../api/axios";

const Onboarding = () => {
  const [step, setStep] = useState(1);
  const navigate = useNavigate();
  const { user, setUser } = useAuthStore();
  const [loading, setLoading] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    birthday: "",
    country: "",
    city: "",
    postalCode: "",
    address: "",
    education: [
      {
        school: "",
        degree: "",
        fieldOfStudy: "",
        startDate: "",
        endDate: "",
        grade: "",
        description: "",
        stillStudying: false,
      }
    ],
  });

  useEffect(() => {
    if (user && user.isOnboarded) {
      navigate("/dashboard");
    }
  }, [user, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleEducationChange = (index, e) => {
    const { name, value, type, checked } = e.target;
    const newEducation = [...formData.education];
    newEducation[index][name] = type === "checkbox" ? checked : value;
    setFormData((prev) => ({ ...prev, education: newEducation }));
  };

  const addEducation = () => {
    setFormData((prev) => ({
      ...prev,
      education: [
        ...prev.education,
        {
          school: "",
          degree: "",
          fieldOfStudy: "",
          startDate: "",
          endDate: "",
          grade: "",
          description: "",
          stillStudying: false,
        },
      ],
    }));
  };

  const removeEducation = (index) => {
    if (formData.education.length > 1) {
      const newEducation = formData.education.filter((_, i) => i !== index);
      setFormData((prev) => ({ ...prev, education: newEducation }));
    }
  };

  const handleCompleteOnboarding = async () => {
    try {
      setLoading(true);
      
      // 1. Update Profile Data
      await api.put("/profile/me", {
        birthday: formData.birthday,
        country: formData.country,
        city: formData.city,
        postalCode: formData.postalCode,
        address: formData.address,
        education: formData.education,
      });

      // 2. Update isOnboarded status
      const res = await api.put("/auth/update-onboarding", { isOnboarded: true });
      
      if (res.data.success) {
        setUser({ ...user, isOnboarded: true });
        navigate("/dashboard");
      }
    } catch (error) {
      console.error("Failed to complete onboarding:", error);
      alert("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const steps = [
    {
      title: "Personal Information",
      description: "Let's start with some basic details about you.",
      icon: "👤",
    },
    {
      title: "Where are you located?",
      description: "This helps us find opportunities near you.",
      icon: "📍",
    },
    {
      title: "Education Background",
      description: "Tell us about your academic journey.",
      icon: "🎓",
    },
    {
      title: "All Set!",
      description: "You're ready to start your journey with TalentForge AI.",
      icon: "🎉",
    }
  ];

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Date of Birth</label>
              <input
                type="date"
                name="birthday"
                value={formData.birthday}
                onChange={handleInputChange}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
              />
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Country</label>
                <input
                  type="text"
                  name="country"
                  placeholder="e.g. USA"
                  value={formData.country}  
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">City</label>
                <input
                  type="text"
                  name="city"
                  placeholder="e.g. New York"
                  value={formData.city}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Postal Code</label>
              <input
                type="text"
                name="postalCode"
                placeholder="e.g. 10001"
                value={formData.postalCode}
                onChange={handleInputChange}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Detailed Address</label>
              <textarea
                name="address"
                placeholder="Street address, Apartment, etc."
                value={formData.address}
                onChange={handleInputChange}
                rows="3"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none resize-none"
              />
            </div>
          </div>
        );
      case 3:
        return (
          <div className="space-y-6 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
            {formData.education.map((edu, index) => (
              <div key={index} className="p-4 border border-slate-100 rounded-2xl bg-slate-50/50 space-y-4 relative">
                {formData.education.length > 1 && (
                  <button 
                    onClick={() => removeEducation(index)}
                    className="absolute top-2 right-2 text-slate-400 hover:text-red-500 transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-slate-700 mb-1">School / University</label>
                    <input
                      type="text"
                      name="school"
                      placeholder="e.g. Harvard University"
                      value={edu.school}
                      onChange={(e) => handleEducationChange(index, e)}
                      className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Degree</label>
                    <input
                      type="text"
                      name="degree"
                      placeholder="e.g. Bachelor's"
                      value={edu.degree}
                      onChange={(e) => handleEducationChange(index, e)}
                      className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Field of Study</label>
                    <input
                      type="text"
                      name="fieldOfStudy"
                      placeholder="e.g. Computer Science"
                      value={edu.fieldOfStudy}
                      onChange={(e) => handleEducationChange(index, e)}
                      className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Start Date</label>
                    <input
                      type="date"
                      name="startDate"
                      value={edu.startDate}
                      onChange={(e) => handleEducationChange(index, e)}
                      className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">End Date</label>
                    <input
                      type="date"
                      name="endDate"
                      value={edu.endDate}
                      onChange={(e) => handleEducationChange(index, e)}
                      disabled={edu.stillStudying}
                      className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none bg-white disabled:bg-slate-100"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Grade / GPA</label>
                    <input
                      type="text"
                      name="grade"
                      placeholder="e.g. 3.8/4.0"
                      value={edu.grade}
                      onChange={(e) => handleEducationChange(index, e)}
                      className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
                    <textarea
                      name="description"
                      placeholder="Describe your studies, activities, or achievements..."
                      value={edu.description}
                      onChange={(e) => handleEducationChange(index, e)}
                      rows="2"
                      className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none bg-white resize-none"
                    />
                  </div>
                  <div className="col-span-2 flex items-center gap-2">
                    <input
                      type="checkbox"
                      name="stillStudying"
                      id={`stillStudying-${index}`}
                      checked={edu.stillStudying}
                      onChange={(e) => handleEducationChange(index, e)}
                      className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
                    />
                    <label htmlFor={`stillStudying-${index}`} className="text-sm text-slate-600">I am currently studying here</label>
                  </div>
                </div>
              </div>
            ))}
            <button 
              onClick={addEducation}
              className="w-full py-3 border-2 border-dashed border-slate-200 rounded-2xl text-slate-500 font-medium hover:border-blue-400 hover:text-blue-500 transition-all flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add Education
            </button>
          </div>
        );
      case 4:
        return (
          <div className="text-center py-8">
            <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6 text-4xl">
              ✓
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">Ready to Go!</h3>
            <p className="text-slate-600">All your information has been collected. Click the button below to enter your dashboard.</p>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-4xl w-full bg-white rounded-[2.5rem] shadow-2xl shadow-slate-200/50 overflow-hidden flex flex-col md:flex-row min-h-[600px]"
      >
        {/* Left Side - Progress */}
        <div className="w-full md:w-1/3 bg-slate-900 p-8 md:p-12 flex flex-col justify-between text-white relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full opacity-20 pointer-events-none">
             <div className="absolute top-[-10%] left-[-10%] w-64 h-64 bg-blue-500 rounded-full blur-[100px]" />
             <div className="absolute bottom-[-10%] right-[-10%] w-64 h-64 bg-indigo-600 rounded-full blur-[100px]" />
          </div>
          
          <div className="relative z-10">
            <h1 className="text-2xl font-bold tracking-tight mb-8">TalentForge</h1>
            
            <div className="space-y-8">
              {steps.map((s, i) => (
                <div key={i} className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all duration-500 ${
                    step > i + 1 ? 'bg-green-500 text-white' : 
                    step === i + 1 ? 'bg-blue-500 text-white ring-4 ring-blue-500/20' : 
                    'bg-slate-800 text-slate-500'
                  }`}>
                    {step > i + 1 ? '✓' : i + 1}
                  </div>
                  <div className="hidden md:block">
                    <p className={`text-sm font-semibold ${step === i + 1 ? 'text-white' : 'text-slate-500'}`}>{s.title}</p>
                    <p className="text-xs text-slate-600">Step {i + 1}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="relative z-10 pt-12">
            <div className="text-6xl mb-4">{steps[step - 1].icon}</div>
            <p className="text-slate-400 text-sm italic">"Join the future of recruitment with AI-powered insights."</p>
          </div>
        </div>

        {/* Right Side - Content */}
        <div className="w-full md:w-2/3 p-8 md:p-12 flex flex-col">
          <div className="flex-1">
            <AnimatePresence mode="wait">
              <motion.div
                key={step}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <div>
                  <h2 className="text-3xl font-bold text-slate-900 leading-tight">
                    {steps[step - 1].title}
                  </h2>
                  <p className="text-slate-600 mt-2">
                    {steps[step - 1].description}
                  </p>
                </div>
                
                <div className="pt-4">
                  {renderStepContent()}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="mt-12 flex items-center justify-between pt-8 border-t border-slate-100">
            {step > 1 ? (
              <button 
                onClick={() => setStep(s => s - 1)}
                className="px-6 py-3 text-slate-500 font-medium hover:text-slate-800 transition-colors flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Back
              </button>
            ) : (
              <div />
            )}
            
            <button
              onClick={() => {
                if (step < steps.length) {
                  setStep(s => s + 1);
                } else {
                  handleCompleteOnboarding();
                }
              }}
              disabled={loading}
              className="px-8 py-3 bg-slate-900 text-white rounded-xl font-semibold shadow-lg shadow-slate-900/20 hover:bg-slate-800 transition-all hover:-translate-y-0.5 active:translate-y-0 flex items-center gap-2"
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </>
              ) : step === steps.length ? "Finish & Go to Dashboard" : "Next Step"}
              {step < steps.length && (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Onboarding;
