import {
  CheckCircle2,
  Clock,
  DollarSign,
  FileCheck,
  Leaf,
  ShieldCheck,
  XCircle,
  Zap,
} from "lucide-react";
import { EngineeringReviewStatusItem } from "@/store/consumer/standard/engineeringReview/types/engineeringReview";
import { statusToneClass } from "../formatMetricCard";

interface ApprovalMatrixRowProps {
  item: EngineeringReviewStatusItem;
}

const ICON_MAP: Record<string, typeof FileCheck> = {
  "technical-design": FileCheck,
  "financial-feasibility": DollarSign,
  "utility-compatibility": Zap,
  "renewable-integration": Leaf,
  "environmental-compliance": ShieldCheck,
};

const ApprovalMatrixRow: React.FC<ApprovalMatrixRowProps> = ({ item }) => {
  const Icon = ICON_MAP[item.key] ?? FileCheck;
  const normalized = item.status.toLowerCase();
  const StatusIcon =
    normalized === "approved"
      ? CheckCircle2
      : normalized === "rejected"
        ? XCircle
        : Clock;

  return (
    <div className="bg-[#EAF7E6]/30 border border-[#E7E9E8] rounded-xl p-5 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 rounded-lg bg-[#EAF7E6] flex items-center justify-center shrink-0">
          <Icon className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h4 className="font-bold text-[#112518]">{item.label}</h4>
          <p className="text-sm text-[#758179]">Status: {item.status}</p>
        </div>
      </div>
      <StatusIcon
        className={`w-6 h-6 shrink-0 ${statusToneClass(item.status)}`}
      />
    </div>
  );
};

export default ApprovalMatrixRow;
