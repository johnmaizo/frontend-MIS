import { z } from "zod";

export const shippingSchema = z.object({
  address: z.string().min(1, "Address is required"),
  city: z.string().min(1, "City is required"),
  // Validate as a number but ensure it is an integer and 4 digits long
  postalCode: z.preprocess(
    (val) => Number(val),
    z.number().int().gte(1000).lte(9999),
  ),
});

// Define the payment schema
export const paymentSchema = z.object({
  cardNumber: z.string().min(16, "Card number is required"),
  expirationDate: z.string().min(5, "Expiration date is required"),
  cvv: z.string().min(3, "CVV is required"),
});
