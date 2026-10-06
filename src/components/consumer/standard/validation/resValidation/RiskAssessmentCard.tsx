import { LucideIcon } from "lucide-react";

interface RiskAssessmentCardProps {
  icon: LucideIcon;
  label: string;
  value: string;
  valueClassName?: string;
}

const RiskAssessmentCard: React.FC<RiskAssessmentCardProps> = ({
  icon: Icon,
  label,
  value,
  valueClassName = "text-green-600",
}) => {
  return (
    <div className="bg-[#EAF7E6]/30 border border-[#E7E9E8] rounded-xl p-6 flex flex-col items-center text-center gap-2">
      <Icon className="w-6 h-6 text-primary" />
      <p className="font-semibold text-[#112518]">{label}</p>
      <p className={`text-xl font-bold ${valueClassName}`}>{value}</p>
    </div>
  );
};

export default RiskAssessmentCard;
