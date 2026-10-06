import SectionHeader from "@/common/header/SectionHeader";
import { Check, ChevronRight, LucideIcon } from "lucide-react";
import React from "react";

interface SizingModuleCardProps {
  icon: LucideIcon;
  iconColor: string;
  title: string;
  description: string;
  bgClassName: string;
  isCompleted?: boolean;
  onConfigure: () => void;
}

const SizingModuleCard: React.FC<SizingModuleCardProps> = ({
  icon: Icon,
  iconColor,
  title,
  description,
  bgClassName,
  isCompleted = false,
  onConfigure,
}) => {
  return (
    <div
      className={`${bgClassName} rounded-2xl p-6 space-y-4 border border-[#E7E9E8]`}
    >
      <div className="w-14 h-14 rounded-full bg-white flex items-center justify-center ">
        <Icon className={`w-6 h-6 ${iconColor}`} />
      </div>

      <SectionHeader title={title} description={description} size="lg" />
      <button
        type="button"
        onClick={onConfigure}
        className={`flex items-center cursor-pointer gap-1 font-semibold text-sm transition-colors ${
          isCompleted
            ? "text-emerald-600 hover:text-emerald-700"
            : "text-blue-600 hover:text-blue-700"
        }`}
      >
        {isCompleted && <Check className="w-4 h-4" />}
        {isCompleted ? "COMPLETED" : "Configure System"}
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
};

export default SizingModuleCard;
