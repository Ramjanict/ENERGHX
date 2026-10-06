import DashboardCardSkeleton from "@/common/loading/DashboardCardSkeleton";
import { loadingList } from "@/help/help";
import { useGetAllUsersQuery } from "@/store/LMS/user/userApi";
import { useState } from "react";
import AdminCommonButton from "../Common/AdminCommonButton";
import AdminCommonHeader from "../Common/AdminCommonHeader";
import AssignCoursesForm from "../components/AssignCoursesForm";
import UserCard from "../components/consumerDashboard/users/UserCard";

const AssignCourse = () => {
  const [isAssignCoursesOpen, setIsAssignCoursesOpen] = useState(false);

  const { data } = useGetAllUsersQuery({
    user_role: "INSTRUCTOR",
  });

  const allUsersData = data?.data?.users ?? [];

  return (
    <div>
      <AdminCommonHeader className="">
        Assign courses for instructor
      </AdminCommonHeader>

      <AdminCommonButton
        className="!w-fit"
        onClick={() => setIsAssignCoursesOpen(true)}
      >
        Assign Courses
      </AdminCommonButton>
      {isAssignCoursesOpen && data?.data && (
        <AssignCoursesForm
          setIsAssignCoursesOpen={setIsAssignCoursesOpen}
          allUsers={data?.data}
        />
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 py-10">
        {allUsersData
          ? allUsersData.map((user) => (
              <UserCard key={user.user_id} user={user} />
            ))
          : loadingList.map((_, index) => (
              <DashboardCardSkeleton key={index} />
            ))}
      </div>
    </div>
  );
};

export default AssignCourse;
