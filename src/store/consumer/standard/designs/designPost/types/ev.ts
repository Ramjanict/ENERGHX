import { DesignSolveItem } from "./shared";

export type {
  SolveEvDesignResponse,
  EvAssumption,
  EvSummary,
  EvSummaryMetric,
  EvChart,
  EvTechnicalSpecifications,
  EvEnvironmentalImpact,
  EvRecommendedEquipment,
  EvProduct,
} from "../../ev/types/evDesign";

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
  items: DesignSolveItem[];
  user: SolveEvUser;
  site: SolveEvSite;
  fleet: SolveEvFleet;
  tariff: SolveEvTariff;
  options: SolveEvOptions;
}
