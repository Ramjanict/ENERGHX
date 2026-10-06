import CommonBorderWrapper from "@/common/button/CommonBorderWrapper";
import SectionHeader from "@/common/header/SectionHeader";
import {
  BatterySpecSection,
  BatteryTechnicalSpecifications as BatteryTechnicalSpecificationsType,
} from "@/store/consumer/standard/designs/battery/types/batteryDesign";
import InfoRow from "../solar/InfoRow";

interface BatteryTechnicalSpecificationsProps {
  specifications: BatteryTechnicalSpecificationsType;
}

const EMPHASIS_CLASSES: Record<string, string> = {
  positive: "text-green-600 font-semibold",
  negative: "text-red-600 font-semibold",
};

const SpecSection: React.FC<{ section: BatterySpecSection }> = ({
  section,
}) => (
  <div className="space-y-4">
    <SectionHeader size="lg" title={section.label} />
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

const BatteryTechnicalSpecifications: React.FC<
  BatteryTechnicalSpecificationsProps
> = ({ specifications }) => {
  return (
    <CommonBorderWrapper isShadow>
      <SectionHeader title={specifications.label} />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
        <SpecSection section={specifications.batterySystem} />
        <SpecSection section={specifications.financialAnalysis} />
      </div>
    </CommonBorderWrapper>
  );
};

export default BatteryTechnicalSpecifications;
