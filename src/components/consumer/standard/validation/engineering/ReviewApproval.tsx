import CommonBorderWrapper from "@/common/button/CommonBorderWrapper";
import CommonButton from "@/common/button/CommonButton";
import SectionHeader from "@/common/header/SectionHeader";
import { Spinner } from "@/common/loading/Spinner";
import BMiniCard from "@/components/consumer/basic/building/card/BMiniCard";
import Welcome from "@/components/consumer/basic/dashboard/Welcome";
import { EngineeringReview } from "@/store/consumer/standard/engineeringReview/types/engineeringReview";
import { StandardPlanCard } from "@/store/consumer/standard/Simulations/types/dashboard";
import {
  ArrowLeft,
  CheckCircle2,
  Clock,
  DollarSign,
  Leaf,
  LucideIcon,
  TrendingUp,
  Zap,
} from "lucide-react";
import { LuCircleCheck } from "react-icons/lu";
import {
  formatMetricCardValue,
  formatTimestamp,
  statusToneClass,
} from "../formatMetricCard";
import ApprovalMatrixRow from "./ApprovalMatrixRow";
import ReviewProgressCard from "./ReviewProgressCard";

interface ReviewApprovalProps {
  engineeringReview: EngineeringReview;
  onBackToValidation: () => void;
  onGenerateFinalProposal: () => void;
  loading: boolean;
}

const SUMMARY_CARD_UI: Record<
  string,
  { icon: LucideIcon; valueClass?: string }
> = {
  "Total System Capacity": { icon: Zap },
  "Expected Energy Offset": { icon: TrendingUp },
  "Annual Savings": {
    icon: DollarSign,
    valueClass: "text-green-600! font-bold! text-xl!",
  },
  "Carbon Reduction": {
    icon: Leaf,
    valueClass: "text-green-600! font-bold! text-xl!",
  },
  "Estimated Payback": { icon: Clock },
};

const renderSummaryCard = (card: StandardPlanCard) => {
  const ui = SUMMARY_CARD_UI[card.label];
  return (
    <BMiniCard
      key={card.label}
      layout="stacked"
      icon={ui?.icon ?? Zap}
      label={card.label}
      value={formatMetricCardValue(card)}
      des={card.subtext || undefined}
      className="flex flex-col items-center text-center"
      bgClassName="bg-[#EAF7E6]/30!"
      iconColorClassName="text-primary"
      valueClass={ui?.valueClass ?? "text-[#112518]! font-bold! text-xl!"}
    />
  );
};

const humanizeNextAction = (type: string | null) => {
  if (!type) return "--";
  return type
    .split(/[\s_-]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join(" ");
};

const ReviewApproval: React.FC<ReviewApprovalProps> = ({
  engineeringReview,
  onBackToValidation,
  onGenerateFinalProposal,
  loading,
}) => {
  const {
    hero,
    reviewProgress,
    engineeringApprovalMatrix,
    finalEngineeringSummary,
    approvalStatus,
  } = engineeringReview;

  return (
    <div className="space-y-6">
      <Welcome
        title={hero.title}
        description={hero.subtitle}
        Icons={LuCircleCheck}
        iconBg="bg-[#DCFCE7]"
        iconColor="text-[#00A63E]"
        className="border border-[rgba(22,163,74,0.20)]! bg-[linear-gradient(90deg,_rgba(22,163,74,0.08)_0%,_rgba(34,197,94,0.08)_100%)]!"
        size="3xl"
        statusLabel={hero.status}
        statusClassName={statusToneClass(hero.status)}
      />

      {loading ? (
        <Spinner size="xl" text="Validating..." />
      ) : (
        <>
          <CommonBorderWrapper isShadow>
            <SectionHeader size="xl" title="Review Progress" />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {reviewProgress.map((item) => (
                <ReviewProgressCard key={item.key} item={item} />
              ))}
            </div>
          </CommonBorderWrapper>

          <CommonBorderWrapper isShadow>
            <SectionHeader size="xl" title="Engineering Approval Matrix" />
            <div className="space-y-4">
              {engineeringApprovalMatrix.map((item) => (
                <ApprovalMatrixRow key={item.key} item={item} />
              ))}
            </div>
          </CommonBorderWrapper>

          <CommonBorderWrapper isShadow>
            <SectionHeader size="xl" title="Final Engineering Summary" />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              {finalEngineeringSummary.cards.map(renderSummaryCard)}
            </div>
          </CommonBorderWrapper>

          <div className="bg-[#EAF7E6]/40 border border-[rgba(22,163,74,0.25)] rounded-2xl p-4 sm:p-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1 space-y-6">
                <div>
                  <p className="font-bold text-[#112518] text-lg mb-1">
                    Approval Status
                  </p>
                  <p
                    className={`text-lg sm:text-2xl md:text-3xl font-extrabold mb-1 ${statusToneClass(approvalStatus.status)}`}
                  >
                    {approvalStatus.label}
                  </p>
                  {approvalStatus.nextAction.type && (
                    <p className="text-sm text-[#758179]">
                      Next action:{" "}
                      {humanizeNextAction(approvalStatus.nextAction.type)}
                      {approvalStatus.nextAction.target
                        ? ` → ${approvalStatus.nextAction.target}`
                        : ""}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <p className="text-sm text-[#758179]">Approval Timestamp</p>
                    <p className="font-bold text-[#112518]">
                      {formatTimestamp(approvalStatus.approvalTimestamp)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-[#758179]">Reviewed By</p>
                    <p className="font-bold text-[#112518]">
                      {approvalStatus.reviewedBy || "--"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-[#758179]">Associate ID</p>
                    <p className="font-bold text-[#112518]">
                      {approvalStatus.associateId || "--"}
                    </p>
                  </div>
                </div>

                {approvalStatus.reasons.length > 0 && (
                  <div>
                    <p className="text-sm text-[#758179] mb-1">Reasons</p>
                    <ul className="list-disc pl-5 space-y-1">
                      {approvalStatus.reasons.map((reason) => (
                        <li key={reason} className="font-medium text-[#112518]">
                          {reason}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {approvalStatus.offendingSections.length > 0 && (
                  <div>
                    <p className="text-sm text-[#758179] mb-1">
                      Offending Sections
                    </p>
                    <ul className="list-disc pl-5 space-y-1">
                      {approvalStatus.offendingSections.map((section) => (
                        <li
                          key={section}
                          className="font-medium text-[#112518]"
                        >
                          {section}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
            <CommonButton variant="outline" onClick={onBackToValidation}>
              <ArrowLeft className="w-4 h-4 mr-1.5" />
              Back to Validation
            </CommonButton>

            <CommonButton onClick={onGenerateFinalProposal}>
              Generate Final Proposal
            </CommonButton>
          </div>
        </>
      )}
    </div>
  );
};

export default ReviewApproval;
