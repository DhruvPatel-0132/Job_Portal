export const validateStep = (step, state) => {
  const errors = {};

  switch (step) {
    case "auth":
      if (!state.emailOrPhone?.trim()) {
        errors.emailOrPhone = "Required";
      }
      if (!state.password || state.password.length < 6) {
        errors.password = "Min 6 characters";
      }
      break;

    case "name":
      if (!state.firstName?.trim()) {
        errors.firstName = "Required";
      }
      if (!state.lastName?.trim()) {
        errors.lastName = "Required";
      }
      break;

    case "role":
      if (!state.role) {
        errors.role = "Select role";
      }
      break;

    case "individual":
      if (!state.skills?.trim()) {
        errors.skills = "Required";
      }
      break;

    case "companyForm":
      if (!state.companyName?.trim()) {
        errors.companyName = "Required";
      }
      break;
  }

  return {
    errors,
    isValid: Object.keys(errors).length === 0,
  };
};