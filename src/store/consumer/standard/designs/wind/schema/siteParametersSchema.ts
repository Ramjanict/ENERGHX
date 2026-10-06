import { z } from "zod";
import type { SolveWindDesignPayload } from "@/store/consumer/standard/designs/designPost/types/wind";

export const savingsBasisOptions = ["gross", "net"] as const;

export const terrainClassOptions = [
  "open",
  "suburban",
  "urban",
  "forest",
] as const;

export const windSiteParametersSchema = z.object({
  latitude: z
    .number({ invalid_type_error: "Enter a valid number" })
    .min(-90, "Must be between -90° and 90°")
    .max(90, "Must be between -90° and 90°"),
  longitude: z
    .number({ invalid_type_error: "Enter a valid number" })
    .min(-180, "Must be between -180° and 180°")
    .max(180, "Must be between -180° and 180°"),
  hubHeightMeters: z
    .number({ invalid_type_error: "Enter a valid number" })
    .min(1, "Must be at least 1 metre")
    .max(200, "Must be 200 metres or less"),
  avgWindSpeedMs: z
    .number({ invalid_type_error: "Enter a valid number" })
    .positive("Must be greater than 0")
    .max(50, "Value looks too large"),
  windSpeedReferenceHeightM: z
    .number({ invalid_type_error: "Enter a valid number" })
    .positive("Must be greater than 0")
    .max(200, "Must be 200 metres or less"),
  terrainClass: z.enum(terrainClassOptions),
  obstacleMaxHeightM: z
    .number({ invalid_type_error: "Enter a valid number" })
    .min(0, "Cannot be negative")
    .max(500, "Value looks too large"),
  obstacleDistanceM: z
    .number({ invalid_type_error: "Enter a valid number" })
    .min(0, "Cannot be negative")
    .max(10_000, "Value looks too large"),

  demandKwhPerYear: z
    .number({ invalid_type_error: "Enter a valid number" })
    .positive("Must be greater than 0")
    .max(10_000_000, "Value looks too large"),

  tariffRatePerKwh: z
    .number({ invalid_type_error: "Enter a valid number" })
    .positive("Must be greater than 0")
    .max(10, "Value looks too large — enter rate per kWh"),
  currency: z.string().min(1, "Currency is required"),
  escalationPct: z
    .number({ invalid_type_error: "Enter a valid number" })
    .min(0, "Must be between 0% and 20%")
    .max(20, "Must be between 0% and 20%"),

  horizonYears: z
    .number({ invalid_type_error: "Enter a valid number" })
    .int("Must be a whole number")
    .min(1, "Must be at least 1 year")
    .max(50, "Must be 50 years or less"),
  savingsBasis: z.enum(savingsBasisOptions),
});

export type WindSiteParametersFormValues = z.infer<
  typeof windSiteParametersSchema
>;

export type WindSiteParametersFormErrors = Partial<
  Record<keyof WindSiteParametersFormValues, string>
>;

export const windSiteParametersDefaultValues: WindSiteParametersFormValues = {
  latitude: 6.5244,
  longitude: 3.3792,
  hubHeightMeters: 24,
  avgWindSpeedMs: 5.4,
  windSpeedReferenceHeightM: 10,
  terrainClass: "suburban",
  obstacleMaxHeightM: 12,
  obstacleDistanceM: 60,
  demandKwhPerYear: 26700,
  tariffRatePerKwh: 0.15,
  currency: "USD",
  escalationPct: 0,
  horizonYears: 30,
  savingsBasis: "net",
};

export const toSolveWindDesignPayload = (
  items: { product_id: string; quantity: number }[],
  parameters: WindSiteParametersFormValues,
): SolveWindDesignPayload => ({
  items,
  site: {
    latitude: parameters.latitude,
    longitude: parameters.longitude,
    hub_height_m: parameters.hubHeightMeters,
    avg_wind_speed_ms: parameters.avgWindSpeedMs,
    wind_speed_reference_height_m: parameters.windSpeedReferenceHeightM,
    terrain_class: parameters.terrainClass,
    nearby_obstacle: {
      max_height_m: parameters.obstacleMaxHeightM,
      distance_m: parameters.obstacleDistanceM,
    },
  },
  demand_kwh_yr: parameters.demandKwhPerYear,
  tariff: {
    rate_per_kwh: parameters.tariffRatePerKwh,
    currency: parameters.currency,
    escalation_pct: parameters.escalationPct,
  },
  options: {
    horizon_years: parameters.horizonYears,
    savings_basis: parameters.savingsBasis,
  },
});
