import { DollarSign, FileCheck, Leaf, ShieldCheck } from "lucide-react";
import { EngineeringReviewStatusItem } from "@/store/consumer/standard/engineeringReview/types/engineeringReview";
import { statusToneClass } from "../formatMetricCard";

interface ReviewProgressCardProps {
  item: EngineeringReviewStatusItem;
}

const ICON_MAP: Record<string, typeof FileCheck> = {
  technical: FileCheck,
  financial: DollarSign,
  sustainability: Leaf,
  compliance: ShieldCheck,
};

const ReviewProgressCard: React.FC<ReviewProgressCardProps> = ({ item }) => {
  const Icon = ICON_MAP[item.key] ?? FileCheck;

  return (
    <div className="bg-[#EAF7E6]/30 border border-[#E7E9E8] rounded-xl p-6 flex flex-col items-center text-center gap-2">
      <Icon className="w-6 h-6 text-primary" />
      <p className="font-semibold text-[#112518]">{item.label}</p>
      <p className={`text-xl font-bold ${statusToneClass(item.status)}`}>
        {item.status}
      </p>
    </div>
  );
};

export default ReviewProgressCard;
