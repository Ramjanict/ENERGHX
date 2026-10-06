import { z } from "zod";

const checklistItemSchema = z.object({
  key: z.string().min(1),
  label: z.string().min(1),
  status: z.string().min(1, "Status is required"),
  validatedBy: z.string(),
  associateId: z.string().nullable(),
  role: z.string(),
});

const riskItemSchema = z.object({
  key: z.string().min(1),
  label: z.string().min(1),
  status: z.string().min(1, "Status is required"),
});

export const resValidationFormSchema = z.object({
  validatedBy: z.string().min(1, "Validated by is required"),
  associateId: z.string().min(1, "Associate ID is required"),
  validatorRole: z.string().min(1, "Validator role is required"),
  readinessScore: z.coerce
    .number({ invalid_type_error: "Readiness score must be a number" })
    .min(0, "Cannot be negative")
    .max(100, "Cannot exceed 100"),
  renewableCoverage: z.coerce
    .number({ invalid_type_error: "Renewable coverage must be a number" })
    .min(0, "Cannot be negative")
    .max(100, "Cannot exceed 100"),
  annualSavings: z.coerce
    .number({ invalid_type_error: "Annual savings must be a number" })
    .min(0, "Cannot be negative"),
  carbonReductionTonsYear: z.coerce
    .number({ invalid_type_error: "Carbon reduction must be a number" })
    .min(0, "Cannot be negative"),
  validationChecklist: z
    .array(checklistItemSchema)
    .min(1, "Checklist items are required"),
  riskAssessment: z.array(riskItemSchema).min(1, "Risk assessment is required"),
});

export type ResValidationFormValues = z.infer<typeof resValidationFormSchema>;

export const resValidationFormDefaultValues: ResValidationFormValues = {
  validatedBy: "",
  associateId: "",
  validatorRole: "",
  readinessScore: 0,
  renewableCoverage: 0,
  annualSavings: 0,
  carbonReductionTonsYear: 0,
  validationChecklist: [],
  riskAssessment: [],
};
