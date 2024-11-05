import { useParams } from "react-router-dom";
import { useEffect, useState, useContext } from "react";
import axios from "axios";
import DefaultLayout from "../../layout/DefaultLayout";
import EnrollmentFormPage from "./enrollment/EnrollmentFormPage";
import { BreadcrumbResponsive } from "../../../components/reuseable/Breadcrumbs";
import { HasRole } from "../../../components/reuseable/HasRole";
import { AuthContext } from "../../../components/context/AuthContext";

const UpdateStudentInfoPage = () => {
  const { user } = useContext(AuthContext);

  const { update_student_id, update_campus_id } = useParams();
  const [studentData, setStudentData] = useState(null);
  const [loading, setLoading] = useState(true); // Initialize loading to true
  const [error, setError] = useState(null); // Initialize error to null

  useEffect(() => {
    // Utility function to sanitize data
    const sanitizeData = (data) => {
      // Replace null with undefined for optional string fields
      const sanitizedPersonalData = {
        ...data.student_personal_datum,
        middleName: data.student_personal_datum.middleName ?? undefined,
        suffix: data.student_personal_datum.suffix ?? undefined,
        ACR: data.student_personal_datum.ACR ?? undefined,
      };

      // Provide default documents if missing
      const defaultDocuments = {
        form_167: false,
        certificate_of_good_moral: false,
        transcript_of_records: false,
        nso_birth_certificate: false,
        two_by_two_id_photo: false,
        certificate_of_transfer_credential: false,
      };

      return {
        student_id: data.student_id, // Include student_id at the top level
        personalData: sanitizedPersonalData,
        addPersonalData: data.student_personal_datum.addPersonalData || {},
        familyDetails: data.student_personal_datum.familyDetails || {},
        academicBackground:
          data.student_personal_datum.student_current_academicbackground || {},
        academicHistory: data.student_personal_datum.academicHistory || {},
        documents:
          data.student_personal_datum.student_document || defaultDocuments,
      };
    };

    // Fetch student data
    axios
      .get("/students/get-student-by-id", {
        params: { student_id: update_student_id, campus_id: update_campus_id },
      })
      .then((response) => {
        const data = response.data;
        const initialData = sanitizeData(data);
        setStudentData(initialData);
        setLoading(false); // Data fetched successfully
      })
      .catch((error) => {
        console.error("Error fetching student data:", error);
        setError("Failed to fetch student data.");
        setLoading(false); // Stop loading on error
      });
  }, [update_student_id, update_campus_id]);

  const NavItems = [
    { to: "/", label: "Dashboard" },
    { to: "/enrollments/all-students", label: "All Students" },
    {
      label: "Update Student", // New breadcrumb item
    },
  ];

  return (
    <DefaultLayout>
      <BreadcrumbResponsive
        pageName={
          !HasRole(user.role, "SuperAdmin")
            ? `Update Student (${user?.campusName})`
            : "Update Student (All Campuses)"
        }
        items={NavItems}
        ITEMS_TO_DISPLAY={3}
      />

      <div className="my-5 rounded-sm border border-stroke bg-white p-4 px-6 dark:border-strokedark dark:bg-boxdark">
        {/* Loading State */}
        {loading && (
          <div className="flex h-64 items-center justify-center">
            {/* Tailwind CSS Spinner */}
            <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-t-2 border-blue-500"></div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="flex h-64 items-center justify-center">
            <p className="text-lg text-red-500">{error}</p>
          </div>
        )}

        {/* Main Content */}
        {!loading && !error && studentData && (
          <EnrollmentFormPage
            initialData={studentData}
            isUpdate={true} // Pass the isUpdate prop
          />
        )}

        {/* No Data State */}
        {!loading && !error && !studentData && (
          <div className="flex h-64 items-center justify-center">
            <p className="text-gray-500 text-lg">No data found.</p>
          </div>
        )}
      </div>
    </DefaultLayout>
  );
};

export default UpdateStudentInfoPage;
