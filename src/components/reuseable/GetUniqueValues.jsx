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

// ! For SubjectEnlistmentPage.jsx

/**
 * Parses the schedule string to extract days, start time, and end time.
 * Expected format: "DAYS START_TIME - END_TIME"
 * Example: "TTH 3:00 AM - 4:30 AM"
 *
 * @param {string} scheduleStr - The schedule string to parse.
 * @returns {object|null} - An object with daysString, startTime, and endTime or null if parsing fails.
 */
export const parseSchedule = (scheduleStr) => {
  if (typeof scheduleStr !== "string") return null;

  // Regular expression to match the schedule format
  const scheduleRegex =
    /^([A-Za-z,]+)\s+(\d{1,2}:\d{2}\s?(AM|PM))\s*-\s*(\d{1,2}:\d{2}\s?(AM|PM))$/i;
  const match = scheduleStr.match(scheduleRegex);

  if (!match) return null;

  const daysString = match[1].toUpperCase();
  const startTime = match[2].toUpperCase();
  const endTime = match[4].toUpperCase();

  return { daysString, startTime, endTime };
};

/**
 * Formats the time string for display.
 *
 * @param {string} timeString - The time string (e.g., "3:00 AM").
 * @returns {string} - Formatted time string.
 */
export const formatTime = (timeString) => {
  if (!timeString) return "N/A";
  // Optionally, you can format the time string if needed
  return timeString; // Already in "3:00 AM" format
};

/**
 * Formats the days array into a readable string.
 *
 * @param {object} cls - The class object.
 * @returns {string} - Formatted days string.
 */
export const formatDays = (cls) => {
  if (cls.days && Array.isArray(cls.days)) {
    return cls.days.join(", ");
  } else if (typeof cls.days === "string") {
    return cls.days;
  } else if (cls.schedule && typeof cls.schedule === "string") {
    const parsed = parseSchedule(cls.schedule);
    if (parsed) {
      const { daysString } = parsed;
      return parseDays(daysString).join(", ");
    }
  }
  return "N/A"; // Default if days can't be determined
};

/**
 * Parses the days string into an array of standardized day codes.
 *
 * @param {string} daysString - The days string (e.g., "TTH").
 * @returns {Array<string>} - An array of day codes (e.g., ["TU", "TH"]).
 */
export const parseDays = (daysString) => {
  if (typeof daysString !== "string") return [];

  // Handle multiple days separated by commas
  if (daysString.includes(",")) {
    return daysString.split(",").map((day) => day.trim());
  }

  // Handle abbreviations like "TTH"
  const dayMapping = {
    M: "MO",
    MT: "MO",
    MO: "MO",
    TU: "TU",
    T: "TU",
    TTH: "TH",
    TH: "TH",
    W: "WE",
    WE: "WE",
    F: "FR",
    FR: "FR",
    S: "SA",
    SA: "SA",
    SU: "SU",
  };

  const days = [];

  // Split the string into possible day codes
  let temp = daysString;
  while (temp.length > 0) {
    if (temp.startsWith("TTH")) {
      days.push(dayMapping["TTH"]);
      temp = temp.slice(3);
    } else if (temp.startsWith("TH")) {
      days.push(dayMapping["TH"]);
      temp = temp.slice(2);
    } else {
      const dayCode = temp.slice(0, 1);
      if (dayMapping[dayCode]) {
        days.push(dayMapping[dayCode]);
        temp = temp.slice(1);
      } else {
        // If unknown, skip one character to prevent infinite loop
        console.warn(`Unknown day code in daysString: "${daysString}"`);
        temp = temp.slice(1);
      }
    }
  }

  return days;
};

/**
 * Formats the schedule components into a readable string.
 *
 * @param {string} daysString - The days string (e.g., "TTH").
 * @param {string} startTime - The start time (e.g., "3:00 AM").
 * @param {string} endTime - The end time (e.g., "4:30 AM").
 * @returns {string} - The formatted schedule string.
 */
export const formatSchedule = (daysString, startTime, endTime) => {
  const daysFormatted = daysString
    .split(",")
    .map((day) => day.trim())
    .join(", ");
  return `${daysFormatted} ${startTime} - ${endTime}`;
};

/**
 * Converts a 12-hour time string to a 24-hour format.
 *
 * @param {string} timeStr - Time string in "h:mm AM/PM" format.
 * @returns {string} - Time string in "HH:MM" 24-hour format.
 */
export const convertTo24Hour = (timeStr) => {
  const [time, modifier] = timeStr.split(" ");
  let [hours, minutes] = time.split(":");
  hours = parseInt(hours, 10);

  if (modifier.toUpperCase() === "PM" && hours !== 12) {
    hours += 12;
  }
  if (modifier.toUpperCase() === "AM" && hours === 12) {
    hours = 0;
  }

  const formattedHours = hours.toString().padStart(2, "0");
  return `${formattedHours}:${minutes}`;
};
