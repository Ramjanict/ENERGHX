import InitialModal from "@/common/password/InitialModal";
import AssignCourse from "@/dashboard/pages/AssignCourse";
import AssociatedAdminCourses from "@/dashboard/pages/associatedAdmin/AssociatedAdminCourses";
import BasicContent from "@/dashboard/pages/BasicContent";
import Approval from "@/dashboard/pages/consumer/Approval";
import ConsumerHandle from "@/dashboard/pages/consumer/ConsumerHandle";
import Country from "@/dashboard/pages/consumer/Country";
import CreateBuildingTypes from "@/dashboard/pages/consumer/CreateBuildingTypes";
import Content from "@/dashboard/pages/Content";
import Course from "@/dashboard/pages/Course";
import DasHome from "@/dashboard/pages/Home";
import Module from "@/dashboard/pages/Module";
import Payment from "@/dashboard/pages/Payment";
import Program from "@/dashboard/pages/Program";
import Quiz from "@/dashboard/pages/Quiz";
import Review from "@/dashboard/pages/Review";
import Users from "@/dashboard/pages/Users";
import AdminLayout from "@/Layout/AdminLayout";
import ProtectedRoute from "./ProtectedRoute";

const dashboardRoutes = {
  path: "/dashboard",
  element: (
    <ProtectedRoute allowedRoles={["SUPER_ADMIN"]}>
      <AdminLayout />
    </ProtectedRoute>
  ),
  children: [
    {
      index: true,
      element: <DasHome />,
    },
    {
      path: "home",
      element: <DasHome />,
    },
    {
      path: "program",
      element: <Program />,
    },
    {
      path: "course",
      element: <Course />,
    },
    {
      path: "instructor-course",
      element: <AssociatedAdminCourses />,
    },
    {
      path: "instructor-module",
      element: <Module />,
    },
    {
      path: "instructor-basic-content",
      element: <BasicContent />,
    },
    {
      path: "instructor-content",
      element: <Content />,
    },
    {
      path: "instructor-quiz",
      element: <Quiz />,
    },
    { path: "module", element: <Module /> },
    { path: "basic-content", element: <BasicContent /> },
    { path: "content", element: <Content /> },
    { path: "quiz", element: <Quiz /> },
    {
      path: "review",
      element: <Review />,
    },
    {
      path: "payment",
      element: <Payment />,
    },
    {
      path: "assign-course",
      element: <AssignCourse />,
    },
    {
      path: "change-password",
      element: <InitialModal />,
    },
    {
      path: "create-building-type",
      element: <CreateBuildingTypes />,
    },
    {
      path: "country",
      element: <Country />,
    },
    {
      path: "users",
      element: <Users />,
    },
    {
      path: "approval",
      element: <Approval />,
    },
    {
      path: "consumer",
      element: <ConsumerHandle />,
    },
  ],
};

export default dashboardRoutes;
