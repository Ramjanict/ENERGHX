import BackButton from "@/common/button/BackButton";
import CommonBorderWrapper from "@/common/button/CommonBorderWrapper";
import CommonButton from "@/common/button/CommonButton";
import SectionHeader from "@/common/header/SectionHeader";
import { inputClass } from "@/pages/Login";
import { useAddCustomApplianceMutation } from "@/store/consumer/basic/appliance/applianceApi";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom"; // adjust to your router setup
import { z } from "zod";
import ImageDropzone from "./ImageDropzone";

const customApplianceSchema = z.object({
  applianceName: z.string().trim().min(1, "Appliance name is required"),
  brandName: z.string().trim().min(1, "Brand name is required"),
  categoryName: z.string().trim().min(1, "Category name is required"),
  powerRating: z
    .string()
    .trim()
    .min(1, "Power rating is required")
    .refine((v) => !Number.isNaN(Number(v)), "Power rating must be a number")
    .refine((v) => Number(v) > 0, "Power rating must be greater than 0"),
  voltage: z
    .string()
    .trim()
    .min(1, "Voltage is required")
    .refine((v) => !Number.isNaN(Number(v)), "Voltage must be a number")
    .refine((v) => Number(v) > 0, "Voltage must be greater than 0"),
  energyRating: z.string().trim().min(1, "Energy rating is required"),
  noOfAppliances: z
    .string()
    .trim()
    .min(1, "Quantity is required")
    .refine((v) => !Number.isNaN(Number(v)), "Quantity must be a number")
    .refine(
      (v) => Number.isInteger(Number(v)) && Number(v) >= 1,
      "Quantity must be at least 1",
    ),
});

type CustomApplianceForm = z.infer<typeof customApplianceSchema>;
type FormErrors = Partial<Record<keyof CustomApplianceForm, string>>;

const INITIAL_FORM: CustomApplianceForm = {
  applianceName: "",
  brandName: "",
  categoryName: "",
  powerRating: "",
  voltage: "",
  energyRating: "",
  noOfAppliances: "",
};

const CustomAppliance = () => {
  const { buildingId, roomId } = useParams<{
    buildingId: string;
    roomId: string;
  }>();
  const navigate = useNavigate();

  const [addCustomAppliance, { isLoading }] = useAddCustomApplianceMutation();
  const [preview, setPreview] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [form, setForm] = useState<CustomApplianceForm>(INITIAL_FORM);
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleFile = (selectedFile: File) => {
    if (!selectedFile.type.startsWith("image/")) return;
    setFile(selectedFile);
    const reader = new FileReader();
    reader.onload = (e) => setPreview(e.target?.result as string);
    reader.readAsDataURL(selectedFile);
  };

  const handleRemove = () => {
    setPreview(null);
    setFile(null);
  };

  const updateField =
    (field: keyof CustomApplianceForm) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setForm((f) => ({ ...f, [field]: e.target.value }));
      if (errors[field]) {
        setErrors((prev) => ({ ...prev, [field]: undefined }));
      }
    };

  const handleSubmit = async () => {
    if (!buildingId || !roomId) {
      setSubmitError("Building ID or Room ID is missing.");
      return;
    }
    setSubmitError(null);

    const result = customApplianceSchema.safeParse(form);

    if (!result.success) {
      const fieldErrors: FormErrors = {};
      result.error.issues.forEach((issue) => {
        const key = issue.path[0] as keyof CustomApplianceForm;
        if (!fieldErrors[key]) fieldErrors[key] = issue.message;
      });
      setErrors(fieldErrors);
      return;
    }

    setErrors({});

    const formData = new FormData();
    formData.append("buildingId", buildingId);
    formData.append("roomId", roomId);
    formData.append("applianceName", result.data.applianceName);
    formData.append("brandName", result.data.brandName);
    formData.append("categoryName", result.data.categoryName);
    formData.append("powerRating", result.data.powerRating);
    formData.append("voltage", result.data.voltage);
    formData.append("energyRating", result.data.energyRating);
    formData.append("noOfAppliances", result.data.noOfAppliances);
    if (file) formData.append("file", file);

    try {
      await addCustomAppliance(formData).unwrap();
      navigate(-1);
    } catch (err) {
      console.error("Failed to add custom appliance:", err);
      setSubmitError("Failed to add appliance. Please try again.");
    }
  };

  const handleCancel = () => navigate(-1);

  return (
    <div className="  space-y-6">
      <BackButton />
      <CommonBorderWrapper isShadow className="">
        <SectionHeader
          title="Upload Custom Appliance"
          description="Add an appliance that's not in our database"
        />

        <div>
          <label className={inputClass.label}>Appliance Image</label>
          <ImageDropzone onFileSelect={handleFile} />
          {preview && (
            <>
              <div className="mt-4 h-80 overflow-hidden rounded-lg">
                <img
                  className="w-full h-full object-cover"
                  src={preview}
                  alt="Appliance Preview"
                />
              </div>{" "}
              <div className="flex justify-end">
                <CommonButton
                  size="sm"
                  variant="destructive"
                  onClick={handleRemove}
                  className="mt-4"
                >
                  Remove
                </CommonButton>
              </div>
            </>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className={inputClass.label}>Appliance Name</label>
            <input
              className={inputClass.input}
              type="text"
              placeholder="Enter appliance name"
              value={form.applianceName}
              onChange={updateField("applianceName")}
            />
            {errors.applianceName && (
              <p className="text-xs text-red-500 mt-1">
                {errors.applianceName}
              </p>
            )}
          </div>
          <div>
            <label className={inputClass.label}>Brand Name</label>
            <input
              className={inputClass.input}
              type="text"
              placeholder="Enter brand name"
              value={form.brandName}
              onChange={updateField("brandName")}
            />
            {errors.brandName && (
              <p className="text-xs text-red-500 mt-1">{errors.brandName}</p>
            )}
          </div>
          <div>
            <label className={inputClass.label}>Category Name</label>
            <input
              className={inputClass.input}
              type="text"
              placeholder="Enter category name"
              value={form.categoryName}
              onChange={updateField("categoryName")}
            />
            {errors.categoryName && (
              <p className="text-xs text-red-500 mt-1">{errors.categoryName}</p>
            )}
          </div>
          <div>
            <label className={inputClass.label}>Power Rating (W)</label>
            <input
              className={inputClass.input}
              type="number"
              placeholder="Enter power in watts"
              value={form.powerRating}
              onChange={updateField("powerRating")}
            />
            {errors.powerRating && (
              <p className="text-xs text-red-500 mt-1">{errors.powerRating}</p>
            )}
          </div>
          <div>
            <label className={inputClass.label}>Voltage</label>
            <input
              className={inputClass.input}
              type="number"
              placeholder="Enter power in V"
              value={form.voltage}
              onChange={updateField("voltage")}
            />
            {errors.voltage && (
              <p className="text-xs text-red-500 mt-1">{errors.voltage}</p>
            )}
          </div>
          <div>
            <label className={inputClass.label}>Energy Rating</label>
            <input
              className={inputClass.input}
              type="text"
              placeholder="Enter energy rating"
              value={form.energyRating}
              onChange={updateField("energyRating")}
            />
            {errors.energyRating && (
              <p className="text-xs text-red-500 mt-1">{errors.energyRating}</p>
            )}
          </div>
          <div>
            <label className={inputClass.label}>Quantity</label>
            <input
              className={inputClass.input}
              type="number"
              placeholder="Enter quantity"
              value={form.noOfAppliances}
              onChange={updateField("noOfAppliances")}
            />
            {errors.noOfAppliances && (
              <p className="text-xs text-red-500 mt-1">
                {errors.noOfAppliances}
              </p>
            )}
          </div>
        </div>

        {submitError && <p className="text-sm text-red-500">{submitError}</p>}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <CommonButton
            type="button"
            onClick={handleSubmit}
            isLoading={isLoading}
            loadingText="Adding..."
          >
            Add Appliance
          </CommonButton>
          <CommonButton variant="outline" type="button" onClick={handleCancel}>
            Cancel
          </CommonButton>
        </div>
      </CommonBorderWrapper>
    </div>
  );
};

export default CustomAppliance;
