// ---------- Categories ----------
export interface BiomassCategory {
  id: string;
  name: string;
  product_count: number;
}

export interface BiomassCategoriesResponse {
  status: number;
  message: string;
  data: {
    success: boolean;
    categories: BiomassCategory[];
  };
}

// ---------- Products (list) ----------
export interface BiomassProductPrice {
  amount: number;
  currency: string;
}

/**
 * Specs are pathway dependent: combustion boilers, anaerobic digestion kits and
 * thermochemical gasifiers each return their own subset of these fields.
 */
export interface BiomassProductSpecs {
  rated_output_kw: number;
  output_kind: string;
  efficiency_pct: number;
  footprint_sqft: number;
  system_type: string;
  feedstock_type: string;

  // Combustion
  storage_capacity_tonnes?: number | null;
  modulation_range_pct?: [number, number] | null;
  ash_removal?: string | null;
  heat_exchanger_cleaning?: string | null;
  flue_diameter_mm?: number | null;

  // Anaerobic digestion
  digester_volume_m3?: number | null;
  hrt_days?: number | null;
  biogas_yield_m3_per_kg?: number | null;
  methane_fraction?: number | null;
  gas_storage_m3?: number | null;
  thermal_recovery_kw?: number | null;
  operating_temp_c?: string | null;
  digestate_output?: string | null;

  // Thermochemical conversion
  reactor_temp_c?: number | null;
  max_feedstock_moisture_pct?: number | null;
  biochar_yield_pct?: number | null;
  feedstock_size_mm?: string | null;
}

export interface BiomassProduct {
  product_id: number;
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
  price: BiomassProductPrice | null;
  specs: BiomassProductSpecs;
}

export interface GetBiomassProductsParams {
  category?: string;
  search?: string;
  page?: number;
  per_page?: number;
}

export interface BiomassProductsResponse {
  status: number;
  message: string;
  data: {
    success: boolean;
    page: number;
    per_page: number;
    total: number;
    total_pages: number;
    products: BiomassProduct[];
  };
}

// ---------- Product detail ----------
export interface BiomassProductDetail extends BiomassProduct {
  country_of_origin: string | null;
  installation_types: string | null;
  market_status: string | null;
  notes: string | null;
}

export interface BiomassProductDetailResponse {
  status: number;
  message: string;
  data: {
    success: boolean;
    product: BiomassProductDetail;
  };
}

// ---------- Solve (request) ----------
export interface SolveBiomassItem {
  product_id: number;
  quantity: number;
}

export interface SolveBiomassContext {
  feedstock_availability: string;
  heating_season_months: number;
  location_label: string;
  currency: string;
}

export interface SolveBiomassFuel {
  cost_per_tonne: number;
  currency: string;
  energy_density_kwh_kg: number;
  moisture_content_pct: number;
}

export interface SolveBiomassTariff {
  rate_per_kwh_thermal: number;
  currency: string;
  incumbent_fuel: string;
}

export interface SolveBiomassOptions {
  horizon_years: number;
  savings_basis: "gross" | "net" | string;
  storage_months: number;
}

export interface SolveBiomassDesignPayload {
  items: SolveBiomassItem[];
  context: SolveBiomassContext;
  heating_demand_kwh_yr: number;
  fuel: SolveBiomassFuel;
  tariff: SolveBiomassTariff;
  options: SolveBiomassOptions;
}

// ---------- Solve (response) ----------
export interface BiomassMetric {
  value: number;
  unit: string;
  sub_label: string;
}

export interface BiomassSizing {
  recommended_capacity: BiomassMetric;
  annual_output: BiomassMetric;
  energy_coverage: BiomassMetric;
}

/** Pathway dependent, so everything beyond the shared fields is optional. */
export interface BiomassSystemConfiguration {
  system_type: string;
  output_kind: string;
  efficiency_pct: number;
  feedstock_type: string;
  feed_rate_kg_h?: number | null;
  storage_capacity_tonnes?: number | null;
  modulation_range_pct?: [number, number] | null;
  ash_removal?: string | null;
  heat_exchanger_cleaning?: string | null;
  digester_volume_m3?: number | null;
  hrt_days?: number | null;
  methane_fraction?: number | null;
  operating_temp_c?: string | null;
  digestate_output?: string | null;
  reactor_temp_c?: number | null;
  biochar_yield_pct?: number | null;
}

export interface BiomassFeedstockAnalysis {
  feedstock_type: string;
  annual_consumption_tonnes: number;
  cost_per_tonne: number;
  energy_density_kwh_kg: number;
  moisture_content_pct: number;
  local_availability: string;
}

export interface BiomassTechnicalSpecifications {
  system_configuration: BiomassSystemConfiguration;
  feedstock_analysis: BiomassFeedstockAnalysis;
}

export interface BiomassSpaceRequirements {
  plant_room: BiomassMetric;
  feedstock_storage: BiomassMetric;
  total_space: BiomassMetric;
}

export interface BiomassFinancialAnalysis {
  currency: string;
  equipment_cost: number;
  installation_cost: number;
  total_investment: number;
  payback_period_years: number;
  annual_fuel_cost: number;
  annual_savings: number;
  lifetime_savings: number;
  horizon_years: number;
  savings_basis: string;
}

export interface BiomassEnvironmentalBenefit {
  title: string;
  value: string;
  note: string;
}

export interface SolveBiomassAssumptions {
  annual_output: string;
  feed_rate_kg_h: string;
  installation_cost: string;
  horizon_years: number;
}

export interface SolveBiomassDesignResponse {
  status: number;
  message: string;
  data: {
    success: boolean;
    pathway: string;
    sizing: BiomassSizing;
    technical_specifications: BiomassTechnicalSpecifications;
    space_requirements: BiomassSpaceRequirements;
    financial_analysis: BiomassFinancialAnalysis;
    environmental_benefits: BiomassEnvironmentalBenefit[];
    integration_notes: string[];
    unavailable: unknown[];
    assumptions: SolveBiomassAssumptions;
  };
}
