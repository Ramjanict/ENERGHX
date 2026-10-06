import CommonButton from "@/common/button/CommonButton";
import Welcome from "@/components/consumer/basic/dashboard/Welcome";
import ModuleConfigs from "@/components/consumer/standard/commodity/nzeb/ModuleConfigs";
import SimulationResultsNZEB from "@/components/consumer/standard/commodity/nzeb/SimulationResultsNZEB";
import FooterActions from "@/components/consumer/standard/commodity/zev/FooterActions";
import {
  nzebFormDefaultValues,
  nzebFormSchema,
  NzebFormValues,
} from "@/store/consumer/standard/Simulations/schema/nzeb/nzebSchema";
import {
  useGetNzebSimulationQuery,
  useRunNzebSimulationMutation,
} from "@/store/consumer/standard/Simulations/simulationApi";
import {
  NzebModuleConfiguration,
  RunNzebSimulationResponse,
} from "@/store/consumer/standard/Simulations/types/nzeb/nzeb";
import { zodResolver } from "@hookform/resolvers/zod";
import { Building2 } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

type NzebRunResult = RunNzebSimulationResponse["data"];

const toModuleConfiguration = (
  values: NzebFormValues,
): NzebModuleConfiguration => ({
  solarModule: {
    panelAreaM2: values.panelAreaM2,
    pvEfficiencyPercent: values.pvEfficiencyPercent,
    solarIrradianceKwhM2Day: values.solarIrradianceKwhM2Day,
  },
  windModule: {
    windSpeedMs: values.windSpeedMs,
    turbineSizeKw: values.turbineSizeKw,
    cutInSpeedMs: values.cutInSpeedMs,
    cutOutSpeedMs: values.cutOutSpeedMs,
  },
  biomassModule: {
    feedstockMassKgDay: values.feedstockMassKgDay,
    methaneYieldM3Kg: values.methaneYieldM3Kg,
    generatorEfficiencyPercent: values.generatorEfficiencyPercent,
  },
  batteryStorageModule: {
    batteryCapacityKwh: values.batteryCapacityKwh,
    chargeEfficiencyPercent: values.chargeEfficiencyPercent,
    dischargeEfficiencyPercent: values.dischargeEfficiencyPercent,
  },
  financialParameters: {
    capitalCost: values.capitalCost,
    omCostPerYear: values.omCostPerYear,
    projectLifeYears: values.projectLifeYears,
    discountRatePercent: values.discountRatePercent,
  },
});

const NetZeroEnergyBuilding: React.FC = () => {
  const { data } = useGetNzebSimulationQuery();
  const [runNzebSimulation, { isLoading: isRunning }] =
    useRunNzebSimulationMutation();

  const [latestRun, setLatestRun] = useState<NzebRunResult | null>(null);

  const form = useForm<NzebFormValues>({
    resolver: zodResolver(nzebFormSchema),
    defaultValues: nzebFormDefaultValues,
  });

  useEffect(() => {
    if (!data?.nzeb) return;
    const n = data.nzeb;
    form.reset({
      panelAreaM2: n.solarModule.panelAreaM2,
      pvEfficiencyPercent: n.solarModule.pvEfficiencyPercent,
      solarIrradianceKwhM2Day: n.solarModule.solarIrradianceKwhM2Day,
      windSpeedMs: n.windModule.windSpeedMs,
      turbineSizeKw: n.windModule.turbineSizeKw,
      cutInSpeedMs: n.windModule.cutInSpeedMs,
      cutOutSpeedMs: n.windModule.cutOutSpeedMs,
      feedstockMassKgDay: n.biomassModule.feedstockMassKgDay,
      methaneYieldM3Kg: n.biomassModule.methaneYieldM3Kg,
      generatorEfficiencyPercent: n.biomassModule.generatorEfficiencyPercent,
      batteryCapacityKwh: n.batteryStorageModule.batteryCapacityKwh,
      chargeEfficiencyPercent: n.batteryStorageModule.chargeEfficiencyPercent,
      dischargeEfficiencyPercent:
        n.batteryStorageModule.dischargeEfficiencyPercent,
      capitalCost: n.financialParameters.capitalCost,
      omCostPerYear: n.financialParameters.omCostPerYear,
      projectLifeYears: n.financialParameters.projectLifeYears,
      discountRatePercent: n.financialParameters.discountRatePercent,
    });
  }, [data, form]);

  const onRunSimulation = form.handleSubmit(async (values) => {
    try {
      const run = await runNzebSimulation(
        toModuleConfiguration(values),
      ).unwrap();
      setLatestRun(run.data);
    } catch (err) {
      console.error("NZEB simulation failed", err);
    }
  });

  const results = latestRun?.simulationResults ?? data?.nzeb?.simulationResults;
  const charts = latestRun?.charts ?? data?.nzeb?.charts;

  return (
    <div className="space-y-6">
      <Welcome
        title="Net Zero Energy Building (NZEB)"
        description="Advanced hybrid renewable energy simulation and optimization"
        className="border-[#00A63E]/20 bg-gradient-to-r from-[#00A63E]/10 to-[#155DFC]/10!"
        Icons={Building2}
        iconColor="text-[#00A63E]"
        iconBg="bg-[#00A63E]/20"
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

      <ModuleConfigs form={form} />
      <SimulationResultsNZEB
        results={results}
        charts={charts}
        onRunSimulation={onRunSimulation}
        isRunning={isRunning}
      />

      <FooterActions
        backText="Back to ZEV"
        continueText="Continue to Thermal Comfort"
        to="../thermal-comfort-simulation"
      />
    </div>
  );
};

export default NetZeroEnergyBuilding;
