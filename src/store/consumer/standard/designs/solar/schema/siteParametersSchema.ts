import { z } from "zod";
import type { SolveSolarDesignPayload } from "@/store/consumer/standard/designs/designPost/types/solar";

export const paybackBasisOptions = ["gross", "net"] as const;

export const usageProfileOptions = [
  "daytime_home",
  "evening_peak",
  "commercial_daytime",
  "flat",
] as const;

export const siteParametersSchema = z
  .object({
    locationLabel: z
      .string()
      .trim()
      .min(2, "Location is required")
      .max(120, "Location is too long"),
    currency: z.string().min(1, "Currency is required"),
    latitude: z
      .number({ invalid_type_error: "Enter a valid number" })
      .min(-90, "Must be between -90 and 90")
      .max(90, "Must be between -90 and 90"),

    totalRoofAreaSqFt: z
      .number({ invalid_type_error: "Enter a valid number" })
      .positive("Must be greater than 0")
      .max(1_000_000, "Value looks too large"),
    availableRoofAreaSqFt: z
      .number({ invalid_type_error: "Enter a valid number" })
      .positive("Must be greater than 0")
      .max(1_000_000, "Value looks too large"),
    solarIrradiance: z
      .number({ invalid_type_error: "Enter a valid number" })
      .min(0.1, "Must be at least 0.1")
      .max(12, "Must be 12 or less"),
    tiltAngleDegrees: z
      .number({ invalid_type_error: "Enter a valid number" })
      .min(0, "Must be between 0° and 90°")
      .max(90, "Must be between 0° and 90°"),
    azimuthDegrees: z
      .number({ invalid_type_error: "Enter a valid number" })
      .min(0, "Must be between 0° and 360°")
      .max(360, "Must be between 0° and 360°"),
    systemLossFactorPct: z
      .number({ invalid_type_error: "Enter a valid number" })
      .min(0, "Must be between 0% and 100%")
      .max(100, "Must be between 0% and 100%"),
    shadingFactor: z
      .number({ invalid_type_error: "Enter a valid number" })
      .min(0, "Must be between 0 and 1")
      .max(1, "Must be between 0 and 1"),
    gridEmissionFactorKgKwh: z
      .number({ invalid_type_error: "Enter a valid number" })
      .min(0, "Cannot be negative")
      .max(5, "Value looks too large"),

    annualLoadKwh: z
      .number({ invalid_type_error: "Enter a valid number" })
      .positive("Must be greater than 0")
      .max(10_000_000, "Value looks too large"),
    usageProfile: z.enum(usageProfileOptions),
    criticalLoadKw: z
      .number({ invalid_type_error: "Enter a valid number" })
      .positive("Must be greater than 0")
      .max(10_000, "Value looks too large"),

    electricityTariffRate: z
      .number({ invalid_type_error: "Enter a valid number" })
      .positive("Must be greater than 0")
      .max(10, "Value looks too large — enter rate per kWh"),
    taxCreditPercentage: z
      .number({ invalid_type_error: "Enter a valid number" })
      .min(0, "Must be between 0% and 100%")
      .max(100, "Must be between 0% and 100%"),
    annualDegradationPct: z
      .number({ invalid_type_error: "Enter a valid number" })
      .min(0, "Cannot be negative")
      .max(100, "Must be 100% or less"),
    escalationPct: z
      .number({ invalid_type_error: "Enter a valid number" })
      .min(0, "Cannot be negative")
      .max(100, "Must be 100% or less"),

    horizonYears: z
      .number({ invalid_type_error: "Enter a valid number" })
      .int("Must be a whole number")
      .min(1, "Must be at least 1 year")
      .max(50, "Must be 50 years or less"),
    paybackBasis: z.enum(paybackBasisOptions),
  })
  .refine((data) => data.availableRoofAreaSqFt <= data.totalRoofAreaSqFt, {
    message: "Cannot exceed total roof area",
    path: ["availableRoofAreaSqFt"],
  });

export type SiteParametersFormValues = z.infer<typeof siteParametersSchema>;

export type SiteParametersFormErrors = Partial<
  Record<keyof SiteParametersFormValues, string>
>;

export const siteParametersDefaultValues: SiteParametersFormValues = {
  locationLabel: "Lagos, Nigeria",
  currency: "USD",
  latitude: 6.5244,
  totalRoofAreaSqFt: 800,
  availableRoofAreaSqFt: 600,
  solarIrradiance: 5.2,
  tiltAngleDegrees: 15,
  azimuthDegrees: 180,
  systemLossFactorPct: 14,
  shadingFactor: 1,
  gridEmissionFactorKgKwh: 0.44,
  annualLoadKwh: 17053,
  usageProfile: "daytime_home",
  criticalLoadKw: 3.5,
  electricityTariffRate: 0.15,
  taxCreditPercentage: 30,
  annualDegradationPct: 0,
  escalationPct: 0,
  horizonYears: 25,
  paybackBasis: "gross",
};

export const toSolveSolarDesignPayload = (
  items: { product_id: string; quantity: number }[],
  parameters: SiteParametersFormValues,
): SolveSolarDesignPayload => ({
  items,
  site: {
    latitude: parameters.latitude,
    daily_irradiance_kwh_m2_day: parameters.solarIrradiance,
    total_roof_area_sqft: parameters.totalRoofAreaSqFt,
    available_roof_area_sqft: parameters.availableRoofAreaSqFt,
    tilt_deg: parameters.tiltAngleDegrees,
    azimuth_deg: parameters.azimuthDegrees,
    system_loss_factor_pct: parameters.systemLossFactorPct,
    shading_factor: parameters.shadingFactor,
    grid_emission_factor_kg_kwh: parameters.gridEmissionFactorKgKwh,
    location_label: parameters.locationLabel,
    currency: parameters.currency,
  },
  demand: {
    annual_load_kwh: parameters.annualLoadKwh,
    usage_profile: parameters.usageProfile,
    critical_load_kw: parameters.criticalLoadKw,
  },
  finance: {
    electricity_tariff_rate: parameters.electricityTariffRate,
    tax_credit_percentage: parameters.taxCreditPercentage / 100,
    currency: parameters.currency,
    annual_degradation_pct: parameters.annualDegradationPct,
    escalation_pct: parameters.escalationPct,
  },
  options: {
    horizon_years: parameters.horizonYears,
    payback_basis: parameters.paybackBasis,
  },
});
