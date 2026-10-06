import AdminCommonButton from "@/dashboard/Common/AdminCommonButton";
import AdminCommonHeader from "@/dashboard/Common/AdminCommonHeader";
import AcceptApproval from "@/dashboard/components/consumerDashboard/approval/AcceptApproval";
import PendingApproval from "@/dashboard/components/consumerDashboard/approval/PendingApproval";
import { useState } from "react";

const Approval = () => {
  const [tab, setTab] = useState<"pending" | "accepted">("pending");
  return (
    <div>
      <AdminCommonHeader className="">
        Approval of Developers & Servers Status
      </AdminCommonHeader>
      <div className="flex gap-4 ">
        <AdminCommonButton
          className={`${
            tab === "pending"
              ? ""
              : "!bg-transparent !text-black border !border-gray-400 hover:!bg-gray-200"
          }`}
          onClick={() => setTab("pending")}
        >
          Pending Server & Developer
        </AdminCommonButton>
        <AdminCommonButton
          className={`${
            tab === "accepted"
              ? ""
              : "!bg-transparent !text-black border !border-gray-400 hover:!bg-gray-200"
          }`}
          onClick={() => setTab("accepted")}
        >
          Approved Server & Developer
        </AdminCommonButton>
      </div>
      <div className="py-6">
        {tab === "pending" ? <PendingApproval /> : <AcceptApproval />}
      </div>
    </div>
  );
};

export default Approval;
