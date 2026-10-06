import type {
  ConsumerWorkflow,
  StandardPlanCard,
  WorkflowStep,
} from "@/store/consumer/standard/Simulations/types/dashboard";

export interface EngineeringReviewMetric {
  value: number | null;
  unit: string | null;
}

export interface EngineeringReviewHero {
  title: string;
  subtitle: string;
  status: string;
}

export interface EngineeringReviewStatusItem {
  key: string;
  label: string;
  status: string;
}

export interface EngineeringReviewCardGroup {
  cards: StandardPlanCard[];
}

export interface EngineeringReviewFinalSummaryMetrics {
  totalSystemCapacity: EngineeringReviewMetric;
  expectedEnergyOffset: EngineeringReviewMetric;
  annualSavings: EngineeringReviewMetric;
  carbonReduction: EngineeringReviewMetric;
  estimatedPayback: EngineeringReviewMetric;
}

export interface EngineeringReviewNextAction {
  type: string | null;
  target: string | null;
}

export interface EngineeringReviewApprovalStatus {
  status: string;
  label: string;
  approvalTimestamp: string | null;
  reviewedBy: string | null;
  associateId: string | null;
  reasons: string[];
  offendingSections: string[];
  nextAction: EngineeringReviewNextAction;
}

export interface EngineeringReviewSummarySources {
  solar: boolean;
  wind: boolean;
  biomass: boolean;
  hvac: boolean;
  battery: boolean;
  ev: boolean;
}

export interface EngineeringReviewSummary {
  generatedDesignCount: number;
  solarCapacityKw: number | null;
  windCapacityKw: number | null;
  biomassCapacityKw: number | null;
  batteryCapacityKwh: number | null;
  evChargingCapacityKw: number | null;
  totalSystemCapacityKw: number | null;
  totalAnnualProductionKwh: number | null;
  totalProjectCost: number | null;
  projectedPaybackYears: number | null;
  expectedEnergyOffsetPercent: number | null;
  annualSavings: number | null;
  carbonReductionTonsYear: number | null;
  sources: EngineeringReviewSummarySources;
}

export interface EngineeringReviewPayload {
  status: string;
  approved: boolean;
  reviewedBy: string | null;
  approvalMatrix: EngineeringReviewStatusItem[];
  approvalStatus: string;
  approvalTimestamp: string | null;
  financialReviewStatus: string;
  technicalReviewStatus: string;
  complianceReviewStatus: string;
  sustainabilityReviewStatus: string;
}

export interface EngineeringReview {
  hero: EngineeringReviewHero;
  reviewProgress: EngineeringReviewStatusItem[];
  engineeringApprovalMatrix: EngineeringReviewStatusItem[];
  finalEngineeringSummary: EngineeringReviewCardGroup;
  finalEngineeringSummaryMetrics: EngineeringReviewFinalSummaryMetrics;
  approvalStatus: EngineeringReviewApprovalStatus;
  summary: EngineeringReviewSummary;
}

export interface GetEngineeringReviewResponse {
  workflow: ConsumerWorkflow | null;
  step: WorkflowStep<EngineeringReviewPayload> | null;
  engineeringReview: EngineeringReview;
}

export type GetEngineeringReviewStatusResponse = EngineeringReviewApprovalStatus;
