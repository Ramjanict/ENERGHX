import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import AdminCommonHeader from "@/dashboard/Common/AdminCommonHeader";
import {
  useCreatingSubBuildingsTypesMutation,
  useGetAllBuildingsTypesQuery,
} from "@/store/consumer/basic/building/buildingApi";
// Validation schema
const schema = z.object({
  subType: z.string().min(1, "Sub Type is required"),
  building_type_id: z.string().uuid("Invalid building type ID"),
});

type FormData = z.infer<typeof schema>;

export default function SubBuilding() {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });
  const { data } = useGetAllBuildingsTypesQuery();

  const allBuildingsTypes = data?.data ?? [];

  const [creatingSubBuildingsTypes, { isLoading }] =
    useCreatingSubBuildingsTypesMutation();

  const onSubmit = async (data: FormData) => {
    try {
      await creatingSubBuildingsTypes(data);
    } catch (error) {
      console.error("Failed to create sub building type:", error);
    } finally {
    }
  };

  const inputClass = {
    input: "w-full border border-primary-gray p-2 outline-none",
    label: "text-primary-gray block mb-1",
    error: "text-red-500 text-sm mt-1",
  };
  return (
    <div>
      <AdminCommonHeader className="pt-6">
        Sub building types information
      </AdminCommonHeader>
      <form onSubmit={handleSubmit(onSubmit)} className=" space-y-4">
        <div>
          <label htmlFor="subType" className={inputClass.label}>
            Sub Building Name
          </label>
          <input
            id="subType"
            {...register("subType")}
            placeholder="Enter Sub Type"
            className={inputClass.input}
          />
          {errors.subType && (
            <p className="text-red-500 text-sm mt-1">
              {errors.subType.message}
            </p>
          )}
        </div>

        <div>
          <Select
            onValueChange={(value) => setValue("building_type_id", value)}
            defaultValue={watch("building_type_id")}
          >
            <SelectTrigger className="w-full border border-primary-gray  outline-none rounded-none   py-5">
              <SelectValue placeholder="Select Building" />
            </SelectTrigger>
            <SelectContent className=" bg-white">
              {allBuildingsTypes?.map((building: any) => (
                <SelectItem key={building.id} value={building.id}>
                  {building.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.building_type_id && (
            <p className="text-red-500 text-sm mt-1">
              {errors.building_type_id.message}
            </p>
          )}
        </div>

        <button
          type="submit"
          className="bg-primary text-white px-4 py-2 rounded cursor-pointer w-fit"
        >
          {isLoading ? "Processing..." : " Add sub building"}
        </button>
      </form>
    </div>
  );
}
