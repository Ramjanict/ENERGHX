import { DesignSolveItem, PendingSolveResponse } from "./shared";

export interface SolveSolarSite {
  latitude: number;
  daily_irradiance_kwh_m2_day: number;
  total_roof_area_sqft: number;
  available_roof_area_sqft: number;
  tilt_deg: number;
  azimuth_deg: number;
  system_loss_factor_pct: number;
  shading_factor: number;
  grid_emission_factor_kg_kwh: number;
  location_label: string;
  currency: string;
}

export interface SolveSolarDemand {
  annual_load_kwh: number;
  usage_profile: string;
  critical_load_kw: number;
}

export interface SolveSolarFinance {
  electricity_tariff_rate: number;
  tax_credit_percentage: number;
  currency: string;
  annual_degradation_pct: number;
  escalation_pct: number;
}

export interface SolveSolarOptions {
  horizon_years: number;
  payback_basis: "gross" | "net" | string;
}

export interface SolveSolarDesignPayload {
  items: DesignSolveItem[];
  site: SolveSolarSite;
  demand: SolveSolarDemand;
  finance: SolveSolarFinance;
  options: SolveSolarOptions;
}

export type SolveSolarDesignResponse = PendingSolveResponse;
