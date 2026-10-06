import CommonHeader from "@/common/header/CommonHeader";
import SectionHeader from "@/common/header/SectionHeader";
import { LucideIcon } from "lucide-react";
import React from "react";

interface StatBlockProps {
  icon?: LucideIcon;
  iconBg?: string;
  iconColor?: string;
  label: string;
  value: string | number;
  valueClass?: string;
  sub: string;
  className?: string;
}

const StatBlock: React.FC<StatBlockProps> = ({
  icon: Icon,
  iconBg = "bg-orange-100",
  iconColor = "text-orange-500",
  label,
  value,
  valueClass = "text-foreground",
  sub,
  className,
}) => {
  return (
    <div
      className={`flex flex-col items-center justify-center text-center ${className ?? ""}`}
    >
      {Icon && (
        <div
          className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-3 ${iconBg}`}
        >
          <Icon className={`w-6 h-6 ${iconColor}`} />
        </div>
      )}
      <CommonHeader size="sm">{label}</CommonHeader>
      <SectionHeader
        title={value}
        description={sub}
        className={`mb-0! flex flex-col items-center justify-center! ${valueClass}`}
      />
    </div>
  );
};

export default StatBlock;
