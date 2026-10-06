import MiniSpinner from "@/common/loading/MiniSpinner";
import AdminCommonHeader from "@/dashboard/Common/AdminCommonHeader";
import AssociatedCourse from "@/dashboard/components/associatedAdmin/course/AssociatedCourse";
import { ServerDeveloperLoginResponse } from "@/store/auth/types/loginUser";
import { useGetAssociatedAdminCoursesQuery } from "@/store/LMS/course/courseApi";
import { RootState } from "@/store/store";
import { useSelector } from "react-redux";

const AssociatedAdminCourses = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const adminId = (user as ServerDeveloperLoginResponse | null)?.data.adminId;
  const { data, isLoading: loading } = useGetAssociatedAdminCoursesQuery(
    adminId as string,
    {
      skip: !adminId,
      refetchOnMountOrArgChange: true,
    },
  );

  const associatedAdminCourses = data?.data ?? [];

  return (
    <div>
      <AdminCommonHeader>All Courses</AdminCommonHeader>

      <div>
        {loading ? (
          <MiniSpinner />
        ) : associatedAdminCourses.length === 0 ? (
          <p className="text-center text-gray-500 mt-6">
            No courses assigned yet
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {associatedAdminCourses.map((course) => (
              <AssociatedCourse key={course.id} course={course} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AssociatedAdminCourses;
