import AdminSidebar from "@/common/sidebar/AdminSidebar";
import TopBar from "@/dashboard/Common/TopBar";
import { Outlet } from "react-router-dom";

const AdminLayout = () => {
  return (
    <div className="flex min-h-screen bg-[#fafafa] overflow-hidden">
      <div className="min-h-screen">
        <AdminSidebar />
      </div>

      <div className="flex-1 flex flex-col max-h-screen">
        <TopBar />
        <div className="p-6 overflow-y-auto flex-1">
          <Outlet />
        </div>
      </div>
    </div>
  );
};
export default AdminLayout;
