// ---------- Categories ----------
export interface WindCategory {
  id: string;
  name: string;
  product_count: number;
}

export interface WindCategoriesResponse {
  status: number;
  message: string;
  data: {
    categories: WindCategory[];
    success: boolean;
  };
}

// ---------- Products (list) ----------
export interface WindProductPrice {
  amount: number;
  currency: string;
}

export interface WindProductSpecs {
  cut_in_speed_ms: number | null;
  cut_out_speed_ms: number | null;
  grid_compatibility: string | null;
  rated_capacity_kw: number | null;
  rotor_configuration: string | null;
}

export interface WindProduct {
  additional: string | null;
  category: string;
  efficiency_class: string | null;
  manufacturer: string;
  name: string;
  output_spec: string;
  price: WindProductPrice | null;
  product_id: number;
  rating: number | null;
  specs: WindProductSpecs;
  technology: string | null;
  warranty_years: number | null;
}

export interface GetWindProductsParams {
  category?: string;
  search?: string;
  page?: number;
  per_page?: number;
}

export interface WindProductsResponse {
  status: number;
  message: string;
  data: {
    page: number;
    per_page: number;
    products: WindProduct[];
    success: boolean;
    total: number;
    total_pages: number;
  };
}

// ---------- Product detail ----------
export interface WindProductDetailSpecs extends WindProductSpecs {
  rated_speed_ms: number | null;
  rotor_diameter_m: number | null;
  tower_height_m: number | null;
  vawt_type: string | null;
}

export interface WindProductDetail extends Omit<WindProduct, "specs"> {
  country_of_origin: string | null;
  installation_types: string | null;
  market_status: string | null;
  notes: string | null;
  specs: WindProductDetailSpecs;
}

export interface WindProductDetailResponse {
  status: number;
  message: string;
  data: {
    product: WindProductDetail;
    success: boolean;
  };
}

// ---------- Solve (request) ----------
export interface SolveWindItem {
  product_id: string;
  quantity: number;
}

export interface SolveWindSite {
  latitude: number;
  longitude: number;
  hub_height_m: number;
}

export interface SolveWindTariff {
  rate_per_kwh: number;
  currency: string;
  escalation_pct: number;
}

export interface SolveWindOptions {
  horizon_years: number;
  savings_basis: "gross" | "net" | string;
}

export interface SolveWindDesignPayload {
  items: SolveWindItem[];
  site: SolveWindSite;
  demand_kwh_yr: number;
  tariff: SolveWindTariff;
  options: SolveWindOptions;
}

// ---------- Solve (response) ----------
export interface SolveWindAssumptions {
  horizon_years: number;
  source: string;
  turbine_capacity: string;
  wind_resource: string;
}

export interface WindFinancialAnalysis {
  annual_savings: number;
  currency: string;
  equipment_cost: number;
  horizon_years: number;
  installation_cost: number;
  lifetime_savings: number;
  payback_period_years: number;
  savings_basis: string;
  total_investment: number;
}

export interface WindSizingMetric {
  raw_pct?: number;
  sub_label: string;
  unit: string;
  value: number;
}

export interface WindSizing {
  annual_production: WindSizingMetric;
  capacity_factor: WindSizingMetric;
  energy_coverage: WindSizingMetric;
  turbine_capacity: WindSizingMetric;
}

export interface WindSiteAnalysis {
  avg_wind_speed_ms: number;
  capacity_factor_pct: number;
  site_suitability: string;
  turbulence_intensity_pct: number;
  wind_class: number;
}

export interface WindTurbineConfiguration {
  cut_in_speed_ms: number | null;
  cut_out_speed_ms: number | null;
  rated_speed_ms: number | null;
  rotor_diameter_m: number | null;
  tower_height_m: number | null;
}

export interface WindTechnicalSpecifications {
  site_analysis: WindSiteAnalysis;
  turbine_configuration: WindTurbineConfiguration;
}

export interface SolveWindDesignResponse {
  status: number;
  message: string;
  data: {
    assumptions: SolveWindAssumptions;
    financial_analysis: WindFinancialAnalysis;
    site_considerations: string[];
    sizing: WindSizing;
    success: boolean;
    technical_specifications: WindTechnicalSpecifications;
    unavailable: unknown[];
  };
}

export type SolveWindDesignData = SolveWindDesignResponse["data"];

