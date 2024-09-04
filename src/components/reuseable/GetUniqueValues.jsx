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
