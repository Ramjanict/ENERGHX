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

// ---------- Configuration (round-trips between GET, POST and PATCH) ----------
export interface ZevVehicleConfiguration {
  vehicleType: string;
  vehicleClass: string;
  batteryCapacityKwh: number;
  dailyDistanceMiles: number;
}

export interface ZevChargingConfiguration {
  chargingMethod: string;
  energyTariffPerKwh: number;
  numberOfChargingPorts: number;
  averageWaitingTimeMinutes: number;
  chargingDurationHoursPerDay: number;
  expectedStationUptimePercent: number;
}

// ---------- Solver input and results ----------
export interface ZevSimulationInput {
  income: number;
  tariff: number;
  waitingTime: number;
  chargingTime: number;
  stationUptime: number;
  vehicleUptime: number;
  stationDensity: number;
  energyDelivered: number;
}

export interface ZevSimulationResults {
  chargingCost: number;
  annualSavings: number;
  monthlyChargingCost: number;
  vehicleUptimePercent: number;
  energyDemandKwhPerDay: number;
  batteryUtilizationPercent: number;
}

// ---------- Charts ----------
export interface ZevChargingPatternPoint {
  timeSlot: string;
  powerKw: number;
  energyKwh: number;
  costUsd: number;
  offPeak: boolean;
}

export interface ZevEnergyCostTrendPoint {
  month: string;
  energyKwh: number;
  costUsd: number;
}

export interface ZevChargingStationUtilization {
  idlePercent: number;
  chargingPercent: number;
  maintenancePercent: number;
}

export interface ZevCharts {
  dailyChargingPattern: ZevChargingPatternPoint[];
  sixMonthEnergyCostTrends: ZevEnergyCostTrendPoint[];
  chargingStationUtilization: ZevChargingStationUtilization;
}

// ---------- Recommendations ----------
export interface ZevRecommendationAction {
  type: string;
  text: string;
  link: string;
}

/**
 * ZEV recommendations are shaped differently from the thermal-comfort ones —
 * they carry a variant, a CTA and a free-form impact object.
 */
export interface ZevRecommendation {
  id: string;
  variant: string;
  heading: string;
  body: string;
  action: ZevRecommendationAction;
  impact?: Record<string, unknown>;
}

// ---------- The persisted ZEV payload ----------
export interface ZevDetails {
  vehicleConfiguration: ZevVehicleConfiguration;
  chargingConfiguration: ZevChargingConfiguration;
  simulationInput: ZevSimulationInput;
  simulationResults: ZevSimulationResults;
  charts: ZevCharts;
  recommendations: ZevRecommendation[];
}

// ---------- GET /workflows/consumer/standard/simulations/zev ----------
export interface GetZevSimulationResponse {
  workflow: ConsumerWorkflow;
  step: WorkflowStep<SimulationsStepPayload>;
  zev: ZevDetails | null;
}

// ---------- PATCH /workflows/consumer/standard/simulations/zev ----------
export interface UpdateZevSimulationPayload {
  status: SimulationStatus;
  zev: ZevDetails;
}

// ---------- POST /analysis/zev/simulation ----------
export interface RunZevSimulationPayload {
  vehicleConfiguration: ZevVehicleConfiguration;
  chargingConfiguration: ZevChargingConfiguration;
  simulationOptions: Record<string, unknown>;
}

/**
 * The solver returns its summary under `simulationSummary` — the same fields as
 * the persisted `simulationResults`. It does not return `simulationInput`.
 */
export interface RunZevSimulationResponse {
  status: number;
  message: string;
  data: {
    simulationSummary: ZevSimulationResults;
    charts: ZevCharts;
    recommendations: ZevRecommendation[];
  };
}
