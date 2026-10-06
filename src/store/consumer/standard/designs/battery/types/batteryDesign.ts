// ---------- Categories ----------
export interface BatteryCategory {
  id: string;
  name: string;
  product_count: number;
}

export interface BatteryCategoriesResponse {
  status: number;
  message: string;
  data: {
    categories: BatteryCategory[];
  };
}

// ---------- Products (list) ----------
export interface BatteryProductPrice {
  amount: number;
  currency: string;
}

/**
 * Battery packs and hybrid inverters live in the same catalogue but publish
 * different fields — an inverter has no usable capacity, a DC-coupled pack has
 * no compatible-inverter list — so only the fields present on every record are
 * required.
 */
export interface BatteryProductSpecs {
  continuous_power_kw: number;
  footprint_sqft: number;

  chemistry?: string | null;
  nameplate_capacity_kwh?: number | null;
  usable_capacity_kwh?: number | null;
  depth_of_discharge_pct?: number | null;
  peak_power_kw?: number | null;
  c_rate_continuous?: number | null;
  cycle_life_cycles?: number | null;
  weight_kg?: number | null;

  // Efficiency — boundary matters, see the product notes
  round_trip_efficiency_pct?: number | null;
  round_trip_efficiency_dc_pct?: number | null;
  round_trip_efficiency_ac_pct?: number | null;
  round_trip_measurement_boundary?: string | null;
  peak_efficiency_pct?: number | null;
  euro_efficiency_pct?: number | null;

  // Backup / islanding
  backup_capable?: boolean | null;
  backup_mode?: string | null;
  islanding_transition_ms?: number | null;
  motor_start_capability_a_lra?: number | null;

  // Inverter and solar coupling
  inverter_included?: boolean | null;
  inverter_continuous_kw?: number | null;
  compatible_inverters?: string[] | null;
  max_solar_dc_input_kw?: number | null;
  solar_mppt_inputs?: number | null;
  max_battery_charge_kw?: number | null;
  battery_voltage_range_v?: [number, number] | null;

  // Modularity and electrical
  scalable?: boolean | null;
  max_units_parallel?: number | null;
  module_capacity_kwh?: number | null;
  modules_installed?: number | null;
  modules_min_max?: [number, number] | null;
  nominal_voltage_v?: number | null;
  voltage_range_v?: [number, number] | null;
  max_continuous_current_a?: number | null;

  // Warranty
  warranty_retention_pct?: number | null;
  warranty_throughput_mwh?: number | null;

  // Energy management
  tariff_optimisation?: boolean | null;
  virtual_power_plant_capable?: boolean | null;

  // Environment and compliance
  control_protocols?: string[] | null;
  certifications?: string[] | null;
  ingress_rating?: string | null;
  operating_temp_range_c?: [number, number] | null;
}

export interface BatteryProduct {
  product_id: number;
  name: string;
  manufacturer: string;
  category: string;
  coupling: string;
  output_spec: string;
  technology: string | null;
  additional: string | null;
  efficiency_class: string | null;
  warranty_years: number | null;
  rating: number | null;
  price: BatteryProductPrice | null;
  specs: BatteryProductSpecs;
}

export interface GetBatteryProductsParams {
  category?: string;
  search?: string;
  page?: number;
  per_page?: number;
}

export interface BatteryPagination {
  page: number;
  per_page: number;
  total: number;
  total_pages: number;
}

export interface BatteryProductsResponse {
  status: number;
  message: string;
  data: {
    products: BatteryProduct[];
    pagination: BatteryPagination;
  };
}

// ---------- Product detail ----------
export interface BatteryProductDetail extends BatteryProduct {
  country_of_origin: string | null;
  installation_types: string | null;
  market_status: string | null;
  notes: string | null;
}

export interface BatteryProductDetailResponse {
  status: number;
  message: string;
  data: {
    product: BatteryProductDetail;
  };
}

// ---------- Solve (request) ----------
export interface SolveBatteryItem {
  product_id: string;
  quantity: number;
}

export interface SolveBatteryUser {
  annual_load_kwh: number;
  load_profile: number[];
  peak_demand_kw: number;
}

export interface SolveBatteryDispatch {
  backup_loads_kw: number;
  target_backup_hours: number;
}

export interface TouWindow {
  start: string;
  end: string;
  rate: number;
}

export interface SolveBatteryTariff {
  import_rate: number;
  export_rate: number;
  demand_charge_per_kw: number;
  tou_windows: TouWindow[];
}

export interface SolveBatteryOptions {
  sizing_mode: string;
  optimize_for: string;
}

export interface SolveBatteryDesignPayload {
  items: SolveBatteryItem[];
  user: SolveBatteryUser;
  dispatch: SolveBatteryDispatch;
  tariff: SolveBatteryTariff;
  options: SolveBatteryOptions;
}

// ---------- Solve (response) ----------
export interface BatterySummary {
  recommendedBatterySize: {
    value: number;
    unit: string;
    subLabel: string;
    usableKwh: number;
    depthOfDischargePct: number;
  };
  backupDuration: {
    value: number;
    unit: string;
    subLabel: string;
    backupLoadKw: number;
  };
  annualSavings: {
    value: number;
    unit: string;
    subLabel: string;
    trend: string;
  };
  energyIndependence: {
    value: number;
    unit: string;
    subLabel: string;
  };
}

export interface BatteryChartAxis {
  key: string;
  label: string;
}

export interface BatteryChartValueAxis {
  id: string;
  label: string;
  position: string;
  min?: number;
  max?: number;
}

export interface BatteryChartSeries {
  key: string;
  label: string;
  axis: string;
  style?: string;
}

export type BatteryChartDatum = Record<string, string | number>;

export interface BatteryLifecycleTotals {
  annualDegradationPct?: number;
  meetsWarranty?: boolean;
  retentionAtWarrantyYear?: number;
  warrantyFloorPct?: number;
  warrantyYear?: number;
}

export interface BatteryDispatchTotals {
  batteryChargedKwh?: number;
  batteryDischargedKwh?: number;
  demandKwh?: number;
  gridImportKwh?: number;
  intervalHours?: number;
  peakDemandKw?: number;
  selfSufficiencyPct?: number;
  solarKwh?: number;
  windKwh?: number;
}

export interface BatteryChart<TTotals> {
  type: string;
  title: string;
  unit: string;
  xAxis: BatteryChartAxis;
  yAxes: BatteryChartValueAxis[];
  series: BatteryChartSeries[];
  data: BatteryChartDatum[];
  totals: TTotals;
}

export type BatteryLifecycleChartData = BatteryChart<BatteryLifecycleTotals>;
export type BatteryDispatchChartData = BatteryChart<BatteryDispatchTotals>;

export interface BatterySpecRow {
  key: string;
  label: string;
  display: string;
  value: number | string;
  unit?: string;
  emphasis?: "positive" | "negative" | string;
}

export interface BatterySpecSection {
  label: string;
  currency?: string;
  rows: BatterySpecRow[];
}

export interface BatteryTechnicalSpecifications {
  label: string;
  batterySystem: BatterySpecSection;
  financialAnalysis: BatterySpecSection;
}

export interface SolveBatteryDesignResponse {
  status: number;
  message: string;
  data: {
    status: string;
    assumptions: string[];
    notes: string[];
    results: {
      summary: BatterySummary;
      charts: {
        batteryLifecycleAnalysis: BatteryLifecycleChartData;
        dailyEnergyDispatchProfile: BatteryDispatchChartData;
      };
      technicalSpecifications: BatteryTechnicalSpecifications;
    };
  };
}
