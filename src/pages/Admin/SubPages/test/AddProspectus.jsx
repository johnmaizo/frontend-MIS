import { useState } from "react";
import axios from "axios";

const ProspectusForm = () => {
  const [prospectusData, setProspectusData] = useState([
    {
      campus_id: "",
      prospectus_id: "",
      yearLevel: "",
      subjectCode: [""],
      preRequisite: [{ prospectus_subject_id: "", subjectCode: [""] }],
    },
  ]);

  // Function to handle form input changes
  const handleInputChange = (index, field, value) => {
    const updatedData = [...prospectusData];
    updatedData[index][field] = value;
    setProspectusData(updatedData);
  };

  // Function to handle subject code changes
  const handleSubjectCodeChange = (index, subIndex, value) => {
    const updatedData = [...prospectusData];
    updatedData[index].subjectCode[subIndex] = value;
    setProspectusData(updatedData);
  };

  // Function to handle prerequisite changes
  const handlePreRequisiteChange = (index, preIndex, field, value) => {
    const updatedData = [...prospectusData];
    updatedData[index].preRequisite[preIndex][field] = value;
    setProspectusData(updatedData);
  };

  // Function to handle prerequisite subject code changes
  const handlePreRequisiteSubjectCodeChange = (
    index,
    preIndex,
    subIndex,
    value,
  ) => {
    const updatedData = [...prospectusData];
    updatedData[index].preRequisite[preIndex].subjectCode[subIndex] = value;
    setProspectusData(updatedData);
  };

  // Function to add a new prospectus subject
  const addNewProspectusSubject = () => {
    setProspectusData([
      ...prospectusData,
      {
        campus_id: "",
        prospectus_id: "",
        yearLevel: "",
        subjectCode: [""],
        preRequisite: [{ prospectus_subject_id: "", subjectCode: [""] }],
      },
    ]);
  };

  // Function to add a new prerequisite to a specific subject
  const addNewPreRequisite = (index) => {
    const updatedData = [...prospectusData];
    updatedData[index].preRequisite.push({
      prospectus_subject_id: "",
      subjectCode: [""],
    });
    setProspectusData(updatedData);
  };

  // Function to add a new subject code
  const addNewSubjectCode = (index) => {
    const updatedData = [...prospectusData];
    updatedData[index].subjectCode.push("");
    setProspectusData(updatedData);
  };

  // Function to add a new prerequisite subject code
  const addNewPreRequisiteSubjectCode = (index, preIndex) => {
    const updatedData = [...prospectusData];
    updatedData[index].preRequisite[preIndex].subjectCode.push("");
    setProspectusData(updatedData);
  };

  // Function to submit the form data to the server
  const handleSubmit = async () => {
    try {
      const response = await axios.post("/api/prospectus", prospectusData);
      console.log("Success:", response.data);
      alert("Prospectus subjects added successfully!");
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred while adding the prospectus subjects.");
    }
  };

  return (
    <div>
      <h2>Add Prospectus Subjects</h2>
      {prospectusData.map((prospectus, index) => (
        <div
          key={index}
          className="prospectus-section mb-5 bg-gray p-3 !text-black"
        >
          <h3 className="text-xl font-semibold">
            Prospectus Subject {index + 1}
          </h3>
          <label>
            Campus ID:
            <input
              type="text"
              value={prospectus.campus_id}
              onChange={(e) =>
                handleInputChange(index, "campus_id", e.target.value)
              }
              className="p-2"
            />
          </label>
          <label>
            Prospectus ID:
            <input
              type="text"
              value={prospectus.prospectus_id}
              onChange={(e) =>
                handleInputChange(index, "prospectus_id", e.target.value)
              }
              className="p-2"
            />
          </label>
          <label>
            Year Level:
            <input
              type="text"
              value={prospectus.yearLevel}
              onChange={(e) =>
                handleInputChange(index, "yearLevel", e.target.value)
              }
              className="p-2"
            />
          </label>

          <h4>Subjects</h4>
          {prospectus.subjectCode.map((code, subIndex) => (
            <input
              key={subIndex}
              type="text"
              placeholder="Subject Code"
              value={code}
              onChange={(e) =>
                handleSubjectCodeChange(index, subIndex, e.target.value)
              }
            />
          ))}
          <button type="button" onClick={() => addNewSubjectCode(index)}>
            Add Subject Code
          </button>

          <h4>PreRequisites</h4>
          {prospectus.preRequisite.map((preReq, preIndex) => (
            <div key={preIndex}>
              <label>
                Prospectus Subject ID:
                <input
                  type="text"
                  value={preReq.prospectus_subject_id}
                  onChange={(e) =>
                    handlePreRequisiteChange(
                      index,
                      preIndex,
                      "prospectus_subject_id",
                      e.target.value,
                    )
                  }
                />
              </label>
              {preReq.subjectCode.map((code, subIndex) => (
                <input
                  key={subIndex}
                  type="text"
                  placeholder="Prerequisite Subject Code"
                  value={code}
                  onChange={(e) =>
                    handlePreRequisiteSubjectCodeChange(
                      index,
                      preIndex,
                      subIndex,
                      e.target.value,
                    )
                  }
                />
              ))}
              <button
                type="button"
                onClick={() => addNewPreRequisiteSubjectCode(index, preIndex)}
                className="mx-4 rounded bg-blue-600 p-1 text-white hover:bg-blue-700"
              >
                Add Prerequisite Subject Code
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => addNewPreRequisite(index)}
            className="my-3 rounded bg-blue-600 p-1 text-white hover:bg-blue-700"
          >
            Add New Prerequisite
          </button>
        </div>
      ))}

      <button
        type="button"
        onClick={addNewProspectusSubject}
        className="mx-5 rounded bg-blue-600 p-2 text-white hover:bg-blue-700"
      >
        Add New Prospectus Subject
      </button>

      <button
        type="button"
        onClick={handleSubmit}
        disabled
        className="mb-5 rounded bg-green-600 p-2 text-white hover:bg-green-700"
      >
        Submit
      </button>
    </div>
  );
};

export default ProspectusForm;
