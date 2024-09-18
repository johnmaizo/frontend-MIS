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

/**
 * Returns an array of unique course codes with a label containing the course code and description
 * @param {object[]} data - Array of objects containing the course code and description
 * @param {string} uniqueKey - The key that uniquely identifies each course
 * @returns {object[]} An array of objects with 'value' and 'label' properties
 */
export const getUniqueCourseCodes = (data, uniqueKey) => {
  return [
    ...new Map(
      data.map((item) => [
        item[uniqueKey],
        {
          value: item[uniqueKey],
          label: `${item.courseCode} - ${item.courseDescription}`,
        },
      ]),
    ).values(),
  ];
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
          // label: getInitialDepartmentCodeAndCampus(item[uniqueKey]),
          label: getInitialDepartmentCodeAndCampus(item[uniqueKey]),
        },
      ]),
    ).values(),
  ].sort((a, b) => a.value.localeCompare(b.value));
};
