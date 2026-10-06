import { z } from "zod";

export const solarPanelSchema = z.object({
  panel_type: z.string().nonempty("Please select a panel type"),
  panel_wattage_w: z.coerce
    .number({ invalid_type_error: "Panel wattage is required" })
    .positive("Panel wattage must be greater than 0"),
  panel_efficiency: z.coerce
    .number({ invalid_type_error: "Panel efficiency is required" })
    .min(0, "Efficiency cannot be negative")
    .max(1, "Efficiency must be between 0 and 1"),
  panel_count: z.coerce
    .number({ invalid_type_error: "Panel count is required" })
    .int("Panel count must be a whole number")
    .positive("Panel count must be greater than 0"),
});

export const solarSiteSchema = z.object({
  daily_irradiance_kwh_m2_day: z.coerce
    .number({ invalid_type_error: "Daily irradiance is required" })
    .positive("Daily irradiance must be greater than 0"),
  azimuth_deg: z.coerce
    .number({ invalid_type_error: "Azimuth is required" })
    .min(0, "Azimuth must be between 0 and 360")
    .max(360, "Azimuth must be between 0 and 360"),
  tilt_deg: z.coerce
    .number({ invalid_type_error: "Tilt is required" })
    .min(0, "Tilt must be between 0 and 90")
    .max(90, "Tilt must be between 0 and 90"),
  shading_factor: z.coerce
    .number({ invalid_type_error: "Shading factor is required" })
    .min(0, "Shading factor must be between 0 and 1")
    .max(1, "Shading factor must be between 0 and 1"),
});

export const solarSystemSchema = z.object({
  performance_ratio: z.coerce
    .number({ invalid_type_error: "Performance ratio is required" })
    .min(0, "Performance ratio must be between 0 and 1")
    .max(1, "Performance ratio must be between 0 and 1"),
  inverter_type: z.string().nonempty("Please select an inverter type"),
  battery_storage_kwh: z.coerce
    .number({ invalid_type_error: "Battery storage is required" })
    .min(0, "Battery storage cannot be negative"),
});

export const solarFinanceSchema = z.object({
  system_cost: z.coerce
    .number({ invalid_type_error: "System cost is required" })
    .positive("System cost must be greater than 0"),
  tax_credit_percentage: z.coerce
    .number({ invalid_type_error: "Tax credit percentage is required" })
    .min(0, "Tax credit must be between 0 and 1")
    .max(1, "Tax credit must be between 0 and 1"),
  electricity_tariff_rate: z.coerce
    .number({ invalid_type_error: "Electricity tariff rate is required" })
    .positive("Electricity tariff rate must be greater than 0"),
  project_lifetime_years: z.coerce
    .number({ invalid_type_error: "Project lifetime is required" })
    .int("Project lifetime must be a whole number")
    .positive("Project lifetime must be greater than 0"),
});

export const solarDemandSchema = z.object({
  annual_load_kwh: z.coerce
    .number({ invalid_type_error: "Annual load is required" })
    .positive("Annual load must be greater than 0"),
});

export const solarGridSchema = z.object({
  grid_emission_factor_kg_kwh: z.coerce
    .number({ invalid_type_error: "Grid emission factor is required" })
    .min(0, "Grid emission factor cannot be negative"),
});

export const solarFormSchema = z.object({
  panel: solarPanelSchema,
  site: solarSiteSchema,
  system: solarSystemSchema,
  finance: solarFinanceSchema,
  demand: solarDemandSchema,
  grid: solarGridSchema,
});

export type SolarFormInput = z.input<typeof solarFormSchema>;
export type SolarFormValues = z.output<typeof solarFormSchema>;

export const defaultSolarValues: SolarFormValues = {
  panel: {
    panel_type: "Monocrystalline",
    panel_wattage_w: 400,
    panel_efficiency: 0.185,
    panel_count: 24,
  },
  site: {
    daily_irradiance_kwh_m2_day: 4.4,
    azimuth_deg: 180,
    tilt_deg: 20,
    shading_factor: 0.97,
  },
  system: {
    performance_ratio: 0.75,
    inverter_type: "advanced",
    battery_storage_kwh: 0,
  },
  finance: {
    system_cost: 18500,
    tax_credit_percentage: 0.3,
    electricity_tariff_rate: 0.169,
    project_lifetime_years: 25,
  },
  demand: {
    annual_load_kwh: 14650,
  },
  grid: {
    grid_emission_factor_kg_kwh: 0.5,
  },
};
