import { useState } from "react";
import { getFlowSteps, getGoogleFlowSteps } from "./flowConfig";
import { validateStep } from "../../validation/stepValidation";
import axios from "axios";

import AuthStep from "./steps/AuthStep";
import NameStep from "./steps/NameStep";
import RoleStep from "./steps/RoleStep";
import HireTypeStep from "./steps/HireTypeStep";
import IndividualStep from "./steps/IndividualStep";
import CompanySelectStep from "./steps/CompanySelectStep";
import CompanyFormStep from "./steps/CompanyFormStep";

import StepDots from "./components/StepDots";
import ProgressBar from "./components/ProgressBar";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import api from "../../api/axios";
import { useAuthStore } from "../../store/authStore";

export default function Register() {
  const navigate = useNavigate();
  const location = useLocation();

  // 🔑 Google OAuth mode — user is already authenticated, just needs a role
  const googleMode = location.state?.googleMode === true;
  const { setUser, user } = useAuthStore();

  const [stepIndex, setStepIndex] = useState(0);
  const [role, setRole] = useState("");
  const [hireType, setHireType] = useState("");

  const [currentProfession, setCurrentProfession] = useState("");
  const [experience, setExperience] = useState("");
  const [project, setProject] = useState("");

  const [companyName, setCompanyName] = useState("");
  const [year, setYear] = useState("");
  const [about, setAbout] = useState("");

  const [search, setSearch] = useState("");
  const [selectedCompany, setSelectedCompany] = useState("");
  const [isNewCompany, setIsNewCompany] = useState(false);
  const [newCompany, setNewCompany] = useState("");

  const [emailOrPhone, setEmailOrPhone] = useState("");
  const [password, setPassword] = useState("");

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  const [errors, setErrors] = useState({});

  // Use the correct flow based on mode
  const steps = googleMode
    ? getGoogleFlowSteps(role, hireType)
    : getFlowSteps(role, hireType);

  const currentStep = steps[stepIndex];

  // =========================
  // NEXT STEP VALIDATION
  // =========================
  const next = () => {
    const result = validateStep(currentStep, {
      role,
      hireType,
      emailOrPhone,
      password,
      firstName,
      lastName,
      currentProfession,
      companyName,
    });

    setErrors(result.errors);

    if (!result.isValid) return;

    setStepIndex((i) => i + 1);
  };

  const back = () => setStepIndex((i) => i - 1);

  // =========================
  // NORMAL REGISTER SUBMIT
  // =========================
  const handleSubmit = async () => {
    const result = validateStep(currentStep, {
      role,
      hireType,
      emailOrPhone,
      password,
      firstName,
      lastName,
      currentProfession,
      companyName,
    });

    setErrors(result.errors);

    if (!result.isValid) return;

    try {
      const { data } = await axios.post(
        "http://localhost:5000/api/auth/register",
        {
          role,
          hireType,
          emailOrPhone,
          password,
          firstName,
          lastName,

          currentProfession,
          experience,
          project,

          companyName,
          year,
          about,

          selectedCompany,
          newCompany,
        },
      );

      console.log("REGISTER SUCCESS:", data);

      localStorage.setItem("token", data.accessToken);
      localStorage.setItem("refreshToken", data.refreshToken);
      localStorage.setItem("userId", data.userId);
      navigate("/auth");
    } catch (error) {
      console.error(
        "REGISTER ERROR:",
        error?.response?.data?.message || error.message,
      );
    }
  };

  // =========================
  // GOOGLE MODE SUBMIT
  // Updates role for an already-authenticated Google user,
  // then redirects to onboarding.
  // =========================
  const handleGoogleSubmit = async () => {
    try {
      const res = await api.put("/auth/update-role", {
        role,
        companyName,
        year,
        about,
        hireType,
        currentProfession,
        experience,
        project,
        selectedCompany,
        newCompany,
      });

      if (res.data.success) {
        // Sync role into Zustand store
        setUser({ ...user, role });
        navigate("/onboarding");
      }
    } catch (error) {
      console.error(
        "GOOGLE ROLE UPDATE ERROR:",
        error?.response?.data?.message || error.message,
      );
    }
  };

  // Pick the right submit handler based on mode
  const activeSubmit = googleMode ? handleGoogleSubmit : handleSubmit;


  const progress = ((stepIndex + 1) / steps.length) * 100;

  // =========================
  // STEP RENDERER
  // =========================
  const renderStep = () => {
    switch (currentStep) {
      case "auth":
        return (
          <AuthStep
            next={next}
            emailOrPhone={emailOrPhone}
            setEmailOrPhone={setEmailOrPhone}
            password={password}
            setPassword={setPassword}
            errors={errors}
          />
        );

      case "name":
        return (
          <NameStep
            next={next}
            back={back}
            firstName={firstName}
            setFirstName={setFirstName}
            lastName={lastName}
            setLastName={setLastName}
            errors={errors}
          />
        );

      case "role":
        return (
          <RoleStep
            role={role}
            setRole={setRole}
            next={next}
            handleSubmit={activeSubmit}
          />
        );

      case "hireType":
        return (
          <HireTypeStep
            hireType={hireType}
            setHireType={setHireType}
            next={next}
          />
        );

      case "individual":
        return (
          <IndividualStep
            currentProfession={currentProfession}
            setCurrentProfession={setCurrentProfession}
            experience={experience}
            setExperience={setExperience}
            project={project}
            setProject={setProject}
            handleSubmit={activeSubmit}
          />
        );

      case "companySelect":
        return (
          <CompanySelectStep
            search={search}
            setSearch={setSearch}
            selectedCompany={selectedCompany}
            setSelectedCompany={setSelectedCompany}
            isNewCompany={isNewCompany}
            setIsNewCompany={setIsNewCompany}
            newCompany={newCompany}
            setNewCompany={setNewCompany}
            handleSubmit={activeSubmit}
          />
        );

      case "companyForm":
        return (
          <CompanyFormStep
            companyName={companyName}
            setCompanyName={setCompanyName}
            year={year}
            setYear={setYear}
            about={about}
            setAbout={setAbout}
            handleSubmit={activeSubmit}
          />
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-gray-50 to-gray-200 px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md bg-white/80 backdrop-blur-xl border border-gray-200 shadow-xl rounded-3xl p-8"
      >
        <StepDots step={stepIndex + 1} totalSteps={steps.length} />
        <ProgressBar progress={progress} />

        {renderStep()}

        {/* LOGIN — hidden in Google mode since user is already authenticated */}
        {!googleMode && (
          <div className="mt-8 pt-6 border-t text-center">
            <p className="text-sm text-gray-500">
              Already have an account?{" "}
              <NavLink to="/" className="text-black font-medium hover:underline">
                Sign in
              </NavLink>
            </p>
          </div>
        )}
      </motion.div>
    </div>
  );
}
