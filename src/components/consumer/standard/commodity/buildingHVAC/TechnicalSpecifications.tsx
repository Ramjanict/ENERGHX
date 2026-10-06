import CommonHeader from "@/common/header/CommonHeader";
import {
  HvacSpecSection,
  HvacTechnicalSpecifications,
} from "@/store/consumer/standard/designs/designPost/types/hvac";
import React from "react";
import InfoRow from "../solar/InfoRow";

interface TechnicalSpecificationsProps {
  specifications: HvacTechnicalSpecifications;
  className?: string;
}

const EMPHASIS_CLASSES: Record<string, string> = {
  positive: "text-[#16A34A]",
  negative: "text-red-600",
};

const SpecSection: React.FC<{ section: HvacSpecSection }> = ({ section }) => (
  <div>
    <CommonHeader size="lg" className="mb-3">
      {section.label}
    </CommonHeader>
    <dl className="space-y-2">
      {section.rows.map((row) => (
        <InfoRow
          key={row.key}
          label={`${row.label}:`}
          value={row.display}
          valueClassName={
            row.emphasis ? EMPHASIS_CLASSES[row.emphasis] : undefined
          }
        />
      ))}
    </dl>
  </div>
);

const TechnicalSpecifications: React.FC<TechnicalSpecificationsProps> = ({
  specifications,
  className = "",
}) => {
  return (
    <div
      className={`bg-white border border-[#E5E7EB] rounded-2xl p-6 ${className}`}
    >
      <CommonHeader size="xl" className="mb-6">
        Technical Specifications
      </CommonHeader>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <SpecSection section={specifications.systemConfiguration} />
        <SpecSection section={specifications.financialAnalysis} />
      </div>
    </div>
  );
};

export default TechnicalSpecifications;
