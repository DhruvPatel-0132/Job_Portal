exports.isEmail = (value) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
};

exports.isPhone = (value) => {
  return /^[0-9]{10}$/.test(value);
};