export const getInitialCourseCodeAndCampus = (name) => {
  const CourseCode = name.split(" - ")[0];
  const Campus = name.split(" - ")[2];
  return `${CourseCode} - ${Campus}`;
};

export const getInitialsWithCampus = (name) => {
  const [collegeName, campus] = name.split(" - "); // Split into college name and campus
  const initials = collegeName
    .split(" ") // Split by spaces
    .filter((word) => /^[A-Z]/.test(word)) // Filter words starting with uppercase letters
    .map((word) => word[0]) // Get the first letter of each word
    .join(""); // Join them to form the acronym
  return initials === "CE"
    ? `COE - ${campus}`
    : initials === "CN"
      ? `CON - ${campus}`
      : `${initials} - ${campus}`; // Combine initials with campus
};