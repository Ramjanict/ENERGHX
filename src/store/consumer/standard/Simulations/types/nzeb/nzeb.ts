import type {
  ConsumerWorkflow,
  SimulationsStepPayload,
  WorkflowStep,
} from "../dashboard";

export type SimulationStatus =
  | "NOT_STARTED"
  | "IN_PROGRESS"
  | "COMPLETED"
  | "FAILED";

// ---------- Module configuration (round-trips between GET, POST and PATCH) ----------
export interface NzebSolarModule {
  panelAreaM2: number;
  pvEfficiencyPercent: number;
  solarIrradianceKwhM2Day: number;
}

export interface NzebWindModule {
  windSpeedMs: number;
  turbineSizeKw: number;
  cutInSpeedMs: number;
  cutOutSpeedMs: number;
}

export interface NzebBiomassModule {
  feedstockMassKgDay: number;
  methaneYieldM3Kg: number;
  generatorEfficiencyPercent: number;
}

export interface NzebBatteryStorageModule {
  batteryCapacityKwh: number;
  chargeEfficiencyPercent: number;
  dischargeEfficiencyPercent: number;
}

export interface NzebFinancialParameters {
  capitalCost: number;
  omCostPerYear: number;
  projectLifeYears: number;
  discountRatePercent: number;
}

export interface NzebModuleConfiguration {
  solarModule: NzebSolarModule;
  windModule: NzebWindModule;
  biomassModule: NzebBiomassModule;
  batteryStorageModule: NzebBatteryStorageModule;
  financialParameters: NzebFinancialParameters;
}

// ---------- Solver results ----------
export interface NzebSimulationResults {
  renewableContributionPercent: number;
  annualCostSavings: number;
  annualGenerationKwh: number;
  carbonReductionTonsPerYear: number;
  paybackPeriodYears: number;
  netPresentValue: number;
  roiPercent: number;
}

// ---------- Charts ----------
export interface NzebEnergySourcePoint {
  source: string;
  energyKwh: number;
  percent: number;
}

export interface NzebMonthlyGenerationPoint {
  month: string;
  solarKwh: number;
  windKwh: number;
  biomassKwh: number;
  demandKwh: number;
}

export interface NzebFinancialProjectionPoint {
  year: number;
  annualSavings: number;
  cumulativeSavings: number;
  netPosition: number;
}

export interface NzebCharts {
  energySourceDistribution: NzebEnergySourcePoint[];
  monthlyGenerationVsDemand: NzebMonthlyGenerationPoint[];
  financialProjection: NzebFinancialProjectionPoint[];
}

// ---------- The persisted NZEB payload ----------
export interface NzebDetails extends NzebModuleConfiguration {
  simulationResults: NzebSimulationResults;
  charts: NzebCharts;
}

// ---------- GET /workflows/consumer/standard/simulations/nzeb ----------
export interface GetNzebSimulationResponse {
  workflow: ConsumerWorkflow;
  step: WorkflowStep<SimulationsStepPayload>;
  nzeb: NzebDetails | null;
}

// ---------- PATCH /workflows/consumer/standard/simulations/nzeb ----------
export interface UpdateNzebSimulationPayload {
  status: SimulationStatus;
  nzeb: NzebDetails;
}

// ---------- POST /analysis/nzeb/simulation ----------
export type RunNzebSimulationPayload = NzebModuleConfiguration;

/**
 * The solver returns the results and charts but echoes none of the module
 * inputs, so the PATCH re-sends whatever configuration was submitted.
 */
export interface RunNzebSimulationResponse {
  status: number;
  message: string;
  data: {
    simulationResults: NzebSimulationResults;
    charts: NzebCharts;
  };
}
