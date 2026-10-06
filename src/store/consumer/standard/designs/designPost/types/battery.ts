import { DesignSolveItem } from "./shared";

export type {
  SolveBatteryDesignResponse,
  BatterySummary,
  BatteryLifecycleChartData,
  BatteryDispatchChartData,
  BatteryTechnicalSpecifications,
  TouWindow,
} from "../../battery/types/batteryDesign";

export interface SolveBatteryUser {
  annual_load_kwh: number;
  load_profile: number[];
  peak_demand_kw: number;
}

export interface SolveBatteryDispatch {
  backup_loads_kw: number;
  target_backup_hours: number;
}

export interface SolveBatteryTouWindow {
  start: string;
  end: string;
  rate: number;
}

export interface SolveBatteryTariff {
  import_rate: number;
  export_rate: number;
  demand_charge_per_kw: number;
  tou_windows: SolveBatteryTouWindow[];
}

export interface SolveBatteryOptions {
  sizing_mode: string;
  optimize_for: string;
}

export interface SolveBatteryDesignPayload {
  items: DesignSolveItem[];
  user: SolveBatteryUser;
  dispatch: SolveBatteryDispatch;
  tariff: SolveBatteryTariff;
  options: SolveBatteryOptions;
}
