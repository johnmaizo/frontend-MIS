export const getInitialCourseCodeAndCampus = (name) => {
  const CourseCode = name.split(" - ")[0];
  const Campus = name.split(" - ")[2];
  return `${CourseCode} - ${Campus}`;
};
