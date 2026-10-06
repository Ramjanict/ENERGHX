export interface ProposalNextAction {
  type: string;
  target: string | null;
}

export interface ProposalApprovalStatus {
  status: string;
  approvalTimestamp: string | null;
  reviewedBy: string | null;
  associateId: string | null;
  reasons: string[];
  offendingSections: string[];
  nextAction: ProposalNextAction | null;
}

export interface ProposalSystem {
  id?: string;
  key?: string;
  label?: string;
  name?: string;
  title?: string;
  subtitle?: string;
  capacity?: string | number | null;
  capacityKw?: number | null;
  systemCost?: number | null;
  cost?: number | null;
  annualGenerationKwh?: number | null;
  annualSavings?: number | null;
  paybackYears?: number | null;
  icon?: "solar" | "wind" | "biomass" | "battery" | string;
}

export interface ProposalEngineeringService {
  id?: string;
  key?: string;
  order?: number;
  title?: string;
  name?: string;
  durationLabel?: string;
  duration?: string;
  cost?: number | null;
}

export interface ProposalTimelinePhase {
  id?: string;
  key?: string;
  step?: number;
  order?: number;
  title?: string;
  durationLabel?: string;
  estimatedDuration?: string;
  durationWeeks?: number;
}

export interface ProposalSavingsYear {
  year?: string;
  annualSavings?: number;
  omCost?: number;
}

export interface ProposalCumulativePoint {
  year?: string;
  cumulativeSavings?: number;
}

export interface ProposalCostSummary {
  renewableEnergySystems?: number;
  engineeringServices?: number;
  subtotal?: number;
  federalTaxCreditPct?: number;
  federalTaxCreditRate?: number;
  federalTaxCreditAmount?: number;
  netProjectInvestment?: number;
}

export interface GetProposalResponse {
  status: string;
  message?: string;
  requiredStep?: string | null;
  approvalStatus?: ProposalApprovalStatus | null;
  approved?: boolean;
  approvedAt?: string | null;
  federalTaxCreditRate?: number | null;
  stateRebates?: number | null;
  utilityIncentives?: number | null;
  totalInvestment?: number | null;
  taxCredits?: number | null;
  netProjectCost?: number | null;
  annualSavings?: number | null;
  systems?: ProposalSystem[];
  recommendedSystems?: ProposalSystem[];
  engineeringServices?: ProposalEngineeringService[];
  timeline?: ProposalTimelinePhase[];
  implementationTimeline?: ProposalTimelinePhase[];
  savingsForecast?: ProposalSavingsYear[];
  cumulativeSavings?: ProposalCumulativePoint[];
  paybackYears?: number | null;
  twentyFiveYearSavings?: number | null;
  cumulativeSavings25Year?: number | null;
  netPresentValue?: number | null;
  roi25YearPct?: number | null;
  costSummary?: ProposalCostSummary | null;
  projectSummary?: {
    systems?: ProposalSystem[];
    totalProjectCost?: number | null;
    currency?: string;
  } | null;
  financialBreakdown?: {
    totalSystemCost?: number | null;
    federalTaxCredit?: number | null;
    federalTaxCreditRate?: number | null;
    stateRebates?: number | null;
    utilityIncentives?: number | null;
    netInvestment?: number | null;
    currency?: string;
  } | null;
  projectedSavings?: {
    annualSavings?: number | null;
    paybackPeriodYears?: number | null;
    cumulativeSavings25Year?: number | null;
    currency?: string;
  } | null;
}

export interface ApproveProposalPayload {
  status: "APPROVED" | "PENDING" | "REJECTED";
  approved: boolean;
  approvedAt: string;
  federalTaxCreditRate: number;
  stateRebates: number;
  utilityIncentives: number;
}

export type ApproveProposalResponse = GetProposalResponse;

export interface ProposalPdfResponse {
  url?: string;
  downloadUrl?: string;
  message?: string;
}
