import CommonButton from "@/common/button/CommonButton";
import SectionHeader from "@/common/header/SectionHeader";
import EmailAuditReportModal from "@/components/consumer/basic/analysis/EmailAuditReportModal";
import EnergyAnalysisReport from "@/components/consumer/basic/analysis/EnergyAnalysisReport";
import StartEnergyAuditModal from "@/components/consumer/basic/analysis/StartEnergyAuditModal";
import {
  useSendEnergyAuditReportMutation,
  useStartAuditMutation,
} from "@/store/consumer/basic/analysis/analysisApi";
import {
  AuditType,
  EnergyAuditResponse,
} from "@/store/consumer/basic/analysis/types/analysis";
import { useGetAllBuildingsQuery } from "@/store/consumer/basic/building/buildingApi";
import { Play, UploadCloud, Zap } from "lucide-react";
import { useEffect, useState } from "react";
const BAnalysis = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [hasStartedAudit, setHasStartedAudit] = useState(false);

  useEffect(() => {
    setIsModalOpen(true);
  }, []);

  const { data, isLoading } = useGetAllBuildingsQuery();
  const buildings =
    data?.data?.map((building) => ({
      label: building.building_name,
      value: building.user_building_details_id,
    })) ?? [];

  const [startAudit, { isLoading: isAuditLoading }] = useStartAuditMutation();

  const [selectedReport, setSelectedReport] =
    useState<EnergyAuditResponse | null>(null);

  const handleStart = async (data: {
    buildingId: string;
    auditType: AuditType;
  }) => {
    try {
      const result = await startAudit(data).unwrap();
      setSelectedReport(result);
      setHasStartedAudit(true);
      setIsModalOpen(false);
    } catch (err) {
      console.error("Failed to start audit:", err);
    }
  };

  // send mail for audit report
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const [sendReport, { isLoading: isLoadingReport }] =
    useSendEnergyAuditReportMutation();

  const handleSend = async ({ file, email }: { file: File; email: string }) => {
    try {
      await sendReport({ file, email }).unwrap();
      setIsEmailModalOpen(false);
      // toast success here
    } catch (err) {
      // toast error here
    }
  };

  return (
    <div>
      {!hasStartedAudit && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#2DAD00]/10 flex items-center justify-center shrink-0">
              <Zap className="w-5 h-5 text-[#2DAD00]" />
            </div>
            <div>
              <SectionHeader title="Energy Analysis" />
              <p className="text-sm text-muted-foreground">
                Run audits and share reports for this building
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <CommonButton
              onClick={() => setIsEmailModalOpen(true)}
              variant="outline"
              showDefaultIcon={false}
            >
              <UploadCloud className="w-4 h-4" />
              Upload Report
            </CommonButton>
            <CommonButton
              onClick={() => setIsModalOpen(true)}
              showDefaultIcon={false}
            >
              <Play className="w-4 h-4" />
              Start Audit
            </CommonButton>
          </div>
        </div>
      )}

      <StartEnergyAuditModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        buildings={buildings}
        onStart={handleStart}
        isLoading={isAuditLoading}
      />

      <EmailAuditReportModal
        isOpen={isEmailModalOpen}
        onClose={() => setIsEmailModalOpen(false)}
        onSend={handleSend}
        isLoading={isLoadingReport}
      />

      {hasStartedAudit && <EnergyAnalysisReport report={selectedReport} />}
    </div>
  );
};

export default BAnalysis;
