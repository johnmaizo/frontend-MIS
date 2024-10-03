import { Badge } from "../ui/badge";

/**
 * Returns an array of Badge components based on a comma-delimited string of roles.
 * Reorders the roles array to place "SuperAdmin" or "Admin" at the start if present.
 * Provides conditional styles for SuperAdmin and Admin roles.
 * @param {string} rolesString - A comma-delimited string of roles
 * @returns {JSX.Element[]}
 */
const RoleBadge = ({ rolesString }) => {
  // Split the roles string into an array based on commas
  let rolesArray = rolesString?.split(",").map((role) => role.trim());

  // Check if SuperAdmin or Admin exists and reorder roles
  const hasSuperAdmin = rolesArray.includes("SuperAdmin");
  const hasAdmin = rolesArray.includes("Admin");

  if (hasSuperAdmin) {
    // Remove SuperAdmin from the array and place it at the start
    rolesArray = [
      "SuperAdmin",
      ...rolesArray.filter((role) => role !== "SuperAdmin"),
    ];
  } else if (hasAdmin) {
    // Remove Admin from the array and place it at the start if no SuperAdmin
    rolesArray = ["Admin", ...rolesArray.filter((role) => role !== "Admin")];
  }

  // Map each role to a Badge component with conditional styles and special cases
  return rolesArray.map((role, index) => {
    // Modify role if it is "DataCenter" to display as "Data Center"
    if (role === "SuperAdmin") {
      role = "Super Admin";
    } else if (role === "DataCenter") {
      role = "Data Center";
    } 
    // else if (role === "MISStaff") {
    //   role = "MIS Staff";
    // }

    // Set badge styles for SuperAdmin and Admin
    let badgeStyle = "";
    if (role === "Super Admin") {
      badgeStyle = "!bg-red-600 hover:!bg-red-700 !text-white";
    } else if (role === "Admin") {
      badgeStyle = "!bg-blue-500 hover:!bg-blue-600 !text-white";
    } else if (role === "MIS") {
      badgeStyle = "!bg-emerald-700 hover:!bg-emerald-800 !text-white";
    } else if (role === "Data Center") {
      badgeStyle = "!bg-orange-500 hover:!bg-orange-600 !text-white";
    } else if (role === "Registrar") {
      badgeStyle = "!bg-violet-800 hover:!bg-violet-900 !text-white";
    } else if (role === "Accounting") {
      badgeStyle = "!bg-green-500 hover:!bg-green-600 !text-white";
    } else if (role === "Dean") {
      badgeStyle = "!bg-cyan-700 hover:!bg-cyan-800 !text-white";
    } else {
      badgeStyle = ""; // Default background for other roles
    }

    return (
      <Badge key={index} className={badgeStyle}>
        {role}
        {/* <p className="bg-cyan-900"></p> */}
      </Badge>
    );
  });
};

export default RoleBadge;
