import CommonBorderWrapper from "@/common/button/CommonBorderWrapper";
import CommonButton from "@/common/button/CommonButton";
import CommonHeader from "@/common/header/CommonHeader";
import SectionHeader from "@/common/header/SectionHeader";
import FeatureCard from "@/components/consumer/basic/dashboard/FeatureCard";
import React from "react";
import { PiCheckCircleBold, PiDropBold, PiLightningBold, PiWindBold } from "react-icons/pi";
import { useNavigate } from "react-router-dom";

interface RenewableMicroservicesProps {
  isLocked?: boolean;
}

const RenewableMicroservices: React.FC<RenewableMicroservicesProps> = ({
  isLocked = true,
}) => {
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      <div>
        <SectionHeader
          title="Renewable Energy Microservices"
          description={
            isLocked
              ? "After completing your audit, explore our specialized renewable energy solutions tailored to your building's needs"
              : "Your building audit is complete. Explore specialized renewable energy solutions tailored to your building's needs."
          }
        />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 ">
        <FeatureCard
          icon={<PiLightningBold className="w-full h-full" />}
          iconBgClassName="bg-[#F59E0B]/10"
          iconColorClassName="text-[#F59E0B]"
          title="Solar"
          description="Deep analysis of your building's solar generation potential and solar panel sizing"
          onClick={!isLocked ? () => navigate("../solar-energy") : undefined}
          className={!isLocked ? "hover:border-[#F59E0B]/50 transition-colors" : ""}
        />
        <FeatureCard
          icon={<PiWindBold className="w-full h-full" />}
          iconBgClassName="bg-[#3B82F6]/10"
          iconColorClassName="text-[#3B82F6]"
          title="Wind"
          description="Evaluate wind energy opportunities based on location, turbine sizing, and wind patterns"
          onClick={!isLocked ? () => navigate("../wind-energy") : undefined}
          className={!isLocked ? "hover:border-[#3B82F6]/50 transition-colors" : ""}
        />
        <FeatureCard
          icon={<PiDropBold className="w-full h-full" />}
          iconBgClassName="bg-[#8B5CF6]/10"
          iconColorClassName="text-[#8B5CF6]"
          title="Biomass"
          description="Explore biomass energy solutions for sustainable waste-to-energy conversion"
          onClick={!isLocked ? () => navigate("../biomass-energy") : undefined}
          className={!isLocked ? "hover:border-[#8B5CF6]/50 transition-colors" : ""}
        />
      </div>
      {isLocked ? (
        <CommonBorderWrapper
          isShadow
          className="flex flex-col gap-1 items-center justify-center space-y-3!"
        >
          <CommonHeader
            size="sm"
            className="text-[#1C398E]! font-semibold! flex items-center gap-1"
          >
            🔒 Renewable Energy Evaluation is locked until you complete your
            building audit
          </CommonHeader>

          <CommonButton
            disabled
            shape="rounded"
            size="lg"
            className="bg-[#D1D5DC]! text-[#6A7282]! "
          >
            🔒 Complete Audit to Unlock
          </CommonButton>
        </CommonBorderWrapper>
      ) : (
        <CommonBorderWrapper
          isShadow
          className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-[linear-gradient(135deg,_#EAF7E6_0%,_#FFF_100%)] border-2 border-[rgba(45,173,0,0.20)]!"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-[#2DAD00] shrink-0">
              <PiCheckCircleBold className="w-6 h-6" />
            </div>
            <div>
              <CommonHeader size="sm" className="text-[#2DAD00]! font-bold!">
                Renewable Energy Modules Unlocked
              </CommonHeader>
              <p className="text-xs sm:text-sm text-slate-600">
                You can now configure and evaluate Solar, Wind, and Biomass systems for your building.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <CommonButton
              shape="rounded"
              size="sm"
              to="../solar-energy"
            >
              Solar Energy
            </CommonButton>
            <CommonButton
              variant="outline"
              shape="rounded"
              size="sm"
              to="../wind-energy"
            >
              Wind Energy
            </CommonButton>
            <CommonButton
              variant="outline"
              shape="rounded"
              size="sm"
              to="../biomass-energy"
            >
              Biomass
            </CommonButton>
          </div>
        </CommonBorderWrapper>
      )}
    </div>
  );
};

export default RenewableMicroservices;
