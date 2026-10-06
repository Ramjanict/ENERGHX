import CommonButton from "@/common/button/CommonButton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useGetAllCourseQuery } from "@/store/LMS/course/courseApi";
import { useAssignCoursesToInstructorMutation } from "@/store/LMS/paymentAndCourse/paymentCourseApi";
import { SingleUser } from "@/store/LMS/user/types/UserAndAssignTypes";
import { zodResolver } from "@hookform/resolvers/zod";
import { FC } from "react";
import { Controller, useForm } from "react-hook-form";
import { RiCloseLargeLine } from "react-icons/ri";
import { z } from "zod";

const formSchema = z.object({
  adminId: z
    .string()
    .uuid("Admin ID must be a valid UUID")
    .nonempty("Admin ID is required"),
  courseIds: z
    .array(z.string().uuid("Each Course ID must be a valid UUID"))
    .min(1, "At least one course must be selected"),
});

type FormData = z.infer<typeof formSchema>;

interface AssignCoursesFormProps {
  setIsAssignCoursesOpen: React.Dispatch<React.SetStateAction<boolean>>;
  allUsers: SingleUser;
}

const AssignCoursesForm: FC<AssignCoursesFormProps> = ({
  setIsAssignCoursesOpen,
  allUsers,
}) => {
  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
    watch,
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      adminId: "",
      courseIds: [],
    },
  });

  const { data } = useGetAllCourseQuery();

  const allCourse = data?.data ?? [];
  const [assignCoursesToInstructor, { isLoading }] =
    useAssignCoursesToInstructorMutation();

  const allInstructors = allUsers?.users ?? [];
  const selectedCourses = watch("courseIds");

  const onSubmit = async (data: FormData) => {
    try {
      await assignCoursesToInstructor(data);
      setIsAssignCoursesOpen(false);
    } catch (error) {
      console.error(" Submission Error:", error);
    } finally {
    }
  };

  const handleCourseSelect = (courseId: string) => {
    const current = watch("courseIds");
    if (current.includes(courseId)) {
      setValue(
        "courseIds",
        current.filter((id) => id !== courseId),
        { shouldValidate: true },
      );
    } else {
      setValue("courseIds", [...current, courseId], { shouldValidate: true });
    }
  };

  return (
    <div className="fixed inset-0 bg-opacity-50 backdrop-blur-sm transition-opacity min-h-screen flex items-center justify-center z-50">
      <div className="w-full flex flex-col justify-center items-center gap-10 h-full overflow-hidden">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-6 bg-white w-[90%] md:w-[60%] lg:w-[50%] xl:w-[40%] shadow-[0px_0px_1px_2px_rgba(0,0,0,.04)] rounded-xl p-8 my-10 overflow-y-scroll"
        >
          <div
            onClick={() => {
              setIsAssignCoursesOpen(false);
            }}
            className="text-xl cursor-pointer hover:text-red-500 w-fit ml-auto"
          >
            <RiCloseLargeLine />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select instructor
            </label>
            <Controller
              name="adminId"
              control={control}
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger className="w-full border text-black border-gray-300 rounded-md p-2 text-sm">
                    <SelectValue placeholder="Select instructor" />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    {allInstructors.map((instructor) => (
                      <SelectItem
                        key={instructor.adminId}
                        value={instructor.adminId || ""}
                        className="cursor-pointer "
                      >
                        {instructor?.firstname} {instructor?.lastname} (
                        {instructor?.email})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.adminId && (
              <p className="text-red-500 text-xs mt-1">
                {errors.adminId.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700">
              Select Courses
            </label>
            <div className="space-y-2">
              {allCourse.map((course) => (
                <label
                  key={course.id}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={selectedCourses.includes(course.id)}
                    onChange={() => handleCourseSelect(course.id)}
                    className="w-4 h-4"
                  />
                  <span>{course.title}</span>
                </label>
              ))}
            </div>
            {errors.courseIds && (
              <p className="text-red-500 text-xs mt-1">
                {errors.courseIds.message}
              </p>
            )}
          </div>

          {/* Buttons */}
          <div className="flex gap-4 pt-4">
            <CommonButton
              disabled={isLoading}
              type="submit"
              className="!bg-primary !text-white px-6 py-2 rounded"
            >
              Submit
            </CommonButton>
            <CommonButton
              type="reset"
              className="!bg-red-500 px-6 py-2 rounded"
            >
              Reset
            </CommonButton>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AssignCoursesForm;
