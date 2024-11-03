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
import ConfirmationComponent from "./components/ConfirmationComponent"; // Import the confirmation component

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

const { useStepper, steps } = defineStepper(
  {
    id: "personalData",
    label: "Personal Data",
    schema: combinedPersonalDataSchema,
  },
  { id: "familyDetails", label: "Family Details", schema: familyDetailsSchema },
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
  { id: "confirmation", label: "Confirmation", schema: z.object({}) }, // Add confirmation step with empty schema
);

const EnrollmentFormPage = () => {
  const { fetchCampusActive, fetchProgramActive, fetchSemesters } = useSchool();

  const navigate = useNavigate();

  useEffect(() => {
    fetchCampusActive();
    fetchProgramActive();
    fetchSemesters();
  }, []);

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

  useEffect(() => {
    console.log("Final form data:", formData);
  }, [formData]);

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
    } else if (stepper.current.id === "confirmation") {
      setLocalLoading(true);
      setGeneralError("");

      // Combine all form data into a single object
      const dataToSubmit = {
        ...formData,
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
          // Reset form and stepper

          // Redirect after 3 seconds
          setTimeout(() => {
            if (response.data.student_personal_id) {
              navigate(
                `/enrollments/subject-enlistment/${response.data.student_personal_id}`,
              );
            } else {
              // Handle the case where student_personal_id is still undefined
              toast.error(
                "Student Personal ID is missing. Please contact support.",
                {
                  position: "bottom-right",
                  duration: 5000,
                },
              );
            }
          }, 3000);

          stepper.reset();
          form.reset();
          setFormData({
            personalData: {},
            addPersonalData: {},
            familyDetails: {},
            academicBackground: {},
            academicHistory: {},
            documents: {},
          });
        }
        setLocalLoading(false);
      } catch (err) {
        if (err.response && err.response.data && err.response.data.message) {
          setGeneralError(err.response.data.message);
        } else {
          setGeneralError("An unexpected error occurred. Please try again.");
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
    const stepsToShow = stepper.all.filter(
      (step) => step.id !== "confirmation",
    );
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

  const handleReset = () => {
    stepper.reset();
    form.reset();
    setFormData({
      personalData: {},
      addPersonalData: {},
      familyDetails: {},
      academicBackground: {},
      academicHistory: {},
      documents: {},
    });
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
                Step {Math.min(stepper.current.index + 1, steps.length - 1)} of{" "}
                {steps.length - 1}
              </span>
            </div>
          </div>
          <nav aria-label="Application Steps" className="group my-4">
            <ol
              className="flex items-center justify-between gap-2"
              aria-orientation="horizontal"
            >
              {stepper.all
                .filter((step) => step.id !== "confirmation")
                .map((step, index, array) => (
                  <React.Fragment key={step.id}>
                    <li className="flex flex-shrink-0 items-center gap-4">
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
                        aria-setsize={steps.length - 1}
                        aria-selected={stepper.current.id === step.id}
                        disabled={
                          stepper.all.findIndex(
                            (s) => s.id === stepper.current.id,
                          ) < stepper.all.findIndex((s) => s.id === step.id)
                        } // Disable future steps to prevent skipping
                        className={`flex items-center justify-center p-10 ${
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
              <Button
                variant="secondary"
                onClick={stepper.prev}
                disabled={stepper.isFirst}
              >
                Back
              </Button>
              <Button type="submit" disabled={localLoading}>
                {stepper.current.id === "confirmation" ? "Complete" : "Next"}
              </Button>
            </div>
            {stepper.switch({
              personalData: () => <PersonalDataComponent />,
              familyDetails: () => <FamilyDetailsComponent />,
              academicBackground: () => <AcademicBackgroundComponent />,
              academicHistory: () => <AcademicHistoryComponent />,
              documents: () => <DocumentsComponent />,
              confirmation: () => <ConfirmationComponent formData={formData} />, // Render the confirmation component
            })}
          </div>
        </form>
      </Form>
    </div>
  );
};

export default EnrollmentFormPage;
