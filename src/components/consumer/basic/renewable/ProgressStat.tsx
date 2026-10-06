import CommonHeader from "@/common/header/CommonHeader";
import React from "react";

interface ProgressStatProps {
  label: string;
  status: string;
  percentage: number;
  description?: string;
  className?: string;
  color?: string;
}

const ProgressStat: React.FC<ProgressStatProps> = ({
  label,
  status,
  percentage,
  description,
  className,
  color = "bg-[#00A63E]",
}) => {
  return (
    <div className={`space-y-1.5 ${className ?? ""}`}>
      <div className="flex items-center justify-between">
        <CommonHeader size="sm" className="text-[#364153]!">
          {label}
        </CommonHeader>

        <CommonHeader size="sm" className="font-bold! text-[#00A63E]!">
          {status}
        </CommonHeader>
      </div>

      <div className="w-full h-2 rounded-full bg-[#D9DDE3] overflow-hidden">
        <div
          className={`h-full rounded-full ${color}`}
          style={{ width: `${percentage}%` }}
        />
      </div>

      {description && (
        <CommonHeader size="sm" className="text-[#6A7282]!">
          {description}
        </CommonHeader>
      )}
    </div>
  );
};

export default ProgressStat;
