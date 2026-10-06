import CommonBorderWrapper from "@/common/button/CommonBorderWrapper";
import SectionHeader from "@/common/header/SectionHeader";
import BMiniCard from "@/components/consumer/basic/building/card/BMiniCard";
import { SolveBatteryDesignResponse } from "@/store/consumer/standard/designs/battery/types/batteryDesign";
import {
  BatteryCharging,
  CheckCircle2,
  DollarSign,
  TrendingUp,
} from "lucide-react";
import ConsiderationCard from "../wind/WindSiteConsiderations";
import BatteryLifecycleChart from "./BatteryLifecycleChart";
import BatteryTechnicalSpecifications from "./BatteryTechnicalSpecifications";
import DailyEnergyDispatchChart from "./DailyEnergyDispatchChart";

interface BatterySystemResultsProps {
  results: SolveBatteryDesignResponse["data"];
}

const BatterySystemResults: React.FC<BatterySystemResultsProps> = ({
  results,
}) => {
  const { assumptions, notes } = results;
  const { summary, charts, technicalSpecifications } = results.results;

  return (
    <div className="space-y-6">
      <CommonBorderWrapper isShadow>
        <SectionHeader title="Battery Sizing Results" />

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <BMiniCard
            layout="stacked"
            icon={BatteryCharging}
            label="Recommended Battery Size"
            value={`${summary.recommendedBatterySize.value}`}
            des={summary.recommendedBatterySize.subLabel}
            className="flex flex-col items-center text-center border-[rgba(152,16,250,0.15)]!"
            bgClassName="bg-[linear-gradient(180deg,_#F5F0FF_0%,_#FFFFFF_100%)]!"
            iconBgClassName=""
            iconColorClassName="text-[#9810FA]"
            valueClass="text-[#9810FA]! font-bold! text-3xl!"
          />
          <BMiniCard
            layout="stacked"
            icon={CheckCircle2}
            label="Backup Duration"
            value={`${summary.backupDuration.value}h`}
            des={summary.backupDuration.subLabel}
            className="flex flex-col items-center text-center border-[rgba(34,197,94,0.15)]!"
            bgClassName="bg-[linear-gradient(180deg,_#EAF9EC_0%,_#FFFFFF_100%)]!"
            iconBgClassName=""
            iconColorClassName="text-[#16A34A]"
            valueClass="text-[#16A34A]! font-bold! text-3xl!"
          />
          <BMiniCard
            layout="stacked"
            icon={DollarSign}
            label="Annual Savings"
            value={`$${summary.annualSavings.value.toLocaleString()}`}
            des={summary.annualSavings.subLabel}
            className="flex flex-col items-center text-center border-[rgba(37,99,235,0.15)]!"
            bgClassName="bg-[linear-gradient(180deg,_#EFF6FF_0%,_#FFFFFF_100%)]!"
            iconBgClassName=""
            iconColorClassName="text-[#2563EB]"
            valueClass="text-[#2563EB]! font-bold! text-3xl!"
          />
          <BMiniCard
            layout="stacked"
            icon={TrendingUp}
            label="Energy Independence"
            value={`${summary.energyIndependence.value}%`}
            des={summary.energyIndependence.subLabel}
            className="flex flex-col items-center text-center border-[rgba(34,197,94,0.15)]!"
            bgClassName="bg-[linear-gradient(180deg,_#EAF9EC_0%,_#FFFFFF_100%)]!"
            iconBgClassName=""
            iconColorClassName="text-[#16A34A]"
            valueClass="text-[#16A34A]! font-bold! text-3xl!"
          />
        </div>
      </CommonBorderWrapper>

      <BatteryTechnicalSpecifications
        specifications={technicalSpecifications}
      />

      <BatteryLifecycleChart chart={charts.batteryLifecycleAnalysis} />

      <DailyEnergyDispatchChart chart={charts.dailyEnergyDispatchProfile} />

      {notes.length > 0 && (
        <ConsiderationCard title="Dispatch Notes" items={notes} />
      )}

      {assumptions.length > 0 && (
        <ConsiderationCard
          className="bg-[#EFF6FF]! border-[#BEDBFF]!"
          dotColor="bg-[#155DFC]"
          title="Assumptions Applied"
          items={assumptions}
        />
      )}
    </div>
  );
};

export default BatterySystemResults;
