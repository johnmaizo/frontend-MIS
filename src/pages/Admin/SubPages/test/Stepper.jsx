/* eslint-disable react/prop-types */
import { defineStepper } from "@stepperize/react";
import { Input } from "../../../../components/ui/input";
import React, { useState, useEffect } from "react";
import { Button } from "../../../../components/ui/button";
import { Separator } from "../../../../components/ui/separator";
import { z } from "zod";
import { useForm, useFormContext } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod"; // Import the zod resolver
import { Form } from "../../../../components/ui/form";
import { paymentSchema, shippingSchema } from "../../../../components/schema";

const { useStepper, steps } = defineStepper(
  { id: "shipping", label: "Shipping", schema: shippingSchema },
  { id: "payment", label: "Payment", schema: paymentSchema },
  { id: "complete", label: "Complete", schema: z.object({}) },
);

const Stepper = () => {
  const stepper = useStepper();
  const [formData, setFormData] = useState({ shipping: {}, payment: {} }); // State with nested objects for each step

  const form = useForm({
    mode: "onTouched",
    resolver: zodResolver(stepper.current.schema), // Use Zod resolver here
  });

  useEffect(() => {
    console.log("Final form data:", formData);
  }, [formData]);

  const onSubmit = (values) => {
    setFormData((prevData) => ({
      ...prevData,
      [stepper.current.id]: { ...prevData[stepper.current.id], ...values },
    }));

    console.log(`Form values for step ${stepper.current.id}:`, values);

    if (stepper.isLast) {
      console.log("Submitting final form data:", formData);
      stepper.reset(); // Reset the stepper
      form.reset(); // Reset the form fields
      setFormData({ shipping: {}, payment: {} }); // Clear the accumulated form data
    } else {
      stepper.next();
    }
  };

  const handleReset = () => {
    stepper.reset(); // Reset the stepper to the first step
    form.reset(); // Reset the form fields
    setFormData({ shipping: {}, payment: {} }); // Clear the form data
  };

  return (
    <div>
      <h3>Stepper:</h3>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-6 rounded-lg border p-6"
        >
          <div className="flex justify-between">
            <h2 className="text-lg font-medium">Checkout</h2>
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground text-sm">
                Step {stepper.current.index + 1} of {steps.length}
              </span>
            </div>
          </div>
          <nav aria-label="Checkout Steps" className="group my-4">
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
                      className={`flex items-center justify-center p-10 ${index <= stepper.current.index ? "!border-primary !bg-primary !text-white hover:!bg-primary" : ""}`}
                      onClick={() => stepper.goTo(step.id)}
                    >
                      {/* {index + 1} */}
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
                  <Button type="submit">
                    {stepper.isLast ? "Complete" : "Next"}
                  </Button>
                </>
              ) : (
                <Button onClick={handleReset}>Reset</Button> // Use handleReset to reset both the stepper and form
              )}
            </div>
            {stepper.switch({
              shipping: () => <ShippingComponent />,
              payment: () => <PaymentComponent />,
              complete: () => <CompleteComponent formData={formData} />, // Pass formData to CompleteComponent
            })}
          </div>
        </form>
      </Form>
    </div>
  );
};

function ShippingComponent() {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  return (
    <div className="space-y-4 text-start">
      <div className="space-y-2">
        <label
          htmlFor={register("address").name}
          className="block text-sm font-medium text-primary"
        >
          Address
        </label>
        <Input
          id={register("address").name}
          {...register("address")}
          className="block w-full rounded-md border p-2"
        />
        {errors.address && (
          <span className="text-sm font-medium text-red-600">
            {errors.address.message}
          </span>
        )}
      </div>
      <div className="space-y-2">
        <label
          htmlFor={register("city").name}
          className="block text-sm font-medium text-primary"
        >
          City
        </label>
        <Input
          id={register("city").name}
          {...register("city")}
          className="block w-full rounded-md border p-2"
        />
        {errors.city && (
          <span className="text-sm font-medium text-red-600">
            {errors.city.message}
          </span>
        )}
      </div>
      <div className="space-y-2">
        <label
          htmlFor={register("postalCode").name}
          className="block text-sm font-medium text-primary"
        >
          Postal Code
        </label>
        <Input
          id={register("postalCode").name}
          {...register("postalCode")}
          className="block w-full rounded-md border p-2"
        />
        {errors.postalCode && (
          <span className="text-sm font-medium text-red-600">
            {errors.postalCode.message}
          </span>
        )}
      </div>
    </div>
  );
}

function PaymentComponent() {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  return (
    <div className="space-y-4 text-start">
      <div className="space-y-2">
        <label
          htmlFor={register("cardNumber").name}
          className="block text-sm font-medium text-primary"
        >
          Card Number
        </label>
        <Input
          id={register("cardNumber").name}
          {...register("cardNumber")}
          className="block w-full rounded-md border p-2"
        />
        {errors.cardNumber && (
          <span className="text-sm font-medium text-red-600">
            {errors.cardNumber.message}
          </span>
        )}
      </div>
      <div className="space-y-2">
        <label
          htmlFor={register("expirationDate").name}
          className="block text-sm font-medium text-primary"
        >
          Expiration Date
        </label>
        <Input
          id={register("expirationDate").name}
          {...register("expirationDate")}
          className="block w-full rounded-md border p-2"
        />
        {errors.expirationDate && (
          <span className="text-sm font-medium text-red-600">
            {errors.expirationDate.message}
          </span>
        )}
      </div>
      <div className="space-y-2">
        <label
          htmlFor={register("cvv").name}
          className="block text-sm font-medium text-primary"
        >
          CVV
        </label>
        <Input
          id={register("cvv").name}
          {...register("cvv")}
          className="block w-full rounded-md border p-2"
        />
        {errors.cvv && (
          <span className="text-sm font-medium text-red-600">
            {errors.cvv.message}
          </span>
        )}
      </div>
    </div>
  );
}

function CompleteComponent({ formData }) {
  return (
    <div className="space-y-4 text-center">
      <h3 className="text-lg font-medium">Order Summary</h3>
      <div className="text-left">
        <h4 className="font-semibold">Shipping Information</h4>
        <p>
          <strong>Address:</strong> {formData.shipping.address || "N/A"}
        </p>
        <p>
          <strong>City:</strong> {formData.shipping.city || "N/A"}
        </p>
        <p>
          <strong>Postal Code:</strong> {formData.shipping.postalCode || "N/A"}
        </p>
      </div>
      <div className="text-left">
        <h4 className="font-semibold">Payment Information</h4>
        <p>
          <strong>Card Number:</strong> {formData.payment.cardNumber || "N/A"}
        </p>
        <p>
          <strong>Expiration Date:</strong>{" "}
          {formData.payment.expirationDate || "N/A"}
        </p>
        <p>
          <strong>CVV:</strong> {formData.payment.cvv || "N/A"}
        </p>
      </div>
      <p>Thank you! Your order is complete.</p>
    </div>
  );
}

export default Stepper;
