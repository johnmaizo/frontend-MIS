export const getInitialDepartmentCodeAndCampus = (name) => {
  const DepartmentCode = name.split(" - ")[0];
  const Campus = name.split(" - ")[2];
  return `${DepartmentCode} - ${Campus}`;
};

export const getInitialDepartmentNameAndCampus = (name) => {
  const DepartmentName = name.split(" - ")[1];
  const Campus = name.split(" - ")[2];
  return `${DepartmentName} - ${Campus}`;
};

export const getInitialProgramCodeAndCampus = (name) => {
  const ProgramCode = name.split(" - ")[0];
  const Campus = name.split(" - ")[2];
  return `${ProgramCode} - ${Campus}`;
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