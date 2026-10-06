export interface SolarResponse {
  status: number;
  message: string;
  data: SolarResponseData;
}

export interface SolarResponseData {
  assumptions: string[];
  environmental_impact: EnvironmentalImpact;
  financial_breakdown: FinancialBreakdown;
  site_suitability: SiteSuitability;
  summary: Summary;
  system_specifications: SystemSpecifications;
}

export interface EnvironmentalImpact {
  clean_energy_percentage: number;
  co2_reduction_tons_per_year: number;
  energy_independence_percentage: number;
  equivalent_trees_planted: number;
}

export interface FinancialBreakdown {
  annual_savings_usd: number;
  lifetime_savings_usd: number;
  net_cost_usd: number;
  payback_period_years: number;
  project_lifetime_years: number;
  system_cost_usd: number;
  tax_credit_percentage: number;
  tax_credit_usd: number;
}

export interface SiteSuitability {
  roof_orientation: RoofOrientation;
  shading_analysis: ShadingAnalysis;
  solar_irradiance: SolarIrradiance;
}

export interface RoofOrientation {
  caption: string;
  rating: string;
  score_pct: number;
}

export interface ShadingAnalysis {
  rating: string;
  score_pct: number;
}

export interface SolarIrradiance {
  rating: string;
  score_pct: number;
}

export interface Summary {
  annual_generation_kwh: number;
  annual_savings_usd: number;
  payback_period_years: number;
  recommended_system_kw: number;
  recommended_system_label: string;
}

export interface SystemSpecifications {
  battery_storage_kwh: number;
  inverter_type: string;
  number_of_panels: number;
  panel_efficiency_percent: number;
  panel_type: string;
  rated_power_w_per_panel: number;
  total_system_kw: number;
}
