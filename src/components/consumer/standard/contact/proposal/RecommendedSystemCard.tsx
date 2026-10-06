import SectionHeader from "@/common/header/SectionHeader";
import { formatCurrency, formatNumber } from "@/lib/utils";
import { Battery, CheckCircle2, Leaf, Sun, Wind } from "lucide-react";
import { RecommendedSystem } from "./types";

interface RecommendedSystemCardProps {
  system: RecommendedSystem;
}

const ICON_MAP = {
  solar: Sun,
  wind: Wind,
  biomass: Leaf,
  battery: Battery,
};

const ICON_COLOR_MAP: Record<RecommendedSystem["icon"], string> = {
  solar: "text-[#D08700]",
  wind: "text-[#155DFC]",
  biomass: "text-primary",
  battery: "text-[#9810FA]",
};

const RecommendedSystemCard: React.FC<RecommendedSystemCardProps> = ({
  system,
}) => {
  const Icon = ICON_MAP[system.icon];

  return (
    <div className={`rounded-2xl p-5 ${system.bgClassName}`}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3 ">
          <div className="flex items-center justify-center shrink-0 bg-white rounded-full p-3">
            <Icon
              className={`w-6 h-6 shrink-0 ${ICON_COLOR_MAP[system.icon]}`}
            />
          </div>

          <div>
            <SectionHeader
              size="lg"
              title={system.title}
              description={system.subtitle}
            />
          </div>
        </div>
        <CheckCircle2 className="w-5 h-5 text-primary shrink-0" />
      </div>

      <div className="grid grid-cols-2 gap-y-3">
        <SectionHeader
          size="lg"
          title={formatCurrency(system.systemCost)}
          description="System Cost"
          direction="col-reverse"
        />

        <SectionHeader
          size="lg"
          title={
            system.annualGenerationKwh !== null && !isNaN(Number(system.annualGenerationKwh))
              ? `${formatNumber(system.annualGenerationKwh)} kWh`
              : "N/A"
          }
          description="Annual Generation"
          direction="col-reverse"
        />

        <SectionHeader
          size="lg"
          title={formatCurrency(system.annualSavings)}
          description="Annual Savings"
          direction="col-reverse"
          className="text-green-600!"
        />

        <SectionHeader
          size="lg"
          title={
            system.paybackYears !== null && !isNaN(Number(system.paybackYears))
              ? `${formatNumber(system.paybackYears)} yrs`
              : "N/A"
          }
          description="Payback Period"
          direction="col-reverse"
        />
      </div>
    </div>
  );
};

export default RecommendedSystemCard;
