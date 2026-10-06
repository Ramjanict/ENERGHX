import BMiniCard from "@/components/consumer/basic/building/card/BMiniCard";
import { Leaf, TreePine, Zap } from "lucide-react";

interface BatteryEnvironmentalBenefitsProps {
  co2AvoidedTonsPerYear: number;
  treesEquivalent: number;
  gridIndependencePct: number;
}

const BatteryEnvironmentalBenefits: React.FC<
  BatteryEnvironmentalBenefitsProps
> = ({ co2AvoidedTonsPerYear, treesEquivalent, gridIndependencePct }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <BMiniCard
        icon={Leaf}
        label="CO2 Avoided"
        value={`${co2AvoidedTonsPerYear} tons/yr`}
        des="From reduced grid draw"
        bgClassName="bg-white flex flex-col items-start justify-center"
        iconBgClassName="bg-[#EAF7E6]"
        iconColorClassName="text-primary w-6! h-6!"
        valueClass="text-[#112518]! font-bold!"
      />
      <BMiniCard
        icon={TreePine}
        label="Equivalent Trees"
        value={treesEquivalent.toLocaleString()}
        des="Planted per year"
        bgClassName="bg-white flex flex-col items-start justify-center"
        iconBgClassName="bg-[#EAF7E6]"
        iconColorClassName="text-primary w-6! h-6!"
        valueClass="text-[#112518]! font-bold!"
      />
      <BMiniCard
        icon={Zap}
        label="Grid Independence"
        value={`${gridIndependencePct}%`}
        des="Of daily load served"
        bgClassName="bg-white flex flex-col items-start justify-center"
        iconBgClassName="bg-[#EAF7E6]"
        iconColorClassName="text-primary w-6! h-6!"
        valueClass="text-green-600! font-bold!"
      />
    </div>
  );
};

export default BatteryEnvironmentalBenefits;
