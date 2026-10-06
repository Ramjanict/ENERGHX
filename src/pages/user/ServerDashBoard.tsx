import CommonHeader from "@/common/header/CommonHeader";
import DashboardFilter from "./DashboardFilter";

const ServerDashBoard = () => {
  return (
    <div className="">
      <CommonHeader>Overview</CommonHeader>

      <div className="w-full flex flex-col items-center md:flex-row md:justify-start gap-6">
        <DashboardFilter />
      </div>
    </div>
  );
};

export default ServerDashBoard;
