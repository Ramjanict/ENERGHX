import {
  CONTRACT_DOCUMENTS,
  FINANCIAL_BREAKDOWN,
  NET_INVESTMENT,
  PROJECT_SUMMARY_SYSTEMS,
  PROJECTED_SAVINGS,
  TIMELINE_PHASES,
  TOTAL_PROJECT_COST,
  TOTAL_PROJECT_DURATION,
} from "@/components/consumer/standard/contact/process/data";
import {
  ContractDocument,
  FinancialBreakdownLine,
  ProjectedSavings,
  ProjectSummarySystem,
  TimelinePhase,
} from "@/components/consumer/standard/contact/process/types";
import {
  DOCUMENT_SELECTION_CRITERIA,
  REQUIRED_DOCUMENTS,
} from "@/components/consumer/standard/contact/report/data";
import {
  AcknowledgementState,
  DocumentSelectionCriteria,
  DocumentSection,
  RequiredDocument,
} from "@/components/consumer/standard/contact/report/types";
import {
  ContractListDocument,
  ContractRequiredDocument,
  ContractTimelineStep,
  GetContractDocumentsResponse,
  GetContractResponse,
} from "./types/contract";

const DOC_ICON_STYLES = [
  {
    iconBg: "bg-blue-50",
    iconColor: "text-blue-600",
    sourceColor: "text-blue-600",
  },
  {
    iconBg: "bg-purple-50",
    iconColor: "text-purple-600",
    sourceColor: "text-blue-600",
  },
  {
    iconBg: "bg-amber-50",
    iconColor: "text-amber-600",
    sourceColor: "text-blue-600",
  },
  {
    iconBg: "bg-[#F0FDF4]",
    iconColor: "text-[#00A63E]",
    sourceColor: "text-blue-600",
  },
] as const;

const DEFAULT_SECTIONS: DocumentSection[] = [
  { order: 1, title: "Terms & Conditions", sectionLabel: "Section 1" },
  { order: 2, title: "Obligations & Rights", sectionLabel: "Section 2" },
  { order: 3, title: "Regulatory Compliance", sectionLabel: "Section 3" },
  { order: 4, title: "Signatures & Execution", sectionLabel: "Section 4" },
];

const formatMonthYear = (value: string | null | undefined) => {
  if (!value) return "Recently";
  const date = new Date(value);
  if (!Number.isNaN(date.getTime())) {
    return date.toLocaleString("en-US", { month: "long", year: "numeric" });
  }
  return value;
};

const formatCapacity = (
  capacity: string | number | null | undefined,
  capacityKw?: number | null,
) => {
  if (typeof capacity === "string" && capacity.trim()) return capacity;
  if (typeof capacity === "number" && Number.isFinite(capacity)) {
    return `${capacity} kW`;
  }
  if (typeof capacityKw === "number" && Number.isFinite(capacityKw)) {
    return `${capacityKw} kW`;
  }
  return "--";
};

export const mapSelectionCriteria = (
  data?: GetContractDocumentsResponse | null,
): DocumentSelectionCriteria => {
  const criteria = data?.selectionCriteria;
  if (!criteria) return DOCUMENT_SELECTION_CRITERIA;

  return {
    utilityProvider:
      criteria.utilityProvider?.trim() ||
      DOCUMENT_SELECTION_CRITERIA.utilityProvider,
    jurisdiction:
      criteria.jurisdiction?.trim() || DOCUMENT_SELECTION_CRITERIA.jurisdiction,
    energyCommodity:
      criteria.energyCommodity?.trim() ||
      DOCUMENT_SELECTION_CRITERIA.energyCommodity,
    engineeringServices:
      criteria.engineeringServices?.filter(Boolean).join(" + ") ||
      DOCUMENT_SELECTION_CRITERIA.engineeringServices,
  };
};

export const mapRequiredDocument = (
  doc: ContractRequiredDocument,
  index: number,
): RequiredDocument & { downloadUrl?: string } => {
  const style = DOC_ICON_STYLES[index % DOC_ICON_STYLES.length];
  const fallback = REQUIRED_DOCUMENTS[index % REQUIRED_DOCUMENTS.length];

  const sections =
    doc.sections?.length > 0
      ? doc.sections.map((section, sectionIndex) => ({
          order: section.order ?? sectionIndex + 1,
          title: section.title?.trim() || `Section ${sectionIndex + 1}`,
          sectionLabel:
            section.sectionLabel?.trim() ||
            section.label?.trim() ||
            `Section ${section.order ?? sectionIndex + 1}`,
        }))
      : fallback?.sections ?? DEFAULT_SECTIONS;

  const isReviewed = Boolean(
    doc.reviewed ||
      doc.signatureCompleted ||
      doc.status === "REVIEWED" ||
      doc.status === "SIGNED" ||
      doc.status === "COMPLETED" ||
      doc.status === "EXECUTED",
  );

  return {
    id: doc.id,
    title: doc.title || fallback?.title || "Contract Document",
    description:
      doc.description?.trim() ||
      fallback?.description ||
      "Review this contract document before proceeding.",
    isRequired: doc.required ?? true,
    source:
      doc.source?.trim() ||
      doc.documentType?.replace(/_/g, " ") ||
      fallback?.source ||
      "Energhx",
    pageCount: doc.totalPages ?? fallback?.pageCount ?? 1,
    lastUpdated:
      formatMonthYear(doc.lastUpdated) ||
      doc.version ||
      fallback?.lastUpdated ||
      "Recently",
    sourceColor: style.sourceColor,
    sections,
    iconBg: style.iconBg,
    iconColor: style.iconColor,
    downloadUrl: doc.file?.downloadUrl,
    reviewed: isReviewed,
    requiresSignature: doc.requiresSignature !== false,
    signatureCompleted: Boolean(doc.signatureCompleted),
    status: isReviewed && doc.status === "NOT_REVIEWED" ? "REVIEWED" : doc.status,
    fileName: doc.file?.fileName,
    mimeType: doc.file?.mimeType,
  };
};

export const mapRequiredDocuments = (
  data?: GetContractDocumentsResponse | null,
): Array<RequiredDocument & { downloadUrl?: string }> => {
  const docs = data?.requiredDocuments;
  if (!docs?.length) return REQUIRED_DOCUMENTS;
  return docs.map(mapRequiredDocument);
};

export const mapAcknowledgementState = (
  data?: GetContractDocumentsResponse | null,
): AcknowledgementState => {
  const checklist = data?.acknowledgement?.checklist ?? [];
  const byKey = (key: string) =>
    checklist.find((item) => item.key === key)?.checked ?? false;

  return {
    reviewedAllDocuments: byKey("reviewed-required-documents"),
    acknowledgedDisclosures: byKey("acknowledge-disclosures"),
    agreedToProceed: byKey("proceed-contract-execution"),
  };
};

export const mapReviewedIds = (
  data?: GetContractDocumentsResponse | null,
): Set<string> => {
  const docs = data?.requiredDocuments ?? [];
  return new Set(
    docs
      .filter(
        (doc) =>
          doc.reviewed ||
          doc.signatureCompleted ||
          doc.status === "REVIEWED" ||
          doc.status === "SIGNED" ||
          doc.status === "COMPLETED" ||
          doc.status === "EXECUTED",
      )
      .map((doc) => doc.id),
  );
};

export const mapProjectSummarySystems = (
  data?: GetContractResponse | null,
): ProjectSummarySystem[] => {
  if (!data?.projectSummary) return PROJECT_SUMMARY_SYSTEMS;

  const systems = data.projectSummary.systems ?? [];
  return systems.map((system, index) => ({
    id: system.id || system.key || `system-${index + 1}`,
    label:
      system.label ||
      system.name ||
      system.title ||
      `System ${index + 1}`,
    capacity: formatCapacity(system.capacity, system.capacityKw),
    cost: system.cost ?? system.systemCost ?? 0,
  }));
};

export const mapTotalProjectCost = (data?: GetContractResponse | null) => {
  if (!data?.projectSummary && !data?.financialBreakdown) {
    return TOTAL_PROJECT_COST;
  }

  const value = data.projectSummary?.totalProjectCost;
  if (typeof value === "number" && Number.isFinite(value)) return value;

  const systemCost = data.financialBreakdown?.totalSystemCost;
  if (typeof systemCost === "number" && Number.isFinite(systemCost)) {
    return systemCost;
  }

  return 0;
};

export const mapFinancialBreakdown = (
  data?: GetContractResponse | null,
): FinancialBreakdownLine[] => {
  const breakdown = data?.financialBreakdown;
  if (!breakdown) return FINANCIAL_BREAKDOWN;

  const ratePct = Math.round((breakdown.federalTaxCreditRate ?? 0) * 100);

  return [
    {
      id: "system-cost",
      label: "Total System Cost",
      amount: breakdown.totalSystemCost ?? 0,
      isDeduction: false,
    },
    {
      id: "federal-tax-credit",
      label: `Federal Tax Credit (${ratePct}%)`,
      amount: breakdown.federalTaxCredit ?? 0,
      isDeduction: true,
    },
    {
      id: "state-rebates",
      label: "State Rebates",
      amount: breakdown.stateRebates ?? 0,
      isDeduction: true,
    },
    {
      id: "utility-incentives",
      label: "Utility Incentives",
      amount: breakdown.utilityIncentives ?? 0,
      isDeduction: true,
    },
  ];
};

export const mapNetInvestment = (data?: GetContractResponse | null) => {
  if (!data?.financialBreakdown) return NET_INVESTMENT;
  const value = data.financialBreakdown.netInvestment;
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
};

export const mapProjectedSavings = (
  data?: GetContractResponse | null,
): ProjectedSavings => {
  const savings = data?.projectedSavings;
  if (!savings) return PROJECTED_SAVINGS;

  return {
    annualSavings: savings.annualSavings,
    paybackYears: savings.paybackPeriodYears,
    twentyFiveYearSavings: savings.cumulativeSavings25Year,
  };
};

export const mapContractDocuments = (
  data?: GetContractResponse | null,
): Array<ContractDocument & { downloadUrl?: string }> => {
  const docs = data?.contractDocuments;
  if (!docs?.length) return CONTRACT_DOCUMENTS;

  return docs.map((doc: ContractListDocument, index) => {
    const fallback = CONTRACT_DOCUMENTS[index % CONTRACT_DOCUMENTS.length];
    return {
      id: doc.id,
      icon: index === 2 ? "shield" : "file",
      title: doc.title || fallback?.title || "Contract Document",
      description:
        doc.description?.trim() ||
        fallback?.description ||
        "Contract agreement document",
      downloadUrl: doc.file?.downloadUrl,
      reviewed: doc.reviewed ?? false,
      requiresSignature: doc.requiresSignature !== false,
      signatureCompleted: doc.signatureCompleted ?? false,
      status: (doc as any).status || (doc.signatureCompleted || doc.reviewed ? "SIGNED" : "PENDING"),
      fileName: doc.file?.fileName,
      mimeType: doc.file?.mimeType,
    };
  });
};

export const mapImplementationTimeline = (
  data?: GetContractResponse | null,
): TimelinePhase[] => {
  const steps: ContractTimelineStep[] | undefined =
    data?.implementationTimeline;
  if (!steps?.length) return TIMELINE_PHASES;

  return steps.map((step, index) => {
    const fallback = TIMELINE_PHASES[index % TIMELINE_PHASES.length];
    return {
      id: `step-${step.step || index + 1}`,
      order: step.step || index + 1,
      title: step.title || fallback?.title || `Phase ${index + 1}`,
      durationLabel:
        step.estimatedDuration || fallback?.durationLabel || "--",
    };
  });
};

export const mapTotalProjectDuration = (
  phases: TimelinePhase[],
): string => {
  if (!phases.length) return TOTAL_PROJECT_DURATION;
  const labels = phases.map((phase) => phase.durationLabel).filter(Boolean);
  if (!labels.length) return TOTAL_PROJECT_DURATION;
  return labels.join(" · ");
};
