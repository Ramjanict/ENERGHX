import CommonHeader from "@/common/header/CommonHeader";
import React, { ReactNode } from "react";

interface FeatureCardProps {
  icon: ReactNode;
  title: string;
  description: string;
  iconBgClassName?: string;
  iconColorClassName?: string;
  className?: string;
  onClick?: () => void;
  isRow?: boolean;
}

const FeatureCard: React.FC<FeatureCardProps> = ({
  icon,
  title,
  description,
  iconBgClassName = "bg-purple-100",
  iconColorClassName = "text-purple-600",
  className = "",
  isRow = false,
  onClick,
}) => {
  return (
    <div
      onClick={onClick}
      className={`bg-white border-2 border-[#F3F4F6] rounded-[14px] p-4 sm:p-6 ${isRow && "flex-row"} flex flex-col  gap-1 sm:gap-3 ${
        onClick ? "cursor-pointer hover:shadow-md transition-shadow" : ""
      } ${className}`}
    >
      <div
        className={`w-16 h-16 rounded-2xl flex items-center justify-center ${iconBgClassName} shrink-0`}
      >
        <div className={`w-8 h-8  ${iconColorClassName}`}>{icon}</div>
      </div>
      <div>
        <CommonHeader className="font-bold! ">{title}</CommonHeader>
        {description && <CommonHeader size="sm">{description}</CommonHeader>}
      </div>
    </div>
  );
};

export default FeatureCard;
