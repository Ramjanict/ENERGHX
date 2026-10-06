import { Leaf, TrendingUp } from "lucide-react";
import React from "react";
import BMiniCard from "../../basic/building/card/BMiniCard";

interface SavingsImpactCardsProps {
  potentialAdditionalSavings?: {
    amount?: number | string | null;
    description?: string;
  };
  enhancedCo2Reduction?: {
    value?: number | string | null;
    description?: string;
  };
}

const SavingsImpactCards: React.FC<SavingsImpactCardsProps> = ({
  potentialAdditionalSavings,
  enhancedCo2Reduction,
}) => {
  const savingsValue =
    potentialAdditionalSavings?.amount != null
      ? `$${potentialAdditionalSavings.amount.toLocaleString()}/year`
      : "$2,400/year";
  const savingsDes =
    potentialAdditionalSavings?.description ||
    "With advanced optimization and battery storage";

  const co2Value =
    enhancedCo2Reduction?.value != null
      ? `+${enhancedCo2Reduction.value} tons/year`
      : "+8.5 tons/year";
  const co2Des =
    enhancedCo2Reduction?.description ||
    "Through complete renewable integration";

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
      <BMiniCard
        icon={TrendingUp}
        iconColorClassName="text-green-600"
        label="Potential Additional Savings"
        value={savingsValue}
        valueClass="text-green-600"
        des={savingsDes}
        className=" border-[rgba(45,173,0,0.20)] bg-[linear-gradient(90deg,_rgba(45,173,0,0.10)_0%,_rgba(45,173,0,0.05)_100%)]"
        layout="stacked"
      />

      <BMiniCard
        icon={Leaf}
        iconColorClassName="text-green-600"
        label="Enhanced CO2 Reduction"
        value={co2Value}
        valueClass="text-green-600"
        des={co2Des}
        className="border-[rgba(0,166,62,0.20)] bg-[linear-gradient(90deg,_rgba(0,166,62,0.10)_0%,_rgba(0,166,62,0.05)_100%)]"
        layout="stacked"
      />
    </div>
  );
};

export default SavingsImpactCards;
