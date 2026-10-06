export interface BiomassResponse {
  status: number;
  message: string;
  data: BiomassResponseData;
}

export interface BiomassResponseData {
  environmental_impact: BiomassEnvironmentalImpact;
  feedstock_availability: FeedstockAvailability;
  financial_breakdown: BiomassFinancialBreakdown;
  summary: BiomassSummary;
  system_specifications: BiomassSystemSpecifications;
}

export interface BiomassEnvironmentalImpact {
  co2_neutral_percentage: number;
  energy_independence_percentage: number;
  renewable_content_percentage: number;
}

export interface FeedstockAvailability {
  local_availability_status: string;
  price_stability_status: string;
  quality_moisture_compliance: string;
}

export interface BiomassFinancialBreakdown {
  annual_savings_usd: number;
  net_cost_usd: number;
  system_cost_usd: number;
  tax_credit_percentage: number;
  tax_credit_usd: number;
  twenty_year_savings_usd: number;
}

export interface BiomassSummary {
  annual_generation_kwh: number;
  annual_savings_usd: number;
  payback_period_years: number | null;
  recommended_system_kw: number;
}

export interface BiomassSystemSpecifications {
  biogas_storage_liters: number;
  electrical_capacity_kw: number;
  energy_output: string;
  feedstock_type: string;
  system_type: string;
}
