/**
 * Checks if the user has the given role.
 *
 * @param {string} userRole The user's roles, comma-separated.
 * @param {string} roleToCheck The role to check for.
 * @returns {boolean} Whether the user has the given role.
 */
export const HasRole = (userRole, roleToCheck) => {
  // Check if userRole contains a comma
  if (!userRole.includes(",")) {
    // If no comma, directly compare the string
    return userRole.trim() === roleToCheck;
  }

  // If there's a comma, split and check each role
  return userRole
    .split(",")
    .map((role) => role.trim())
    .includes(roleToCheck);
};
