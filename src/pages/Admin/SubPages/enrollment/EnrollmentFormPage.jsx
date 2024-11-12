/* eslint-disable react/prop-types */
/* eslint-disable react-hooks/exhaustive-deps */
import { defineStepper } from "@stepperize/react";
import React, { useState, useEffect } from "react";
import { Button } from "../../../../components/ui/button";
import { Separator } from "../../../../components/ui/separator";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "../../../../components/ui/form";

import { useNavigate } from "react-router-dom";

import PersonalDataComponent from "./components/PersonalDataComponent";
import FamilyDetailsComponent from "./components/FamilyDetailsComponent";
import AcademicBackgroundComponent from "./components/AcademicBackgroundComponent";
import AcademicHistoryComponent from "./components/AcademicHistoryComponent";
import DocumentsComponent from "./components/DocumentsComponent";
import ConfirmationComponent from "./components/ConfirmationComponent";

import axios from "axios";
import { toast } from "react-hot-toast";
import {
  combinedPersonalDataSchema,
  academicBackgroundSchema,
  academicHistorySchema,
  documentsSchema,
  familyDetailsSchema,
} from "../../../../components/schema";
import { useSchool } from "../../../../components/context/SchoolContext";

const EnrollmentFormPage = ({ initialData = {}, isUpdate = false }) => {
  const { fetchCampusActive, fetchProgramActive, fetchSemesters } = useSchool();

  const navigate = useNavigate();

  useEffect(() => {
    fetchCampusActive();
    fetchProgramActive();
    fetchSemesters();
  }, []);

  // Define steps conditionally based on isUpdate
  const stepsDefinition = [
    {
      id: "personalData",
      label: "Personal Data",
      schema: combinedPersonalDataSchema,
    },
    {
      id: "familyDetails",
      label: "Family Details",
      schema: familyDetailsSchema,
    },
    {
      id: "academicBackground",
      label: "Academic Background",
      schema: academicBackgroundSchema,
    },
    {
      id: "academicHistory",
      label: "Academic History",
      schema: academicHistorySchema,
    },
    { id: "documents", label: "Documents", schema: documentsSchema },
  ];

  // Include confirmation step only if not updating
  if (!isUpdate) {
    stepsDefinition.push({
      id: "confirmation",
      label: "Confirmation",
      schema: z.object({}),
    });
  }

  const { useStepper, steps } = defineStepper(...stepsDefinition);

  const stepper = useStepper();
  const [formData, setFormData] = useState({
    personalData: {},
    addPersonalData: {},
    familyDetails: {},
    academicBackground: {},
    academicHistory: {},
    documents: {},
  });

  const [localLoading, setLocalLoading] = useState(false);
  const [generalError, setGeneralError] = useState("");
  const [success, setSuccess] = useState(false);

  const form = useForm({
    mode: "onTouched",
    resolver: zodResolver(stepper.current.schema),
  });

  // Set initial form data if available
  useEffect(() => {
    if (initialData && Object.keys(initialData).length > 0) {
      // Map initialData to formData structure
      setFormData({
        personalData: initialData.personalData || {},
        addPersonalData: initialData.addPersonalData || {},
        familyDetails: initialData.familyDetails || {},
        academicBackground: initialData.academicBackground || {},
        academicHistory: initialData.academicHistory || {},
        documents: initialData.documents || {},
      });

      // Also set form values
      form.reset({
        student_id: initialData.student_id || "", // Include student_id
        ...initialData.personalData,
        ...initialData.addPersonalData,
        ...initialData.familyDetails,
        ...initialData.academicBackground,
        ...initialData.academicHistory,
        ...initialData.documents,
      });
    }
  }, [initialData]);

  const onSubmit = async (values) => {
    if (stepper.current.id === "personalData") {
      const {
        cityAddress,
        cityTelNumber,
        provinceAddress,
        provinceTelNumber,
        ...personalDataValues
      } = values;

      const updatedFormData = {
        ...formData,
        personalData: {
          ...formData.personalData,
          ...personalDataValues,
        },
        addPersonalData: {
          ...formData.addPersonalData,
          cityAddress,
          cityTelNumber,
          provinceAddress,
          provinceTelNumber,
        },
      };

      setFormData(updatedFormData);
      stepper.next();
    } else if (
      stepper.isLast ||
      (isUpdate && stepper.current.id === steps[steps.length - 1].id)
    ) {
      // If it's the last step or update mode
      setLocalLoading(true);
      setGeneralError("");

      // Combine all form data into a single object
      const dataToSubmit = {
        ...formData,
        [stepper.current.id]: values,
      };

      // Transform data: trim strings and replace empty strings with null
      const transformedData = {};
      for (const [sectionKey, sectionValue] of Object.entries(dataToSubmit)) {
        transformedData[sectionKey] = {};
        for (const [key, value] of Object.entries(sectionValue)) {
          if (typeof value === "string") {
            transformedData[sectionKey][key] =
              value.trim() === "" ? null : value.trim();
          } else {
            transformedData[sectionKey][key] = value;
          }
        }
      }

      console.log("transformedData: ", transformedData);

      try {
        if (isUpdate) {
          // Call update API
          const response = await toast.promise(
            axios.put("/students/update-student", transformedData),
            {
              loading: "Updating Student Information...",
              success: "Student information updated successfully!",
              error: "Failed to update student information.",
            },
            {
              position: "bottom-right",
              duration: 5000,
            },
          );

          if (response.data) {
            navigate("/all-students");
          }
        } else {
          // Call enrollment API
          const response = await toast.promise(
            axios.post("/enrollment/submit-application", transformedData),
            {
              loading: "Submitting Application...",
              success: "Application submitted successfully!",
              error: "Failed to submit application.",
            },
            {
              position: "bottom-right",
              duration: 5000,
            },
          );

          if (response.data) {
            setSuccess(true);
            toast.success(response.data.message, {
              position: "bottom-right",
              duration: 5000,
            });

            // Redirect after 3 seconds
            setTimeout(() => {
              if (response.data.student_personal_id) {
                navigate(
                  `/enrollments/subject-enlistment/${response.data.student_personal_id}`,
                );
              } else {
                // Handle the case where student_personal_id is undefined
                toast.error(
                  "Student Personal ID is missing. Please contact support.",
                  {
                    position: "bottom-right",
                    duration: 5000,
                  },
                );
              }
            }, 3000);
          }
        }
        setLocalLoading(false);
      } catch (err) {
        if (err.response && err.response.data && err.response.data.reason) {
          setGeneralError(
            `Failed to submit application: ${err.response.data.reason}`,
          );
          toast.error(
            `${err.response.data.reason}`,
            {
              position: "bottom-right",
              duration: 5000,
            },
          );
        } else if (
          err.response &&
          err.response.data &&
          err.response.data.message
        ) {
          setGeneralError(
            `Failed to submit application: ${err.response.data.message}`,
          );
          toast.error(
            `Failed to submit application: ${err.response.data.message}`,
            {
              position: "bottom-right",
              duration: 5000,
            },
          );
        } else {
          setGeneralError("An unexpected error occurred. Please try again.");
          toast.error("An unexpected error occurred. Please try again.", {
            position: "bottom-right",
            duration: 5000,
          });
        }
        setLocalLoading(false);
      }
    } else {
      const updatedFormData = {
        ...formData,
        [stepper.current.id]: {
          ...formData[stepper.current.id],
          ...values,
        },
      };
      setFormData(updatedFormData);
      stepper.next();
    }
  };

  const validateAndNavigate = async (stepId, index) => {
    const stepsToShow = isUpdate
      ? stepper.all
      : stepper.all.filter((step) => step.id !== "confirmation");
    const currentIndex = stepsToShow.findIndex(
      (step) => step.id === stepper.current.id,
    );
    if (index < currentIndex) {
      // Allow moving back to previous steps without validation
      stepper.goTo(stepId);
      return;
    }

    // Prevent skipping by only allowing navigation to the next step
    const isValid = await form.trigger();
    if (isValid && index === currentIndex) {
      stepper.goTo(stepId); // Navigate to the next step only if validation passes and it's the current step
    } else {
      console.log("Validation failed or trying to skip steps.");
    }
  };

  return (
    <div>
      {generalError && (
        <div className="font-medium text-red-600">{generalError}</div>
      )}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 p-3">
          <div className="flex justify-end">
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground text-sm">
                Step {Math.min(stepper.current.index + 1, steps.length)} of{" "}
                {steps.length}
              </span>
            </div>
          </div>
          <nav aria-label="Application Steps" className="group my-4">
            <ol
              className="flex items-center justify-between gap-2"
              aria-orientation="horizontal"
            >
              {stepper.all
                .filter((step) => isUpdate || step.id !== "confirmation")
                .map((step, index, array) => (
                  <React.Fragment key={step.id}>
                    <li className="flex flex-shrink-0 items-center gap-4">
                      <div
                        className={`${stepper.current.id !== step.id ? "hidden md:flex" : "flex"} w-full justify-center md:justify-start`}
                      >
                        <Button
                          type="button"
                          role="tab"
                          variant={
                            stepper.all.findIndex(
                              (s) => s.id === stepper.current.id,
                            ) >= stepper.all.findIndex((s) => s.id === step.id)
                              ? "default"
                              : "secondary"
                          }
                          aria-current={
                            stepper.current.id === step.id ? "step" : undefined
                          }
                          aria-posinset={index + 1}
                          aria-setsize={steps.length}
                          aria-selected={stepper.current.id === step.id}
                          disabled={
                            stepper.all.findIndex(
                              (s) => s.id === stepper.current.id,
                            ) < stepper.all.findIndex((s) => s.id === step.id)
                          } // Disable future steps to prevent skipping
                          className={`// Base mobile size // Medium screen adjustments // Larger screen adjustments flex items-center justify-center p-4 text-sm md:p-6 md:text-base lg:p-8 lg:text-lg ${
                            stepper.all.findIndex(
                              (s) => s.id === stepper.current.id,
                            ) >= stepper.all.findIndex((s) => s.id === step.id)
                              ? "!border-primary !bg-primary !text-white hover:!bg-primary"
                              : ""
                          }`}
                          onClick={() => validateAndNavigate(step.id, index)}
                        >
                          {step.label}
                        </Button>
                      </div>
                    </li>

                    {index < array.length - 1 && (
                      <Separator
                        className={`h-[3px] flex-1 ${
                          stepper.all.findIndex(
                            (s) => s.id === stepper.current.id,
                          ) > stepper.all.findIndex((s) => s.id === step.id)
                            ? "bg-blue-500"
                            : "bg-slate-500"
                        }`}
                      />
                    )}
                  </React.Fragment>
                ))}
            </ol>
          </nav>
          <div className="space-y-4">
            <div className="flex justify-end gap-4">
              <input
                type="button"
                value="Back"
                onClick={stepper.prev}
                disabled={stepper.isFirst}
                className="inline-block cursor-pointer rounded bg-black px-3 text-sm font-medium text-white"
              />
              <Button type="submit" disabled={localLoading}>
                {isUpdate
                  ? stepper.isLast
                    ? "Update"
                    : "Next"
                  : stepper.current.id === "confirmation"
                    ? "Complete"
                    : "Next"}
              </Button>
            </div>
            {stepper.switch({
              personalData: () => <PersonalDataComponent isUpdate={isUpdate} />,
              familyDetails: () => <FamilyDetailsComponent />,
              academicBackground: () => <AcademicBackgroundComponent />,
              academicHistory: () => <AcademicHistoryComponent />,
              documents: () => <DocumentsComponent />,
              confirmation: () =>
                !isUpdate && <ConfirmationComponent formData={formData} />,
            })}
          </div>
        </form>
      </Form>
    </div>
  );
};

export default EnrollmentFormPage;
