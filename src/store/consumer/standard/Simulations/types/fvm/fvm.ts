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

// ---------- Persisted configuration ----------
export interface FvmBuildingParameters {
  thermalConductivityWmK: number;
  domainWidthM: number;
  domainHeightM: number;
  interiorTemperatureC: number;
  exteriorTemperatureC: number;
  temperatureDeltaC: number;
  /** Required by POST /analysis/fvm/simulate; round-tripped when the API stores extras. */
  density?: number;
  specificHeat?: number;
}

export interface FvmSimulationSettings {
  convergenceTolerance: number;
  maximumIterations: number;
  simulationMethod: string;
  simulationDimension: string;
  gridResolution: string;
  solverType: string;
  analysisType: string;
  estimatedRuntimeSeconds: number;
  /** Required by the solver; kept alongside the display string. */
  gridNx?: number;
  gridNy?: number;
}

export interface FvmSimulationResults {
  simulationStatus: string;
  iterationsUsed: number;
  comfortScore: number;
  avgHeatFluxWm2: number;
  energyImpactKwhYearLoss: number;
  convergenceAchieved: boolean;
  finalResidual: number;
}

// ---------- Chart points (camelCase for workflow persistence) ----------
export interface FvmTemperaturePoint {
  positionM: number;
  temperatureC: number;
  comfortIndex: number;
}

export interface FvmHeatFluxZonePoint {
  zone: string;
  heatFluxWm2: number;
  annualLossKwh: number;
}

export interface FvmConvergencePoint {
  iteration: number;
  residual: number;
}

export interface FvmCharts {
  temperatureDistributionAcrossBuilding: FvmTemperaturePoint[];
  heatFluxByBuildingZone: FvmHeatFluxZonePoint[];
  convergenceAnalysis: FvmConvergencePoint[];
  temperatureCaption?: string;
  heatFluxCaption?: string;
}

export interface FvmRecommendation {
  title: string;
  description: string;
  estimatedSavings?: string;
  comfortImprovement?: string;
}

export interface FvmDetails {
  buildingParameters: FvmBuildingParameters;
  simulationSettings: FvmSimulationSettings;
  simulationResults: FvmSimulationResults;
  charts: FvmCharts;
  recommendations: FvmRecommendation[];
}

// ---------- GET /workflows/consumer/standard/simulations/thermal-comfort ----------
export interface GetFvmSimulationResponse {
  workflow: ConsumerWorkflow;
  step: WorkflowStep<SimulationsStepPayload>;
  thermalComfort: FvmDetails | null;
}

// ---------- PATCH ----------
export interface UpdateFvmSimulationPayload {
  status: SimulationStatus;
  thermalComfort: FvmDetails;
}

// ---------- POST /analysis/fvm/simulate ----------
export interface RunFvmSimulationPayload {
  building: {
    thermal_conductivity: number;
    domain_width_m: number;
    domain_height_m: number;
    boundary_conditions: {
      interior_temp_c: number;
      exterior_temp_c: number;
    };
    density: number;
    specific_heat: number;
  };
  simulation: {
    convergence_tolerance: number;
    max_iterations: number;
    method: string;
    dimension: string;
    grid_nx: number;
    grid_ny: number;
  };
  endpointOptions?: {
    method?: string;
    dimension?: string;
  };
}

export interface RunFvmKpi {
  value: number;
  unit: string;
  out_of: number | null;
  direction: string | null;
}

export interface RunFvmSimulationData {
  status: {
    converged: boolean;
    iterations_used: number;
    final_residual: number;
    runtime_seconds: number;
  };
  kpis: {
    comfort_score: RunFvmKpi;
    avg_heat_flux: RunFvmKpi;
    energy_impact: RunFvmKpi;
  };
  temperature_distribution: {
    caption: string;
    x_axis: {
      label: string;
      unit: string;
      scale: string | null;
      from: number;
      to: number;
    };
    series: Array<{
      key: string;
      label: string;
      unit: string;
      axis: string;
    }>;
    points: Array<{
      position_m: number;
      temperature_c: number;
      comfort_index: number;
    }>;
  };
  heat_flux_by_zone: {
    caption: string;
    series: Array<{
      key: string;
      label: string;
      unit: string;
      axis: string;
    }>;
    zones: Array<{
      zone: string;
      heat_flux_wm2: number;
      annual_loss_kwh: number;
    }>;
  };
  convergence: {
    x_axis: {
      label: string;
      unit: string | null;
      scale: string | null;
      from: number;
      to: number;
    };
    y_axis: {
      label: string;
      unit: string | null;
      scale: string | null;
      from: number | null;
      to: number | null;
    };
    history: Array<{ iteration: number; residual: number }>;
  };
  assumptions: {
    comfort_target_c: number;
    comfort_full_range_c: number;
    wall_area_m2: number;
    hours_per_year: number;
  };
  warnings: string[];
}

export interface RunFvmSimulationResponse {
  status: number;
  message: string;
  data: RunFvmSimulationData;
}

/** Map the solver response into the persisted workflow shapes. */
export const mapRunToFvmResults = (
  data: RunFvmSimulationData,
): FvmSimulationResults => ({
  simulationStatus: data.status.converged ? "Converged" : "Not Converged",
  iterationsUsed: data.status.iterations_used,
  comfortScore: data.kpis.comfort_score.value,
  avgHeatFluxWm2: data.kpis.avg_heat_flux.value,
  energyImpactKwhYearLoss: data.kpis.energy_impact.value,
  convergenceAchieved: data.status.converged,
  finalResidual: data.status.final_residual,
});

export const mapRunToFvmCharts = (data: RunFvmSimulationData): FvmCharts => ({
  temperatureDistributionAcrossBuilding:
    data.temperature_distribution.points.map((p) => ({
      positionM: p.position_m,
      temperatureC: p.temperature_c,
      comfortIndex: p.comfort_index,
    })),
  heatFluxByBuildingZone: data.heat_flux_by_zone.zones.map((z) => ({
    zone: z.zone,
    heatFluxWm2: z.heat_flux_wm2,
    annualLossKwh: z.annual_loss_kwh,
  })),
  convergenceAnalysis: data.convergence.history.map((h) => ({
    iteration: h.iteration,
    residual: h.residual,
  })),
  temperatureCaption: data.temperature_distribution.caption,
  heatFluxCaption: data.heat_flux_by_zone.caption,
});

export const defaultThermalRecommendations: FvmRecommendation[] = [
  {
    title: "Upgrade Roof Insulation",
    description: "Add R-38 insulation to reduce heat flux.",
    estimatedSavings: "$180/year",
  },
  {
    title: "Install Thermal Barriers",
    description: "Add thermal breaks in walls.",
    comfortImprovement: "+7 points",
  },
];

export const generateThermalSimulationFallback = (values: {
  thermalConductivityWmK: number;
  domainWidthM: number;
  domainHeightM: number;
  interiorTemperatureC: number;
  exteriorTemperatureC: number;
  simulationMethod?: string;
  simulationDimension?: string;
  maximumIterations?: number;
  convergenceTolerance?: number;
}): RunFvmSimulationData => {
  const delta =
    Math.abs(values.exteriorTemperatureC - values.interiorTemperatureC) || 13;
  const k = values.thermalConductivityWmK || 0.5;
  const is3D = values.simulationDimension === "3D";
  const width = values.domainWidthM || 10;
  const height = values.domainHeightM || 3;

  const avgHeatFlux = Math.round(30 + k * 14);
  const comfortScore = Math.min(
    96,
    Math.max(60, Math.round(98 - delta * 0.85)),
  );
  const energyImpact = Math.round(avgHeatFlux * width * height * 4);
  const iterationsUsed = Math.min(
    values.maximumIterations || 1000,
    is3D ? 678 : 542,
  );
  const runtimeSeconds = is3D ? 4.2 : 2.8;

  const pointsCount = 6;
  const points = Array.from({ length: pointsCount }, (_, i) => {
    const fraction = i / (pointsCount - 1);
    const position_m = Math.round(fraction * width * 10) / 10;
    const temp =
      Math.round(
        (values.exteriorTemperatureC -
          fraction *
            (values.exteriorTemperatureC - values.interiorTemperatureC)) *
          10,
      ) / 10;
    const comfort_index = Math.round(30 + fraction * 70);
    return {
      position_m,
      temperature_c: temp,
      comfort_index,
    };
  });

  return {
    status: {
      converged: true,
      iterations_used: iterationsUsed,
      final_residual: 0.0009,
      runtime_seconds: runtimeSeconds,
    },
    kpis: {
      comfort_score: {
        value: comfortScore,
        unit: "score",
        out_of: 100,
        direction: null,
      },
      avg_heat_flux: {
        value: avgHeatFlux,
        unit: "W/m2",
        out_of: null,
        direction: null,
      },
      energy_impact: {
        value: energyImpact,
        unit: "kWh/year",
        out_of: null,
        direction: "negative",
      },
    },
    temperature_distribution: {
      caption:
        "Temperature gradient from exterior (left) to interior (right). Comfort index improves toward building core.",
      x_axis: {
        label: "Position",
        unit: "m",
        scale: null,
        from: 0,
        to: width,
      },
      series: [
        { key: "temperature", label: "Temperature", unit: "C", axis: "left" },
        {
          key: "comfort_index",
          label: "Comfort Index",
          unit: "score",
          axis: "right",
        },
      ],
      points,
    },
    heat_flux_by_zone: {
      caption:
        "Roof shows highest heat flux. Consider improved insulation for maximum impact.",
      series: [
        { key: "heat_flux", label: "Heat Flux", unit: "W/m2", axis: "left" },
        {
          key: "annual_loss",
          label: "Annual Loss",
          unit: "kWh",
          axis: "right",
        },
      ],
      zones: [
        {
          zone: "North Wall",
          heat_flux_wm2: Math.round(avgHeatFlux * 1.13),
          annual_loss_kwh: Math.round(energyImpact * 0.19),
        },
        {
          zone: "East Wall",
          heat_flux_wm2: Math.round(avgHeatFlux * 1.02),
          annual_loss_kwh: Math.round(energyImpact * 0.17),
        },
        {
          zone: "South Wall",
          heat_flux_wm2: Math.round(avgHeatFlux * 0.97),
          annual_loss_kwh: Math.round(energyImpact * 0.16),
        },
        {
          zone: "West Wall",
          heat_flux_wm2: Math.round(avgHeatFlux * 1.08),
          annual_loss_kwh: Math.round(energyImpact * 0.18),
        },
        {
          zone: "Roof",
          heat_flux_wm2: Math.round(avgHeatFlux * 1.4),
          annual_loss_kwh: Math.round(energyImpact * 0.23),
        },
        {
          zone: "Floor",
          heat_flux_wm2: Math.round(avgHeatFlux * 0.4),
          annual_loss_kwh: Math.round(energyImpact * 0.07),
        },
      ],
    },
    convergence: {
      x_axis: {
        label: "Iterations",
        unit: null,
        scale: null,
        from: 100,
        to: iterationsUsed,
      },
      y_axis: {
        label: "Residual Error",
        unit: null,
        scale: "log",
        from: null,
        to: null,
      },
      history: [
        { iteration: 100, residual: 1 },
        { iteration: 200, residual: 0.35 },
        { iteration: 300, residual: 0.12 },
        { iteration: 400, residual: 0.04 },
        { iteration: 500, residual: 0.012 },
        { iteration: 600, residual: 0.003 },
        { iteration: iterationsUsed, residual: 0.0009 },
      ],
    },
    assumptions: {
      comfort_target_c: 22,
      comfort_full_range_c: 10,
      wall_area_m2: height,
      hours_per_year: 8760,
    },
    warnings: [],
  };
};
