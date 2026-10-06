import RadioIndicator from "@/common/button/RadioIndicator";
import React from "react";

interface EnergyPlanCardProps {
  title: string;
  rate: string;
  description: string;
  features: string[];
  selected: boolean;
  onClick: () => void;
}

const EnergyPlanCard: React.FC<EnergyPlanCardProps> = ({
  title,
  rate,
  description,
  features,
  selected,
  onClick,
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`text-left border-2 rounded-2xl p-5 transition-colors cursor-pointer ${
        selected
          ? "border-green-500 bg-green-50/50"
          : "border-gray-200 bg-white hover:border-gray-300"
      }`}
    >
      <div className="flex items-start justify-between mb-2">
        <p className="font-bold text-foreground">{title}</p>
        <RadioIndicator selected={selected} />
      </div>

      <p className="font-bold text-green-600 mb-2">{rate}</p>
      <p className="text-sm text-[#758179] mb-3">{description}</p>

      <ul className="space-y-1.5">
        {features.map((feature) => (
          <li
            key={feature}
            className="flex items-center gap-2 text-sm text-[#758179]"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
            {feature}
          </li>
        ))}
      </ul>
    </button>
  );
};

export default EnergyPlanCard;
