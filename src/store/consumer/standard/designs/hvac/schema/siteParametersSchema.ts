import { z } from "zod";

export const currencyOptions = ["USD", "EUR", "GBP", "NGN"] as const;

/**
 * Only "size-to-load" is documented by the solve endpoint so far. Extend this
 * list as the backend adds further strategies.
 */
export const sizingModeOptions = ["size-to-load"] as const;

export const hvacSiteParametersSchema = z
  .object({
    // Building load
    annualLoadKwh: z
      .number({ invalid_type_error: "Enter a valid number" })
      .positive("Must be greater than 0")
      .max(100_000_000, "Value looks too large"),
    peakCoolingLoadKw: z
      .number({ invalid_type_error: "Enter a valid number" })
      .positive("Must be greater than 0")
      .max(10_000, "Value looks too large"),
    baseCoolingLoadKw: z
      .number({ invalid_type_error: "Enter a valid number" })
      .min(0, "Cannot be negative")
      .max(10_000, "Value looks too large"),
    peakHour: z
      .number({ invalid_type_error: "Enter a valid number" })
      .int("Must be a whole hour")
      .min(0, "Must be between 0 and 23")
      .max(23, "Must be between 0 and 23"),

    // Finance
    electricityTariffRate: z
      .number({ invalid_type_error: "Enter a valid number" })
      .positive("Must be greater than 0")
      .max(10, "Value looks too large — enter rate per kWh"),
    currency: z.enum(currencyOptions),

    // Options
    horizonYears: z
      .number({ invalid_type_error: "Enter a valid number" })
      .int("Must be a whole number of years")
      .min(1, "Must be at least 1 year")
      .max(50, "Must be 50 years or fewer"),
    sizingMode: z.enum(sizingModeOptions),
  })
  .refine((data) => data.baseCoolingLoadKw < data.peakCoolingLoadKw, {
    message: "Must be below the peak cooling load",
    path: ["baseCoolingLoadKw"],
  });

export type HvacSiteParametersFormValues = z.infer<
  typeof hvacSiteParametersSchema
>;

export type HvacSiteParametersFormErrors = Partial<
  Record<keyof HvacSiteParametersFormValues, string>
>;
