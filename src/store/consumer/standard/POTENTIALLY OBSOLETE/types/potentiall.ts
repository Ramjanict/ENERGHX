export type UtilityConsentPayload = {
  status: "COMPLETED";
  completed: boolean;
  authorized: boolean;
  utilityId: string;
  commodityId: string;
  consentGiven: boolean;
  signedAt: string;
};

export interface StandardPlanBuilding {
  name: string;
  location: string;
}

export interface MetricValue<T = number | string | null> {
  value: T;
  unit?: string;
  outOf?: number;
}

export interface StandardPlanMetrics {
  energyScore?: MetricValue<number>;
  zerIndex?: MetricValue<number>;
  monthlyUsage?: MetricValue<number>;
  annualSavings?: MetricValue<number>;
  paybackPeriod?: MetricValue<number>;
  eui?: MetricValue<number>;
  efficiencyRating?: MetricValue<string>;
  co2Reduction?: MetricValue<number>;
  systemCapacity?: MetricValue<number | null>;
}

export interface StandardPlanStatusData {
  building: StandardPlanBuilding;
  status: string;
  metrics: StandardPlanMetrics;
}

export interface ZevModuleParameters {
  stationUptime?: string | null;
  vehicleUptime?: string | null;
  energyDelivered?: string | null;
  chargingTime?: string | null;
}

export interface NzebModuleParameters {
  solarContribution?: string | null;
  windContribution?: string | null;
  biomassContribution?: string | null;
  batteryStorage?: string | null;
}

export interface ThermalModuleParameters {
  thermalConductivity?: string | null;
  comfortIndex?: string | null;
  energyImpact?: string | null;
  heatTransfer?: string | null;
}

export interface AdvancedEngineeringModulesResponse {
  modules?: {
    zeroEmissionVehicle?: {
      parameters?: ZevModuleParameters;
    };
    netZeroEnergyBuilding?: {
      parameters?: NzebModuleParameters;
    };
    thermalComfortSimulation?: {
      parameters?: ThermalModuleParameters;
    };
  };
}

export interface RenewableEngineeringSizingResponse {
  status?: {
    solar?: string;
    wind?: string;
    biomass?: string;
  };
}

export interface ImplementationWorkflowStepItem {
  step: number;
  title: string;
  description: string;
  status: "COMPLETED" | "EXECUTED" | "IN_PROGRESS" | "PENDING" | string;
}

export interface ImplementationWorkflowResponse {
  steps?: ImplementationWorkflowStepItem[];
  potentialAdditionalSavings?: {
    amount?: number | string | null;
    description?: string;
  };
  enhancedCo2Reduction?: {
    value?: number | string | null;
    description?: string;
  };
}

export interface StandardConsumerStatusResponse {
  id?: string;
  userId?: string;
  standardPlanStatus?: StandardPlanStatusData;
  advancedEngineeringModules?: AdvancedEngineeringModulesResponse;
  renewableEngineeringSizing?: RenewableEngineeringSizingResponse;
  implementationWorkflow?: ImplementationWorkflowResponse;
  dashboard?: any;
}

