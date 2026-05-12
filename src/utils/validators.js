export const isRequired = (value) =>
  value !== undefined && value !== null && String(value).trim() !== ""
    ? null
    : "This field is required";

export const isEmail = (value) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
    ? null
    : "Please enter a valid email address";

export const isMinLength = (min) => (value) =>
  value && value.length >= min ? null : `Must be at least ${min} characters`;

export const isMaxLength = (max) => (value) =>
  value && value.length <= max
    ? null
    : `Must be no more than ${max} characters`;

export const isStrongPassword = (value) => {
  if (!value) return "Password is required";
  if (value.length < 8) return "Password must be at least 8 characters";
  if (!/[A-Z]/.test(value)) return "Must contain at least one uppercase letter";
  if (!/[0-9]/.test(value)) return "Must contain at least one number";
  return null;
};

export const isMatch =
  (other, label = "Passwords") =>
  (value) =>
    value === other ? null : `${label} do not match`;

export const isUrl = (value) => {
  try {
    new URL(value);
    return null;
  } catch {
    return "Please enter a valid URL";
  }
};

export const validateForm = (values, rules) => {
  const errors = {};
  Object.entries(rules).forEach(([field, validators]) => {
    for (const validate of validators) {
      const error = validate(values[field]);
      if (error) {
        errors[field] = error;
        break;
      }
    }
  });
  return errors;
};
