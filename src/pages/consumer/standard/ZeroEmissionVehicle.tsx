import CommonButton from "@/common/button/CommonButton";
import Welcome from "@/components/consumer/basic/dashboard/Welcome";
import OptimizationRecommendations from "@/components/consumer/standard/commodity/setup/OptimizationRecommendations";
import VehicleChargingConfiguration from "@/components/consumer/standard/commodity/setup/VehicleChargingConfiguration";
import FooterActions from "@/components/consumer/standard/commodity/zev/FooterActions";
import SimulationResults from "@/components/consumer/standard/commodity/zev/SimulationResults";

import {
  zevFormDefaultValues,
  zevFormSchema,
  ZevFormValues,
} from "@/store/consumer/standard/Simulations/schema/zev/zevSchema";
import {
  useGetZevSimulationQuery,
  useRunZevSimulationMutation,
} from "@/store/consumer/standard/Simulations/simulationApi";
import { RunZevSimulationResponse } from "@/store/consumer/standard/Simulations/types/zev/zev";
import { zodResolver } from "@hookform/resolvers/zod";
import { Car } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

type ZevRunResult = RunZevSimulationResponse["data"];

const ZeroEmissionVehicle: React.FC = () => {
  const { data } = useGetZevSimulationQuery();
  const [runZevSimulation, { isLoading: isRunning }] =
    useRunZevSimulationMutation();

  const [latestRun, setLatestRun] = useState<ZevRunResult | null>(null);

  const form = useForm<ZevFormValues>({
    resolver: zodResolver(zevFormSchema),
    defaultValues: zevFormDefaultValues,
  });

  useEffect(() => {
    if (!data?.zev) return;
    const { vehicleConfiguration: v, chargingConfiguration: c } = data.zev;
    form.reset({
      vehicleType: v.vehicleType,
      batteryCapacityKwh: v.batteryCapacityKwh,
      dailyDistanceMiles: v.dailyDistanceMiles,
      vehicleClass: v.vehicleClass,
      chargingMethod: c.chargingMethod,
      numberOfChargingPorts: c.numberOfChargingPorts,
      chargingDurationHoursPerDay: c.chargingDurationHoursPerDay,
      expectedStationUptimePercent: c.expectedStationUptimePercent,
      averageWaitingTimeMinutes: c.averageWaitingTimeMinutes,
      energyTariffPerKwh: c.energyTariffPerKwh,
    });
  }, [data, form]);

  const onRunSimulation = form.handleSubmit(async (values) => {
    try {
      const run = await runZevSimulation({
        vehicleConfiguration: {
          vehicleType: values.vehicleType,
          vehicleClass: values.vehicleClass,
          batteryCapacityKwh: values.batteryCapacityKwh,
          dailyDistanceMiles: values.dailyDistanceMiles,
        },
        chargingConfiguration: {
          chargingMethod: values.chargingMethod,
          energyTariffPerKwh: values.energyTariffPerKwh,
          numberOfChargingPorts: values.numberOfChargingPorts,
          averageWaitingTimeMinutes: values.averageWaitingTimeMinutes,
          chargingDurationHoursPerDay: values.chargingDurationHoursPerDay,
          expectedStationUptimePercent: values.expectedStationUptimePercent,
        },
        simulationOptions: {},
      }).unwrap();

      setLatestRun(run.data);
    } catch (err) {
      console.error("ZEV simulation failed", err);
    }
  });

  const results = latestRun?.simulationSummary ?? data?.zev?.simulationResults;
  const charts = latestRun?.charts ?? data?.zev?.charts;
  const recommendations =
    latestRun?.recommendations ?? data?.zev?.recommendations;

  return (
    <div className="space-y-6">
      <Welcome
        title="Zero Emission Vehicle (ZEV)"
        description="Advanced vehicle charging simulation and optimization"
        className="border-[#155DFC]/20 bg-gradient-to-r from-[#155DFC]/10 to-[#0092B8]/10!"
        Icons={Car}
        iconColor="text-[#155DFC]"
        iconBg="bg-[#155DFC]/10"
      />
      <Welcome
        title="Utility Data Connection Required"
        description="Connect your utility provider to automatically import electricity and
          gas consumption data."
        variant="secondary"
        isConnected
        actions={
          <CommonButton variant="primaryBlue" className="">
            Request Permission
          </CommonButton>
        }
      />
      <VehicleChargingConfiguration form={form} />
      <SimulationResults
        results={results}
        charts={charts}
        onRunSimulation={onRunSimulation}
        isRunning={isRunning}
      />
      {results && (
        <OptimizationRecommendations recommendations={recommendations} />
      )}

      <FooterActions
        backText="Back to Dashboard"
        continueText="Continue to NZEB Analysis"
        to="../nzeb"
      />
    </div>
  );
};

export default ZeroEmissionVehicle;
