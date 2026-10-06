import CommonHeader from "@/common/header/CommonHeader";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  icon?: LucideIcon;
  label: string;
  value: string | number;
  valueClass?: string;
  des?: string;
  className?: string;
  bgClassName?: string;
  iconColorClassName?: string;
  iconBgClassName?: string;
  iconClassName?: string;
  layout?: "inline" | "stacked";
}

const BMiniCard: React.FC<StatCardProps> = ({
  icon: Icon,
  label,
  value,
  valueClass,
  des,
  className = "",
  bgClassName = "bg-[#EAF7E6]/30",
  iconColorClassName = "text-primary-green",
  iconBgClassName,
  layout = "inline",
  iconClassName,
}) => {
  if (layout === "stacked") {
    return (
      <div
        className={`${bgClassName} border-[#E5E7EB] rounded-xl p-5 ${className} border`}
      >
        {Icon && (
          <div
            className={`w-8 h-8 rounded-lg flex items-center justify-center mb-1 ${iconBgClassName}`}
          >
            <Icon className={`w-6 h-6 ${iconColorClassName}`} />
          </div>
        )}
        <CommonHeader size="sm">{label}</CommonHeader>
        <CommonHeader size="2xl" className={valueClass}>
          {value}
        </CommonHeader>
        {des && <CommonHeader size="sm">{des}</CommonHeader>}
      </div>
    );
  }

  return (
    <div
      className={`${bgClassName} bg-[#EAF7E6]/30 border-[#E5E7EB] rounded-xl p-5 space-y-3 ${className} border `}
    >
      <div className={`flex items-center gap-1 ${iconClassName}`}>
        {Icon && (
          <div
            className={`w-8 h-8 rounded-lg flex items-center justify-center ${iconBgClassName}`}
          >
            <Icon className={`w-6 h-6 ${iconColorClassName}`} />
          </div>
        )}
        <CommonHeader size="sm">{label}</CommonHeader>
      </div>
      <CommonHeader size="2xl" className={valueClass}>
        {value}
      </CommonHeader>
      {des && <CommonHeader size="sm">{des}</CommonHeader>}
    </div>
  );
};

export default BMiniCard;
