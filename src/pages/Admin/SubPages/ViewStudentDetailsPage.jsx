import { useParams } from "react-router-dom";
import { useEffect, useState, useContext } from "react";
import axios from "axios";
import DefaultLayout from "../../layout/DefaultLayout";
import { BreadcrumbResponsive } from "../../../components/reuseable/Breadcrumbs";
import { HasRole } from "../../../components/reuseable/HasRole";
import { AuthContext } from "../../../components/context/AuthContext";

const ViewStudentDetailsPage = () => {
  const { view_student_id, view_campus_id } = useParams();
  const [studentData, setStudentData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch student data
    axios
      .get("/students/get-student-by-id", {
        params: { student_id: view_student_id, campus_id: view_campus_id },
      })
      .then((response) => {
        setStudentData(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching student data:", error);
        setError("Failed to fetch student data.");
        setLoading(false);
      });
  }, [view_student_id, view_campus_id]);

  // Destructure studentData for easier access
  const { student_id, campus, student_personal_datum } = studentData || {};

  // Destructure nested student_personal_datum
  const {
    enrollmentType,
    applicant_id_for_online,
    status,
    firstName,
    middleName,
    lastName,
    suffix,
    gender,
    email,
    address,
    contactNumber,
    birthDate,
    civilStatus,
    citizenship,
    country,
    birthPlace,
    religion,
    addPersonalData,
    familyDetails,
    student_current_academicbackground,
    academicHistory,
    student_document, // Include student_document
  } = student_personal_datum || {};

  // Destructure campus information
  const { campusName, campusAddress } = campus || {};

  // Destructure academic background
  const {
    program,
    majorIn,
    studentType,
    applicationType,
    yearEntry,
    yearLevel,
    yearGraduate,
    semester_id,
    prospectus_id,
    semester,
  } = student_current_academicbackground || {};

  // Destructure program and department
  const { programCode, programDescription, department } = program || {};

  const { departmentName, departmentDean } = department || {};

  const { user } = useContext(AuthContext);

  const NavItems = [
    { to: "/", label: "Dashboard" },
    { to: "/enrollments/all-students", label: "All Students" },
    {
      label: "Student Details",
    },
  ];

  return (
    <DefaultLayout>
      <BreadcrumbResponsive
        pageName={
          !HasRole(user.role, "SuperAdmin")
            ? `Student Details (${user?.campusName})`
            : "Student Details (All Campuses)"
        }
        items={NavItems}
        ITEMS_TO_DISPLAY={3}
      />

      <div className="mx-auto max-w-6xl">
        {/* Loading State */}
        {loading && (
          <div className="flex h-screen items-center justify-center">
            <div className="text-xl">Loading...</div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="flex h-screen items-center justify-center">
            <div className="text-xl text-red-500">{error}</div>
          </div>
        )}

        {/* No Data State */}
        {!loading && !error && !studentData && (
          <div className="flex h-screen items-center justify-center">
            <div className="text-gray-500 text-xl">No data found.</div>
          </div>
        )}

        {/* Main Content */}
        {!loading && !error && studentData && (
          <>
            {/* Personal Information */}
            <div className="my-5 rounded-sm border border-stroke bg-white p-4 px-6 dark:border-strokedark dark:bg-boxdark">
              <section className="mb-6">
                <h2 className="mb-4 border-b pb-2 text-2xl font-semibold">
                  Personal Information
                </h2>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <div>
                    <p className="text-gray-700">
                      <span className="font-medium">Student ID:</span>{" "}
                      {student_id}
                    </p>
                    <p className="text-gray-700">
                      <span className="font-medium">Name:</span> {firstName}{" "}
                      {middleName ? `${middleName} ` : ""}
                      {lastName} {suffix || ""}
                    </p>
                    <p className="text-gray-700">
                      <span className="font-medium">Gender:</span> {gender}
                    </p>
                    <p className="text-gray-700">
                      <span className="font-medium">Email:</span> {email}
                    </p>
                    <p className="text-gray-700">
                      <span className="font-medium">Contact Number:</span>{" "}
                      {contactNumber}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-700">
                      <span className="font-medium">Address:</span> {address}
                    </p>
                    <p className="text-gray-700">
                      <span className="font-medium">Birth Date:</span>{" "}
                      {new Date(birthDate).toLocaleDateString()}
                    </p>
                    <p className="text-gray-700">
                      <span className="font-medium">Civil Status:</span>{" "}
                      {civilStatus}
                    </p>
                    <p className="text-gray-700">
                      <span className="font-medium">Citizenship:</span>{" "}
                      {citizenship}
                    </p>
                    <p className="text-gray-700">
                      <span className="font-medium">Country:</span> {country}
                    </p>
                    <p className="text-gray-700">
                      <span className="font-medium">Birth Place:</span>{" "}
                      {birthPlace}
                    </p>
                    <p className="text-gray-700">
                      <span className="font-medium">Religion:</span> {religion}
                    </p>
                  </div>
                </div>
              </section>

              {/* Additional Personal Data */}
              {addPersonalData && (
                <section className="mb-6">
                  <h2 className="mb-4 border-b pb-2 text-2xl font-semibold">
                    Additional Personal Data
                  </h2>
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <div>
                      <p className="text-gray-700">
                        <span className="font-medium">City Address:</span>{" "}
                        {addPersonalData.cityAddress}
                      </p>
                      <p className="text-gray-700">
                        <span className="font-medium">City Tel Number:</span>{" "}
                        {addPersonalData.cityTelNumber}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-700">
                        <span className="font-medium">Province Address:</span>{" "}
                        {addPersonalData.provinceAddress}
                      </p>
                      <p className="text-gray-700">
                        <span className="font-medium">
                          Province Tel Number:
                        </span>{" "}
                        {addPersonalData.provinceTelNumber}
                      </p>
                    </div>
                  </div>
                </section>
              )}

              {/* Family Details */}
              {familyDetails && (
                <section className="mb-6">
                  <h2 className="mb-4 border-b pb-2 text-2xl font-semibold">
                    Family Details
                  </h2>
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    {/* Father Details */}
                    <div>
                      <h3 className="mb-2 text-xl font-medium">Father</h3>
                      {familyDetails.fatherFirstName ? (
                        <>
                          <p className="text-gray-700">
                            <span className="font-medium">Name:</span>{" "}
                            {familyDetails.fatherFirstName}{" "}
                            {familyDetails.fatherMiddleName
                              ? `${familyDetails.fatherMiddleName} `
                              : ""}
                            {familyDetails.fatherLastName}
                          </p>
                          <p className="text-gray-700">
                            <span className="font-medium">Address:</span>{" "}
                            {familyDetails.fatherAddress}
                          </p>
                          <p className="text-gray-700">
                            <span className="font-medium">Occupation:</span>{" "}
                            {familyDetails.fatherOccupation}
                          </p>
                          <p className="text-gray-700">
                            <span className="font-medium">Contact Number:</span>{" "}
                            {familyDetails.fatherContactNumber}
                          </p>
                          <p className="text-gray-700">
                            <span className="font-medium">Company Name:</span>{" "}
                            {familyDetails.fatherCompanyName}
                          </p>
                          <p className="text-gray-700">
                            <span className="font-medium">
                              Company Address:
                            </span>{" "}
                            {familyDetails.fatherCompanyAddress}
                          </p>
                          <p className="text-gray-700">
                            <span className="font-medium">Email:</span>{" "}
                            {familyDetails.fatherEmail}
                          </p>
                          <p className="text-gray-700">
                            <span className="font-medium">Income:</span>{" "}
                            {familyDetails.fatherIncome}
                          </p>
                        </>
                      ) : (
                        <p className="text-gray-700">
                          No father details available.
                        </p>
                      )}
                    </div>

                    {/* Mother Details */}
                    <div>
                      <h3 className="mb-2 text-xl font-medium">Mother</h3>
                      {familyDetails.motherFirstName ? (
                        <>
                          <p className="text-gray-700">
                            <span className="font-medium">Name:</span>{" "}
                            {familyDetails.motherFirstName}{" "}
                            {familyDetails.motherMiddleName
                              ? `${familyDetails.motherMiddleName} `
                              : ""}
                            {familyDetails.motherLastName}
                          </p>
                          <p className="text-gray-700">
                            <span className="font-medium">Address:</span>{" "}
                            {familyDetails.motherAddress}
                          </p>
                          <p className="text-gray-700">
                            <span className="font-medium">Occupation:</span>{" "}
                            {familyDetails.motherOccupation}
                          </p>
                          <p className="text-gray-700">
                            <span className="font-medium">Contact Number:</span>{" "}
                            {familyDetails.motherContactNumber}
                          </p>
                          <p className="text-gray-700">
                            <span className="font-medium">Company Name:</span>{" "}
                            {familyDetails.motherCompanyName}
                          </p>
                          <p className="text-gray-700">
                            <span className="font-medium">
                              Company Address:
                            </span>{" "}
                            {familyDetails.motherCompanyAddress}
                          </p>
                          <p className="text-gray-700">
                            <span className="font-medium">Email:</span>{" "}
                            {familyDetails.motherEmail}
                          </p>
                          <p className="text-gray-700">
                            <span className="font-medium">Income:</span>{" "}
                            {familyDetails.motherIncome}
                          </p>
                        </>
                      ) : (
                        <p className="text-gray-700">
                          No mother details available.
                        </p>
                      )}
                    </div>
                  </div>
                </section>
              )}

              {/* Academic Background */}
              {student_current_academicbackground && (
                <section className="mb-6">
                  <h2 className="mb-4 border-b pb-2 text-2xl font-semibold">
                    Academic Background
                  </h2>
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <div>
                      <p className="text-gray-700">
                        <span className="font-medium">Program Code:</span>{" "}
                        {programCode}
                      </p>
                      <p className="text-gray-700">
                        <span className="font-medium">
                          Program Description:
                        </span>{" "}
                        {programDescription}
                      </p>
                      <p className="text-gray-700">
                        <span className="font-medium">Department:</span>{" "}
                        {departmentName}
                      </p>
                      <p className="text-gray-700">
                        <span className="font-medium">Department Dean:</span>{" "}
                        {departmentDean}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-700">
                        <span className="font-medium">Student Type:</span>{" "}
                        {studentType}
                      </p>
                      <p className="text-gray-700">
                        <span className="font-medium">Application Type:</span>{" "}
                        {applicationType}
                      </p>
                      <p className="text-gray-700">
                        <span className="font-medium">Year of Entry:</span>{" "}
                        {yearEntry}
                      </p>
                      <p className="text-gray-700">
                        <span className="font-medium">Year Level:</span>{" "}
                        {yearLevel}
                      </p>
                      <p className="text-gray-700">
                        <span className="font-medium">
                          Expected Graduation:
                        </span>{" "}
                        {yearGraduate}
                      </p>
                      <p className="text-gray-700">
                        <span className="font-medium">Prospectus ID:</span>{" "}
                        {prospectus_id}
                      </p>
                      {majorIn && (
                        <p className="text-gray-700">
                          <span className="font-medium">Major In:</span>{" "}
                          {majorIn}
                        </p>
                      )}
                    </div>

                    {/* Semester Information */}
                    {semester && (
                      <div className="mt-6 md:col-span-2">
                        <h3 className="mb-4 text-xl font-semibold">
                          Semester Information
                        </h3>
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                          <p className="text-gray-700">
                            <span className="font-medium">Semester Name:</span>{" "}
                            {semester.semesterName}
                          </p>
                          <p className="text-gray-700">
                            <span className="font-medium">School Year:</span>{" "}
                            {semester.schoolYear}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </section>
              )}

              {/* Academic History */}
              {academicHistory && (
                <section className="mb-6">
                  <h2 className="mb-4 border-b pb-2 text-2xl font-semibold">
                    Academic History
                  </h2>
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    {/* Elementary School */}
                    <div>
                      <h3 className="mb-2 text-xl font-medium">
                        Elementary School
                      </h3>
                      <p className="text-gray-700">
                        <span className="font-medium">School Name:</span>{" "}
                        {academicHistory.elementarySchool}
                      </p>
                      <p className="text-gray-700">
                        <span className="font-medium">Address:</span>{" "}
                        {academicHistory.elementaryAddress}
                      </p>
                      {academicHistory.elementaryHonors && (
                        <p className="text-gray-700">
                          <span className="font-medium">Honors:</span>{" "}
                          {academicHistory.elementaryHonors}
                        </p>
                      )}
                      {academicHistory.elementaryGraduate && (
                        <p className="text-gray-700">
                          <span className="font-medium">Year Graduated:</span>{" "}
                          {academicHistory.elementaryGraduate}
                        </p>
                      )}
                    </div>

                    {/* Secondary School */}
                    <div>
                      <h3 className="mb-2 text-xl font-medium">
                        Secondary School
                      </h3>
                      <p className="text-gray-700">
                        <span className="font-medium">School Name:</span>{" "}
                        {academicHistory.secondarySchool}
                      </p>
                      <p className="text-gray-700">
                        <span className="font-medium">Address:</span>{" "}
                        {academicHistory.secondaryAddress}
                      </p>
                      {academicHistory.secondaryHonors && (
                        <p className="text-gray-700">
                          <span className="font-medium">Honors:</span>{" "}
                          {academicHistory.secondaryHonors}
                        </p>
                      )}
                      {academicHistory.secondaryGraduate && (
                        <p className="text-gray-700">
                          <span className="font-medium">Year Graduated:</span>{" "}
                          {academicHistory.secondaryGraduate}
                        </p>
                      )}
                    </div>

                    {/* Senior High School */}
                    {academicHistory.seniorHighSchool && (
                      <div>
                        <h3 className="mb-2 text-xl font-medium">
                          Senior High School
                        </h3>
                        <p className="text-gray-700">
                          <span className="font-medium">School Name:</span>{" "}
                          {academicHistory.seniorHighSchool}
                        </p>
                        <p className="text-gray-700">
                          <span className="font-medium">Address:</span>{" "}
                          {academicHistory.seniorHighAddress}
                        </p>
                        {academicHistory.seniorHighHonors && (
                          <p className="text-gray-700">
                            <span className="font-medium">Honors:</span>{" "}
                            {academicHistory.seniorHighHonors}
                          </p>
                        )}
                        {academicHistory.seniorHighSchoolGraduate && (
                          <p className="text-gray-700">
                            <span className="font-medium">Year Graduated:</span>{" "}
                            {academicHistory.seniorHighSchoolGraduate}
                          </p>
                        )}
                      </div>
                    )}

                    {/* NCAE */}
                    {academicHistory.ncae_grade &&
                      academicHistory.ncae_year_taken && (
                        <div>
                          <h3 className="mb-2 text-xl font-medium">NCAE</h3>
                          <p className="text-gray-700">
                            <span className="font-medium">Grade:</span>{" "}
                            {academicHistory.ncae_grade}
                          </p>
                          <p className="text-gray-700">
                            <span className="font-medium">Year Taken:</span>{" "}
                            {academicHistory.ncae_year_taken}
                          </p>
                        </div>
                      )}

                    {/* Latest College */}
                    {academicHistory.latest_college && (
                      <div>
                        <h3 className="mb-2 text-xl font-medium">
                          Latest College
                        </h3>
                        <p className="text-gray-700">
                          <span className="font-medium">College Name:</span>{" "}
                          {academicHistory.latest_college}
                        </p>
                        <p className="text-gray-700">
                          <span className="font-medium">Address:</span>{" "}
                          {academicHistory.college_address}
                        </p>
                        {academicHistory.college_honors && (
                          <p className="text-gray-700">
                            <span className="font-medium">Honors:</span>{" "}
                            {academicHistory.college_honors}
                          </p>
                        )}
                        {academicHistory.program && (
                          <p className="text-gray-700">
                            <span className="font-medium">Program:</span>{" "}
                            {academicHistory.program}
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                </section>
              )}

              {/* Documents Information */}
              {student_document && (
                <section className="mb-6">
                  <h2 className="mb-4 border-b pb-2 text-2xl font-semibold">
                    Documents Information
                  </h2>
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <p className="text-gray-700">
                      <span className="font-medium">Form 167:</span>{" "}
                      {student_document.form_167
                        ? "Submitted"
                        : "Not Submitted"}
                    </p>
                    <p className="text-gray-700">
                      <span className="font-medium">
                        Certificate of Good Moral:
                      </span>{" "}
                      {student_document.certificate_of_good_moral
                        ? "Submitted"
                        : "Not Submitted"}
                    </p>
                    <p className="text-gray-700">
                      <span className="font-medium">
                        Transcript of Records:
                      </span>{" "}
                      {student_document.transcript_of_records
                        ? "Submitted"
                        : "Not Submitted"}
                    </p>
                    <p className="text-gray-700">
                      <span className="font-medium">
                        NSO Birth Certificate:
                      </span>{" "}
                      {student_document.nso_birth_certificate
                        ? "Submitted"
                        : "Not Submitted"}
                    </p>
                    <p className="text-gray-700">
                      <span className="font-medium">2x2 ID Photo:</span>{" "}
                      {student_document.two_by_two_id_photo
                        ? "Submitted"
                        : "Not Submitted"}
                    </p>
                    <p className="text-gray-700">
                      <span className="font-medium">
                        Certificate of Transfer Credential:
                      </span>{" "}
                      {student_document.certificate_of_transfer_credential
                        ? "Submitted"
                        : "Not Submitted"}
                    </p>
                  </div>
                </section>
              )}
            </div>

            {/* Campus Information */}
            <div className="mb-8 rounded-lg bg-white p-6 shadow-md">
              <section>
                <h2 className="mb-4 border-b pb-2 text-2xl font-semibold">
                  Campus Information
                </h2>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <div>
                    <p className="text-gray-700">
                      <span className="font-medium">Campus Name:</span>{" "}
                      {campusName}
                    </p>
                    <p className="text-gray-700">
                      <span className="font-medium">Campus Address:</span>{" "}
                      {campusAddress}
                    </p>
                  </div>
                  {/* Add more campus-related details here if available */}
                </div>
              </section>
            </div>
          </>
        )}
      </div>
    </DefaultLayout>
  );
};

export default ViewStudentDetailsPage;
