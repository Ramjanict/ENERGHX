import SectionHeader from "@/common/header/SectionHeader";
import ButtonWithLoading from "@/common/loading/ButtonWithLoading";
import { ChevronRight, LucideIcon } from "lucide-react";
import React from "react";
import BMiniCard from "../../basic/building/card/BMiniCard";

export interface SimulationStat {
  label: string;
  value: string;
}

interface SimulationModuleCardProps {
  icon: LucideIcon;
  iconColor: string;
  title: string;
  description: string;
  stats: [SimulationStat, SimulationStat, SimulationStat, SimulationStat];
  bgClassName: string;
  borderClassName?: string;
  onRunSimulation: () => void;
  isLoading?: boolean;
}

const SimulationModuleCard: React.FC<SimulationModuleCardProps> = ({
  icon: Icon,
  iconColor,
  title,
  description,
  stats,
  bgClassName,
  borderClassName = "border-[#E7E9E8]",
  onRunSimulation,
  isLoading,
}) => {
  return (
    <div
      className={`${bgClassName} ${borderClassName} rounded-2xl p-6 flex flex-col border`}
    >
      <div className="w-14 h-14 rounded-full bg-white flex items-center justify-center mb-5 shadow-xs">
        <Icon className={`w-6 h-6 ${iconColor}`} />
      </div>

      <SectionHeader
        size="lg"
        title={title}
        description={description}
        className="mb-4"
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="bg-white rounded-xl p-3.5 flex flex-col justify-center min-h-[72px]"
          >
            <span className="text-xs text-gray-500 font-normal leading-tight">
              {stat.label}
            </span>
            <span className="text-base font-bold text-gray-900 mt-1">
              {stat.value}
            </span>
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={onRunSimulation}
        disabled={isLoading}
        className="mt-auto flex items-center justify-center gap-1.5 border border-gray-200 bg-white hover:bg-gray-50 rounded-xl py-3 font-semibold text-gray-800 transition-colors cursor-pointer disabled:cursor-not-allowed disabled:opacity-50 disabled:pointer-events-none"
      >
        {isLoading ? (
          <ButtonWithLoading
            title="Processing..."
            textColor="text-primary!"
            borderColor="border-primary!"
          />
        ) : (
          <>
            Run Simulation
            <ChevronRight className="w-4 h-4" />
          </>
        )}
      </button>
    </div>
  );
};

export default SimulationModuleCard;
