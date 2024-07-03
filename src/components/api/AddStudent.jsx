import React from "react";
import { useForm } from "react-hook-form";
// import { addStudent } from '../../axios/services/student/studentService';
import "./addstudentstyle.css";
import axios from "axios";

const AddStudent = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();
  const [error, setError] = React.useState("");
  const [success, setSuccess] = React.useState(false);

  const onSubmit = async (data) => {
    // Transform form data to replace empty strings with null
    const transformedData = Object.fromEntries(
      Object.entries(data).map(([key, value]) => [
        key,
        value === "" ? null : value,
      ]),
    );

    setError("");
    try {
      // const response = await addStudent(transformedData);
      const response = await axios.post(
        "/students/add-student",
        transformedData,
      );
      if (response.data) {
        setSuccess(true);
      }
    } catch (err) {
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
    }
  };

  React.useEffect(() => {
    if (success) {
      setTimeout(() => {
        setSuccess(false);
        reset();
      }, 5000);
    } else if (error) {
      setTimeout(() => {
        setError("");
      }, 6000);
    }
  }, [success, error, reset]);

  const validateBirthDate = (value) => {
    const birthYear = new Date(value).getFullYear();
    const currentYear = new Date().getFullYear();
    return birthYear >= 1900 && birthYear < currentYear;
  };

  return (
    <div className="add-student-container">
      <h2>Add New Student</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        {/* <div className="form-group">
          <label>Student ID:</label>
          <input
            type="text"
            {...register("student_id", {
              required: { value: true, message: "Student ID is required" },
            })}
          />
          {errors.student_id && <span>{errors.student_id.message}</span>}
        </div> */}
        <div className="form-group">
          <label>First Name:</label>
          <input
            type="text"
            {...register("firstName", {
              required: { value: true, message: "First name is required" },
            })}
          />
          {errors.firstName && <span>{errors.firstName.message}</span>}
        </div>
        <div className="form-group">
          <label>Middle Name:</label>
          <input type="text" {...register("middleName")} />
        </div>
        <div className="form-group">
          <label>Last Name:</label>
          <input
            type="text"
            {...register("lastName", {
              required: { value: true, message: "Last name is required" },
            })}
          />
          {errors.lastName && <span>{errors.lastName.message}</span>}
        </div>
        <div className="form-group">
          <label>Gender:</label>
          <input
            type="text"
            {...register("gender", {
              required: { value: true, message: "Gender is required" },
            })}
          />
          {errors.gender && <span>{errors.gender.message}</span>}
        </div>
        <div className="form-group">
          <label>Civil Status:</label>
          <input
            type="text"
            {...register("civilStatus", {
              required: { value: true, message: "Civil status is required" },
            })}
          />
          {errors.civilStatus && <span>{errors.civilStatus.message}</span>}
        </div>
        <div className="form-group">
          <label>Birth Date:</label>
          <input
            type="date"
            {...register("birthDate", {
              required: { value: true, message: "Birth date is required" },
              validate: {
                validYear: (value) =>
                  validateBirthDate(value) ||
                  "Invalid birth date. Please enter a valid year between 1900 and the current year.",
              },
            })}
          />
          {errors.birthDate && <span>{errors.birthDate.message}</span>}
        </div>
        <div className="form-group">
          <label>Birth Place:</label>
          <input
            type="text"
            {...register("birthPlace", {
              required: { value: true, message: "Birth place is required" },
            })}
          />
          {errors.birthPlace && <span>{errors.birthPlace.message}</span>}
        </div>
        <div className="form-group">
          <label>Religion:</label>
          <input
            type="text"
            {...register("religion", {
              required: { value: true, message: "Religion is required" },
            })}
          />
          {errors.religion && <span>{errors.religion.message}</span>}
        </div>
        <div className="form-group">
          <label>Citizenship:</label>
          <input
            type="text"
            {...register("citizenship", {
              required: { value: true, message: "Citizenship is required" },
            })}
          />
          {errors.citizenship && <span>{errors.citizenship.message}</span>}
        </div>
        <div className="form-group">
          <label>Country:</label>
          <input
            type="text"
            {...register("country", {
              required: { value: true, message: "Country is required" },
            })}
          />
          {errors.country && <span>{errors.country.message}</span>}
        </div>
        <div className="form-group">
          <label>ACR:</label>
          <input type="text" {...register("ACR")} />
        </div>
        <button
          type="submit"
          className="my-2 mb-6 bg-primary p-3 font-semibold text-white"
          disabled={success}
        >
          Add Student
        </button>
      </form>

      {error && <div className="error-message">{error}</div>}
      {success && (
        <div className="success-message">Student added successfully!</div>
      )}
    </div>
  );
};

export default AddStudent;
