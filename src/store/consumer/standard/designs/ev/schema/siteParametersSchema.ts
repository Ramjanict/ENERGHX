import { z } from "zod";
import type { SolveEvDesignPayload } from "@/store/consumer/standard/designs/designPost/types/ev";

export const distanceUnitOptions = ["km", "mi"] as const;

/**
 * Only "size-to-fleet" is documented by the solve endpoint so far. Extend this
 * list as the backend adds further strategies.
 */
export const sizingModeOptions = ["size-to-fleet"] as const;

export const evSiteParametersSchema = z
  .object({
    // Site & grid
    annualLoadKwh: z
      .number({ invalid_type_error: "Enter a valid number" })
      .positive("Must be greater than 0")
      .max(100_000_000, "Value looks too large"),
    gridConnectionKw: z
      .number({ invalid_type_error: "Enter a valid number" })
      .positive("Must be greater than 0")
      .max(100_000, "Value looks too large"),
    existingPeakDemandKw: z
      .number({ invalid_type_error: "Enter a valid number" })
      .min(0, "Cannot be negative")
      .max(100_000, "Value looks too large"),

    // Fleet
    vehicleCount: z
      .number({ invalid_type_error: "Enter a valid number" })
      .int("Must be a whole number")
      .positive("Must be at least 1 vehicle")
      .max(10_000, "Value looks too large"),
    averageDailyDistance: z
      .number({ invalid_type_error: "Enter a valid number" })
      .positive("Must be greater than 0")
      .max(2_000, "Value looks too large"),
    consumptionKwhPer100: z
      .number({ invalid_type_error: "Enter a valid number" })
      .positive("Must be greater than 0")
      .max(200, "Value looks too large"),
    targetUptimePercent: z
      .number({ invalid_type_error: "Enter a valid number" })
      .min(1, "Must be between 1% and 100%")
      .max(100, "Must be between 1% and 100%"),

    // Tariff
    energyRate: z
      .number({ invalid_type_error: "Enter a valid number" })
      .positive("Must be greater than 0")
      .max(10, "Value looks too large — enter rate per kWh"),
    demandChargePerKw: z
      .number({ invalid_type_error: "Enter a valid number" })
      .min(0, "Cannot be negative")
      .max(1_000, "Value looks too large"),

    // Options
    sizingMode: z.enum(sizingModeOptions),
    distanceUnit: z.enum(distanceUnitOptions),
  })
  .refine((data) => data.existingPeakDemandKw <= data.gridConnectionKw, {
    message: "Cannot exceed the grid connection capacity",
    path: ["existingPeakDemandKw"],
  });

export type EvSiteParametersFormValues = z.infer<typeof evSiteParametersSchema>;

export type EvSiteParametersFormErrors = Partial<
  Record<keyof EvSiteParametersFormValues, string>
>;

export const toSolveEvDesignPayload = (
  items: { product_id: string; quantity: number }[],
  values: EvSiteParametersFormValues,
  dbBlob: unknown[] = [],
): SolveEvDesignPayload => ({
  items,
  user: {
    annual_load_kwh: values.annualLoadKwh,
    ...(dbBlob.length > 0 ? { anything_the_db_has: dbBlob } : {}),
  },
  site: {
    grid_connection_kw: values.gridConnectionKw,
    existing_peak_demand_kw: values.existingPeakDemandKw,
  },
  fleet: {
    vehicle_count: values.vehicleCount,
    average_daily_distance: values.averageDailyDistance,
    consumption_kwh_per_100: values.consumptionKwhPer100,
    target_uptime_percent: values.targetUptimePercent,
  },
  tariff: {
    energy_rate: values.energyRate,
    demand_charge_per_kw: values.demandChargePerKw,
  },
  options: {
    sizing_mode: values.sizingMode,
    distance_unit: values.distanceUnit,
  },
});
