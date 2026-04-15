const validateRegister = (data) => {
  const errors = {};

  if (!data.emailOrPhone)
    errors.emailOrPhone = "Email or phone is required";

  if (!data.password || data.password.length < 6)
    errors.password = "Password must be 6+ chars";

  if (!data.firstName) errors.firstName = "First name required";
  if (!data.role) errors.role = "Role required";

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

module.exports = { validateRegister };