// ─── Shared primitives ───────────────────────────────────────────────

type ISODateString = string;

// ─── ZEV (Zero Emission Vehicle) simulation ──────────────────────────

interface ChargingStationUtilization {
  idlePercent: number;
  chargingPercent: number;
  maintenancePercent: number;
}

interface ZevCharts {
  dailyChargingPattern: unknown[];
  sixMonthEnergyCostTrends: unknown[];
  chargingStationUtilization: ChargingStationUtilization;
}

interface ZevSimulationInput {
  income: number;
  tariff: number;
  waitingTime: number;
  chargingTime: number;
  stationUptime: number;
  vehicleUptime: number;
  stationDensity: number;
  energyDelivered: number;
}

interface ZevSimulationResults {
  chargingCost: number;
  annualSavings: number;
  monthlyChargingCost: number;
  vehicleUptimePercent: number;
  energyDemandKwhPerDay: number;
  batteryUtilizationPercent: number;
}

interface VehicleConfiguration {
  vehicleType: string;
  vehicleClass: string;
  batteryCapacityKwh: number;
  dailyDistanceMiles: number;
}

interface ChargingConfiguration {
  chargingMethod: string;
  energyTariffPerKwh: number;
  numberOfChargingPorts: number;
  averageWaitingTimeMinutes: number;
  chargingDurationHoursPerDay: number;
  expectedStationUptimePercent: number;
}

export interface ZevPayload {
  charts: ZevCharts;
  recommendations: unknown[];
  simulationInput: ZevSimulationInput;
  simulationResults: ZevSimulationResults;
  vehicleConfiguration: VehicleConfiguration;
  chargingConfiguration: ChargingConfiguration;
}

// ─── Thermal Comfort simulation ──────────────────────────────────────

interface ThermalComfortCharts {
  convergenceAnalysis: unknown[];
  heatFluxByBuildingZone: unknown[];
  temperatureDistributionAcrossBuilding: unknown[];
}

interface ThermalRecommendation {
  title: string;
  description: string;
  estimatedSavings?: string;
  comfortImprovement?: string;
}

interface ThermalSimulationResults {
  comfortScore: number;
  finalResidual: number;
  avgHeatFluxWm2: number;
  iterationsUsed: number;
  simulationStatus: string;
  convergenceAchieved: boolean;
  energyImpactKwhYearLoss: number;
}

interface BuildingParameters {
  domainWidthM: number;
  domainHeightM: number;
  temperatureDeltaC: number;
  exteriorTemperatureC: number;
  interiorTemperatureC: number;
  thermalConductivityWmK: number;
}

interface SimulationSettings {
  solverType: string;
  analysisType: string;
  gridResolution: string;
  simulationMethod: string;
  maximumIterations: number;
  simulationDimension: string;
  convergenceTolerance: number;
  estimatedRuntimeSeconds: number;
}

interface ThermalComfortPayload {
  charts: ThermalComfortCharts;
  recommendations: ThermalRecommendation[];
  simulationResults: ThermalSimulationResults;
  buildingParameters: BuildingParameters;
  simulationSettings: SimulationSettings;
}

// ─── Workflow step ────────────────────────────────────────────────────

export interface SimulationsStepPayload {
  zev: ZevPayload;
  thermalComfort: ThermalComfortPayload;
  nzeb?: unknown;
}

export type WorkflowStepStatus =
  | "DRAFT"
  | "PENDING"
  | "IN_PROGRESS"
  | "COMPLETED"
  | "FAILED"
  | "ACTIVE"
  | "APPROVED"
  | "EXECUTED";

export interface ResValidationChecklistItem {
  key: string;
  role: string | null;
  label: string;
  status: string;
  associateId: string | null;
  validatedBy: string | null;
}

export interface ResValidationRiskItem {
  key: string;
  label: string;
  status: string;
}

export interface ResValidationPayload {
  status: string;
  associateId: string | null;
  validatedBy: string;
  annualSavings: number;
  validatorRole: string;
  readinessScore: number;
  riskAssessment: ResValidationRiskItem[];
  renewableCoverage: number;
  validationChecklist: ResValidationChecklistItem[];
  carbonReductionTonsYear: number;
}

export interface WorkflowStep<TPayload = unknown> {
  id: string;
  workflowId: string;
  stepKey: string;
  status: WorkflowStepStatus;
  payload: TPayload | null;
  completedAt: ISODateString | null;
  createdAt: ISODateString;
  updatedAt: ISODateString;
}

// ─── Dashboard: hero / actions ───────────────────────────────────────

interface DashboardAction {
  label: string;
  action?: string;
  endpoint?: string;
}

interface DashboardHero {
  title: string;
  subtitle: string;
  primaryAction: DashboardAction;
  secondaryAction: DashboardAction;
}

// ─── Dashboard: selected building ────────────────────────────────────

interface SelectedBuilding {
  id: string | null;
  name: string | null;
  city: string | null;
  location: string | null;
  type: string | null;
  subType: string | null;
  roomsCount: number;
  evsCount: number;
  utilitiesCount: number;
}

// ─── Dashboard: standard plan status ─────────────────────────────────

export interface StandardPlanCard {
  label: string;
  value: number | string | null;
  unit: string | null;
  subtext: string | null;
}

interface StandardPlanStatus {
  status: WorkflowStepStatus;
  auditStatus: string | null;
  auditType: string | null;
  cards: StandardPlanCard[];
  latestAudit: unknown | null;
}

// ─── Dashboard: utility data connection ──────────────────────────────

interface UtilityDataConnection {
  connected: boolean;
  status: "NOT_CONNECTED" | "PENDING" | "CONNECTED";
  label: string;
  message: string;
  action: {
    label: string;
    endpoint: string;
  };
  utilityPermission: unknown | null;
  commoditySetup: unknown | null;
  utilityBills: unknown[];
}

type ModuleStatus = "NOT_STARTED" | "IN_PROGRESS" | "COMPLETED" | "FAILED";

export interface AdvancedEngineeringModule {
  key: "ZEV" | "NZEB" | "THERMAL_COMFORT" | string;
  title: string;
  description: string;
  status: ModuleStatus;
  metrics: ZevPayload | ThermalComfortPayload | null;
  action: DashboardAction;
}

interface RenewableEngineeringSizingItem {
  key: "SOLAR" | "WIND" | "BIOMASS" | string;
  title: string;
  description: string;
  status: ModuleStatus;
  action: DashboardAction;
}

// ─── Dashboard: implementation workflow ──────────────────────────────

interface ImplementationWorkflowItem {
  step: number;
  key: string;
  title: string;
  description: string;
  status: WorkflowStepStatus;
  action?: string;
}

// ─── Dashboard: savings summary ──────────────────────────────────────

interface SavingsMetric {
  value: number | null;
  unit: string;
  description: string;
}

interface SavingsSummary {
  potentialAdditionalSavings: SavingsMetric;
  enhancedCo2Reduction: SavingsMetric;
}

// ─── Dashboard: workflow steps mirror ────────────────────────────────

interface DashboardWorkflowSteps {
  utilityPermission: unknown | null;
  commoditySetup: unknown | null;
  simulations: WorkflowStep<SimulationsStepPayload> | null;
  engineeringServices: unknown | null;
  designs: unknown | null;
}

// ─── Dashboard root ───────────────────────────────────────────────────

interface Dashboard {
  hero: DashboardHero;
  selectedBuilding: SelectedBuilding;
  standardPlanStatus: StandardPlanStatus;
  utilityDataConnection: UtilityDataConnection;
  advancedEngineeringModules: AdvancedEngineeringModule[];
  renewableEngineeringSizing: RenewableEngineeringSizingItem[];
  implementationWorkflow: ImplementationWorkflowItem[];
  savingsSummary: SavingsSummary;
  workflowSteps: DashboardWorkflowSteps;
}

export interface ConsumerWorkflow {
  id: string;
  userId: string;
  userType: "CONSUMER";
  status: WorkflowStepStatus;
  currentStep: string;
  progressPercent: number;
  completedSteps: string[];
  steps: WorkflowStep<SimulationsStepPayload>[];
  createdAt: ISODateString;
  updatedAt: ISODateString;
  dashboard: Dashboard;
}
