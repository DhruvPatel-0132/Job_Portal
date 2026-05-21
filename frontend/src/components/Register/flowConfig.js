export const getFlowSteps = (role, hireType) => {
  const base = ["auth", "name", "role"];

  if (role === "job_seeker") return base;

  if (role === "company") return [...base, "companyForm"];

  if (role === "hire") {
    if (!hireType) return [...base, "hireType"];
    if (hireType === "individual")
      return [...base, "hireType", "individual"];
    if (hireType === "company")
      return [...base, "hireType", "companySelect"];
  }

  return base;
};

// For Google OAuth new users — skip auth & name, start at role
export const getGoogleFlowSteps = (role, hireType) => {
  const base = ["role"];

  if (role === "job_seeker") return base;

  if (role === "company") return [...base, "companyForm"];

  if (role === "hire") {
    if (!hireType) return [...base, "hireType"];
    if (hireType === "individual")
      return [...base, "hireType", "individual"];
    if (hireType === "company")
      return [...base, "hireType", "companySelect"];
  }

  return base;
};