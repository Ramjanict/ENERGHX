import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ServerDeveloperLoginResponse } from "@/store/auth/types/loginUser";
import {
  useGetAllCourseQuery,
  useGetAssociatedAdminCoursesQuery,
} from "@/store/LMS/course/courseApi";
import { RootState } from "@/store/store";
import { useSelector } from "react-redux";

interface AllCourseProps {
  handleCourseChange: (value: string) => void;
  selectedCourseId: string;
}

const AllCourse: React.FC<AllCourseProps> = ({
  handleCourseChange,
  selectedCourseId,
}) => {
  const { user } = useSelector((state: RootState) => state.auth);
  const serverUser = user as ServerDeveloperLoginResponse | null;

  const isInstructor = serverUser?.data.userType !== "SUPER_ADMIN";
  const adminId = serverUser?.data?.adminId;

  const { data: associatedData } = useGetAssociatedAdminCoursesQuery(
    adminId as string,
    {
      skip: !adminId || !isInstructor,
      refetchOnMountOrArgChange: true,
    },
  );

  const { data: courseData } = useGetAllCourseQuery(undefined, {
    skip: isInstructor || !user,
  });

  const allCourse = isInstructor
    ? (associatedData?.data ?? [])
    : (courseData?.data ?? []);

  return (
    <div className="">
      <Select onValueChange={handleCourseChange} value={selectedCourseId}>
        <SelectTrigger className="outline-none text-primary-gray rounded">
          <SelectValue placeholder="Choose Course" />
        </SelectTrigger>
        <SelectContent className="bg-light-green">
          {allCourse.map((course) => (
            <SelectItem key={course.id} value={course.id}>
              {course.title}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default AllCourse;
