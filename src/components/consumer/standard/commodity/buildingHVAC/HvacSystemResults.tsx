import SectionHeader from "@/common/header/SectionHeader";
import BMiniCard from "@/components/consumer/basic/building/card/BMiniCard";
import { SolveHvacDesignData } from "@/store/consumer/standard/designs/designPost/types/hvac";
import { DollarSign, Snowflake, Thermometer, Zap } from "lucide-react";
import ConsiderationCard from "../wind/WindSiteConsiderations";
import EnvironmentalImpact from "./EnvironmentalImpact";
import EquipmentComparisonList from "./EquipmentComparisonList";
import MonthlyEnergyLoadChart from "./MonthlyEnergyLoadChart";
import TechnicalSpecifications from "./TechnicalSpecifications";

interface SystemResultsProps {
  results: SolveHvacDesignData;
  selectedProductIds: string[];
  categoryLabels: Record<string, string>;
  onSelectProduct: (productId: string) => void;
  onViewProductDetails: (productId: string) => void;
}

const formatMetricValue = (value: number | string) =>
  typeof value === "number" ? value.toLocaleString() : value;

const HvacSystemResults: React.FC<SystemResultsProps> = ({
  results,
  selectedProductIds,
  categoryLabels,
  onSelectProduct,
  onViewProductDetails,
}) => {
  const { assumptions } = results;
  const {
    summary,
    charts,
    technicalSpecifications,
    environmentalImpact,
    recommendedEquipment,
  } = results.results;

  return (
    <div className="space-y-6">
      <SectionHeader size="xl" title="HVAC Sizing Results" />

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <BMiniCard
          icon={Thermometer}
          label="Recommended Capacity"
          value={`${summary.recommendedCapacity.value} ${summary.recommendedCapacity.unit}`}
          des={summary.recommendedCapacity.subLabel}
          bgClassName="bg-blue-50/70 flex flex-col items-center justify-center"
          iconClassName=" flex! flex-col! items-center! justify-center! "
          iconBgClassName=""
          iconColorClassName="text-blue-600 w-8! h-8!"
          valueClass="text-blue-600 font-bold!"
        />
        <BMiniCard
          icon={Zap}
          label="Annual Energy Consumption"
          value={formatMetricValue(summary.annualEnergyConsumption.value)}
          des={summary.annualEnergyConsumption.subLabel}
          bgClassName="bg-green-50/70 flex flex-col items-center justify-center"
          iconClassName=" flex! flex-col! items-center! justify-center! "
          iconBgClassName=""
          iconColorClassName="text-green-600 w-8! h-8!"
          valueClass="text-green-600 font-bold!"
        />
        <BMiniCard
          icon={DollarSign}
          label="Annual Operating Cost"
          value={`$${formatMetricValue(summary.annualOperatingCost.value)}`}
          des={summary.annualOperatingCost.subLabel}
          bgClassName="bg-amber-50/70 flex flex-col items-center justify-center"
          iconClassName=" flex! flex-col! items-center! justify-center! "
          iconBgClassName=""
          iconColorClassName="text-amber-600 w-8! h-8!"
          valueClass="text-amber-600 font-bold!"
        />
        <BMiniCard
          icon={Snowflake}
          label="Energy Efficiency Rating"
          value={summary.energyEfficiencyRating.value}
          des={summary.energyEfficiencyRating.subLabel}
          bgClassName="bg-purple-50/70 flex flex-col items-center justify-center"
          iconClassName=" flex! flex-col! items-center! justify-center! "
          iconBgClassName=""
          iconColorClassName="text-purple-600 w-8! h-8!"
          valueClass="text-purple-600 font-bold!"
        />
      </div>

      <MonthlyEnergyLoadChart chart={charts.monthlyEnergyLoadProfile} />

      <TechnicalSpecifications specifications={technicalSpecifications} />

      <EnvironmentalImpact impact={environmentalImpact} />

      <EquipmentComparisonList
        recommended={recommendedEquipment}
        selectedProductIds={selectedProductIds}
        categoryLabels={categoryLabels}
        onSelect={onSelectProduct}
        onViewDetails={onViewProductDetails}
      />

      {assumptions.length > 0 && (
        <ConsiderationCard
          className="bg-[#EFF6FF]! border-[#BEDBFF]!"
          dotColor="bg-[#155DFC]"
          title="Assumptions Applied"
          items={assumptions}
        />
      )}
    </div>
  );
};

export default HvacSystemResults;
