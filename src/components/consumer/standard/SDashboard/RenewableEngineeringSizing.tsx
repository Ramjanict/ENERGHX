import CommonBorderWrapper from "@/common/button/CommonBorderWrapper";
import SectionHeader from "@/common/header/SectionHeader";
import { Leaf, Sun, Wind } from "lucide-react";
import React from "react";
import { useNavigate } from "react-router-dom";
import SizingModuleCard from "./SizingModuleCard";

interface RenewableEngineeringSizingProps {
  data?: any;
  status?: {
    solar?: string;
    wind?: string;
    biomass?: string;
    [key: string]: any;
  };
}

const RenewableEngineeringSizing: React.FC<RenewableEngineeringSizingProps> = ({
  data,
  status,
}) => {
  const navigate = useNavigate();

  const handleConfigure = (module: string) => {
    if (module === "solar") navigate("/standard-consumer/solar-energy");
    else if (module === "wind") navigate("/standard-consumer/wind-energy");
    else if (module === "biomass") navigate("/standard-consumer/biomass-energy");
  };

  const getModuleStatus = (
    moduleKey: "solar" | "wind" | "biomass"
  ): string | undefined => {
    // 1. Direct status prop object
    if (status && typeof status === "object") {
      if (status[moduleKey] != null) return String(status[moduleKey]);
      if (status[moduleKey.toUpperCase()] != null)
        return String(status[moduleKey.toUpperCase()]);
    }
    // 2. data object if passed
    if (data) {
      if (Array.isArray(data)) {
        const item = data.find(
          (d: any) =>
            d.key?.toLowerCase() === moduleKey ||
            d.key?.toLowerCase() === `${moduleKey}_sizing` ||
            d.title?.toLowerCase().includes(moduleKey)
        );
        if (item?.status) return String(item.status);
      } else if (typeof data === "object") {
        if (data.status?.[moduleKey] != null)
          return String(data.status[moduleKey]);
        if (data.status?.[moduleKey.toUpperCase()] != null)
          return String(data.status[moduleKey.toUpperCase()]);
        if (data[moduleKey]?.status != null)
          return String(data[moduleKey].status);
        if (typeof data[moduleKey] === "string") return data[moduleKey];
      }
    }
    return undefined;
  };

  const isModuleCompleted = (
    moduleKey: "solar" | "wind" | "biomass"
  ): boolean => {
    const s = getModuleStatus(moduleKey);
    if (!s) return false;
    const normalized = s.trim().toUpperCase();
    return (
      normalized === "COMPLETED" ||
      normalized === "COMPLETE" ||
      normalized === "EXECUTED" ||
      normalized === "APPROVED" ||
      normalized === "DONE"
    );
  };

  return (
    <CommonBorderWrapper isShadow>
      <SectionHeader
        size="xl"
        title="Renewable Engineering Sizing"
        description="Advanced system sizing and optimization tools"
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <SizingModuleCard
          icon={Sun}
          iconColor="text-amber-500"
          title="Solar Sizing"
          description="Professional sizing calculations and system optimization"
          bgClassName="bg-amber-50"
          isCompleted={isModuleCompleted("solar")}
          onConfigure={() => handleConfigure("solar")}
        />

        <SizingModuleCard
          icon={Wind}
          iconColor="text-blue-500"
          title="Wind Sizing"
          description="Professional sizing calculations and system optimization"
          bgClassName="bg-blue-50"
          isCompleted={isModuleCompleted("wind")}
          onConfigure={() => handleConfigure("wind")}
        />

        <SizingModuleCard
          icon={Leaf}
          iconColor="text-green-600"
          title="Biomass Sizing"
          description="Professional sizing calculations and system optimization"
          bgClassName="bg-green-50"
          isCompleted={isModuleCompleted("biomass")}
          onConfigure={() => handleConfigure("biomass")}
        />
      </div>
    </CommonBorderWrapper>
  );
};

export default RenewableEngineeringSizing;
