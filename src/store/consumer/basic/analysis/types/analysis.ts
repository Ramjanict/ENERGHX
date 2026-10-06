export type AuditType = "BASIC_AUDIT" | "COMPREHENSIVE_AUDIT";

export interface CreateAuditPayload {
  buildingId: string;
  auditType: AuditType;
}

// audit response
export interface EnergyMonthData {
  month: string;
  solarGenerationKwh: number;
  usageKwh: number;
  windGenerationKwh: number;
}

export interface EnergyGenerationTotals {
  peakMonth: string;
  peakMonthKwh: number;
  solarGenerationKwh: number;
  usageKwh: number;
  windGenerationKwh: number;
}

export interface EnergyGenerationAndUsage {
  data: EnergyMonthData[];
  totals: EnergyGenerationTotals;
}

export type EnergySource = "solar" | "wind" | "grid" | string;

export interface EnergySourceDistributionItem {
  energyKwh: number;
  sharePct: number;
  source: EnergySource;
}

export interface EnergySourceDistribution {
  data: EnergySourceDistributionItem[];
}

export interface Charts {
  energyGenerationAndUsage: EnergyGenerationAndUsage;
  energySourceDistribution: EnergySourceDistribution;
}

export interface BuildingInsights {
  efficiencyRating: string;
  peakUsageTime: string;
  totalAppliances: number;
}

export interface Recommendation {
  description: string;
  key: string;
  title: string;
}

export interface Summary {
  annualSavings: number;
  co2Avoided: number;
  energyScore: number;
  renewablePercent: number;
}

export interface AuditReport {
  buildingInsights?: BuildingInsights;
  charts?: Charts;
  recommendations?: Recommendation[];
  summary?: Summary;
}

export interface AuditResultValueItem {
  report: AuditReport;
  title: string;
}

export interface AuditResultData {
  computed_at: number;
  value: AuditResultValueItem[];
}

export type AuditStatus = "computed" | "pending" | "failed" | string;

export interface AuditResult {
  data: AuditResultData;
  status: AuditStatus;
}

export interface AuditData {
  auditType: AuditType;
  result: AuditResult;
}

export interface EnergyAuditResponse {
  status: number;
  message: string;
  data: AuditData;
}

export interface EnergyAuditHistoryItem {
  id: string;
  userId: string;
  buildingId: string;
  status: "COMPLETED" | "IN_PROGRESS" | "PENDING" | "FAILED" | string;
  auditType: AuditType;
  result?: AuditResult;
  error?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Pagination {
  page: number;
  pageSize: number;
  total: number;
  pageCount: number;
}

export interface EnergyAuditHistoryResponse {
  items: EnergyAuditHistoryItem[];
  pagination: Pagination;
}

export interface GetEnergyAuditHistoryParams {
  page?: number;
  pageSize?: number;
}
