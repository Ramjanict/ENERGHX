import { DesignSolveItem, PendingSolveResponse } from "./shared";

export interface SolveWindNearbyObstacle {
  max_height_m: number;
  distance_m: number;
}

export interface SolveWindSite {
  latitude: number;
  longitude: number;
  hub_height_m: number;
  avg_wind_speed_ms: number;
  wind_speed_reference_height_m: number;
  terrain_class: string;
  nearby_obstacle: SolveWindNearbyObstacle;
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
  items: DesignSolveItem[];
  site: SolveWindSite;
  demand_kwh_yr: number;
  tariff: SolveWindTariff;
  options: SolveWindOptions;
}

export type SolveWindDesignResponse = PendingSolveResponse;
