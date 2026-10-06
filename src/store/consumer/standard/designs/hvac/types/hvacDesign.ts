// ---------- Categories ----------
export interface HvacCategory {
  id: string;
  name: string;
  product_count: number;
}

export interface HvacCategoriesResponse {
  status: number;
  message: string;
  data: {
    categories: HvacCategory[];
  };
}

// ---------- Products (list) ----------
export interface HvacProductPrice {
  amount: number;
  currency: string;
}

/**
 * HVAC specs are pathway-dependent — a vapour-compression heat pump, an
 * absorption chiller, a heat-recovery ventilator and a zoning controller share
 * almost no fields — and the solve response returns a reduced subset, so only
 * the fields present on every record are required.
 */
export interface HvacProductSpecs {
  output_kind: string;
  footprint_sqft: number;
  cop_rated?: number | null;
  rated_capacity_kw?: number | null;

  control_protocols?: string[] | null;
  electrical_supply?: string | null;
  rating_standard?: string | null;
  sound_pressure_dba?: number | null;
  sound_power_dba?: number | null;
  capacity_modulation_pct?: [number, number] | null;
  condensate_drain_required?: boolean | null;

  // Vapour compression / heat pumps
  cop_heating?: number | null;
  rated_capacity_ton?: number | null;
  rated_heating_capacity_kw?: number | null;
  rated_input_power_kw_cooling?: number | null;
  rated_input_power_kw_heating?: number | null;
  ieer_ahri1230?: number | null;
  seer_en14825?: number | null;
  scop_en14825?: number | null;
  max_indoor_units?: number | null;
  max_total_pipe_length_m?: number | null;
  operating_ambient_range_c_cooling?: [number, number] | null;
  operating_ambient_range_c_heating?: [number, number] | null;
  refrigerant?: string | null;
  refrigerant_charge_kg?: number | null;
  refrigerant_co2e_tonnes?: number | null;
  refrigerant_gwp_ar4?: number | null;
  refrigerant_safety_class_iso817?: string | null;

  // Absorption chillers
  absorbent?: string | null;
  driving_energy_kind?: string | null;
  driving_heat_input_kw?: number | null;
  hot_water_inlet_temp_c?: number | null;
  hot_water_min_inlet_temp_c?: number | null;
  chilled_water_temps_c?: [number, number] | null;
  cooling_water_inlet_temp_c?: number | null;
  cooling_tower_required?: boolean | null;
  heat_rejection_kw?: number | null;
  electrical_parasitic_w?: number | null;

  // Ventilation / heat recovery
  airflow_nominal_m3h?: number | null;
  airflow_range_m3h?: [number, number] | null;
  external_static_pressure_pa?: number | null;
  sensible_recovery_effectiveness_pct?: number | null;
  latent_recovery_effectiveness_pct?: number | null;
  specific_fan_power_w_per_m3h?: number | null;
  rated_input_power_kw?: number | null;
  filter_class?: string | null;
  bypass?: string | null;
  frost_protection?: string | null;

  // Controls
  max_zones?: number | null;
  staging_supported?: string | null;
  sensors_supported?: string[] | null;
  demand_response_protocol?: string | null;
  energy_star_certified?: boolean | null;
  rated_input_power_w?: number | null;
  typical_consumption_reduction_pct?: [number, number] | null;
}

export interface HvacProduct {
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
  price: HvacProductPrice | null;
  specs: HvacProductSpecs;
}

export interface GetHvacProductsParams {
  category?: string;
  search?: string;
  page?: number;
  per_page?: number;
}

export interface HvacPagination {
  page: number;
  per_page: number;
  total: number;
  total_pages: number;
}

export interface HvacProductsResponse {
  status: number;
  message: string;
  data: {
    products: HvacProduct[];
    pagination: HvacPagination;
  };
}

// ---------- Product detail ----------
export interface HvacProductDetail extends HvacProduct {
  country_of_origin: string | null;
  installation_types: string | null;
  market_status: string | null;
  notes: string | null;
}

export interface HvacProductDetailResponse {
  status: number;
  message: string;
  data: {
    product: HvacProductDetail;
  };
}

// ---------- Solve (request) ----------
export interface SolveHvacItem {
  product_id: number;
  quantity: number;
}

export interface SolveHvacUser {
  annual_load_kwh: number;
  tenant_id?: string;
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
  items: SolveHvacItem[];
  user: SolveHvacUser;
  building: SolveHvacBuilding;
  finance: SolveHvacFinance;
  options: SolveHvacOptions;
}

// ---------- Solve (response) ----------
export interface HvacSummaryMetric {
  value: number;
  unit: string;
  subLabel: string;
}

export interface HvacSummary {
  recommendedCapacity: HvacSummaryMetric & { capacityKw: number };
  annualEnergyConsumption: HvacSummaryMetric;
  annualOperatingCost: HvacSummaryMetric & { tariffRate: number };
  energyEfficiencyRating: {
    value: string;
    unit: string;
    subLabel: string;
    copAverage: number;
  };
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

export interface HvacRecommendedEquipment {
  label: string;
  subLabel: string;
  items: HvacProduct[];
}

export interface SolveHvacDesignResponse {
  status: number;
  message: string;
  data: {
    status: string;
    assumptions: string[];
    results: {
      summary: HvacSummary;
      charts: {
        monthlyEnergyLoadProfile: HvacChart;
      };
      technicalSpecifications: HvacTechnicalSpecifications;
      environmentalImpact: HvacEnvironmentalImpact;
      recommendedEquipment: HvacRecommendedEquipment;
    };
  };
}
