import { z } from "zod";

export const basicConsumer = z.object({
  firstname: z.string().min(2, "Please insert your first name"),
  lastname: z.string().min(2, "Please insert your last name"),
  othername: z.string().min(2, "Please insert your other name"),
  companyName: z.string().optional(),
  email: z.string().email("Please insert a valid email"),
  streetNumber: z.string().min(1, "Please insert your street number"),
  streetName: z.string().min(2, "Please insert your street name"),
  city: z.string().min(2, "Please insert your city"),
  countryName: z.string().min(2, "Please insert your country name"),
  provinceName: z.string().min(2, "Please insert your province name"),

  postalCode: z
    .union([
      z.string().min(1, "Enter the Postal code"),
      z.number({ invalid_type_error: "Postal code must be a number" }),
    ])
    .transform((val) => val.toString()),
  sex: z.enum(["MALE", "FEMALE"]),
});
export type TbasicConsumer = z.infer<typeof basicConsumer>;

export const utility = z.object({
  commodity: z.string().nonempty("Please select Commodity"),
});

export type Tutility = z.infer<typeof utility>;
