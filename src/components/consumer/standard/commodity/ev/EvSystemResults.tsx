import SectionHeader from "@/common/header/SectionHeader";
import BMiniCard from "@/components/consumer/basic/building/card/BMiniCard";
import { SolveEvDesignResponse } from "@/store/consumer/standard/designs/ev/types/evDesign";
import { DollarSign, Plug, TrendingUp, Zap } from "lucide-react";
import ConsiderationCard from "../wind/WindSiteConsiderations";
import EvEnergyDeliveryChart from "./EvEnergyDeliveryChart";
import EvEnvironmentalImpact from "./EvEnvironmentalImpact";
import EvRecommendedEquipment from "./EvRecommendedEquipment";
import EvTechnicalSpecifications from "./EvTechnicalSpecifications";

interface SystemResultsProps {
  results: SolveEvDesignResponse["data"];
  selectedProductIds: string[];
  categoryLabels: Record<string, string>;
  onSelectProduct: (productId: string | number) => void;
  onViewProductDetails: (productId: string | number) => void;
}

const EvSystemResults: React.FC<SystemResultsProps> = ({
  results,
  selectedProductIds,
  categoryLabels,
  onSelectProduct,
  onViewProductDetails,
}) => {
  const { notes, assumptions } = results;
  const {
    summary,
    charts,
    technicalSpecifications,
    environmentalImpact,
    recommendedEquipment,
  } = results.results;

  return (
    <div className="space-y-6">
      <SectionHeader size="xl" title="EV Infrastructure Sizing Results" />

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <BMiniCard
          icon={Plug}
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
          value={summary.annualEnergyConsumption.value.toLocaleString()}
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
          value={`$${summary.annualOperatingCost.value.toLocaleString()}`}
          des={summary.annualOperatingCost.subLabel}
          bgClassName="bg-amber-50/70 flex flex-col items-center justify-center"
          iconClassName=" flex! flex-col! items-center! justify-center! "
          iconBgClassName=""
          iconColorClassName="text-amber-600 w-8! h-8!"
          valueClass="text-amber-600 font-bold!"
        />
        <BMiniCard
          icon={TrendingUp}
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

      {notes.length > 0 && (
        <ConsiderationCard title="Sizing Notes" items={notes} />
      )}

      <EvEnergyDeliveryChart chart={charts.monthlyEnergyDeliveryProfile} />

      <EvTechnicalSpecifications specifications={technicalSpecifications} />

      <EvEnvironmentalImpact impact={environmentalImpact} />

      <EvRecommendedEquipment
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
          items={assumptions.map(
            (assumption) =>
              `${assumption.field} = ${assumption.value} (${assumption.source})`,
          )}
        />
      )}
    </div>
  );
};

export default EvSystemResults;
