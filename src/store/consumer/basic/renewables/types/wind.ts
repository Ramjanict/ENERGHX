export interface WindResponse {
  status: number;
  message: string;
  data: WindResponseData;
}

export interface WindResponseData {
  environmental_impact: WindEnvironmentalImpact;
  financial_breakdown: WindFinancialBreakdown;
  summary: WindSummary;
  system_specifications: WindSystemSpecifications;
  wind_resource_assessment: WindResourceAssessment;
}

export interface WindEnvironmentalImpact {
  capacity_factor_percentage: number;
  clean_energy_percentage: number;
  co2_reduction_tons_per_year: number;
  energy_independence_percentage: number;
  equivalent_trees_planted: number;
}

export interface WindFinancialBreakdown {
  annual_savings_usd: number;
  lifetime_savings_usd: number;
  net_cost_usd: number;
  project_lifetime_years: number;
  system_cost_usd: number;
  tax_credit_percentage: number;
  tax_credit_usd: number;
}

export interface WindSummary {
  annual_generation_kwh: number;
  annual_savings_usd: number;
  payback_period_years: number;
  recommended_system_kw: number;
  recommended_system_label: string;
}

export interface WindSystemSpecifications {
  derived_rated_speed_ms: number;
  grid_connection: string;
  hub_height_m: number;
  number_of_turbines: number;
  rated_power_kw_per_turbine: number;
  rotor_diameter_m: number;
  swept_area_m2: number;
  total_rated_power_kw: number;
  turbine_type: string;
}

export interface WindResourceAssessment {
  average_wind_speed: WindRatingScore;
  hub_height_wind_speed_ms: number;
  mean_wind_speed_ms: number;
  obstacle_free_zone: WindRatingScore;
  site_suitability: WindRatingScore;
  turbulence_level: WindRatingScore;
}

export interface WindRatingScore {
  rating: string;
  score_pct: number;
}
