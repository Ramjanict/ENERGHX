import { BiomassEnvironmentalBenefit } from "@/store/consumer/standard/designs/designPost/types/biomass";
import { Leaf, LucideIcon, Users } from "lucide-react";

interface EnvironmentalBenefitsProps {
  benefits: BiomassEnvironmentalBenefit[];
}

const BENEFIT_ICONS: Record<string, LucideIcon> = {
  "Carbon Neutral": Leaf,
  "Local Economy": Users,
};

const EnvironmentalBenefits: React.FC<EnvironmentalBenefitsProps> = ({
  benefits,
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
      {benefits.map((benefit) => {
        const Icon = BENEFIT_ICONS[benefit.title] ?? Leaf;

        return (
          <div key={benefit.title} className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-lg bg-[#EAF7E6] flex items-center justify-center shrink-0">
              <Icon className="w-4 h-4 text-primary" />
            </div>
            <div>
              <p className="font-semibold text-[#112518]">{benefit.title}</p>
              <p className="text-sm text-green-600 font-medium">
                {benefit.value}
              </p>
              <p className="text-xs text-[#758179] mt-0.5">{benefit.note}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default EnvironmentalBenefits;
