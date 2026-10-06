import AllCourses from "@/common/LMS/AllCourses";
import Settings from "@/common/Settings";
import WorkExperience from "@/components/register/WorkExperience";
import ServerLayout from "@/Layout/ServerLayout";
import AllProgram from "@/pages/user/AllProgram";
import ServerDashBoard from "@/pages/user/ServerDashBoard";
import ProtectedRoute from "./ProtectedRoute";

const userRoutes = {
  path: "user",
  element: (
    <ProtectedRoute allowedRoles={["SERVER", "DEVELOPER"]}>
      <ServerLayout />
    </ProtectedRoute>
  ),
  children: [
    { index: true, element: <ServerDashBoard /> },
    { path: "dashboard", element: <ServerDashBoard /> },
    { path: "all-courses", element: <AllCourses /> },
    { path: "settings", element: <Settings /> },
    {
      path: "all-program",
      element: <AllProgram />,
    },
    {
      path: "experience",
      element: <WorkExperience />,
    },
  ],
};

export default userRoutes;
