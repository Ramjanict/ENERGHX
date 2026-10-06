import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import AdminCommonButton from "@/dashboard/Common/AdminCommonButton";
import AdminCommonHeader from "@/dashboard/Common/AdminCommonHeader";
import {
  useCreateProgramMutation,
  useUpdateProgramMutation,
} from "@/store/LMS/program/programApi";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { RiCloseLargeLine } from "react-icons/ri";
import { z } from "zod";

const programSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  price: z
    .number({ invalid_type_error: "Price must be a number" })
    .positive("Price must be positive"),
  thumbnail: z.union([
    z.instanceof(File).refine((file) => file.size > 0, "Thumbnail is required"),
    z.string().min(1, "Thumbnail is required"),
  ]),
  publishedFor: z.enum(["DEVELOPER", "SERVER"]),
});
export type ProgramFormData = z.infer<typeof programSchema>;

interface ProgramCreationModalProps {
  selectedProgram: (ProgramFormData & { id?: string }) | null;
  programId: string | null;
  onClose: () => void;
  onSuccess: () => void;
}

const ProgramCreationModal = ({
  selectedProgram,
  programId,
  onClose,
  onSuccess,
}: ProgramCreationModalProps) => {
  const [createProgram, { isLoading: isCreating }] = useCreateProgramMutation();
  const [updateProgram, { isLoading: isUpdating }] = useUpdateProgramMutation();

  const [preview, setPreview] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    reset,
    setValue,
  } = useForm<ProgramFormData>({
    resolver: zodResolver(programSchema),
    defaultValues: {
      title: "",
      description: "",
      price: 0,
      thumbnail: "",
    },
  });

  useEffect(() => {
    if (selectedProgram) {
      const { thumbnail, title, description, price, publishedFor } =
        selectedProgram;
      setPreview(typeof thumbnail === "string" ? thumbnail : null);
      reset({ title, description, price, thumbnail, publishedFor });
    } else {
      setPreview(null);
      reset();
    }
  }, [selectedProgram, reset]);

  const onSubmit = async (data: ProgramFormData) => {
    const formData = new FormData();
    const { thumbnail, ...restData } = data;
    formData.append("text", JSON.stringify(restData));
    if (thumbnail instanceof File) {
      formData.append("file", thumbnail);
    }

    try {
      if (programId && selectedProgram) {
        await updateProgram({ programId, program: formData }).unwrap();
      } else {
        await createProgram(formData).unwrap();
      }
      onSuccess();
    } catch (error) {
      console.error("Failed to submit program:", error);
    }
  };

  const isLoading = isCreating || isUpdating;

  return (
    <div className="fixed inset-0 bg-opacity-50 backdrop-blur-sm transition-opacity min-h-screen flex items-center justify-center">
      <div className="w-full h-full flex flex-col justify-center items-center gap-10">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-6 bg-white w-[90%] md:w-[60%] lg:w-[50%] xl:w-[40%] shadow-[0px_0px_1px_2px_rgba(0,0,0,.04)] rounded-xl p-8"
        >
          <div className="w-full flex justify-between items-center">
            <AdminCommonHeader className="!pb-0">
              {selectedProgram ? "Update Program" : "Create Program"}
            </AdminCommonHeader>
            <div
              onClick={onClose}
              className="text-xl cursor-pointer hover:text-red-500"
            >
              <RiCloseLargeLine />
            </div>
          </div>

          <div>
            <label className="text-primary-gray block mb-1">Title</label>
            <input
              {...register("title")}
              className="w-full border border-primary-gray p-2 outline-none"
              placeholder="Enter title"
            />
            {errors.title && (
              <p className="text-red-500 text-xs sm:text-sm">
                {errors.title.message}
              </p>
            )}
          </div>

          <div>
            <label className="text-primary-gray block mb-1">Description</label>
            <textarea
              {...register("description")}
              className="w-full border border-primary-gray p-2 outline-none"
              placeholder="Enter description"
              rows={5}
            />
            {errors.description && (
              <p className="text-red-500 text-xs sm:text-sm">
                {errors.description.message}
              </p>
            )}
          </div>

          <div>
            <label className="text-primary-gray block mb-1">Price ($)</label>
            <input
              type="number"
              step="0.01"
              {...register("price", { valueAsNumber: true })}
              className="w-full border border-primary-gray p-2 outline-none"
            />
            {errors.price && (
              <p className="text-red-500 text-xs sm:text-sm">
                {errors.price.message}
              </p>
            )}
          </div>

          <div>
            <label className="text-primary-gray block mb-1">Thumbnail</label>
            <input
              id="thumbnail"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  setPreview(URL.createObjectURL(file));
                  setValue("thumbnail", file, { shouldValidate: true });
                }
              }}
            />
            {!preview && (
              <label
                htmlFor="thumbnail"
                className="block cursor-pointer border border-primary-gray py-2 px-4 text-primary-gray hover:bg-primary-green hover:text-white transition"
              >
                Upload Thumbnail
              </label>
            )}
            {preview && (
              <div className="w-full mt-2">
                <img
                  src={preview}
                  alt="Thumbnail Preview"
                  className="w-fit max-h-20 object-contain border border-gray-200"
                />
                <button
                  type="button"
                  onClick={() => {
                    setPreview(null);
                    setValue("thumbnail", "", { shouldValidate: true });
                  }}
                  className="bg-red-500 text-white px-2 py-1 rounded-md cursor-pointer mt-1"
                >
                  Remove
                </button>
              </div>
            )}
            {errors.thumbnail && (
              <p className="text-red-500 text-xs sm:text-sm mt-1">
                {errors.thumbnail.message}
              </p>
            )}
          </div>

          <div>
            <label className="text-primary-gray block mb-1">Publish</label>
            <Controller
              name="publishedFor"
              control={control}
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger className="w-full outline-none text-primary-gray py-5 rounded-none">
                    <SelectValue placeholder="Choose audience" />
                  </SelectTrigger>
                  <SelectContent className="bg-light-green">
                    <SelectItem
                      value="SERVER"
                      className="hover:bg-primary-green hover:text-white"
                    >
                      SERVER
                    </SelectItem>
                    <SelectItem
                      value="DEVELOPER"
                      className="hover:bg-primary-green hover:text-white"
                    >
                      DEVELOPER
                    </SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
            {errors.publishedFor && (
              <p className="text-red-500 text-xs sm:text-sm">
                {errors.publishedFor.message}
              </p>
            )}
          </div>

          <AdminCommonButton disabled={isLoading}>
            {isLoading
              ? "Processing..."
              : selectedProgram
                ? "Update Program"
                : "Create Program"}
          </AdminCommonButton>
        </form>
      </div>
    </div>
  );
};

export default ProgramCreationModal;
