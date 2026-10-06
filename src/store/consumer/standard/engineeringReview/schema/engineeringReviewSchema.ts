import { z } from "zod";

const statusItemSchema = z.object({
  key: z.string().min(1),
  label: z.string().min(1),
  status: z.string().min(1, "Status is required"),
});

export const engineeringReviewFormSchema = z.object({
  reviewedBy: z.string().min(1, "Reviewed by is required"),
  approvalTimestamp: z.string().min(1, "Approval timestamp is required"),
  reviewProgress: z
    .array(statusItemSchema)
    .min(1, "Review progress is required"),
  approvalMatrix: z
    .array(statusItemSchema)
    .min(1, "Approval matrix is required"),
});

export type EngineeringReviewFormValues = z.infer<
  typeof engineeringReviewFormSchema
>;

export const engineeringReviewFormDefaultValues: EngineeringReviewFormValues = {
  reviewedBy: "",
  approvalTimestamp: "",
  reviewProgress: [],
  approvalMatrix: [],
};
