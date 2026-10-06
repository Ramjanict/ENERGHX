import { z } from "zod";

export const processSchema = z
  .object({
    t: z.coerce.number().min(0).default(30),
    TS: z.coerce.number().min(0).max(1).default(0.3),
    VS: z.coerce.number().min(0).max(1).default(0.8),
    FADin: z.coerce.number().min(0).default(120),
    VADCH4: z.coerce.number().min(0).default(236),
    THTC: z.coerce.number().min(0).default(1073),
    QAD: z.coerce.number().min(0).default(86400),
  })
  .default({});

export const demandSchema = z
  .object({
    ED: z.coerce.number().min(0).default(5),
    GD: z.coerce.number().min(0).default(300),
  })
  .default({});

export const conversionSchema = z
  .object({
    generator_efficiency: z.coerce.number().min(0).max(1).default(0.42),
    methane_calorific_value_mj_m3: z.coerce.number().min(0).default(35.8),
  })
  .default({});

export const operatingSchema = z
  .object({
    annual_operating_hours: z.coerce.number().min(0).default(8000),
  })
  .default({});

export const financialSchema = z
  .object({
    system_cost: z.coerce.number().min(0).default(9300),
    tax_credit_percentage: z.coerce.number().min(0).max(1).default(0.26),
    electricity_tariff_rate: z.coerce.number().min(0).default(0.16),
    om_cost_annual: z.coerce.number().min(0).default(250),
  })
  .default({});

export const marketSchema = z
  .object({
    annual_electricity_demand_kwh: z.coerce.number().min(0).default(40000),
    local_supplier_count: z.coerce.number().int().min(0).default(3),
    moisture_content_percentage: z.coerce.number().min(0).max(100).default(12),
  })
  .default({});

export const biomassFormSchema = z.object({
  feedstock: z
    .enum([
      "animal_dung",
      "crop_residue",
      "food_waste",
      "municipal_solid_waste",
    ])
    .default("animal_dung"),

  priority: z.enum(["electricity", "gas", "heat"]).default("electricity"),

  process: processSchema,
  demand: demandSchema,
  conversion: conversionSchema,
  operating: operatingSchema,
  financial: financialSchema,
  market: marketSchema,
});

export type BiomassFormInput = z.input<typeof biomassFormSchema>;
export type BiomassFormValues = z.output<typeof biomassFormSchema>;

export const defaultBiomassValues: BiomassFormValues = {
  feedstock: "animal_dung",
  priority: "electricity",

  process: {
    t: 30,
    TS: 0.3,
    VS: 0.8,
    FADin: 120,
    VADCH4: 236,
    THTC: 1073,
    QAD: 86400,
  },

  demand: {
    ED: 5,
    GD: 300,
  },

  conversion: {
    generator_efficiency: 0.42,
    methane_calorific_value_mj_m3: 35.8,
  },

  operating: {
    annual_operating_hours: 8000,
  },

  financial: {
    system_cost: 9300,
    tax_credit_percentage: 0.26,
    electricity_tariff_rate: 0.16,
    om_cost_annual: 250,
  },

  market: {
    annual_electricity_demand_kwh: 40000,
    local_supplier_count: 3,
    moisture_content_percentage: 12,
  },
};
