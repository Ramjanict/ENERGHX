import BackButton from "@/common/button/BackButton";
import { usePdfExport } from "@/common/htmlToPdf/usePdfExport";
import EmptyState from "@/common/loading/EmptyState";
import Spinner from "@/common/loading/Spinner";
import { useGetApplianceReportQuery } from "@/store/consumer/basic/appliance/applianceApi";
import { useParams } from "react-router-dom";
import ManageEnergy from "./card/ManageEnergy";
import HeaderBanner from "./HeaderBanner";
import ApplianceInventory from "./management/ApplianceInventory";
import EfficiencyInsights from "./management/EfficiencyInsights";
import RenewableEnergy from "./management/RenewableEnergy";

const AppliancesManagement = () => {
  const { buildingId } = useParams<{ buildingId: string }>();

  const { data, isLoading } = useGetApplianceReportQuery(buildingId ?? "", {
    skip: !buildingId,
    refetchOnMountOrArgChange: true,
  });

  const report = data?.data;

  const { targetRef, exportPdf, isExporting } = usePdfExport<HTMLDivElement>({
    filename: `Report-${report?.rooms[0].title.toLowerCase()}-${new Date()
      .toISOString()
      .slice(0, 10)}.pdf`,
  });

  return (
    <div className=" space-y-6">
      <div className="space-y-6">
        <BackButton label="Back to Building" />

        <HeaderBanner
          title="Appliances Management"
          description="Comprehensive overview of all appliances in your building"
          isButton
          onClick={() => exportPdf()}
          isLoading={isExporting || isLoading}
        />
      </div>
      {isLoading ? (
        <Spinner text={"Loading Appliances..."} size="lg" />
      ) : report ? (
        <div className="space-y-6">
          <div className="space-y-6" ref={targetRef}>
            <ManageEnergy report={report} isLoading={isLoading} />
            <ApplianceInventory report={report} isLoading={isLoading} />
          </div>
          <EfficiencyInsights report={report} isLoading={isLoading} />
          <RenewableEnergy />
        </div>
      ) : (
        <EmptyState message="No appliances found" />
      )}
    </div>
  );
};

export default AppliancesManagement;
