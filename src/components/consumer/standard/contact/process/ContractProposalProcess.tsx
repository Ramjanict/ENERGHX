import CommonButton from "@/common/button/CommonButton";
import SectionHeader from "@/common/header/SectionHeader";
import Spinner from "@/common/loading/Spinner";
import { openOrDownloadDocument } from "@/lib/utils";
import { ArrowLeft } from "lucide-react";
import { useEffect, useState } from "react";
import CheckboxRow from "../report/CheckboxRow";
import ContractDocumentsSection from "./ContractDocumentsSection";
import {
  CONTRACT_DOCUMENTS,
  FINANCIAL_BREAKDOWN,
  NET_INVESTMENT,
  PROJECT_SUMMARY_SYSTEMS,
  PROJECTED_SAVINGS,
  TIMELINE_PHASES,
  TOTAL_PROJECT_COST,
  TOTAL_PROJECT_DURATION,
} from "./data";
import FinancialBreakdownSection from "./FinancialBreakdownSection";
import ImplementationTimelineSection from "./ImplementationTimelineSection";
import ProjectedSavingsSection from "./ProjectedSavingsSection";
import ProjectSummarySection from "./ProjectSummarySection";
import {
  ContractDocument,
  FinancialBreakdownLine,
  ProjectedSavings,
  ProjectSummarySystem,
  TimelinePhase,
} from "./types";

export type ViewableContractDocument = ContractDocument & {
  downloadUrl?: string;
};

interface ContractProposalProcessProps {
  title?: string;
  description?: string;
  onBack: () => void;
  onProceedToCheckout: () => void;
  systems?: ProjectSummarySystem[];
  totalCost?: number;
  financialLines?: FinancialBreakdownLine[];
  netInvestment?: number;
  projectedSavings?: ProjectedSavings;
  documents?: ViewableContractDocument[];
  timelinePhases?: TimelinePhase[];
  totalDuration?: string;
  initiallyAgreed?: boolean;
  isSubmitting?: boolean;
  loading?: boolean;
}

const ContractProposalProcess: React.FC<ContractProposalProcessProps> = ({
  title = "Contract & Proposal Process",
  description = "Review your project proposal and agreement documents",
  onBack,
  onProceedToCheckout,
  systems = PROJECT_SUMMARY_SYSTEMS,
  totalCost = TOTAL_PROJECT_COST,
  financialLines = FINANCIAL_BREAKDOWN,
  netInvestment = NET_INVESTMENT,
  projectedSavings = PROJECTED_SAVINGS,
  documents = CONTRACT_DOCUMENTS,
  timelinePhases = TIMELINE_PHASES,
  totalDuration = TOTAL_PROJECT_DURATION,
  initiallyAgreed = false,
  isSubmitting = false,
  loading = false,
}) => {
  const [hasAgreed, setHasAgreed] = useState(initiallyAgreed);

  useEffect(() => {
    setHasAgreed(initiallyAgreed);
  }, [initiallyAgreed]);

  const handleViewPdf = (document: ViewableContractDocument) => {
    if (document.downloadUrl) {
      openOrDownloadDocument(
        document.downloadUrl,
        (document as any).fileName || document.title,
        (document as any).mimeType,
      );
      return;
    }
    console.log("Viewing document:", document.id);
  };

  return (
    <div className="space-y-6">
      <SectionHeader title={title} description={description} />

      {loading ? (
        <Spinner size="xl" text="Loading contract..." />
      ) : (
        <>
          <ProjectSummarySection systems={systems} totalCost={totalCost} />

          <FinancialBreakdownSection
            lines={financialLines}
            netInvestment={netInvestment}
          />

          <ProjectedSavingsSection savings={projectedSavings} />

          <ContractDocumentsSection
            documents={documents}
            onViewPdf={handleViewPdf}
          />

          <ImplementationTimelineSection
            phases={timelinePhases}
            totalDuration={totalDuration}
          />

          <CheckboxRow
            checked={hasAgreed}
            onChange={() => setHasAgreed((prev) => !prev)}
            label="I have reviewed all documents and agree to the terms and conditions"
          />

          <div className="flex flex-col sm:flex-row gap-3 sm:items-center justify-between">
            <CommonButton variant="outline" onClick={onBack}>
              <ArrowLeft className="w-4 h-4" />
              Back
            </CommonButton>

            <CommonButton
              onClick={onProceedToCheckout}
              disabled={!hasAgreed}
              isLoading={isSubmitting}
              loadingText="Saving..."
            >
              Proceed to Checkout
            </CommonButton>
          </div>
        </>
      )}
    </div>
  );
};

export default ContractProposalProcess;
