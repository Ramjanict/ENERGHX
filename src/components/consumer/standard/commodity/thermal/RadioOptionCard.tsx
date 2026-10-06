import RadioIndicator from "@/common/button/RadioIndicator";
import React from "react";

interface RadioOptionCardProps {
  title: string;
  description: string;
  selected: boolean;
  onClick: () => void;
}

const RadioOptionCard: React.FC<RadioOptionCardProps> = ({
  title,
  description,
  selected,
  onClick,
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full cursor-pointer text-left flex items-start gap-3 border-2 rounded-xl p-4 transition-colors ${
        selected
          ? "border-primary bg-primary/5"
          : "border-[#E7E9E8] bg-white hover:border-gray-300"
      }`}
    >
      <RadioIndicator selected={selected} />

      <div>
        <p
          className={`font-bold ${selected ? "text-primary" : "text-[#112518]"} text-sm `}
        >
          {title}
        </p>
        <p className="text-sm text-[#758179]">{description}</p>
      </div>
    </button>
  );
};

export default RadioOptionCard;
