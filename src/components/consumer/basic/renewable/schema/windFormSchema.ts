import { z } from "zod";

/* ---------------------------------------------------------------------- */
/*  Wind Resource Parameters                                              */
/* ---------------------------------------------------------------------- */
export const windResourceSchema = z.object({
  mean_wind_speed_ms: z.coerce
    .number({ invalid_type_error: "Mean wind speed is required" })
    .min(0, "Mean wind speed cannot be negative"),
  measurement_height_m: z.coerce
    .number({ invalid_type_error: "Measurement height is required" })
    .min(0, "Measurement height cannot be negative"),
  weibull_k: z.coerce
    .number({ invalid_type_error: "Weibull k is required" })
    .min(0, "Weibull k cannot be negative"),
  air_density_kg_m3: z.coerce
    .number({ invalid_type_error: "Air density is required" })
    .min(0, "Air density cannot be negative"),
  turbulence_intensity: z.coerce
    .number({ invalid_type_error: "Turbulence intensity is required" })
    .min(0, "Turbulence intensity cannot be negative"),
  terrain_roughness_class: z.coerce
    .number({ invalid_type_error: "Terrain roughness class is required" })
    .min(0, "Terrain roughness class cannot be negative"),
  nearest_obstacle_height_m: z.coerce
    .number({ invalid_type_error: "Nearest obstacle height is required" })
    .min(0, "Nearest obstacle height cannot be negative"),
  nearest_obstacle_distance_m: z.coerce
    .number({ invalid_type_error: "Nearest obstacle distance is required" })
    .min(0, "Nearest obstacle distance cannot be negative"),
});

/* ---------------------------------------------------------------------- */
/*  Turbine Parameters                                                    */
/* ---------------------------------------------------------------------- */
export const turbineSchema = z.object({
  turbine_type: z.string().nonempty("Please select a turbine type"),
  rotor_diameter_m: z.coerce
    .number({ invalid_type_error: "Rotor diameter is required" })
    .positive("Rotor diameter must be greater than 0"),
  hub_height_m: z.coerce
    .number({ invalid_type_error: "Hub height is required" })
    .positive("Hub height must be greater than 0"),
  rated_power_kw: z.coerce
    .number({ invalid_type_error: "Rated power is required" })
    .positive("Rated power must be greater than 0"),
  power_coefficient_cp: z.coerce
    .number({ invalid_type_error: "Power coefficient is required" })
    .min(0, "Power coefficient must be between 0 and 1")
    .max(1, "Power coefficient must be between 0 and 1"),
  cut_in_speed_ms: z.coerce
    .number({ invalid_type_error: "Cut-in speed is required" })
    .min(0, "Cut-in speed cannot be negative"),
  cut_out_speed_ms: z.coerce
    .number({ invalid_type_error: "Cut-out speed is required" })
    .min(0, "Cut-out speed cannot be negative"),
  system_efficiency: z.coerce
    .number({ invalid_type_error: "System efficiency is required" })
    .min(0, "System efficiency must be between 0 and 1")
    .max(1, "System efficiency must be between 0 and 1"),
});

/* ---------------------------------------------------------------------- */
/*  System Parameters                                                     */
/* ---------------------------------------------------------------------- */
export const systemSchema = z.object({
  turbine_count: z.coerce
    .number({ invalid_type_error: "Turbine count is required" })
    .int("Turbine count must be a whole number")
    .min(1, "At least one turbine is required"),
});

/* ---------------------------------------------------------------------- */
/*  Demand Parameters                                                     */
/* ---------------------------------------------------------------------- */
export const demandSchema = z.object({
  monthly_energy_kwh: z.coerce
    .number({ invalid_type_error: "Monthly energy is required" })
    .min(0, "Monthly energy cannot be negative"),
  annual_energy_kwh: z.coerce
    .number({ invalid_type_error: "Annual energy is required" })
    .min(0, "Annual energy cannot be negative"),
});

/* ---------------------------------------------------------------------- */
/*  Operating Parameters                                                  */
/* ---------------------------------------------------------------------- */
export const operatingSchema = z.object({
  annual_operating_hours: z.coerce
    .number({ invalid_type_error: "Annual operating hours is required" })
    .min(0, "Annual operating hours cannot be negative"),
  availability_factor: z.coerce
    .number({ invalid_type_error: "Availability factor is required" })
    .min(0, "Availability factor must be between 0 and 1")
    .max(1, "Availability factor must be between 0 and 1"),
});

/* ---------------------------------------------------------------------- */
/*  Financial Parameters                                                  */
/* ---------------------------------------------------------------------- */
export const financialSchema = z.object({
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
  om_cost_annual: z.coerce
    .number({ invalid_type_error: "Annual O&M cost is required" })
    .min(0, "Annual O&M cost cannot be negative"),
  project_lifetime_years: z.coerce
    .number({ invalid_type_error: "Project lifetime is required" })
    .int("Project lifetime must be a whole number")
    .positive("Project lifetime must be greater than 0"),
});

/* ---------------------------------------------------------------------- */
/*  Grid Parameters                                                       */
/* ---------------------------------------------------------------------- */
export const gridSchema = z.object({
  connection_type: z.string().nonempty("Please select a connection type"),
  emissions_factor_kg_co2_per_kwh: z.coerce
    .number({ invalid_type_error: "Emissions factor is required" })
    .min(0, "Emissions factor cannot be negative"),
  kg_co2_absorbed_per_tree_year: z.coerce
    .number({ invalid_type_error: "CO2 absorbed per tree is required" })
    .min(0, "CO2 absorbed per tree cannot be negative"),
});

/* ---------------------------------------------------------------------- */
/*  Combined form schema                                                  */
/* ---------------------------------------------------------------------- */
export const windFormSchema = z.object({
  wind_resource: windResourceSchema,
  turbine: turbineSchema,
  system: systemSchema,
  demand: demandSchema,
  operating: operatingSchema,
  financial: financialSchema,
  grid: gridSchema,
});

export type WindFormInput = z.input<typeof windFormSchema>;
export type WindFormValues = z.output<typeof windFormSchema>;

/* ---------------------------------------------------------------------- */
/*  Default values used to pre-fill the form                              */
/* ---------------------------------------------------------------------- */
export const defaultWindValues: WindFormValues = {
  wind_resource: {
    mean_wind_speed_ms: 5.5,
    measurement_height_m: 10,
    weibull_k: 2,
    air_density_kg_m3: 1.225,
    turbulence_intensity: 0.098,
    terrain_roughness_class: 2,
    nearest_obstacle_height_m: 8,
    nearest_obstacle_distance_m: 250,
  },
  turbine: {
    turbine_type: "Horizontal Axis",
    rotor_diameter_m: 6.2,
    hub_height_m: 18,
    rated_power_kw: 5,
    power_coefficient_cp: 0.4,
    cut_in_speed_ms: 3.5,
    cut_out_speed_ms: 25,
    system_efficiency: 0.857,
  },
  system: {
    turbine_count: 1,
  },
  demand: {
    monthly_energy_kwh: 1520,
    annual_energy_kwh: 18250,
  },
  operating: {
    annual_operating_hours: 8760,
    availability_factor: 1,
  },
  financial: {
    system_cost: 15200,
    tax_credit_percentage: 0.3,
    electricity_tariff_rate: 0.168,
    om_cost_annual: 200,
    project_lifetime_years: 25,
  },
  grid: {
    connection_type: "Grid-Tied with Net Metering",
    emissions_factor_kg_co2_per_kwh: 0.5,
    kg_co2_absorbed_per_tree_year: 21.8,
  },
};
