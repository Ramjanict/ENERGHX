import { z } from "zod";
import type { SolveBatteryDesignPayload } from "@/store/consumer/standard/designs/designPost/types/battery";

/**
 * Only values documented by the solve endpoint so far. Extend these lists as
 * the backend adds further strategies.
 */
export const sizingModeOptions = ["as-selected"] as const;
export const optimizeForOptions = ["self_sufficiency"] as const;

const TIME_OF_DAY = /^([01]\d|2[0-3]):[0-5]\d$/;

/** 24 hourly fractions summing to ~1.0 for a typical residential load shape. */
export const DEFAULT_BATTERY_LOAD_PROFILE = [
  0.024, 0.021, 0.019, 0.018, 0.018, 0.021, 0.029, 0.038, 0.045, 0.047, 0.044,
  0.043, 0.042, 0.041, 0.041, 0.042, 0.046, 0.055, 0.07, 0.085, 0.08, 0.061,
  0.041, 0.029,
] as const;

export const touWindowSchema = z.object({
  start: z.string().regex(TIME_OF_DAY, "Use 24-hour HH:MM"),
  end: z.string().regex(TIME_OF_DAY, "Use 24-hour HH:MM"),
  rate: z
    .number({ invalid_type_error: "Enter a valid number" })
    .min(0, "Cannot be negative")
    .max(10, "Value looks too large — enter rate per kWh"),
});

export const batterySiteParametersSchema = z.object({
  // Load
  annualLoadKwh: z
    .number({ invalid_type_error: "Enter a valid number" })
    .positive("Must be greater than 0")
    .max(100_000_000, "Value looks too large"),
  peakDemandKw: z
    .number({ invalid_type_error: "Enter a valid number" })
    .positive("Must be greater than 0")
    .max(10_000, "Value looks too large"),
  loadProfile: z
    .array(z.number({ invalid_type_error: "Enter a valid number" }).min(0))
    .length(24, "Load profile must include 24 hourly values"),

  // Dispatch
  backupLoadsKw: z
    .number({ invalid_type_error: "Enter a valid number" })
    .positive("Must be greater than 0")
    .max(10_000, "Value looks too large"),
  targetBackupHours: z
    .number({ invalid_type_error: "Enter a valid number" })
    .positive("Must be greater than 0")
    .max(168, "Must be one week or less"),

  // Tariff
  importRate: z
    .number({ invalid_type_error: "Enter a valid number" })
    .positive("Must be greater than 0")
    .max(10, "Value looks too large — enter rate per kWh"),
  exportRate: z
    .number({ invalid_type_error: "Enter a valid number" })
    .min(0, "Cannot be negative")
    .max(10, "Value looks too large — enter rate per kWh"),
  demandChargePerKw: z
    .number({ invalid_type_error: "Enter a valid number" })
    .min(0, "Cannot be negative")
    .max(1_000, "Value looks too large"),
  touWindows: z.array(touWindowSchema),

  // Options
  sizingMode: z.enum(sizingModeOptions),
  optimizeFor: z.enum(optimizeForOptions),
});

export type TouWindowFormValues = z.infer<typeof touWindowSchema>;

export type BatterySiteParametersFormValues = z.infer<
  typeof batterySiteParametersSchema
>;

export type BatterySiteParametersFormErrors = Partial<
  Record<
    Exclude<keyof BatterySiteParametersFormValues, "touWindows" | "loadProfile">,
    string
  >
>;

export type TouWindowErrors = Partial<Record<keyof TouWindowFormValues, string>>;

export const toSolveBatteryDesignPayload = (
  items: { product_id: string; quantity: number }[],
  values: BatterySiteParametersFormValues,
): SolveBatteryDesignPayload => ({
  items,
  user: {
    annual_load_kwh: values.annualLoadKwh,
    load_profile: values.loadProfile,
    peak_demand_kw: values.peakDemandKw,
  },
  dispatch: {
    backup_loads_kw: values.backupLoadsKw,
    target_backup_hours: values.targetBackupHours,
  },
  tariff: {
    import_rate: values.importRate,
    export_rate: values.exportRate,
    demand_charge_per_kw: values.demandChargePerKw,
    tou_windows: values.touWindows,
  },
  options: {
    sizing_mode: values.sizingMode,
    optimize_for: values.optimizeFor,
  },
});
