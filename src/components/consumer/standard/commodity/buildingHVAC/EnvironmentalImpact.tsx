import CommonHeader from "@/common/header/CommonHeader";
import BMiniCard from "@/components/consumer/basic/building/card/BMiniCard";
import { HvacEnvironmentalImpact } from "@/store/consumer/standard/designs/designPost/types/hvac";
import React from "react";

interface EnvironmentalImpactProps {
  impact: HvacEnvironmentalImpact;
  className?: string;
}

const EnvironmentalImpact: React.FC<EnvironmentalImpactProps> = ({
  impact,
  className = "",
}) => {
  const metrics = [
    impact.co2Reduction,
    impact.energySavings,
    impact.refrigerantGwp,
  ];

  return (
    <div
      className={`bg-white border border-[#E5E7EB] rounded-2xl p-6 ${className}`}
    >
      <CommonHeader size="xl" className="mb-6">
        Environmental Impact
      </CommonHeader>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {metrics.map((metric) => (
          <BMiniCard
            key={metric.label}
            layout="stacked"
            label={metric.label}
            value={metric.display}
            des={metric.subLabel}
            valueClass="text-[#15803D]!"
            bgClassName="bg-[#EAF7E6]/60"
          />
        ))}
      </div>
    </div>
  );
};

export default EnvironmentalImpact;
