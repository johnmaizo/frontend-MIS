import { defineStepper } from "@stepperize/react";
import React, { useState, useEffect } from "react";
import { Button } from "../../../../components/ui/button";
import { Separator } from "../../../../components/ui/separator";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "../../../../components/ui/form";

import ApplicantComponent from "./components/ApplicantComponent";
import PersonalDataComponent from "./components/PersonalDataComponent";
import AddPersonalDataComponent from "./components/AddPersonalDataComponent";
import FamilyDetailsComponent from "./components/FamilyDetailsComponent";
import AcademicBackgroundComponent from "./components/AcademicBackgroundComponent";
import AcademicHistoryComponent from "./components/AcademicHistoryComponent";
import DocumentsComponent from "./components/DocumentsComponent";
import CompleteComponent from "./components/CompleteComponent";

// Import axios and toast
import axios from "axios";
import { toast } from "react-hot-toast";
import {
  academicBackgroundSchema,
  academicHistorySchema,
  addPersonalDataSchema,
  applicantSchema,
  documentsSchema,
  familyDetailsSchema,
  personalDataSchema,
} from "../../../../components/schema";

const { useStepper, steps } = defineStepper(
  { id: "applicant", label: "Applicant", schema: applicantSchema },
  { id: "personalData", label: "Personal Data", schema: personalDataSchema },
  {
    id: "addPersonalData",
    label: "Add Personal Data",
    schema: addPersonalDataSchema,
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
  { id: "complete", label: "Complete", schema: z.object({}) },
);

const EnrollmentFormPage = () => {
  const stepper = useStepper();
  const [formData, setFormData] = useState({
    applicant: {},
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
    const updatedFormData = {
      ...formData,
      [stepper.current.id]: {
        ...formData[stepper.current.id],
        ...values,
      },
    };

    if (stepper.isLast) {
      setLocalLoading(true);
      setGeneralError("");

      // Combine all form data into a single object
      const dataToSubmit = {
        ...updatedFormData,
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

      try {
        const response = await toast.promise(
          axios.post("/enrollments/submit-application", transformedData),
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
          // Reset form and stepper
          stepper.reset();
          form.reset();
          setFormData({
            applicant: {},
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
      setFormData(updatedFormData);
      stepper.next();
    }
  };

  const validateAndNavigate = async (stepId, index) => {
    if (index < stepper.current.index) {
      // Allow moving back to previous steps without validation
      stepper.goTo(stepId);
      return;
    }

    // Prevent skipping by only allowing navigation to the next step
    const isValid = await form.trigger();
    if (isValid && index === stepper.current.index) {
      stepper.goTo(stepId); // Navigate to the next step only if validation passes and it's the current step
    } else {
      console.log("Validation failed or trying to skip steps.");
    }
  };

  const handleReset = () => {
    stepper.reset();
    form.reset();
    setFormData({
      applicant: {},
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
      <h3>Enrollment Form:</h3>
      {generalError && (
        <div className="font-medium text-red-600">{generalError}</div>
      )}
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-6 rounded-lg border p-6"
        >
          <div className="flex justify-between">
            <h2 className="text-lg font-medium">Application</h2>
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground text-sm">
                Step {stepper.current.index + 1} of {steps.length}
              </span>
            </div>
          </div>
          <nav aria-label="Application Steps" className="group my-4">
            <ol
              className="flex items-center justify-between gap-2"
              aria-orientation="horizontal"
            >
              {stepper.all.map((step, index, array) => (
                <React.Fragment key={step.id}>
                  <li className="flex flex-shrink-0 items-center gap-4">
                    <Button
                      type="button"
                      role="tab"
                      variant={
                        index <= stepper.current.index ? "default" : "secondary"
                      }
                      aria-current={
                        stepper.current.id === step.id ? "step" : undefined
                      }
                      aria-posinset={index + 1}
                      aria-setsize={steps.length}
                      aria-selected={stepper.current.id === step.id}
                      disabled={index > stepper.current.index} // Disable future steps to prevent skipping
                      className={`flex items-center justify-center p-10 ${
                        index <= stepper.current.index
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
                        index < stepper.current.index
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
              {!stepper.isLast ? (
                <>
                  <Button
                    variant="secondary"
                    onClick={stepper.prev}
                    disabled={stepper.isFirst}
                  >
                    Back
                  </Button>
                  <Button type="submit" disabled={localLoading}>
                    {stepper.isLast ? "Complete" : "Next"}
                  </Button>
                </>
              ) : (
                <Button onClick={handleReset}>Reset</Button>
              )}
            </div>
            {stepper.switch({
              applicant: () => <ApplicantComponent />,
              personalData: () => <PersonalDataComponent />,
              addPersonalData: () => <AddPersonalDataComponent />,
              familyDetails: () => <FamilyDetailsComponent />,
              academicBackground: () => <AcademicBackgroundComponent />,
              academicHistory: () => <AcademicHistoryComponent />,
              documents: () => <DocumentsComponent />,
              complete: () => <CompleteComponent formData={formData} />,
            })}
          </div>
        </form>
      </Form>
    </div>
  );
};

export default EnrollmentFormPage;
