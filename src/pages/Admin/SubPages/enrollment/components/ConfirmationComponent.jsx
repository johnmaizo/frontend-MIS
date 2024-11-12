/* eslint-disable react/prop-types */

const ConfirmationComponent = ({ formData }) => {
  const labels = {
    campus_id: "Campus ID",
    enrollmentType: "Enrollment Type",
    firstName: "First Name",
    lastName: "Last Name",
    suffix: "Suffix",
    middleName: "Middle Name",
    gender: "Gender",
    email: "Email",
    birthPlace: "Birth Place",
    religion: "Religion",
    contactNumber: "Contact Number",
    address: "Address",
    birthDate: "Birth Date",
    civilStatus: "Civil Status",
    citizenship: "Citizenship",
    country: "Country",
    cityAddress: "City Address",
    cityTelNumber: "City Telephone Number",
    provinceAddress: "Province Address",
    provinceTelNumber: "Province Telephone Number",
    fatherFirstName: "Father's FirstName",
    fatherMiddleName: "Father's MiddleName",
    fatherLastName: "Father's LastName",
    fatherAddress: "Father's Address",
    fatherOccupation: "Father's Occupation",
    fatherContactNumber: "Father's Contact Number",
    fatherCompanyName: "Father's Company Name",
    fatherCompanyAddress: "Father's Company Address",
    fatherEmail: "Father's Email Address",
    fatherIncome: "Father's Income",
    motherFirstName: "Mother's FirstName",
    motherMiddleName: "Mother's MiddleName",
    motherLastName: "Mother's LastName",
    motherAddress: "Mother's Address",
    motherOccupation: "Mother's Occupation",
    motherContactNumber: "Mother's Contact Number",
    motherCompanyName: "Mother's Company Name",
    motherCompanyAddress: "Mother's Company Address",
    motherEmail: "Mother's Email Address",
    motherIncome: "Mother's Income",
    guardianFirstName: "Guardian's FirstName",
    guardianMiddleName: "Guardian's MiddleName",
    guardianLastName: "Guardian's LastName",
    guardianRelation: "Guardian's Relation",
    guardianContactNumber: "Guardian's Contact Number",
    majorIn: "Major In",
    studentType: "Student Type",
    applicationType: "Application Type",
    yearLevel: "Year Level",
    program_id: "Program ID",
    prospectus_id: "Prospectus ID",
    semester_id: "Semester ID",
    yearEntry: "Year Entry",
    yearGraduate: "Year Graduate",
    elementarySchool: "Elementary School",
    elementaryAddress: "Elementary Address",
    elementaryHonors: "Elementary Honors",
    elementaryGraduate: "Elementary Graduate",
    secondarySchool: "Secondary School",
    secondaryAddress: "Secondary Address",
    secondaryHonors: "Secondary Honors",
    secondaryGraduate: "Secondary Graduate",
    seniorHighSchool: "Senior High School",
    seniorHighAddress: "Senior High Address",
    seniorHighHonors: "Senior High Honors",
    seniorHighSchoolGraduate: "Senior High School Graduate",
    ncae_grade: "NCAE Grade",
    ncae_year_taken: "NCAE Year Taken",
    latest_college: "Latest College",
    college_address: "College Address",
    college_honors: "College Honors",
    program: "Program",
    form_167: "Form 167",
    certificate_of_good_moral: "Certificate of Good Moral",
    transcript_of_records: "Transcript of Records",
    nso_birth_certificate: "NSO Birth Certificate",
    two_by_two_id_photo: "2x2 ID Photo",
    certificate_of_transfer_credential: "Certificate of Transfer Credential",
  };

  const fatherDetails = Object.fromEntries(
    Object.entries(formData.familyDetails).filter(([key]) =>
      key.startsWith("father"),
    ),
  );

  const motherDetails = Object.fromEntries(
    Object.entries(formData.familyDetails).filter(([key]) =>
      key.startsWith("mother"),
    ),
  );

  const guardianDetails = Object.fromEntries(
    Object.entries(formData.familyDetails).filter(([key]) =>
      key.startsWith("guardian"),
    ),
  );

  return (
    <div className="text-gray-700 my-5 space-y-4 rounded-lg border border-stroke bg-white p-4 px-6 dark:border-strokedark dark:bg-boxdark">
      <h3 className="text-3xl font-semibold">Confirmation</h3>

      {/* Grid container */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* Left column */}
        <div className="space-y-8">
          {/* Personal Data */}
          <div className="rounded-lg bg-white p-6 shadow-md dark:bg-boxdark">
            <h3 className="mb-4 border-b pb-2 text-2xl font-semibold">
              Personal Data
            </h3>
            <ul>
              {Object.entries(formData.personalData).map(([key, value]) => (
                <li key={key}>
                  <strong className={`text-gray-700 font-medium ${labels[key] === "Campus ID" ? "sr-only" : ""}`}>
                    {labels[key] || key}:{" "}
                  </strong>{" "}
                  {labels[key] === "Campus ID" ? "" : value}
                </li>
              ))}
              {Object.entries(formData.addPersonalData).map(([key, value]) => (
                <li key={key}>
                  <strong className="text-gray-700 font-medium">
                    {labels[key] || key}:{" "}
                  </strong>{" "}
                  {value}
                </li>
              ))}
            </ul>
          </div>

          {/* Family Details */}
          <div className="rounded-lg bg-white p-6 shadow-md dark:bg-boxdark">
            <h3 className="mb-4 border-b pb-2 text-2xl font-semibold">
              Family Details
            </h3>

            {/* Grid for Father's and Guardian's Details */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {/* Left column */}
              <div className="space-y-4">
                {/* Father's Details */}
                <div className="mb-4">
                  <h4 className="text-xl font-semibold">
                    Father&apos;s Details
                  </h4>
                  <ul>
                    {Object.entries(fatherDetails).map(([key, value]) => (
                      <li key={key}>
                        <strong className="text-gray-700 font-medium">
                          {labels[key] || key}:{" "}
                        </strong>{" "}
                        {value}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Guardian's Details */}
                <div className="mb-4">
                  <h4 className="text-xl font-semibold">
                    Guardian&apos;s Details
                  </h4>
                  <ul>
                    {Object.entries(guardianDetails).map(([key, value]) => (
                      <li key={key}>
                        <strong className="text-gray-700 font-medium">
                          {labels[key] || key}:{" "}
                        </strong>{" "}
                        {value}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Right column */}
              <div className="space-y-4">
                {/* Mother's Details */}
                <div className="mb-4">
                  <h4 className="text-xl font-semibold">
                    Mother&apos;s Details
                  </h4>
                  <ul>
                    {Object.entries(motherDetails).map(([key, value]) => (
                      <li key={key}>
                        <strong className="text-gray-700 font-medium">
                          {labels[key] || key}:{" "}
                        </strong>{" "}
                        {value}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right column */}
        <div className="space-y-8">
          {/* Academic Background */}
          <div className="rounded-lg bg-white p-6 shadow-md dark:bg-boxdark">
            <h3 className="mb-4 border-b pb-2 text-2xl font-semibold">
              Academic Background
            </h3>
            <ul>
              {Object.entries(formData.academicBackground).map(
                ([key, value]) => (
                  <li key={key}>
                    <strong className="text-gray-700 font-medium">
                      {labels[key] || key}:{" "}
                    </strong>{" "}
                    {value}
                  </li>
                ),
              )}
            </ul>
          </div>

          {/* Academic History */}
          <div className="rounded-lg bg-white p-6 shadow-md dark:bg-boxdark">
            <h3 className="mb-4 border-b pb-2 text-2xl font-semibold">
              Academic History
            </h3>
            <ul>
              {Object.entries(formData.academicHistory).map(([key, value]) => (
                <li key={key}>
                  <strong className="text-gray-700 font-medium">
                    {labels[key] || key}:{" "}
                  </strong>{" "}
                  {value}
                </li>
              ))}
            </ul>
          </div>

          {/* Documents */}
          <div className="rounded-lg bg-white p-6 shadow-md dark:bg-boxdark">
            <h3 className="mb-4 border-b pb-2 text-2xl font-semibold">
              Documents
            </h3>
            <ul>
              {Object.entries(formData.documents).map(([key, value]) => (
                <li key={key}>
                  <strong className="text-gray-700 font-medium">
                    {labels[key] || key}:{" "}
                  </strong>{" "}
                  {value ? "Yes" : "No"}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationComponent;
