/**
 * Extract the department code and campus from a string that is in the format
 * "Department Code - Department Name - Campus"
 * @param {string} name The string to extract from
 * @returns {string} "Department Code - Campus"
 */
export const getInitialDepartmentCodeAndCampus = (name) => {
  const DepartmentCode = name.split(" - ")[0];
  const Campus = name.split(" - ")[2];
  return `${DepartmentCode} - ${Campus}`;
};

/**
 * Extract the department name and campus from a string that is in the format
 * "Department Code - Department Name - Campus"
 * @param {string} name The string to extract from
 * @returns {string} "Department Name - Campus"
 */
export const getInitialDepartmentNameAndCampus = (name) => {
  const DepartmentName = name.split(" - ")[1];
  const Campus = name.split(" - ")[2];
  return `${DepartmentName} - ${Campus}`;
};

/**
 * Extract the program code and campus from a string that is in the format
 * "Program Code - Program Name - Campus"
 * @param {string} name The string to extract from
 * @returns {string} "Program Code - Campus"
 */
export const getInitialProgramCodeAndCampus = (name) => {
  const ProgramCode = name.split(" - ")[0];
  const Campus = name.split(" - ")[2];
  return `${ProgramCode} - ${Campus}`;
};

/**
 * Extract the initials of the college name and campus from a string that is in the format
 * "College Name - Campus"
 * @param {string} name The string to extract from
 * @returns {string} "Initials - Campus"
 */
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