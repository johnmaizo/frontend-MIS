import { useEffect, useState } from "react";
import DefaultLayout from "../../layout/DefaultLayout";
import { useParams } from "react-router-dom";

import { BreadcrumbResponsive } from "../../../components/reuseable/Breadcrumbs";
import InputText from "../../../components/reuseable/InputText";

import loadingProfile from "../../../assets/images/profile-user.jpg";

import { ProfileLoadingIcon } from "../../../components/Icons";

import axios from "axios";
import AcceptEnrollment from "../../../components/api/AcceptEnrollment";

const ViewEnrollmentApplicantPage = () => {
  // Initialize state to hold the fetched data
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { applicantId } = useParams();

  useEffect(() => {
    // Log the applicantId for debugging
    console.log("Fetching data for Applicant ID:", applicantId);

    const fetchData = async () => {
      try {
        const response = await axios.get(
          `/enrollment/get-applicant-data/${applicantId}`,
        );

        // Log the API response for debugging
        console.log("API Response:", response.data);

        console.log("HAHAAHHAAHHAHAAHAHAAHA API Response:", response.data);

        // Check if the response contains the expected data
        if (
          response.data &&
          response.data.personal_data &&
          Array.isArray(response.data.personal_data) &&
          response.data.personal_data.length > 0
        ) {
          setStudent(response.data);
        } else if (response.data && response.data.detail) {
          // If the response contains a detail message, treat it as an error
          setError(response.data.detail);
        } else {
          // Generic error message if the structure is unexpected
          setError("No matching data found.");
        }
      } catch (err) {
        console.error("Fetch Error:", err);
        if (err.response && err.response.data && err.response.data.detail) {
          setError(err.response.data.detail);
        } else if (err.message) {
          setError(`Failed to fetch student: ${err.message}`);
        } else {
          setError("An unexpected error occurred.");
        }
      }
      setLoading(false);
    };

    fetchData();
  }, [applicantId]);

  const NavItems = [
    { to: "/", label: "Dashboard" },
    {
      to: "/enrollments/online-applicants",
      label: "Pending Enrollment Applicants",
    },
    {
      label: `${loading ? "Loading..." : error ? "Error" : "View Enrollment Application"}`,
    },
  ];

  // Helper function to safely access nested data
  const getData = (section, field) => {
    if (
      student &&
      student[section] &&
      Array.isArray(student[section]) &&
      student[section].length > 0 &&
      student[section][0][field] !== undefined &&
      student[section][0][field] !== null &&
      student[section][0][field] !== ""
    ) {
      return student[section][0][field];
    }
    return "N/A";
  };

  return (
    <DefaultLayout>
      <BreadcrumbResponsive
        pageName={"View Enrollment Application"}
        items={NavItems}
        ITEMS_TO_DISPLAY={3}
      />

      <div className="mb-6 flex w-full justify-end">
        <div className="rounded bg-white p-4 shadow-default dark:bg-boxdark">
          {/* Pass student data as a prop if needed */}
          <AcceptEnrollment applicantId={applicantId} loading={loading} />
        </div>
      </div>

      {/* Display error message if any */}
      {error && (
        <div className="mb-6 rounded border border-red-500 bg-red-100 p-4 shadow">
          <p className="text-xl font-semibold text-red-700">{error}</p>
        </div>
      )}

      {/* Display status messages based on the student&apos;s active status and application status */}
      {!loading && !error && student && student.personal_data.length > 0 && (
        <>
          {!student.personal_data[0].is_active && (
            <div className="mb-6 rounded border border-red-500 bg-red-100 p-4 shadow">
              <p className="text-xl font-semibold text-red-700">
                NOTE: This Student is Inactive.
              </p>
            </div>
          )}

          {student.personal_data[0].status === "accepted" && (
            <div className="mb-6 rounded border border-green-500 bg-green-100 p-4 shadow">
              <p className="text-xl font-semibold text-green-700">
                NOTE: This Student has been Accepted. 🎉🎉
              </p>
            </div>
          )}

          {/* New Status Message for Pending Submission */}
          {student.personal_data[0].status === "pending" && (
            <div className="mb-6 rounded border border-yellow-500 bg-yellow-100 p-4 shadow">
              <p className="text-xl font-semibold text-yellow-700">
                NOTE: This Student is submitting through the online enrollment
                application.
              </p>
            </div>
          )}
        </>
      )}

      {/* Main Content */}
      <div className="mb-6 rounded bg-white p-6 shadow dark:bg-boxdark">
        <div className="flex flex-col items-center gap-6 md:flex-row md:items-start">
          {/* Profile Section */}
          <div className="flex-shrink-0">
            <div className="bg-gray-100 flex h-40 w-40 items-center justify-center rounded-full border">
              {loading ? (
                <ProfileLoadingIcon className="text-gray-300 h-20 w-20 animate-pulse" />
              ) : (
                <img
                  src={loadingProfile}
                  alt="Applicant Profile"
                  className="h-40 w-40 rounded-full object-cover"
                />
              )}
            </div>
          </div>

          {/* Applicant Information */}
          <div className="w-full space-y-6">
            {/* Personal Information Section */}
            {!loading &&
              !error &&
              student &&
              student.personal_data.length > 0 && (
                <section>
                  <h2 className="text-gray-800 mb-4 text-2xl font-semibold dark:text-white">
                    Personal Information
                  </h2>
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                    <div>
                      <label className="text-gray-600 dark:text-gray-300 block">
                        First Name
                      </label>
                      <InputText
                        value={getData("personal_data", "f_name")}
                        disabled={true}
                        className={"transition-none"}
                      />
                    </div>
                    <div>
                      <label className="text-gray-600 dark:text-gray-300 block">
                        Middle Name
                      </label>
                      <InputText
                        value={getData("personal_data", "m_name")}
                        disabled={true}
                        className={"transition-none"}
                      />
                    </div>
                    <div>
                      <label className="text-gray-600 dark:text-gray-300 block">
                        Last Name
                      </label>
                      <InputText
                        value={getData("personal_data", "l_name")}
                        disabled={true}
                        className={"transition-none"}
                      />
                    </div>
                    {getData("personal_data", "suffix") !== "N/A" && (
                      <div>
                        <label className="text-gray-600 dark:text-gray-300 block">
                          Suffix
                        </label>
                        <InputText
                          value={getData("personal_data", "suffix")}
                          disabled={true}
                          className={"transition-none"}
                        />
                      </div>
                    )}
                    <div>
                      <label className="text-gray-600 dark:text-gray-300 block">
                        Gender
                      </label>
                      <InputText
                        value={getData("personal_data", "sex")}
                        disabled={true}
                        className={"transition-none"}
                      />
                    </div>
                    <div>
                      <label className="text-gray-600 dark:text-gray-300 block">
                        Birth Date
                      </label>
                      <InputText
                        value={getData("personal_data", "birth_date")}
                        disabled={true}
                        className={"transition-none"}
                      />
                    </div>
                    <div>
                      <label className="text-gray-600 dark:text-gray-300 block">
                        Birth Place
                      </label>
                      <InputText
                        value={getData("personal_data", "birth_place")}
                        disabled={true}
                        className={"transition-none"}
                      />
                    </div>
                    <div>
                      <label className="text-gray-600 dark:text-gray-300 block">
                        Marital Status
                      </label>
                      <InputText
                        value={getData("personal_data", "marital_status")}
                        disabled={true}
                        className={"transition-none"}
                      />
                    </div>
                    <div>
                      <label className="text-gray-600 dark:text-gray-300 block">
                        Religion
                      </label>
                      <InputText
                        value={getData("personal_data", "religion")}
                        disabled={true}
                        className={"transition-none"}
                      />
                    </div>
                    <div>
                      <label className="text-gray-600 dark:text-gray-300 block">
                        Country
                      </label>
                      <InputText
                        value={getData("personal_data", "country")}
                        disabled={true}
                        className={"transition-none"}
                      />
                    </div>
                    <div>
                      <label className="text-gray-600 dark:text-gray-300 block">
                        Email
                      </label>
                      <InputText
                        value={getData("personal_data", "email")}
                        disabled={true}
                        className={"transition-none"}
                      />
                    </div>
                    <div>
                      <label className="text-gray-600 dark:text-gray-300 block">
                        Status
                      </label>
                      <InputText
                        value={getData("personal_data", "status")}
                        disabled={true}
                        className={"transition-none"}
                      />
                    </div>
                  </div>
                </section>
              )}

            {/* Contact Details Section */}
            {!loading &&
              !error &&
              student &&
              student.add_personal_data.length > 0 && (
                <section>
                  <h2 className="text-gray-800 mb-4 text-2xl font-semibold dark:text-white">
                    Contact Details
                  </h2>
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                    <div>
                      <label className="text-gray-600 dark:text-gray-300 block">
                        City Address
                      </label>
                      <InputText
                        value={getData("add_personal_data", "city_address")}
                        disabled={true}
                        className={"transition-none"}
                      />
                    </div>
                    <div>
                      <label className="text-gray-600 dark:text-gray-300 block">
                        Province Address
                      </label>
                      <InputText
                        value={getData("add_personal_data", "province_address")}
                        disabled={true}
                        className={"transition-none"}
                      />
                    </div>
                    <div>
                      <label className="text-gray-600 dark:text-gray-300 block">
                        Citizenship
                      </label>
                      <InputText
                        value={getData("add_personal_data", "citizenship")}
                        disabled={true}
                        className={"transition-none"}
                      />
                    </div>
                    <div>
                      <label className="text-gray-600 dark:text-gray-300 block">
                        Primary Contact Number
                      </label>
                      <InputText
                        value={getData("add_personal_data", "contact_number")}
                        disabled={true}
                        className={"transition-none"}
                      />
                    </div>
                    <div>
                      <label className="text-gray-600 dark:text-gray-300 block">
                        Contact Number (City)
                      </label>
                      <InputText
                        value={getData(
                          "add_personal_data",
                          "city_contact_number",
                        )}
                        disabled={true}
                        className={"transition-none"}
                      />
                    </div>
                    <div>
                      <label className="text-gray-600 dark:text-gray-300 block">
                        Contact Number (Province)
                      </label>
                      <InputText
                        value={getData(
                          "add_personal_data",
                          "province_contact_number",
                        )}
                        disabled={true}
                        className={"transition-none"}
                      />
                    </div>
                  </div>
                </section>
              )}

            {/* Family Background Section */}
            {!loading &&
              !error &&
              student &&
              student.family_background.length > 0 && (
                <section>
                  <h2 className="text-gray-800 mb-4 text-2xl font-semibold dark:text-white">
                    Family Background
                  </h2>
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                    {/* Father&apos;s Information */}
                    <div className="md:col-span-3">
                      <h3 className="text-gray-700 dark:text-gray-200 mb-2 text-xl font-semibold">
                        Father&apos;s Information
                      </h3>
                    </div>
                    <div>
                      <label className="text-gray-600 dark:text-gray-300 block">
                        Father&apos;s Name
                      </label>
                      <InputText
                        value={
                          `${getData("family_background", "father_fname")} ${getData("family_background", "father_mname") || ""} ${getData("family_background", "father_lname") || ""}`.trim() ||
                          "N/A"
                        }
                        disabled={true}
                        className={"transition-none"}
                      />
                    </div>
                    <div>
                      <label className="text-gray-600 dark:text-gray-300 block">
                        Father&apos;s Contact Number
                      </label>
                      <InputText
                        value={getData(
                          "family_background",
                          "father_contact_number",
                        )}
                        disabled={true}
                        className={"transition-none"}
                      />
                    </div>
                    <div>
                      <label className="text-gray-600 dark:text-gray-300 block">
                        Father&apos;s Email
                      </label>
                      <InputText
                        value={getData("family_background", "father_email")}
                        disabled={true}
                        className={"transition-none"}
                      />
                    </div>

                    {/* Mother&apos;s Information */}
                    <div className="md:col-span-3">
                      <h3 className="text-gray-700 dark:text-gray-200 mb-2 text-xl font-semibold">
                        Mother&apos;s Information
                      </h3>
                    </div>
                    <div>
                      <label className="text-gray-600 dark:text-gray-300 block">
                        Mother&apos;s Name
                      </label>
                      <InputText
                        value={
                          `${getData("family_background", "mother_fname")} ${getData("family_background", "mother_mname") || ""} ${getData("family_background", "mother_lname") || ""}`.trim() ||
                          "N/A"
                        }
                        disabled={true}
                        className={"transition-none"}
                      />
                    </div>
                    <div>
                      <label className="text-gray-600 dark:text-gray-300 block">
                        Mother&apos;s Contact Number
                      </label>
                      <InputText
                        value={getData(
                          "family_background",
                          "mother_contact_number",
                        )}
                        disabled={true}
                        className={"transition-none"}
                      />
                    </div>
                    <div>
                      <label className="text-gray-600 dark:text-gray-300 block">
                        Mother&apos;s Email
                      </label>
                      <InputText
                        value={getData("family_background", "mother_email")}
                        disabled={true}
                        className={"transition-none"}
                      />
                    </div>

                    {/* Guardian Information */}
                    {getData("family_background", "guardian_fname") !==
                      "N/A" && (
                      <>
                        <div className="md:col-span-3">
                          <h3 className="text-gray-700 dark:text-gray-200 mb-2 text-xl font-semibold">
                            Guardian Information
                          </h3>
                        </div>
                        <div>
                          <label className="text-gray-600 dark:text-gray-300 block">
                            Guardian&apos;s Name
                          </label>
                          <InputText
                            value={
                              `${getData("family_background", "guardian_fname")} ${getData("family_background", "guardian_mname") || ""} ${getData("family_background", "guardian_lname") || ""}`.trim() ||
                              "N/A"
                            }
                            disabled={true}
                            className={"transition-none"}
                          />
                        </div>
                        <div>
                          <label className="text-gray-600 dark:text-gray-300 block">
                            Guardian&apos;s Relation
                          </label>
                          <InputText
                            value={getData(
                              "family_background",
                              "guardian_relation",
                            )}
                            disabled={true}
                            className={"transition-none"}
                          />
                        </div>
                        <div>
                          <label className="text-gray-600 dark:text-gray-300 block">
                            Guardian&apos;s Contact Number
                          </label>
                          <InputText
                            value={getData(
                              "family_background",
                              "guardian_contact_number",
                            )}
                            disabled={true}
                            className={"transition-none"}
                          />
                        </div>
                        <div>
                          <label className="text-gray-600 dark:text-gray-300 block">
                            Guardian&apos;s Email
                          </label>
                          <InputText
                            value={getData(
                              "family_background",
                              "guardian_email",
                            )}
                            disabled={true}
                            className={"transition-none"}
                          />
                        </div>
                      </>
                    )}
                  </div>
                </section>
              )}

            {/* Academic Background Section */}
            {!loading &&
              !error &&
              student &&
              student.academic_background.length > 0 && (
                <section>
                  <h2 className="text-gray-800 mb-4 text-2xl font-semibold dark:text-white">
                    Academic Background
                  </h2>
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                    <div>
                      <label className="text-gray-600 dark:text-gray-300 block">
                        Student Type
                      </label>
                      <InputText
                        value={getData("academic_background", "student_type")}
                        disabled={true}
                        className={"transition-none"}
                      />
                    </div>
                    <div>
                      <label className="text-gray-600 dark:text-gray-300 block">
                        Year Entry
                      </label>
                      <InputText
                        value={getData("academic_background", "year_entry")}
                        disabled={true}
                        className={"transition-none"}
                      />
                    </div>
                    <div>
                      <label className="text-gray-600 dark:text-gray-300 block">
                        Year Graduate
                      </label>
                      <InputText
                        value={getData("academic_background", "year_graduate")}
                        disabled={true}
                        className={"transition-none"}
                      />
                    </div>
                    <div>
                      <label className="text-gray-600 dark:text-gray-300 block">
                        Year Level
                      </label>
                      <InputText
                        value={getData("academic_background", "year_level")}
                        disabled={true}
                        className={"transition-none"}
                      />
                    </div>
                    <div>
                      <label className="text-gray-600 dark:text-gray-300 block">
                        Program
                      </label>
                      {/* Access Program from academic_background */}
                      <InputText
                        value={getData("academic_background", "program")}
                        disabled={true}
                        className={"transition-none"}
                      />
                    </div>
                    <div>
                      <label className="text-gray-600 dark:text-gray-300 block">
                        Semester Entry
                      </label>
                      <InputText
                        value={getData("academic_background", "semester_entry")}
                        disabled={true}
                        className={"transition-none"}
                      />
                    </div>
                    <div>
                      <label className="text-gray-600 dark:text-gray-300 block">
                        Application Type
                      </label>
                      <InputText
                        value={getData(
                          "academic_background",
                          "application_type",
                        )}
                        disabled={true}
                        className={"transition-none"}
                      />
                    </div>
                    <div>
                      <label className="text-gray-600 dark:text-gray-300 block">
                        Major In
                      </label>
                      <InputText
                        value={getData("academic_background", "major_in")}
                        disabled={true}
                        className={"transition-none"}
                      />
                    </div>
                  </div>
                </section>
              )}

            {/* Academic History Section */}
            {!loading &&
              !error &&
              student &&
              student.academic_history.length > 0 && (
                <section>
                  <h2 className="text-gray-800 mb-4 text-2xl font-semibold dark:text-white">
                    Academic History
                  </h2>
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                    {/* Elementary School */}
                    <div className="md:col-span-3">
                      <h3 className="text-gray-700 dark:text-gray-200 mb-2 text-xl font-semibold">
                        Elementary School
                      </h3>
                    </div>
                    <div>
                      <label className="text-gray-600 dark:text-gray-300 block">
                        School Name
                      </label>
                      <InputText
                        value={getData("academic_history", "elementary_school")}
                        disabled={true}
                        className={"transition-none"}
                      />
                    </div>
                    <div>
                      <label className="text-gray-600 dark:text-gray-300 block">
                        Address
                      </label>
                      <InputText
                        value={getData(
                          "academic_history",
                          "elementary_address",
                        )}
                        disabled={true}
                        className={"transition-none"}
                      />
                    </div>
                    <div>
                      <label className="text-gray-600 dark:text-gray-300 block">
                        Honors
                      </label>
                      <InputText
                        value={getData("academic_history", "elementary_honors")}
                        disabled={true}
                        className={"transition-none"}
                      />
                    </div>
                    <div>
                      <label className="text-gray-600 dark:text-gray-300 block">
                        Graduate Year
                      </label>
                      <InputText
                        value={getData(
                          "academic_history",
                          "elementary_graduate",
                        )}
                        disabled={true}
                        className={"transition-none"}
                      />
                    </div>

                    {/* Junior High School */}
                    <div className="md:col-span-3">
                      <h3 className="text-gray-700 dark:text-gray-200 mb-2 text-xl font-semibold">
                        Junior High School
                      </h3>
                    </div>
                    <div>
                      <label className="text-gray-600 dark:text-gray-300 block">
                        School Name
                      </label>
                      <InputText
                        value={getData("academic_history", "junior_highschool")}
                        disabled={true}
                        className={"transition-none"}
                      />
                    </div>
                    <div>
                      <label className="text-gray-600 dark:text-gray-300 block">
                        Address
                      </label>
                      <InputText
                        value={getData("academic_history", "junior_address")}
                        disabled={true}
                        className={"transition-none"}
                      />
                    </div>
                    <div>
                      <label className="text-gray-600 dark:text-gray-300 block">
                        Honors
                      </label>
                      <InputText
                        value={getData("academic_history", "junior_honors")}
                        disabled={true}
                        className={"transition-none"}
                      />
                    </div>
                    <div>
                      <label className="text-gray-600 dark:text-gray-300 block">
                        Graduate Year
                      </label>
                      <InputText
                        value={getData("academic_history", "junior_graduate")}
                        disabled={true}
                        className={"transition-none"}
                      />
                    </div>

                    {/* Senior High School */}
                    <div className="md:col-span-3">
                      <h3 className="text-gray-700 dark:text-gray-200 mb-2 text-xl font-semibold">
                        Senior High School
                      </h3>
                    </div>
                    <div>
                      <label className="text-gray-600 dark:text-gray-300 block">
                        School Name
                      </label>
                      <InputText
                        value={getData("academic_history", "senior_highschool")}
                        disabled={true}
                        className={"transition-none"}
                      />
                    </div>
                    <div>
                      <label className="text-gray-600 dark:text-gray-300 block">
                        Address
                      </label>
                      <InputText
                        value={getData("academic_history", "senior_address")}
                        disabled={true}
                        className={"transition-none"}
                      />
                    </div>
                    <div>
                      <label className="text-gray-600 dark:text-gray-300 block">
                        Honors
                      </label>
                      <InputText
                        value={getData("academic_history", "senior_honors")}
                        disabled={true}
                        className={"transition-none"}
                      />
                    </div>
                    <div>
                      <label className="text-gray-600 dark:text-gray-300 block">
                        Graduate Year
                      </label>
                      <InputText
                        value={getData("academic_history", "senior_graduate")}
                        disabled={true}
                        className={"transition-none"}
                      />
                    </div>

                    {/* NCAE Details */}
                    <div>
                      <label className="text-gray-600 dark:text-gray-300 block">
                        NCAE Grade
                      </label>
                      <InputText
                        value={getData("academic_history", "ncae_grade")}
                        disabled={true}
                        className={"transition-none"}
                      />
                    </div>
                    <div>
                      <label className="text-gray-600 dark:text-gray-300 block">
                        NCAE Year Taken
                      </label>
                      <InputText
                        value={getData("academic_history", "ncae_year_taken")}
                        disabled={true}
                        className={"transition-none"}
                      />
                    </div>

                    {/* College Details */}
                    <div className="md:col-span-3">
                      <h3 className="text-gray-700 dark:text-gray-200 mb-2 text-xl font-semibold">
                        College Details
                      </h3>
                    </div>
                    <div>
                      <label className="text-gray-600 dark:text-gray-300 block">
                        Latest College
                      </label>
                      <InputText
                        value={getData("academic_history", "latest_college")}
                        disabled={true}
                        className={"transition-none"}
                      />
                    </div>
                    <div>
                      <label className="text-gray-600 dark:text-gray-300 block">
                        College Address
                      </label>
                      <InputText
                        value={getData("academic_history", "college_address")}
                        disabled={true}
                        className={"transition-none"}
                      />
                    </div>
                    <div>
                      <label className="text-gray-600 dark:text-gray-300 block">
                        College Honors
                      </label>
                      <InputText
                        value={getData("academic_history", "college_honors")}
                        disabled={true}
                        className={"transition-none"}
                      />
                    </div>
                    <div>
                      <label className="text-gray-600 dark:text-gray-300 block">
                        Program
                      </label>
                      {/* Access Program from academic_history if necessary */}
                      <InputText
                        value={getData("academic_history", "program")}
                        disabled={true}
                        className={"transition-none"}
                      />
                    </div>
                  </div>
                </section>
              )}
          </div>
        </div>
      </div>
    </DefaultLayout>
  );
};

export default ViewEnrollmentApplicantPage;
