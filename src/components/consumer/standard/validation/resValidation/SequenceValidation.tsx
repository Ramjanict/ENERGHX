import CommonBorderWrapper from "@/common/button/CommonBorderWrapper";
import CommonButton from "@/common/button/CommonButton";
import SectionHeader from "@/common/header/SectionHeader";
import Spinner from "@/common/loading/Spinner";
import BMiniCard from "@/components/consumer/basic/building/card/BMiniCard";
import Welcome from "@/components/consumer/basic/dashboard/Welcome";
import InfoRow from "@/components/consumer/standard/commodity/solar/InfoRow";
import { ResValidation } from "@/store/consumer/standard/resValidation/types/resValidation";
import { StandardPlanCard } from "@/store/consumer/standard/Simulations/types/dashboard";
import {
  ArrowLeft,
  Battery,
  Car,
  CheckCircle2,
  DollarSign,
  Leaf,
  LucideIcon,
  ShieldCheck,
  Sun,
  Thermometer,
  TrendingUp,
  Wind,
  Zap,
} from "lucide-react";
import { LuCircleCheck } from "react-icons/lu";
import {
  formatMetricCardValue,
  formatTimestamp,
  statusToneClass,
} from "../formatMetricCard";
import RiskAssessmentCard from "./RiskAssessmentCard";
import ValidationChecklistCard from "./ValidationChecklistCard";

interface SequenceValidationProps {
  resValidation: ResValidation;
  onBackToBiomassSizing: () => void;
  onContinueToEngineeringReview: () => void;
  loading: boolean;
}

const READINESS_CARD_UI: Record<
  string,
  {
    icon: LucideIcon;
    iconColor: string;
    valueClass: string;
    bgClassName: string;
  }
> = {
  "System Readiness Score": {
    icon: CheckCircle2,
    iconColor: "text-primary",
    valueClass: "text-primary! font-bold! text-3xl!",
    bgClassName: "bg-[#EAF7E6]/50!",
  },
  "Renewable Coverage": {
    icon: Zap,
    iconColor: "text-primary",
    valueClass: "text-primary! font-bold! text-3xl!",
    bgClassName: "bg-[#EAF7E6]/50!",
  },
  "Annual Savings": {
    icon: DollarSign,
    iconColor: "text-blue-600",
    valueClass: "text-blue-600! font-bold! text-3xl!",
    bgClassName: "bg-blue-50/70!",
  },
  "Carbon Reduction": {
    icon: Leaf,
    iconColor: "text-primary",
    valueClass: "text-primary! font-bold! text-3xl!",
    bgClassName: "bg-[#EAF7E6]/50!",
  },
};

const SUMMARY_CARD_UI: Record<
  string,
  { icon: LucideIcon; iconColor: string; bgClassName: string }
> = {
  "Solar Capacity": {
    icon: Sun,
    iconColor: "text-amber-600",
    bgClassName: "bg-amber-50/70!",
  },
  "Wind Capacity": {
    icon: Wind,
    iconColor: "text-blue-600",
    bgClassName: "bg-blue-50/70!",
  },
  "Biomass Capacity": {
    icon: Leaf,
    iconColor: "text-primary",
    bgClassName: "bg-[#EAF7E6]/50!",
  },
  "HVAC Capacity": {
    icon: Thermometer,
    iconColor: "text-orange-600",
    bgClassName: "bg-orange-50/70!",
  },
  "Battery Capacity": {
    icon: Battery,
    iconColor: "text-violet-600",
    bgClassName: "bg-violet-50/70!",
  },
  "EV Charging Capacity": {
    icon: Car,
    iconColor: "text-sky-600",
    bgClassName: "bg-sky-50/70!",
  },
};

const RISK_ICON_MAP: Record<string, LucideIcon> = {
  technical: ShieldCheck,
  financial: DollarSign,
  implementation: TrendingUp,
  compliance: CheckCircle2,
};

const renderMetricCard = (
  card: StandardPlanCard,
  ui?: {
    icon: LucideIcon;
    iconColor: string;
    valueClass?: string;
    bgClassName: string;
  },
) => (
  <BMiniCard
    key={card.label}
    layout="stacked"
    icon={ui?.icon}
    label={card.label}
    value={formatMetricCardValue(card)}
    des={card.subtext || undefined}
    className="flex flex-col items-center text-center"
    bgClassName={ui?.bgClassName ?? "bg-[#EAF7E6]/50!"}
    iconColorClassName={ui?.iconColor}
    valueClass={ui?.valueClass ?? "text-[#112518]! font-bold! text-2xl!"}
  />
);

const FEATURED_SUMMARY_LABELS = new Set([
  "Solar Capacity",
  "Wind Capacity",
  "Biomass Capacity",
  "HVAC Capacity",
  "Battery Capacity",
  "EV Charging Capacity",
]);

const DETAIL_SUMMARY_LABELS = new Set([
  "Total Annual Production",
  "Total Project Cost",
  "Projected ROI",
]);

const SequenceValidation: React.FC<SequenceValidationProps> = ({
  resValidation,
  onBackToBiomassSizing,
  onContinueToEngineeringReview,
  loading,
}) => {
  const hero = resValidation?.hero;
  const readinessCards = resValidation?.overallSystemReadiness?.cards ?? [];
  const checklist = resValidation?.validationChecklist ?? [];
  const summaryCards = resValidation?.renewableSystemSummary?.cards ?? [];
  const risks = resValidation?.riskAssessment ?? [];

  const featuredSummary = summaryCards.filter(
    (card) =>
      FEATURED_SUMMARY_LABELS.has(card.label) ||
      (!DETAIL_SUMMARY_LABELS.has(card.label) && Boolean(card.subtext)),
  );
  const featuredKeys = new Set(featuredSummary.map((card) => card.label));
  const detailSummary = summaryCards.filter(
    (card) => !featuredKeys.has(card.label),
  );

  return (
    <div className="space-y-6">
      <Welcome
        title={
          hero?.title || "Renewable Energy System (RES) Sequence Validation"
        }
        description={
          hero?.subtitle ||
          "Validate all renewable energy sizing and engineering calculations before proposal generation"
        }
        Icons={LuCircleCheck}
        iconBg="bg-[#DCFCE7]"
        iconColor="text-[#00A63E]"
        className="border border-[rgba(22,163,74,0.20)]! bg-[linear-gradient(90deg,_rgba(22,163,74,0.08)_0%,_rgba(34,197,94,0.08)_100%)]!"
        size="3xl"
        statusLabel={hero?.status}
        statusClassName={statusToneClass(hero?.status ?? "")}
      />
      {loading ? (
        <Spinner size="xl" text="Validating..." />
      ) : (
        <>
          <CommonBorderWrapper isShadow>
            <SectionHeader size="xl" title="Overall System Readiness" />
            {resValidation.lastComputedOn && (
              <p className="text-sm text-[#758179] -mt-2 mb-4">
                Last computed: {formatTimestamp(resValidation.lastComputedOn)}
              </p>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {readinessCards.map((card) =>
                renderMetricCard(card, READINESS_CARD_UI[card.label]),
              )}
            </div>
          </CommonBorderWrapper>

          <CommonBorderWrapper isShadow>
            <SectionHeader size="xl" title="Validation Checklist" />
            <div className="space-y-4">
              {checklist.length > 0 ? (
                checklist.map((item) => (
                  <ValidationChecklistCard
                    key={item.key || item.label}
                    item={item}
                  />
                ))
              ) : (
                <p className="text-sm text-[#758179]">
                  No checklist items yet.
                </p>
              )}
            </div>
          </CommonBorderWrapper>

          <CommonBorderWrapper isShadow>
            <SectionHeader size="xl" title="Renewable System Summary" />
            {featuredSummary.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {featuredSummary.map((card) =>
                  renderMetricCard(card, SUMMARY_CARD_UI[card.label]),
                )}
              </div>
            )}
            {detailSummary.length > 0 && (
              <dl className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                {detailSummary.map((card) => (
                  <InfoRow
                    key={card.label}
                    label={card.label}
                    value={formatMetricCardValue(card)}
                    valueClassName={
                      card.label === "Projected ROI"
                        ? "text-green-600"
                        : undefined
                    }
                  />
                ))}
              </dl>
            )}
          </CommonBorderWrapper>

          <CommonBorderWrapper isShadow>
            <SectionHeader size="xl" title="Risk Assessment" />
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              {risks.map((item) => {
                const Icon = RISK_ICON_MAP[item.key] ?? ShieldCheck;
                return (
                  <RiskAssessmentCard
                    key={item.key || item.label}
                    icon={Icon}
                    label={item.label}
                    value={item.status}
                    valueClassName={statusToneClass(item.status)}
                  />
                );
              })}
            </div>
          </CommonBorderWrapper>

          <div className="flex flex-col sm:flex-row gap-3 sm:items-center justify-between">
            <CommonButton variant="outline" onClick={onBackToBiomassSizing}>
              <ArrowLeft className="w-4 h-4 mr-1.5" />
              Back to Biomass Sizing
            </CommonButton>

            <CommonButton onClick={onContinueToEngineeringReview}>
              Continue to Engineering Review
            </CommonButton>
          </div>
        </>
      )}
    </div>
  );
};

export default SequenceValidation;
