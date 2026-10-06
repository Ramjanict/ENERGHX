// ---------- Categories ----------
export interface EvCategory {
  id: string;
  name: string;
  product_count: number;
}

export interface EvCategoriesResponse {
  status: number;
  message: string;
  data: {
    categories: EvCategory[];
  };
}

// ---------- Products (list) ----------
export interface EvProductPrice {
  amount: number;
  currency: string;
}

/**
 * EVSE specs differ widely between AC Level 2, DC fast and bidirectional units,
 * and the solve response returns a reduced subset, so only the two fields that
 * appear on every record are required.
 */
export interface EvProductSpecs {
  rated_output_power_kw: number;
  conversion_efficiency_pct: number;

  power_allocation?: string | null;
  footprint_sqft?: number | null;
  product_configuration?: string | null;
  number_of_outputs?: number | null;
  connector_types?: string[] | null;
  cable_length_ft?: number | null;
  cable_cooling?: string | null;
  max_output_current_a?: number | null;
  output_voltage_range_v?: [number, number] | null;
  input_voltage_v?: number | null;
  input_phase?: string | null;
  input_kind?: string | null;

  // Shared-power cabinets
  power_per_output_kw_max?: number | null;
  power_per_output_kw_all_active?: number | null;
  power_sharing_granularity_kw?: number | null;

  // Standby energy (AC Level 2 / ENERGY STAR reporting)
  no_vehicle_mode_power_w?: number | null;
  partial_on_mode_power_w?: number | null;
  idle_mode_power_w?: number | null;
  annual_standby_energy_kwh?: number | null;

  conversion_stage_location?: string | null;
  typical_onboard_charger_efficiency_pct?: number | null;
  efficiency_measurement_basis?: string | null;
  integral_battery_bank?: boolean | null;

  // Bidirectional / V2X
  bidirectional?: boolean | null;
  discharge_power_kw?: number | null;
  round_trip_efficiency_pct?: number | null;
  v2x_modes?: string[] | null;
  islanding_capable?: boolean | null;
  islanding_transition_ms?: number | null;
  vehicle_compatibility?: string | null;

  // Networking
  network_capable?: boolean | null;
  connected_capable?: boolean | null;
  smart_charging_protocols?: string[] | null;
  roaming_protocol?: string | null;
  demand_response_protocol?: string | null;
  load_management?: string | null;
  payment?: string | null;

  // Compliance
  nevi_compliant?: boolean | null;
  energy_star_certified?: boolean | null;
  energy_star_certified_date?: string | null;
  rating_standard?: string | null;
  certifications?: string[] | null;
  ingress_rating?: string | null;
  operating_temp_range_c?: [number, number] | null;
  sound_pressure_dba?: number | null;
  markets?: string[] | null;
}

export interface EvProduct {
  product_id: number;
  name: string;
  manufacturer: string;
  category: string;
  current_type: string;
  output_spec: string;
  technology: string | null;
  additional: string | null;
  efficiency_class: string | null;
  warranty_years: number | null;
  rating: number | null;
  price: EvProductPrice | null;
  specs: EvProductSpecs;
}

export interface GetEvProductsParams {
  category?: string;
  search?: string;
  page?: number;
  per_page?: number;
}

export interface EvPagination {
  page: number;
  per_page: number;
  total: number;
  total_pages: number;
}

export interface EvProductsResponse {
  status: number;
  message: string;
  data: {
    products: EvProduct[];
    pagination: EvPagination;
  };
}

// ---------- Product detail ----------
export interface EvProductDetail extends EvProduct {
  country_of_origin: string | null;
  installation_types: string | null;
  market_status: string | null;
  notes: string | null;
}

export interface EvProductDetailResponse {
  status: number;
  message: string;
  data: {
    product: EvProductDetail;
  };
}

// ---------- Solve (request) ----------
export interface SolveEvItem {
  product_id: string;
  quantity: number;
}

export interface SolveEvUser {
  annual_load_kwh: number;
  anything_the_db_has?: unknown[];
}

export interface SolveEvSite {
  grid_connection_kw: number;
  existing_peak_demand_kw: number;
}

export interface SolveEvFleet {
  vehicle_count: number;
  average_daily_distance: number;
  consumption_kwh_per_100: number;
  target_uptime_percent: number;
}

export interface SolveEvTariff {
  energy_rate: number;
  demand_charge_per_kw: number;
}

export interface SolveEvOptions {
  sizing_mode: string;
  distance_unit: "km" | "mi" | string;
}

export interface SolveEvDesignPayload {
  items: SolveEvItem[];
  user: SolveEvUser;
  site: SolveEvSite;
  fleet: SolveEvFleet;
  tariff: SolveEvTariff;
  options: SolveEvOptions;
}

// ---------- Solve (response) ----------
export interface EvAssumption {
  field: string;
  value: number | string | boolean;
  source: string;
}

export interface EvSummaryMetric {
  value: number;
  unit: string;
  subLabel: string;
}

export interface EvSummary {
  recommendedCapacity: EvSummaryMetric & { simultaneousKw: number };
  annualEnergyConsumption: EvSummaryMetric;
  annualOperatingCost: EvSummaryMetric & { tariffRate: number };
  energyEfficiencyRating: {
    value: string;
    unit: string;
    subLabel: string;
    plugToBatteryPct: number;
  };
}

export interface EvChartAxis {
  key: string;
  label: string;
}

export interface EvChartValueAxis {
  id: string;
  label: string;
  position: string;
  min?: number;
  max?: number;
}

export interface EvChartSeries {
  key: string;
  label: string;
  axis: string;
}

export type EvChartDatum = Record<string, string | number>;

export interface EvChartTotals {
  peakMonth?: string;
  peakMonthKwh?: number;
  totalKwh?: number;
  [key: string]: string | number | undefined;
}

export interface EvChart {
  type: string;
  title: string;
  unit: string;
  xAxis: EvChartAxis;
  yAxes: EvChartValueAxis[];
  series: EvChartSeries[];
  data: EvChartDatum[];
  totals: EvChartTotals;
}

export interface EvSpecRow {
  key: string;
  label: string;
  display: string;
  value: number | string | string[];
  unit?: string;
  emphasis?: "positive" | "negative" | string;
}

export interface EvSpecSection {
  label: string;
  currency?: string;
  rows: EvSpecRow[];
}

export interface EvTechnicalSpecifications {
  stationConfiguration: EvSpecSection;
  financialAnalysis: EvSpecSection;
}

export interface EvEnvironmentalMetric {
  value: number;
  unit: string;
  display: string;
  label: string;
  subLabel: string;
}

export interface EvEnvironmentalImpact {
  co2Reduction: EvEnvironmentalMetric;
  fuelDisplaced: EvEnvironmentalMetric;
  gridEmissionFactor: EvEnvironmentalMetric;
}

export interface EvRecommendedEquipment {
  label: string;
  subLabel: string;
  items: EvProduct[];
}

export interface SolveEvDesignResponse {
  status: number;
  message: string;
  data: {
    status: string;
    assumptions: EvAssumption[];
    notes: string[];
    results: {
      summary: EvSummary;
      charts: {
        monthlyEnergyDeliveryProfile: EvChart;
      };
      technicalSpecifications: EvTechnicalSpecifications;
      environmentalImpact: EvEnvironmentalImpact;
      recommendedEquipment: EvRecommendedEquipment;
    };
  };
}
