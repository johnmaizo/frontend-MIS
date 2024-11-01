/* eslint-disable react/prop-types */

const ConfirmationComponent = ({ formData }) => {
  return (
    <div className="space-y-4 text-start">
      <h2 className="text-lg font-medium">Confirmation</h2>

      {/* Personal Data */}
      <div>
        <h3 className="text-md font-medium">Personal Data</h3>
        <ul>
          {Object.entries(formData.personalData).map(([key, value]) => (
            <li key={key}>
              <strong>{key}: </strong> {value}
            </li>
          ))}
          {Object.entries(formData.addPersonalData).map(([key, value]) => (
            <li key={key}>
              <strong>{key}: </strong> {value}
            </li>
          ))}
        </ul>
      </div>

      {/* Family Details */}
      <div>
        <h3 className="text-md font-medium">Family Details</h3>
        <ul>
          {Object.entries(formData.familyDetails).map(([key, value]) => (
            <li key={key}>
              <strong>{key}: </strong> {value}
            </li>
          ))}
        </ul>
      </div>

      {/* Academic Background */}
      <div>
        <h3 className="text-md font-medium">Academic Background</h3>
        <ul>
          {Object.entries(formData.academicBackground).map(([key, value]) => (
            <li key={key}>
              <strong>{key}: </strong> {value}
            </li>
          ))}
        </ul>
      </div>

      {/* Academic History */}
      <div>
        <h3 className="text-md font-medium">Academic History</h3>
        <ul>
          {Object.entries(formData.academicHistory).map(([key, value]) => (
            <li key={key}>
              <strong>{key}: </strong> {value}
            </li>
          ))}
        </ul>
      </div>

      {/* Documents */}
      <div>
        <h3 className="text-md font-medium">Documents</h3>
        <ul>
          {Object.entries(formData.documents).map(([key, value]) => (
            <li key={key}>
              <strong>{key}: </strong> {value ? "Yes" : "No"}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ConfirmationComponent;
