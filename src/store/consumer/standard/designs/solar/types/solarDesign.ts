// ---------- Categories ----------
export interface SolarCategory {
  id: string;
  name: string;
  product_count: number;
}

export interface SolarCategoriesResponse {
  status: number;
  message: string;
  data: {
    categories: SolarCategory[];
    success: boolean;
  };
}

// ---------- Products (list) ----------
export interface SolarProductPrice {
  amount: number;
  currency: string;
}

export interface SolarProductSpecs {
  area_m2: number;
  bifacial: boolean;
  bifaciality_factor?: number;
  cell_type: string;
  isc_a: number;
  panel_efficiency_pct: number;
  rated_power_w: number;
  role: string;
  temp_coefficient_pct_per_c: number;
  voc_v: number;
}

export interface SolarProduct {
  additional: string;
  category: string;
  efficiency_class: string;
  manufacturer: string;
  name: string;
  output_spec: string;
  price: SolarProductPrice;
  product_id: number;
  rating: number;
  role: string;
  specs: SolarProductSpecs;
  technology: string;
  warranty_years: number;
}

export interface GetSolarProductsParams {
  category?: string;
  search?: string;
  page?: number;
  per_page?: number;
}

export interface SolarProductsResponse {
  status: number;
  message: string;
  data: {
    page: number;
    per_page: number;
    products: SolarProduct[];
    success: boolean;
    total: number;
    total_pages: number;
  };
}

// ---------- Product detail ----------
export interface SolarProductDetail extends SolarProduct {
  country_of_origin: string;
  installation_types: string;
  market_status: string;
  notes: string;
}

export interface SolarProductDetailResponse {
  status: number;
  message: string;
  data: {
    product: SolarProductDetail;
    success: boolean;
  };
}

// ---------- Solve (request) ----------
export interface SolveItem {
  product_id: string;
  quantity: number;
}

export interface SolveSite {
  daily_irradiance_kwh_m2_day: number;
  total_roof_area_sqft: number;
  available_roof_area_sqft: number;
  tilt_deg: number;
  azimuth_deg: number;
  system_loss_factor_pct: number;
  panel_efficiency_pct: number;
  location_label: string;
  currency: string;
}

export interface SolveDemand {
  annual_load_kwh: number;
}

export interface SolveFinance {
  electricity_tariff_rate: number;
  tax_credit_percentage: number;
  currency: string;
}

export interface SolveOptions {
  horizon_years: number;
  payback_basis: "gross" | "net" | string;
}

export interface SolveSolarDesignPayload {
  items: SolveItem[];
  site: SolveSite;
  demand: SolveDemand;
  finance: SolveFinance;
  options: SolveOptions;
}

// ---------- Solve (response) ----------
export interface SolveAssumptions {
  horizon_years: number;
  installation_cost: string;
  monthly_consumption: string;
  monthly_profile: string;
  orientation_factor: string;
  shading_factor: string;
}

export interface EnvironmentalBenefit {
  note: string;
  title: string;
  value: string;
}

export interface FinancialAnalysis {
  annual_savings: number;
  currency: string;
  equipment_cost: number;
  horizon_years: number;
  installation_cost: number;
  lifetime_savings: number;
  net_cost: number;
  net_roi_percent: number;
  payback_basis: string;
  payback_period_years: number;
  roi_percent: number;
  savings_basis: string;
  system_cost: number;
  tax_credit_amount: number;
  total_investment: number;
}

export interface MonthlyProfileItem {
  consumption_kwh: number;
  month: string;
  production_kwh: number;
}

export interface SiteSuitabilityMetric {
  caption?: string;
  rating: string;
  score_pct: number;
}

export interface SiteSuitability {
  roof_orientation: SiteSuitabilityMetric;
  shading_analysis: SiteSuitabilityMetric;
  solar_irradiance: SiteSuitabilityMetric;
}

export interface SizingMetric {
  raw_pct?: number;
  sub_label: string;
  unit: string;
  value: number;
}

export interface Sizing {
  annual_production: SizingMetric;
  energy_coverage: SizingMetric;
  panel_count: SizingMetric;
  system_capacity: SizingMetric;
}

export interface ArrayAnalysis {
  area_per_panel_sqft: number;
  array_area_sqft: number;
  available_roof_area_sqft: number;
  fits_available_roof: boolean;
  roof_utilisation_pct: number;
  total_roof_area_sqft: number;
}

export interface SystemConfiguration {
  array_configuration: string;
  bifacial: boolean;
  cell_type: string;
  efficiency_class: string;
  isc_a: number;
  panel_efficiency_pct: number;
  panel_wattage_w: number;
  rating: number;
  roof_coverage_sqft: number;
  technology: string;
  temp_coefficient_pct_per_c: number;
  total_panels: number;
  voc_v: number;
  warranty_years: number;
  specs?: {
    rated_power_w?: number;
    module_efficiency_pct?: number;
    [key: string]: unknown;
  };
}

export interface TechnicalSpecifications {
  array_analysis: ArrayAnalysis;
  system_configuration: SystemConfiguration;
}

export interface SolveSolarDesignResponse {
  status: number;
  message: string;
  data: {
    assumptions: SolveAssumptions;
    environmental_benefits: EnvironmentalBenefit[];
    financial_analysis: FinancialAnalysis;
    integration_notes: string[];
    monthly_profile: MonthlyProfileItem[];
    site_suitability: SiteSuitability;
    sizing: Sizing;
    success: boolean;
    technical_specifications: TechnicalSpecifications;
    unavailable: unknown[];
  };
}

export type SolveSolarDesignData = SolveSolarDesignResponse["data"];

