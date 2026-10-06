import CloseButton from "@/common/button/CloseButton";
import CommonButton from "@/common/button/CommonButton";
import CommonSelect from "@/common/button/CommonSelect";
import SectionHeader from "@/common/header/SectionHeader";
import { AuditType } from "@/store/consumer/basic/analysis/types/analysis";
import React, { useState } from "react";
import AuditTypeCard from "./AuditTypeCard";

interface Option {
  label: string;
  value: string;
}

interface StartEnergyAuditModalProps {
  isOpen: boolean;
  onClose: () => void;
  buildings: Option[];
  onStart: (data: { buildingId: string; auditType: AuditType }) => void;
  isLoading: boolean;
}
// export type AuditType = "BASIC_AUDIT" | "COMPREHENSIVE_AUDIT";
const StartEnergyAuditModal: React.FC<StartEnergyAuditModalProps> = ({
  isOpen,
  onClose,
  buildings,
  isLoading,
  onStart,
}) => {
  const [buildingId, setBuildingId] = useState("");
  const [auditType, setAuditType] = useState<AuditType>("BASIC_AUDIT");

  if (!isOpen) return null;

  const handleStart = () => {
    if (!buildingId) return;
    onStart({ buildingId, auditType });
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-6 sm:p-8 w-full max-w-2xl">
        <div className="flex items-center justify-between mb-6">
          <SectionHeader title="Start Energy Audit" />
          <CloseButton onClick={onClose} />
        </div>

        <div className="mb-6">
          <label className="block text-sm text-muted-foreground mb-2">
            Select Building <span className="text-red-500">*</span>
          </label>
          <CommonSelect
            value={buildingId}
            onValueChange={setBuildingId}
            item={buildings}
            placeholder="Choose a building"
            className="w-full"
          />
        </div>

        <div className="mb-8">
          <label className="block text-sm text-muted-foreground mb-3">
            Audit Type <span className="text-red-500">*</span>
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <AuditTypeCard
              title="Basic Audit"
              description="Quick energy assessment with basic recommendations"
              selected={auditType === "BASIC_AUDIT"}
              onClick={() => setAuditType("BASIC_AUDIT")}
            />
            <AuditTypeCard
              title="Comprehensive Audit"
              description="Detailed analysis with advanced recommendations"
              selected={auditType === "COMPREHENSIVE_AUDIT"}
              onClick={() => setAuditType("COMPREHENSIVE_AUDIT")}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <CommonButton variant="outline" onClick={onClose}>
            Cancel
          </CommonButton>
          <CommonButton
            onClick={handleStart}
            disabled={!buildingId}
            isLoading={isLoading}
            loadingText="Starting audit..."
          >
            Start Audit
          </CommonButton>
        </div>
      </div>
    </div>
  );
};

export default StartEnergyAuditModal;
