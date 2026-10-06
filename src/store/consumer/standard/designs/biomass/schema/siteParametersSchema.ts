import { z } from "zod";

export const savingsBasisOptions = ["gross", "net"] as const;

export const feedstockAvailabilityOptions = [
  "Excellent",
  "Good",
  "Fair",
  "Poor",
] as const;

export const usageProfileOptions = [
  "intermittent",
  "continuous",
  "daytime_home",
  "seasonal",
] as const;

export const biomassSiteParametersSchema = z.object({
  // Context
  locationLabel: z
    .string()
    .trim()
    .min(2, "Location is required")
    .max(120, "Location is too long"),
  currency: z.string().min(1, "Currency is required"),
  feedstockAvailability: z.enum(feedstockAvailabilityOptions),
  feedstock: z.string().trim().min(2, "Feedstock is required"),
  environmentTemperatureC: z
    .number({ invalid_type_error: "Enter a valid number" })
    .min(-20, "Must be at least -20°C")
    .max(60, "Must be 60°C or less"),
  slurryFeedstockKg: z
    .number({ invalid_type_error: "Enter a valid number" })
    .positive("Must be greater than 0")
    .max(100, "Value looks too large"),
  slurryWaterKg: z
    .number({ invalid_type_error: "Enter a valid number" })
    .positive("Must be greater than 0")
    .max(100, "Value looks too large"),
  heatingSeasonMonths: z
    .number({ invalid_type_error: "Enter a valid number" })
    .int("Must be a whole number")
    .min(1, "Must be between 1 and 12 months")
    .max(12, "Must be between 1 and 12 months"),

  // Demand
  heatingDemandKwhPerYear: z
    .number({ invalid_type_error: "Enter a valid number" })
    .positive("Must be greater than 0")
    .max(10_000_000, "Value looks too large"),
  annualLoadKwh: z
    .number({ invalid_type_error: "Enter a valid number" })
    .positive("Must be greater than 0")
    .max(10_000_000, "Value looks too large"),
  usageProfile: z.enum(usageProfileOptions),

  // Fuel
  fuelCostPerTonne: z
    .number({ invalid_type_error: "Enter a valid number" })
    .positive("Must be greater than 0")
    .max(10_000, "Value looks too large"),
  energyDensityKwhPerKg: z
    .number({ invalid_type_error: "Enter a valid number" })
    .min(0.1, "Must be at least 0.1")
    .max(20, "Must be 20 or less"),
  moistureContentPct: z
    .number({ invalid_type_error: "Enter a valid number" })
    .min(0, "Must be between 0% and 100%")
    .max(100, "Must be between 0% and 100%"),

  // Tariff
  tariffRatePerKwhThermal: z
    .number({ invalid_type_error: "Enter a valid number" })
    .positive("Must be greater than 0")
    .max(10, "Value looks too large — enter rate per kWh"),
  incumbentFuel: z.string().trim().min(2, "Incumbent fuel is required"),

  // Options
  horizonYears: z
    .number({ invalid_type_error: "Enter a valid number" })
    .int("Must be a whole number")
    .min(1, "Must be at least 1 year")
    .max(50, "Must be 50 years or less"),
  savingsBasis: z.enum(savingsBasisOptions),
  storageMonths: z
    .number({ invalid_type_error: "Enter a valid number" })
    .min(0, "Must be between 0 and 12 months")
    .max(12, "Must be between 0 and 12 months"),
});

export type BiomassSiteParametersFormValues = z.infer<
  typeof biomassSiteParametersSchema
>;

export type BiomassSiteParametersFormErrors = Partial<
  Record<keyof BiomassSiteParametersFormValues, string>
>;
