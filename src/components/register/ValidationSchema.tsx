import { z } from "zod";

const MAX_IMAGE_SIZE = 4 * 1024 * 1024; // 4MB

const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

export const POSTAL_CODE_RULES: Record<
  string,
  {
    regex: RegExp;
    message: string;
    format: (raw: string) => string;
    inputMode: "text" | "numeric";
  }
> = {
  Canada: {
    regex: /^[A-Za-z]\d[A-Za-z][ ]?\d[A-Za-z]\d$/,
    message: "Enter a valid Canadian postal code (e.g. A1A 1A1)",
    inputMode: "text",
    format: (raw) => {
      let v = raw
        .toUpperCase()
        .replace(/[^A-Z0-9]/g, "")
        .slice(0, 6);
      if (v.length > 3) v = `${v.slice(0, 3)} ${v.slice(3)}`;
      return v;
    },
  },
  Nigeria: {
    regex: /^\d{6}$/,
    message: "Enter a valid Nigerian postal code (6 digits)",
    inputMode: "numeric",
    format: (raw) => raw.replace(/[^0-9]/g, "").slice(0, 6),
  },
  "United States": {
    regex: /^\d{5}(-\d{4})?$/,
    message: "Enter a valid ZIP code (e.g. 12345 or 12345-6789)",
    inputMode: "numeric",
    format: (raw) => {
      let v = raw.replace(/[^0-9]/g, "").slice(0, 9);
      if (v.length > 5) v = `${v.slice(0, 5)}-${v.slice(5)}`;
      return v;
    },
  },
};
export const signupSchema = z
  .object({
    firstname: z.string().min(1, "First name is required"),
    lastname: z.string().min(1, "Last name is required"),
    othername: z.string().optional(),
    email: z.string().email("Invalid email address"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    sex: z.enum(["MALE", "FEMALE"]),
    companyName: z.string().optional(),
    image: z
      .instanceof(File)
      .refine(
        (file) => ACCEPTED_IMAGE_TYPES.includes(file.type),
        "Only .jpg, .jpeg, .png, and .webp formats are supported",
      )
      .refine((file) => file.size <= MAX_IMAGE_SIZE, "Max file size is 4MB"),

    streetNumber: z.string().min(1, "Street number is required"),
    street: z.string().min(1, "Street name is required"),
    city: z.string().min(1, "City is required"),
    postalCode: z.string().min(1, "Postal code is required"),
    countryName: z.string().optional(),

    countryId: z.string().uuid("Please select a valid country"),

    stateId: z.string().uuid("Please select a valid state"),
  })
  .superRefine((data, ctx) => {
    const rule = data.countryName
      ? POSTAL_CODE_RULES[data.countryName]
      : undefined;
    if (rule && !rule.regex.test(data.postalCode)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: rule.message,
        path: ["postalCode"],
      });
    }
  });

export type SignUpType = z.infer<typeof signupSchema>;

export const updateProfileSchema = z
  .object({
    firstname: z.string().min(1, "First name is required"),
    lastname: z.string().min(1, "Last name is required"),
    othername: z.string().optional(),
    sex: z.enum(["MALE", "FEMALE"]),
    companyName: z.string().optional(),
    image: z
      .instanceof(File)
      .refine(
        (file) => ACCEPTED_IMAGE_TYPES.includes(file.type),
        "Only .jpg, .jpeg, .png, and .webp formats are supported",
      )
      .refine((file) => file.size <= MAX_IMAGE_SIZE, "Max file size is 4MB")
      .optional(),

    streetNumber: z.string().min(1, "Street number is required"),
    street: z.string().min(1, "Street name is required"),
    city: z.string().min(1, "City is required"),
    postalCode: z.string().min(1, "Postal code is required"),
    countryName: z.string().optional(),
    countryId: z.string().uuid("Please select a valid country"),

    stateId: z.string().uuid("Please select a valid state"),
  })
  .superRefine((data, ctx) => {
    const rule = data.countryName
      ? POSTAL_CODE_RULES[data.countryName]
      : undefined;

    if (rule && !rule.regex.test(data.postalCode)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["postalCode"],
        message: rule.message,
      });
    }
  });

export type UpdateProfileType = z.infer<typeof updateProfileSchema>;

export const experienceSchema = z.object({
  name: z.string().min(1, "Work engagement name is required"),
  address: z.string().min(1, "Address is required"),
  title: z.string().min(1, "Job title is required"),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().min(1, "End date is required"),
});

export const publicationSchema = z.object({
  publisher: z.string().min(1, "Publisher is required"),
  title: z.string().min(1, "Title is required"),
  authorList: z.string().min(1, "Author list is required"),
  pages: z.string().min(1, "Pages are required"),
  publicationYear: z
    .number({ invalid_type_error: "Year must be a number" })
    .min(1900)
    .max(new Date().getFullYear()),
});

export const referenceSchema = z.object({
  name: z.string().min(1, "Reference name is required"),
});

const dataSchema = z.object({
  experiences: z
    .array(experienceSchema)
    .min(1, "At least one experience required"),
  publications: z.array(publicationSchema).optional(),
  references: z.array(referenceSchema).optional(),
  files: z.array(z.instanceof(File)).optional(),
});

export type UserExperience = z.infer<typeof dataSchema>;
export default dataSchema;
