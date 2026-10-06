import { z } from "zod";

const positiveNumber = (label: string) =>
  z.coerce
    .number({ invalid_type_error: `${label} must be a number` })
    .positive(`${label} must be greater than 0`);

const nonNegativeNumber = (label: string) =>
  z.coerce
    .number({ invalid_type_error: `${label} must be a number` })
    .min(0, `${label} cannot be negative`);

export const thermalFormSchema = z.object({
  // Building
  thermalConductivityWmK: positiveNumber("Thermal conductivity"),
  domainWidthM: positiveNumber("Domain width"),
  domainHeightM: positiveNumber("Domain height"),
  interiorTemperatureC: z.coerce.number({
    invalid_type_error: "Interior temperature must be a number",
  }),
  exteriorTemperatureC: z.coerce.number({
    invalid_type_error: "Exterior temperature must be a number",
  }),
  density: positiveNumber("Density"),
  specificHeat: positiveNumber("Specific heat"),

  // Simulation
  convergenceTolerance: positiveNumber("Convergence tolerance"),
  maximumIterations: z.coerce
    .number({ invalid_type_error: "Maximum iterations must be a number" })
    .int("Must be a whole number")
    .positive("Must be greater than 0"),
  simulationMethod: z.enum(["FVM", "FEM"]),
  simulationDimension: z.enum(["2D", "3D"]),
  gridNx: z.coerce
    .number({ invalid_type_error: "Grid Nx must be a number" })
    .int()
    .positive(),
  gridNy: z.coerce
    .number({ invalid_type_error: "Grid Ny must be a number" })
    .int()
    .positive(),
  solverType: z.string().min(1, "Solver type is required"),
  estimatedRuntimeSeconds: nonNegativeNumber("Estimated runtime"),
});

export type ThermalFormValues = z.infer<typeof thermalFormSchema>;

/** Defaults align with the documented POST / PATCH examples. */
export const thermalFormDefaultValues: ThermalFormValues = {
  thermalConductivityWmK: 0.5,
  domainWidthM: 10,
  domainHeightM: 3,
  interiorTemperatureC: 22,
  exteriorTemperatureC: 35,
  density: 2000,
  specificHeat: 900,
  convergenceTolerance: 0.000001,
  maximumIterations: 1000,
  simulationMethod: "FVM",
  simulationDimension: "3D",
  gridNx: 10,
  gridNy: 10,
  solverType: "Gauss-Seidel",
  estimatedRuntimeSeconds: 6,
};

export const buildGridResolution = (values: ThermalFormValues): string =>
  values.simulationDimension === "3D"
    ? `${values.gridNx} x ${values.gridNy} x ${values.gridNy} nodes`
    : `${values.gridNx} x ${values.gridNy} nodes`;

export const buildAnalysisType = (values: ThermalFormValues): string =>
  `${values.simulationDimension} Steady State`;

/**
 * Parse a persisted gridResolution string like "100 x 30 x 30 nodes"
 * into nx/ny for the form. Falls back to defaults when unparsable.
 */
export const parseGridResolution = (
  resolution: string | undefined,
  fallback: { gridNx: number; gridNy: number },
): { gridNx: number; gridNy: number } => {
  if (!resolution) return fallback;
  const nums = resolution.match(/\d+/g)?.map(Number);
  if (!nums || nums.length < 2) return fallback;
  return { gridNx: nums[0], gridNy: nums[1] };
};
