import AdminCommonHeader from "@/dashboard/Common/AdminCommonHeader";
import { useCreatingBuildingsTypesMutation } from "@/store/consumer/basic/building/buildingApi";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

const schema = z.object({
  name: z.string().min(1, "Name is required"),
});

type FormData = z.infer<typeof schema>;

export default function BuildTypes() {
  const [creatingBuildingsTypes, { isLoading }] =
    useCreatingBuildingsTypesMutation();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    try {
      await creatingBuildingsTypes(data);
    } catch (error) {
      console.error("Submission failed:", error);
    } finally {
    }
  };

  const inputClass = {
    input: "w-full border border-primary-gray p-2 outline-none",
    label: "text-primary-gray block mb-1",
    error: "text-red-500 text-sm mt-1",
  };
  return (
    <>
      <AdminCommonHeader>Building information</AdminCommonHeader>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
        <div className="">
          <label className={inputClass.label} htmlFor="name">
            Building Name
          </label>
          <input
            id="name"
            {...register("name")}
            className={inputClass.input}
            placeholder="Enter building type name"
          />
          {errors.name && (
            <p className={inputClass.error}>{errors.name.message}</p>
          )}
        </div>
        <button
          type="submit"
          className="bg-primary text-white px-4 py-2 rounded cursor-pointer w-fit"
        >
          {isLoading ? "Processing..." : " Add building type"}
        </button>
      </form>
    </>
  );
}
