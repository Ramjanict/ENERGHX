import CommonBorderWrapper from "@/common/button/CommonBorderWrapper";
import SectionHeader from "@/common/header/SectionHeader";
import { AdvancedEngineeringModulesResponse } from "@/store/consumer/standard/POTENTIALLY OBSOLETE/types/potentiall";
import {
  AdvancedEngineeringModule,
  ZevPayload,
} from "@/store/consumer/standard/Simulations/types/dashboard";
import { Building2, Car, Thermometer } from "lucide-react";
import React from "react";
import { useNavigate } from "react-router-dom";
import SimulationModuleCard from "./SimulationModuleCard";

interface SimulationModule {
  advancedEngineeringModules?: AdvancedEngineeringModulesResponse | AdvancedEngineeringModule[] | any;
}
const AdvancedEngineeringModules: React.FC<SimulationModule> = ({
  advancedEngineeringModules,
}) => {
  const navigate = useNavigate();

  const isArray = Array.isArray(advancedEngineeringModules);
  const zevData = isArray
    ? advancedEngineeringModules?.find(
        (module: any) => module.key === "ZEV",
      )
    : undefined;
  const zevInput = zevData?.metrics as ZevPayload | undefined;

  const modules = !isArray ? advancedEngineeringModules?.modules : undefined;
  const zevParams = modules?.zeroEmissionVehicle?.parameters;
  const nzebParams = modules?.netZeroEnergyBuilding?.parameters;
  const thermalParams = modules?.thermalComfortSimulation?.parameters;

  return (
    <CommonBorderWrapper isShadow>
      <SectionHeader
        title="Advanced Engineering Modules"
        description="Specialized computational tools for advanced sustainability analysis"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <SimulationModuleCard
          icon={Car}
          iconColor="text-blue-500"
          title="Zero Emission Vehicle"
          description="Advanced vehicle charging simulation and optimization"
          bgClassName="bg-[#EFF6FF]"
          borderClassName="border-[#BFDBFE]/60"
          stats={[
            {
              label: "Station Uptime",
              value:
                zevParams?.stationUptime ??
                (zevInput?.simulationInput?.stationUptime != null
                  ? `${zevInput.simulationInput.stationUptime.toFixed(1)}%`
                  : "98.2%"),
            },
            {
              label: "Vehicle Uptime",
              value:
                zevParams?.vehicleUptime ??
                (zevInput?.simulationInput?.vehicleUptime != null
                  ? `${zevInput.simulationInput.vehicleUptime.toFixed(0)}%`
                  : "96%"),
            },
            {
              label: "Energy Delivered",
              value:
                zevParams?.energyDelivered ??
                (zevInput?.simulationInput?.energyDelivered != null
                  ? `${zevInput.simulationInput.energyDelivered} kWh`
                  : "485 kWh"),
            },
            {
              label: "Charging Time",
              value:
                zevParams?.chargingTime ??
                (zevInput?.simulationInput?.chargingTime != null
                  ? `${zevInput.simulationInput.chargingTime} hrs`
                  : "8 hrs"),
            },
          ]}
          onRunSimulation={() => navigate("/standard-consumer/zev")}
        />

        <SimulationModuleCard
          icon={Building2}
          iconColor="text-green-600"
          title="Net Zero Energy Building"
          description="Hybrid renewable energy simulation and net-zero optimization"
          bgClassName="bg-[#F0FDF4]"
          borderClassName="border-[#86EFAC]/40"
          stats={[
            {
              label: "Solar Contribution",
              value: nzebParams?.solarContribution ?? "55%",
            },
            {
              label: "Wind Contribution",
              value: nzebParams?.windContribution ?? "25%",
            },
            {
              label: "Biomass Contribution",
              value: nzebParams?.biomassContribution ?? "15%",
            },
            {
              label: "Battery Storage",
              value: nzebParams?.batteryStorage ?? "30 kWh",
            },
          ]}
          onRunSimulation={() => navigate("/standard-consumer/nzeb")}
        />

        <SimulationModuleCard
          icon={Thermometer}
          iconColor="text-orange-500"
          title="Thermal Comfort Simulation"
          description="FVM heat transfer analysis and building envelope optimization"
          bgClassName="bg-[#FFF7ED]"
          borderClassName="border-[#FED7AA]/50"
          stats={[
            {
              label: "Thermal Conductivity",
              value: thermalParams?.thermalConductivity ?? "0.5 W/m·K",
            },
            {
              label: "Heat Transfer",
              value: thermalParams?.heatTransfer ?? "37 W/m²",
            },
            {
              label: "Comfort Index",
              value: thermalParams?.comfortIndex ?? "87/100",
            },
            {
              label: "Energy Impact",
              value: thermalParams?.energyImpact ?? "4,450 kWh",
            },
          ]}
          onRunSimulation={() =>
            navigate("/standard-consumer/thermal-comfort-simulation")
          }
        />
      </div>
    </CommonBorderWrapper>
  );
};

export default AdvancedEngineeringModules;
