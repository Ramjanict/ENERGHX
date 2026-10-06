import AdminCommonHeader from "@/dashboard/Common/AdminCommonHeader";
import ConsumerPanel from "@/dashboard/components/consumerDashboard/consumer/ConsumerPanel";

const ConsumerHandle = () => {
  return (
    <>
      <AdminCommonHeader className="">
        Selection Servers or Developers for Consumer
      </AdminCommonHeader>

      <ConsumerPanel />
    </>
  );
};

export default ConsumerHandle;
