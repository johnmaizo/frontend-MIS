/**
 * Returns an array of unique values with a label containing the value
 * @param {object[]} data - Array of objects containing the value
 * @param {string} uniqueKey - The key that uniquely identifies each value
 * @returns {object[]} An array of objects with 'value' and 'label' properties
 */

import { getInitialDepartmentCodeAndCampus } from "./GetInitialNames";

export const getUniqueCodes = (data, uniqueKey) => {
  return [
    ...new Map(
      data.map((item) => [
        item[uniqueKey],
        {
          value: item[uniqueKey],
          label: item[uniqueKey],
        },
      ]),
    ).values(),
  ].sort((a, b) => a.value.localeCompare(b.value));
};

/**
 * Returns an array of unique values with a label containing the value,
 * with the first letter capitalized. The array is sorted in ascending order
 * by label.
 * @param {object[]} data - Array of objects containing the value
 * @param {string} uniqueKey - The key that uniquely identifies each value
 * @returns {object[]} An array of objects with 'value' and 'label' properties
 */
export const getUniqueCodesEnrollment = (data, uniqueKey) => {
  return [
    ...new Map(
      data.map((item) => [
        item[uniqueKey],
        {
          value: item[uniqueKey],
          label:
            item[uniqueKey].charAt(0).toUpperCase() + item[uniqueKey].slice(1), // Capitalize first letter
        },
      ]),
    ).values(),
  ].sort((a, b) => a.label.localeCompare(b.label)); // Sort labels in ascending order
};

export const getUniqueCourseCodes = (data, uniqueKey, data2) => {
  // Sort the data so items with null department_id come first
  const sortedData = data.sort((a, b) => {
    if (a.department_id === null && b.department_id !== null) {
      return -1;
    }
    if (a.department_id !== null && b.department_id === null) {
      return 1;
    }
    return 0; // Keep original order for items with the same department_id status
  });

  // Create the unique map and return the sorted results
  return (
    [
      ...new Map(
        sortedData.map((item) => {
          // Check if the uniqueKey matches between data and data2
          const matchingItem = data2.find(
            (item2) => item2[uniqueKey] === item[uniqueKey],
          );

          return [
            item[uniqueKey],
            {
              value: item[uniqueKey],
              label: `${item.courseCode} - ${item.courseDescription}`,
              isDepartmentIdNull: item.department_id === null, // New field
              disable: matchingItem ? true : false, // Set disable based on whether a match is found
            },
          ];
        }),
      ).values(),
    ]
      // Sort the results by the value of uniqueKey (or another sorting logic if needed)
      .sort((a, b) => (a.value > b.value ? 1 : -1))
  ); // Sort alphabetically by uniqueKey value
};

/**
 * Returns an array of unique strings from the given data array by the specified key.
 * @param {object[]} data - Array of objects containing the key
 * @param {string} uniqueKey - The key that uniquely identifies each value
 * @returns {string[]} An array of unique strings
 */
export const getUniqueStringsByProperty = (data, uniqueKey) => {
  return [...new Set(data.map((item) => item[uniqueKey]))];
};

export const getUniqueCodesForProgram = (data, uniqueKey) => {
  return [
    ...new Map(
      data.map((item) => [
        item[uniqueKey],
        {
          value: item[uniqueKey],
          label: getInitialDepartmentCodeAndCampus(item[uniqueKey]),
        },
      ]),
    ).values(),
  ].sort((a, b) => a.value.localeCompare(b.value));
};

export const getUniqueCodesForSubject = (data, uniqueKey) => {
  const mappedData = [
    ...new Map(
      data.map((item) => [
        item[uniqueKey] || "General Subject", // Check if value is null/undefined, default to "General Subject"
        {
          value: item[uniqueKey] || null, // If null/undefined, value is null
          label: item[uniqueKey] || "General Subject", // Label is "General Subject" when null/undefined
        },
      ]),
    ).values(),
  ];

  // Sort the data but ensure "General Subject" is always first
  return mappedData.sort((a, b) => {
    if (a.label === "General Subject") return -1; // "General Subject" comes first
    if (b.label === "General Subject") return 1;
    return a.label.localeCompare(b.label); // Sort the rest alphabetically by label
  });
};
