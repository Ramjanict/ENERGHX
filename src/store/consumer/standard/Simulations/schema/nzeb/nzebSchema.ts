import { z } from "zod";

const positiveNumber = (label: string) =>
  z.coerce
    .number({ invalid_type_error: `${label} must be a number` })
    .positive(`${label} must be greater than 0`);

const percentNumber = (label: string) =>
  z.coerce
    .number({ invalid_type_error: `${label} must be a number` })
    .min(0, `${label} cannot be negative`)
    .max(100, `${label} cannot exceed 100%`);

export const nzebFormSchema = z.object({
  // Solar
  panelAreaM2: positiveNumber("Panel area"),
  pvEfficiencyPercent: percentNumber("PV efficiency"),
  solarIrradianceKwhM2Day: positiveNumber("Solar irradiance"),

  // Wind
  windSpeedMs: positiveNumber("Wind speed"),
  turbineSizeKw: positiveNumber("Turbine size"),
  cutInSpeedMs: z.coerce
    .number({ invalid_type_error: "Cut-in speed must be a number" })
    .min(0, "Cut-in speed cannot be negative"),
  cutOutSpeedMs: positiveNumber("Cut-out speed"),

  // Biomass
  feedstockMassKgDay: positiveNumber("Feedstock mass"),
  methaneYieldM3Kg: positiveNumber("Methane yield"),
  generatorEfficiencyPercent: percentNumber("Generator efficiency"),

  // Battery
  batteryCapacityKwh: positiveNumber("Battery capacity"),
  chargeEfficiencyPercent: percentNumber("Charge efficiency"),
  dischargeEfficiencyPercent: percentNumber("Discharge efficiency"),

  // Financial
  capitalCost: positiveNumber("Capital cost"),
  omCostPerYear: z.coerce
    .number({ invalid_type_error: "O&M cost must be a number" })
    .min(0, "O&M cost cannot be negative"),
  projectLifeYears: z.coerce
    .number({ invalid_type_error: "Project life must be a number" })
    .int("Project life must be a whole number")
    .positive("Project life must be greater than 0"),
  discountRatePercent: percentNumber("Discount rate"),
});

export type NzebFormValues = z.infer<typeof nzebFormSchema>;

/** Defaults align with the documented PATCH example. */
export const nzebFormDefaultValues: NzebFormValues = {
  panelAreaM2: 450,
  pvEfficiencyPercent: 20,
  solarIrradianceKwhM2Day: 5.2,
  windSpeedMs: 6.5,
  turbineSizeKw: 10,
  cutInSpeedMs: 3,
  cutOutSpeedMs: 25,
  feedstockMassKgDay: 500,
  methaneYieldM3Kg: 0.4,
  generatorEfficiencyPercent: 35,
  batteryCapacityKwh: 30,
  chargeEfficiencyPercent: 95,
  dischargeEfficiencyPercent: 92,
  capitalCost: 125000,
  omCostPerYear: 3500,
  projectLifeYears: 25,
  discountRatePercent: 5,
};
