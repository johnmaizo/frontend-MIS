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
  ].sort((a, b) => a.value.toString().localeCompare(b.value));
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

/**
 * Returns an array of unique values with a label containing the value, sorted in ascending order by label.
 * Items with null department_id come first in the sorted order.
 * The array includes an additional 'disable' property that is set to true if a matching item is found in data2.
 * @param {object[]} data - Array of objects containing the value
 * @param {string} uniqueKey - The key that uniquely identifies each value
 * @param {object[]} data2 - Array of objects to compare with data
 * @returns {object[]} An array of objects with 'value', 'label', 'isDepartmentIdNull', and 'disable' properties
 */
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
              unit: item.unit,
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

// ! For Accounts
export const getDataWithDisable = (data1, data2, compareField) => {
  // Map through data1, compare the specified field with data2, and add "disable" field
  return data1.map((item) => {
    // Check if there's a matching value for the specified field in data2
    const matchingItem = data2.some(
      (item2) => item2[compareField] === item[compareField],
    );

    // Return the item from data1 with the additional "disable" field
    return {
      ...item,
      disable: matchingItem ? true : false, // Set disable based on the comparison field match
    };
  });
};

/**
 * Compares data1 and data2 and adds a "disable" field to data1 based on the comparison.
 * The comparison is done by finding the matching item in data2 based on campus_id
 * and departmentCodeForClass, and if a match is found, the "disable" field is set to false.
 * If no match is found, the "disable" field is set to true.
 * @param {object[]} data1 - Array of objects containing campus_id and departmentCodeForClass
 * @param {object[]} data2 - Array of objects containing campus_id and departmentCodeForClass
 * @param {string} departmentCodeForClass - The department code for the class
 * @returns {object[]} An array of objects with the additional "disable" field
 */
export const compareDataAndSetDisable = (
  data1,
  data2,
  departmentCodeForClass,
) => {
  return data1.map((item1) => {
    // Find the matching item in data2 based on campus_id and departmentCodeForClass
    const matchingItemInData2 = data2.find(
      (item2) =>
        item1.campus_id === item2.campus_id &&
        item2.departmentCodeForClass === departmentCodeForClass,
    );

    const disable =
      item1.departmentCodeForClass === departmentCodeForClass &&
      matchingItemInData2
        ? false
        : true;

    // Return item1 with the additional "disable" field
    return {
      ...item1,
      disable: disable,
    };
  });
};
