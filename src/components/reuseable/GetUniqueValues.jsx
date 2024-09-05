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
  ];
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

export const getUniqueStringsByProperty = (data, uniqueKey) => {
  return [...new Set(data.map((item) => item[uniqueKey]))];
};
