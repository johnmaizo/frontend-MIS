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
