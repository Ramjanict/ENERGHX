export interface RecommendedSystem {
  id: string;
  icon: "solar" | "wind" | "biomass" | "battery";
  title: string;
  subtitle: string;
  systemCost: number;
  annualGenerationKwh: number | null;
  annualSavings: number;
  paybackYears: number | null;
  bgClassName: string;
}

export interface EngineeringServiceItem {
  id: string;
  order: number;
  title: string;
  durationLabel: string;
  cost: number;
}

export interface TimelinePhase {
  id: string;
  order: number;
  title: string;
  durationLabel: string;
  durationWeeks: number;
}

export interface SavingsForecastYear {
  year: string;
  annualSavings: number;
  omCost: number;
}

export interface CumulativeSavingsPoint {
  year: string;
  cumulativeSavings: number;
}

export interface ProposalTopStats {
  totalInvestment: number;
  taxCredits: number;
  taxCreditPct: number;
  netProjectCost: number;
  annualSavings: number;
}

export interface SavingsForecastSummary {
  paybackYears: number;
  twentyFiveYearSavings: number;
  netPresentValue: number;
  roi25YearPct: number;
}

export interface CostSummary {
  renewableEnergySystems: number;
  engineeringServices: number;
  subtotal: number;
  federalTaxCreditPct: number;
  federalTaxCreditAmount: number;
  netProjectInvestment: number;
}
