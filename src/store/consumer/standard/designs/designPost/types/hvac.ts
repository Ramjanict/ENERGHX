import { DesignSolveEnvelope, DesignSolveItem } from "./shared";

export interface SolveHvacUser {
  annual_load_kwh: number;
  tenant_id: string;
  whatever_else_the_database_holds?: Record<string, unknown>;
}

export interface SolveHvacBuilding {
  /** Hour of day ("0"–"23") mapped to cooling load in kW */
  cooling_load_profile_kw: Record<string, number>;
}

export interface SolveHvacFinance {
  electricity_tariff_rate: number;
  currency: string;
}

export interface SolveHvacOptions {
  horizon_years: number;
  sizing_mode: string;
}

export interface SolveHvacDesignPayload {
  items: DesignSolveItem[];
  user: SolveHvacUser;
  building: SolveHvacBuilding;
  finance: SolveHvacFinance;
  options: SolveHvacOptions;
}

export interface HvacSummaryMetric {
  value: number | string;
  unit: string;
  subLabel: string;
}

export interface HvacSummary {
  recommendedCapacity: HvacSummaryMetric & { capacityKw: number };
  annualEnergyConsumption: HvacSummaryMetric;
  annualOperatingCost: HvacSummaryMetric & { tariffRate: number };
  energyEfficiencyRating: HvacSummaryMetric & { copAverage: number };
}

export interface HvacChartAxis {
  key: string;
  label: string;
}

export interface HvacChartValueAxis {
  id: string;
  label: string;
  position: string;
  min?: number;
  max?: number;
}

export interface HvacChartSeries {
  key: string;
  label: string;
  axis: string;
}

export type HvacChartDatum = Record<string, string | number>;

export interface HvacChartTotals {
  peakMonth?: string;
  peakMonthKwh?: number;
  totalKwh?: number;
  [key: string]: string | number | undefined;
}

export interface HvacChart {
  type: string;
  title: string;
  unit: string;
  xAxis: HvacChartAxis;
  yAxes: HvacChartValueAxis[];
  series: HvacChartSeries[];
  data: HvacChartDatum[];
  totals: HvacChartTotals;
}

export interface HvacSpecRow {
  key: string;
  label: string;
  display: string;
  value: number | string | string[];
  unit?: string;
  emphasis?: "positive" | "negative" | string;
  gwpAr4?: number;
}

export interface HvacSpecSection {
  label: string;
  currency?: string;
  rows: HvacSpecRow[];
}

export interface HvacTechnicalSpecifications {
  systemConfiguration: HvacSpecSection;
  financialAnalysis: HvacSpecSection;
}

export interface HvacEnvironmentalMetric {
  value: number;
  unit: string;
  display: string;
  label: string;
  subLabel: string;
}

export interface HvacEnvironmentalImpact {
  co2Reduction: HvacEnvironmentalMetric;
  energySavings: HvacEnvironmentalMetric;
  refrigerantGwp: HvacEnvironmentalMetric;
}

export interface HvacRecommendedEquipmentPrice {
  amount: number;
  currency: string;
}

export interface HvacRecommendedEquipmentItem {
  product_id: string | number;
  name: string;
  manufacturer: string;
  category: string;
  pathway: string;
  output_spec: string;
  technology: string | null;
  additional: string | null;
  efficiency_class: string | null;
  warranty_years: number | null;
  rating: number | null;
  price: HvacRecommendedEquipmentPrice | null;
  specs: Record<
    string,
    string | number | boolean | string[] | number[] | null | undefined
  >;
}

export interface HvacRecommendedEquipment {
  label: string;
  subLabel: string;
  items: HvacRecommendedEquipmentItem[];
}

export interface SolveHvacResults {
  summary: HvacSummary;
  charts: {
    monthlyEnergyLoadProfile: HvacChart;
  };
  technicalSpecifications: HvacTechnicalSpecifications;
  environmentalImpact: HvacEnvironmentalImpact;
  recommendedEquipment: HvacRecommendedEquipment;
}

export interface SolveHvacDesignData {
  status: string;
  assumptions: string[];
  results: SolveHvacResults;
}

export type SolveHvacDesignResponse = DesignSolveEnvelope<SolveHvacDesignData>;
