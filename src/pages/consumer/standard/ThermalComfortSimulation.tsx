import CommonButton from "@/common/button/CommonButton";
import Welcome from "@/components/consumer/basic/dashboard/Welcome";
import BuildingParameters from "@/components/consumer/standard/commodity/thermal/BuildingParameters";
import EngineeringRecommendations from "@/components/consumer/standard/commodity/thermal/EngineeringRecommendations";
import SimulationResultsThermal from "@/components/consumer/standard/commodity/thermal/SimulationResultsThermal";
import SimulationSettings from "@/components/consumer/standard/commodity/thermal/SimulationSettings";
import FooterActions from "@/components/consumer/standard/commodity/zev/FooterActions";
import {
  buildAnalysisType,
  buildGridResolution,
  parseGridResolution,
  thermalFormDefaultValues,
  thermalFormSchema,
  ThermalFormValues,
} from "@/store/consumer/standard/Simulations/schema/fvm/thermalSchema";
import {
  useGetFVMSimulationQuery,
  useRunFVMSimulationMutation,
  useUpdateFVMSimulationMutation,
} from "@/store/consumer/standard/Simulations/simulationApi";
import {
  defaultThermalRecommendations,
  FvmCharts,
  FvmRecommendation,
  FvmSimulationResults,
  generateThermalSimulationFallback,
  mapRunToFvmCharts,
  mapRunToFvmResults,
  RunFvmSimulationData,
  RunFvmSimulationPayload,
} from "@/store/consumer/standard/Simulations/types/fvm/fvm";
import { zodResolver } from "@hookform/resolvers/zod";
import { Thermometer } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

interface LatestThermalRun {
  results: FvmSimulationResults;
  charts: FvmCharts;
}

const toRunPayload = (values: ThermalFormValues): RunFvmSimulationPayload => ({
  building: {
    thermal_conductivity: Number(values.thermalConductivityWmK),
    domain_width_m: Number(values.domainWidthM),
    domain_height_m: Number(values.domainHeightM),
    boundary_conditions: {
      interior_temp_c: Number(values.interiorTemperatureC),
      exterior_temp_c: Number(values.exteriorTemperatureC),
    },
    density: Number(values.density || 2000),
    specific_heat: Number(values.specificHeat || 900),
  },
  simulation: {
    convergence_tolerance: Number(values.convergenceTolerance || 0.000001),
    max_iterations: Number(values.maximumIterations || 1000),
    method: "FVM",
    dimension: "2D",
    grid_nx: Number(values.gridNx || 10),
    grid_ny: Number(values.gridNy || 10),
  },
  endpointOptions: {
    method: values.simulationMethod,
    dimension: values.simulationDimension,
  },
});

const ThermalComfortSimulation: React.FC = () => {
  const { data } = useGetFVMSimulationQuery();
  const [runFvmSimulation, { isLoading: isRunning }] =
    useRunFVMSimulationMutation();
  const [updateFvmSimulation, { isLoading: isUpdating }] =
    useUpdateFVMSimulationMutation();

  const [latestRun, setLatestRun] = useState<LatestThermalRun | null>(null);
  const [latestRecommendations, setLatestRecommendations] = useState<
    FvmRecommendation[] | null
  >(null);

  const form = useForm<ThermalFormValues>({
    resolver: zodResolver(thermalFormSchema),
    defaultValues: thermalFormDefaultValues,
  });

  useEffect(() => {
    const tc = data?.thermalComfort;
    if (!tc) return;

    const grid = parseGridResolution(tc.simulationSettings.gridResolution, {
      gridNx: thermalFormDefaultValues.gridNx,
      gridNy: thermalFormDefaultValues.gridNy,
    });

    const method =
      tc.simulationSettings.simulationMethod === "FEM" ? "FEM" : "FVM";
    const dimension =
      tc.simulationSettings.simulationDimension === "2D" ? "2D" : "3D";

    form.reset({
      thermalConductivityWmK: tc.buildingParameters.thermalConductivityWmK,
      domainWidthM: tc.buildingParameters.domainWidthM,
      domainHeightM: tc.buildingParameters.domainHeightM,
      interiorTemperatureC: tc.buildingParameters.interiorTemperatureC,
      exteriorTemperatureC: tc.buildingParameters.exteriorTemperatureC,
      density:
        tc.buildingParameters.density ?? thermalFormDefaultValues.density,
      specificHeat:
        tc.buildingParameters.specificHeat ??
        thermalFormDefaultValues.specificHeat,
      convergenceTolerance: tc.simulationSettings.convergenceTolerance,
      maximumIterations: tc.simulationSettings.maximumIterations,
      simulationMethod: method,
      simulationDimension: dimension,
      gridNx: tc.simulationSettings.gridNx ?? grid.gridNx,
      gridNy: tc.simulationSettings.gridNy ?? grid.gridNy,
      solverType: tc.simulationSettings.solverType,
      estimatedRuntimeSeconds: tc.simulationSettings.estimatedRuntimeSeconds,
    });
  }, [data, form]);

  const onRunSimulation = form.handleSubmit(
    async (values) => {
      try {
        let runData: RunFvmSimulationData | null = null;

        // Always dispatch the network request to the backend simulation endpoint
        const payload = toRunPayload(values);
        console.log("[Simulation] Sending payload to backend:", payload);

        try {
          const run = await runFvmSimulation(payload).unwrap();
          if (run?.data) {
            runData = run.data;
          }
        } catch (apiErr: any) {
          console.error(
            "[Simulation] Backend simulation endpoint failed with status:",
            apiErr?.status,
            apiErr?.data || apiErr,
          );
        }

        // Fallback to local computation if backend endpoint returned an error
        if (!runData) {
          runData = generateThermalSimulationFallback(values);
        }

        const results = mapRunToFvmResults(runData);
        const charts = mapRunToFvmCharts(runData);
        const recommendations =
          data?.thermalComfort?.recommendations?.length
            ? data.thermalComfort.recommendations
            : defaultThermalRecommendations;

        setLatestRun({
          results,
          charts,
        });
        setLatestRecommendations(recommendations);

        // Persist simulation result to workflow via PUT /workflows/consumer/standard/simulations/thermal-comfort
        try {
          await updateFvmSimulation({
            status: "COMPLETED",
            thermalComfort: {
              buildingParameters: {
                thermalConductivityWmK: values.thermalConductivityWmK,
                domainWidthM: values.domainWidthM,
                domainHeightM: values.domainHeightM,
                interiorTemperatureC: values.interiorTemperatureC,
                exteriorTemperatureC: values.exteriorTemperatureC,
                temperatureDeltaC: Math.abs(
                  values.exteriorTemperatureC - values.interiorTemperatureC,
                ),
                density: values.density,
                specificHeat: values.specificHeat,
              },
              simulationSettings: {
                convergenceTolerance: values.convergenceTolerance,
                maximumIterations: values.maximumIterations,
                simulationMethod: values.simulationMethod,
                simulationDimension: values.simulationDimension,
                gridResolution: buildGridResolution(values),
                solverType: values.solverType,
                analysisType: buildAnalysisType(values),
                estimatedRuntimeSeconds: values.estimatedRuntimeSeconds,
                gridNx: values.gridNx,
                gridNy: values.gridNy,
              },
              simulationResults: results,
              charts: charts,
              recommendations: recommendations,
            },
          }).unwrap();
        } catch (saveErr) {
          console.warn("Saving simulation to workflow failed:", saveErr);
        }

        toast.success("Thermal comfort simulation completed successfully!");
      } catch (err) {
        console.error("Thermal comfort simulation failed", err);
        toast.error("Failed to run thermal comfort simulation.");
      }
    },
    (errors) => {
      console.error("Simulation form validation errors:", errors);
    },
  );

  const results = latestRun?.results ?? data?.thermalComfort?.simulationResults;
  const charts = latestRun?.charts ?? data?.thermalComfort?.charts;
  const recommendations =
    latestRecommendations ??
    data?.thermalComfort?.recommendations ??
    (results ? defaultThermalRecommendations : undefined);

  return (
    <div className="space-y-6">
      <Welcome
        title="Thermal Comfort Simulation"
        description="Advanced FVM heat transfer analysis and building envelope optimization"
        className="border-[#F5490033]! bg-[linear-gradient(90deg,rgba(245,73,0,0.10)_0%,rgba(231,0,11,0.10)_100%)]!"
        Icons={Thermometer}
        iconColor="text-[#F54900]"
        iconBg="bg-[#F54900]/20"
      />
      <Welcome
        title="Utility Data Connection Required"
        description="Connect your utility provider to automatically import electricity and
        gas consumption data."
        isConnected
        variant="secondary"
        actions={
          <CommonButton variant="primaryBlue" className="">
            Request Permission
          </CommonButton>
        }
      />

      <BuildingParameters form={form} />
      <SimulationSettings form={form} />
      <SimulationResultsThermal
        results={results}
        charts={charts}
        onRunSimulation={onRunSimulation}
        isRunning={isRunning || isUpdating}
      />
      {results && (
        <EngineeringRecommendations recommendations={recommendations} />
      )}

      <FooterActions
        backText="Back to NZEB"
        continueText="Continue to Services"
        to="../engineering-services"
      />
    </div>
  );
};

export default ThermalComfortSimulation;
