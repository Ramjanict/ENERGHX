import CommonBorderWrapper from "@/common/button/CommonBorderWrapper";
import CommonButton from "@/common/button/CommonButton";
import SectionHeader from "@/common/header/SectionHeader";
import Spinner from "@/common/loading/Spinner";
import BMiniCard from "@/components/consumer/basic/building/card/BMiniCard";
import Welcome from "@/components/consumer/basic/dashboard/Welcome";
import {
  AlertTriangle,
  ArrowLeft,
  DollarSign,
  Download,
  FileText,
  TrendingUp,
} from "lucide-react";
import { formatCurrency, formatNumber } from "@/lib/utils";
import { FaRegCircleCheck } from "react-icons/fa6";
import CostSummarySection from "./CostSummarySection";
import {
  COST_SUMMARY,
  CUMULATIVE_SAVINGS,
  ENGINEERING_SERVICES,
  PROPOSAL_TOP_STATS,
  RECOMMENDED_SYSTEMS,
  SAVINGS_FORECAST,
  SAVINGS_FORECAST_SUMMARY,
  TIMELINE_PHASES,
} from "./data";
import EngineeringServicesList from "./EngineeringServicesList";
import ProjectTimelineList from "./ProjectTimelineList";
import RecommendedSystemCard from "./RecommendedSystemCard";
import SavingsForecastSection from "./SavingsForecastSection";
import {
  CostSummary,
  CumulativeSavingsPoint,
  EngineeringServiceItem,
  ProposalTopStats,
  RecommendedSystem,
  SavingsForecastSummary,
  SavingsForecastYear,
  TimelinePhase,
} from "./types";

interface ProjectProposalProps {
  onBackToSystemSizing: () => void;
  onDownloadProposalPdf: () => void;
  onApproveAndContinue: () => void;
  topStats?: ProposalTopStats;
  systems?: RecommendedSystem[];
  engineeringServices?: EngineeringServiceItem[];
  timelinePhases?: TimelinePhase[];
  savingsForecast?: SavingsForecastYear[];
  cumulativeSavings?: CumulativeSavingsPoint[];
  savingsSummary?: SavingsForecastSummary;
  costSummary?: CostSummary;
  isApproving?: boolean;
  isDownloading?: boolean;
  loading?: boolean;
  isBlocked?: boolean;
  requiredStep?: string | null;
  onGoToRequiredStep?: () => void;
}

const ProjectProposal: React.FC<ProjectProposalProps> = ({
  onBackToSystemSizing,
  onDownloadProposalPdf,
  onApproveAndContinue,
  topStats = PROPOSAL_TOP_STATS,
  systems = RECOMMENDED_SYSTEMS,
  engineeringServices = ENGINEERING_SERVICES,
  timelinePhases = TIMELINE_PHASES,
  savingsForecast = SAVINGS_FORECAST,
  cumulativeSavings = CUMULATIVE_SAVINGS,
  savingsSummary = SAVINGS_FORECAST_SUMMARY,
  costSummary = COST_SUMMARY,
  isApproving = false,
  isDownloading = false,
  loading = false,
  isBlocked = false,
  requiredStep,
  onGoToRequiredStep,
}) => {
  return (
    <div className="space-y-6">
      <Welcome
        title="Project Proposal"
        description="Comprehensive renewable energy implementation plan"
        Icons={FileText}
        iconBg="bg-primary/20"
        iconColor="text-primary"
        className="border border-[rgba(45,173,0,0.2)]! bg-[linear-gradient(90deg,rgba(45,173,0,0.1)_0%,rgba(21,93,252,0.1)_100%)]!"
        size="3xl"
      />

      {isBlocked && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl border border-amber-300 bg-amber-50 text-amber-900">
          <div className="flex items-start sm:items-center gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5 sm:mt-0" />
            <div>
              <p className="font-bold text-sm sm:text-base text-[#112518]">
                Status:{" "}
                <span className="text-[#C10007] font-semibold">BLOCKED</span>
              </p>
              <p className="text-xs sm:text-sm text-[#758179]">
                Required step:{" "}
                <span className="font-semibold text-[#112518]">
                  {requiredStep || "engineering-review"}
                </span>
                . Engineering review must be approved before you can proceed to
                proposal approval.
              </p>
            </div>
          </div>
          {onGoToRequiredStep && (
            <CommonButton
              size="sm"
              onClick={onGoToRequiredStep}
              className="shrink-0"
            >
              Go to Engineering Review
            </CommonButton>
          )}
        </div>
      )}

      {loading ? (
        <Spinner size="xl" text="Loading proposal..." />
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <BMiniCard
              layout="stacked"
              icon={DollarSign}
              label="Total Investment"
              value={formatCurrency(topStats.totalInvestment)}
              des="Equipment & systems"
              className="flex flex-col items-start"
              bgClassName="bg-white!"
              iconColorClassName="text-primary"
              valueClass="text-[#112518]! font-bold! text-2xl!"
            />
            <BMiniCard
              layout="stacked"
              icon={TrendingUp}
              label="Tax Credits"
              value={formatCurrency(topStats.taxCredits)}
              des={`${formatNumber(topStats.taxCreditPct)}% federal ITC`}
              className="flex flex-col items-start"
              bgClassName="bg-white!"
              iconColorClassName="text-green-600"
              valueClass="text-green-600! font-bold! text-2xl!"
            />
            <BMiniCard
              layout="stacked"
              icon={DollarSign}
              label="Net Project Cost"
              value={formatCurrency(topStats.netProjectCost)}
              des="After incentives"
              className="flex flex-col items-start"
              bgClassName="bg-white!"
              iconColorClassName="text-blue-600"
              valueClass="text-blue-600! font-bold! text-2xl!"
            />
            <BMiniCard
              layout="stacked"
              icon={TrendingUp}
              label="Annual Savings"
              value={formatCurrency(topStats.annualSavings)}
              des="Year 1 projection"
              className="flex flex-col items-start"
              bgClassName="bg-white!"
              iconColorClassName="text-green-600"
              valueClass="text-green-600! font-bold! text-2xl!"
            />
          </div>

          <CommonBorderWrapper isShadow>
            <SectionHeader size="xl" title="Recommended Systems" />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              {systems.map((system) => (
                <RecommendedSystemCard key={system.id} system={system} />
              ))}
            </div>
          </CommonBorderWrapper>

          <EngineeringServicesList items={engineeringServices} />

          <ProjectTimelineList phases={timelinePhases} />

          <SavingsForecastSection
            forecastData={savingsForecast}
            cumulativeData={cumulativeSavings}
            summary={savingsSummary}
          />

          <CostSummarySection summary={costSummary} />

          <Welcome
            title={
              isBlocked
                ? "Proposal Locked (Engineering Review Required)"
                : "Ready to Approve Your Proposal?"
            }
            description={
              isBlocked
                ? `Engineering review must be approved before you can proceed to contract agreement. Required step: ${requiredStep || "engineering-review"}.`
                : "Review all systems, services, timeline, and financial projections. Once approved, we'll proceed to contract agreement."
            }
            Icons={FaRegCircleCheck}
            iconColor={isBlocked ? "text-amber-600" : "text-[#155DFC]"}
            className={
              isBlocked
                ? "border border-amber-300! bg-[linear-gradient(90deg,rgba(245,158,11,0.10)_0%,rgba(239,68,68,0.10)_100%)]!"
                : "border  border-[#155DFC33]! bg-[linear-gradient(90deg,rgba(21,93,252,0.10)_0%,rgba(152,16,250,0.10)_100%)]!"
            }
            size="3xl"
            actions={
              <>
                <CommonButton
                  variant="outline"
                  className=" border-[#155DFC]! text-[#155DFC]! bg-white! hover:bg-white/10"
                  onClick={onDownloadProposalPdf}
                >
                  {isDownloading ? "Downloading..." : "Download Proposal PDF"}
                  <Download className="w-4 h-4 hidden sm:flex " />
                </CommonButton>
                {!isBlocked ? (
                  <CommonButton
                    className=""
                    onClick={onApproveAndContinue}
                    isLoading={isApproving}
                    loadingText="Approving..."
                  >
                    Approve & Continue to Contract
                    <FaRegCircleCheck className="w-4 h-4 hidden sm:block " />
                  </CommonButton>
                ) : (
                  <>
                    {onGoToRequiredStep && (
                      <CommonButton onClick={onGoToRequiredStep}>
                        Go to Engineering Review
                      </CommonButton>
                    )}
                  </>
                )}
              </>
            }
          />
          <div className="flex flex-col sm:flex-row justify-between gap-3 mt-4">
            {" "}
            <CommonButton
              to="../solar-energy"
              variant="outline"
              onClick={onBackToSystemSizing}
            >
              <ArrowLeft className="w-4 h-4 mr-1.5" />
              Back to System Sizing
            </CommonButton>{" "}
            <CommonButton
              disabled
              title="Blocked: Engineering review must be completed first"
              className="opacity-50 cursor-not-allowed"
            >
              Blocked
            </CommonButton>
          </div>
        </>
      )}
    </div>
  );
};

export default ProjectProposal;
