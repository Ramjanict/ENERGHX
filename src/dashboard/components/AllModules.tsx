import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useGetAllModuleQuery } from "@/store/LMS/module/moduleApi";
import { Control, Controller, FieldErrors } from "react-hook-form";
import { AllContentType } from "./creationModal/ContentCreationModal";
// store/LMS/content/types/contentType.ts
interface AllModulesProps {
  errors: FieldErrors<AllContentType>;
  control: Control<AllContentType>;
  selectedCourseId: string;
}

const AllModules: React.FC<AllModulesProps> = ({
  control,
  errors,
  selectedCourseId,
}) => {
  const { data } = useGetAllModuleQuery(selectedCourseId, {
    skip: !selectedCourseId,
    refetchOnMountOrArgChange: true,
  });

  const modules = data?.data?.modules ?? [];

  return (
    <div>
      <Controller
        name="moduleId"
        control={control}
        render={({ field }) => (
          <Select onValueChange={field.onChange} value={field.value}>
            <SelectTrigger className="outline-none rounded-lg border border-border px-3 py-2 text-sm text-primary-gray w-[180px]">
              <SelectValue placeholder="Choose Module" />
            </SelectTrigger>
            <SelectContent className="bg-white border border-border rounded-lg shadow-md">
              {modules.map((module) => (
                <SelectItem
                  className="block w-full text-left px-3 py-2 text-sm cursor-pointer hover:bg-gray-100 data-[highlighted]:bg-gray-100 rounded-lg"
                  key={module.id}
                  value={module.id}
                >
                  {module.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      />
      {errors.moduleId && (
        <p className="text-red-500 text-xs">{errors.moduleId.message}</p>
      )}
    </div>
  );
};

export default AllModules;
