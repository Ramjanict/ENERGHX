import type {
  ConsumerWorkflow,
  ResValidationChecklistItem,
  ResValidationPayload,
  ResValidationRiskItem,
  StandardPlanCard,
  WorkflowStep,
} from "@/store/consumer/standard/Simulations/types/dashboard";

export interface ResValidationHero {
  title: string;
  subtitle: string;
  status: string;
}

export interface ResValidationMetric {
  value: number | null;
  unit: string | null;
}

export interface ResValidationOverallSystemReadiness {
  systemReadinessScore: ResValidationMetric;
  renewableCoverage: ResValidationMetric;
  annualSavings: ResValidationMetric;
  carbonReduction: ResValidationMetric;
  /** UI cards derived from the metric fields above */
  cards: StandardPlanCard[];
}

export interface ResValidationCardGroup {
  cards: StandardPlanCard[];
}

export interface ResValidationRenewableSystemSummaryMetrics {
  solarCapacity: ResValidationMetric;
  windCapacity: ResValidationMetric;
  biomassCapacity: ResValidationMetric;
  hvacCapacity: ResValidationMetric;
  batteryCapacity: ResValidationMetric;
  evCapacity: ResValidationMetric;
  totalAnnualProduction: ResValidationMetric;
  totalProjectCost: ResValidationMetric;
  projectedRoi: ResValidationMetric;
}

export interface GetResValidationSummaryResponse {
  lastComputedOn: string | null;
  renewableSystemSummary: ResValidationCardGroup;
  riskAssessment: ResValidationRiskItem[];
  metrics: ResValidationRenewableSystemSummaryMetrics;
}

export interface ResValidationSummarySources {
  solar: boolean;
  wind: boolean;
  biomass: boolean;
  hvac: boolean;
  battery: boolean;
  ev: boolean;
}

export interface ResValidationSummary {
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
  sources: ResValidationSummarySources;
}

export interface ResValidation {
  status: string;
  lastComputedOn: string | null;
  hero: ResValidationHero;
  overallSystemReadiness: ResValidationOverallSystemReadiness;
  validationChecklist: ResValidationChecklistItem[];
  renewableSystemSummary: ResValidationCardGroup;
  riskAssessment: ResValidationRiskItem[];
  summary: ResValidationSummary;
  overrides: Record<string, unknown>;
}

export interface GetResValidationResponse {
  workflow: ConsumerWorkflow | null;
  step: WorkflowStep<ResValidationPayload> | null;
  resValidation: ResValidation;
}
