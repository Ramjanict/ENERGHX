export interface ProjectSummarySystem {
  id: string;
  label: string;
  capacity: string;
  cost: number;
}

export interface FinancialBreakdownLine {
  id: string;
  label: string;
  amount: number;
  isDeduction: boolean;
}

export interface ProjectedSavings {
  annualSavings: number | null;
  paybackYears: number | null;
  twentyFiveYearSavings: number | null;
}

export interface ContractDocument {
  id: string;
  icon: "file" | "shield";
  title: string;
  description: string;
  reviewed?: boolean;
  requiresSignature?: boolean;
  signatureCompleted?: boolean;
  status?: string;
  fileName?: string;
  mimeType?: string;
}

export interface TimelinePhase {
  id: string;
  order: number;
  title: string;
  durationLabel: string;
}
