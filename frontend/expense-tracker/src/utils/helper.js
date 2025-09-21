export const validateEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};
// Get initials from a name
export const getInitials = (name) => {
  if (!name) return "";
  const names = name.trim().split(" ");
  if (names.length === 1) return names[0].charAt(0).toUpperCase();
  return names[0].charAt(0).toUpperCase() + names[names.length - 1].charAt(0).toUpperCase();
};

// Add thousands separator to a number
export const addThousandsSeparator = (num) => {
  if (num == null || isNaN(num)) return "";
  const [integerPart, fractionalPart] = num.toString().split(".");
  const formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return fractionalPart
    ? `${formattedInteger}.${fractionalPart}`
    : formattedInteger;
};
