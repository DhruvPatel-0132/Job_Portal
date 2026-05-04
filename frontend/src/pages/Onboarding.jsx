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

  useEffect(() => {
    if (user && user.isOnboarded) {
      navigate("/dashboard");
    }
  }, [user, navigate]);

  const handleCompleteOnboarding = async () => {
    try {
      setLoading(true);
      // Update isOnboarded in the backend
      const res = await api.put("/auth/update-onboarding", { isOnboarded: true });
      
      if (res.data.success) {
        // Update user state in store
        setUser({ ...user, isOnboarded: true });
        navigate("/dashboard");
      }
    } catch (error) {
      console.error("Failed to complete onboarding:", error);
    } finally {
      setLoading(false);
    }
  };

  const steps = [
    {
      title: "Welcome to TalentForge AI",
      description: "Let's get your journey started. We'll help you find the perfect match for your career.",
      icon: "🚀",
    },
    {
      title: "Tailored for You",
      description: "Our AI analyzes your skills and preferences to bring you the best opportunities.",
      icon: "✨",
    },
    {
      title: "Ready to Explore?",
      description: "You're all set! Let's head to your dashboard and see what's waiting for you.",
      icon: "🎉",
    }
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-2xl w-full bg-white rounded-3xl shadow-2xl shadow-slate-200/50 overflow-hidden flex flex-col md:flex-row"
      >
        {/* Left Side - Visual */}
        <div className="w-full md:w-2/5 bg-slate-900 p-8 flex flex-col justify-between text-white relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full opacity-20 pointer-events-none">
             <div className="absolute top-[-10%] left-[-10%] w-64 h-64 bg-blue-500 rounded-full blur-[100px]" />
             <div className="absolute bottom-[-10%] right-[-10%] w-64 h-64 bg-indigo-600 rounded-full blur-[100px]" />
          </div>
          
          <div className="relative z-10">
            <h1 className="text-2xl font-bold tracking-tight">TalentForge</h1>
            <div className="h-1 w-12 bg-blue-500 mt-2 rounded-full" />
          </div>

          <div className="relative z-10">
            <div className="text-6xl mb-6">{steps[step - 1].icon}</div>
            <p className="text-slate-400 text-sm">Step {step} of {steps.length}</p>
            <div className="flex gap-1 mt-2">
              {steps.map((_, i) => (
                <div 
                  key={i} 
                  className={`h-1 rounded-full transition-all duration-300 ${i + 1 === step ? 'w-8 bg-blue-500' : 'w-2 bg-slate-700'}`} 
                />
              ))}
            </div>
          </div>
        </div>

        {/* Right Side - Content */}
        <div className="w-full md:w-3/5 p-8 md:p-12 flex flex-col justify-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <h2 className="text-3xl font-bold text-slate-900 leading-tight">
                {steps[step - 1].title}
              </h2>
              <p className="text-slate-600 text-lg leading-relaxed">
                {steps[step - 1].description}
              </p>
            </motion.div>
          </AnimatePresence>

          <div className="mt-12 flex items-center justify-between">
            {step > 1 ? (
              <button 
                onClick={() => setStep(s => s - 1)}
                className="text-slate-500 font-medium hover:text-slate-800 transition-colors"
              >
                Previous
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
              {loading ? "Finalizing..." : step === steps.length ? "Get Started" : "Continue"}
              {step < steps.length && (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="arrow_forward" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
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
