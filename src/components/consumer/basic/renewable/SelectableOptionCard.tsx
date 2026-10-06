import SectionHeader from "@/common/header/SectionHeader";
import { LucideIcon } from "lucide-react";
import React from "react";

interface SelectableOptionCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  selected?: boolean;
  onClick: () => void;
  selectedColor?: string;
}

const SelectableOptionCard: React.FC<SelectableOptionCardProps> = ({
  icon: Icon,
  title,
  description,
  selected = false,
  onClick,
  selectedColor = "border-green-500 bg-green-50",
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex-1 flex flex-col items-center gap-2 border rounded-2xl py-8 px-4 transition-colors cursor-pointer ${
        selected
          ? selectedColor
          : "border-gray-200 bg-white hover:border-gray-300"
      }`}
    >
      <Icon
        className={`w-6 h-6 ${selected ? "text-green-600" : "text-gray-400"}`}
      />
      <SectionHeader
        size="md"
        title={title}
        description={description}
        className="mb-0! flex flex-col items-center justify-center!"
      />
    </button>
  );
};

export default SelectableOptionCard;
