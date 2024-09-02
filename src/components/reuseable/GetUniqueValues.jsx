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
