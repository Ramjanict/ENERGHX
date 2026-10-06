import CommonBorderWrapper from "@/common/button/CommonBorderWrapper";
import CommonButton from "@/common/button/CommonButton";
import SectionHeader from "@/common/header/SectionHeader";

const RenewableEnergy = () => {
  return (
    <CommonBorderWrapper className="bg-primary-green/5!  border-primary-green/20! space-y-4">
      <SectionHeader
        title="Renewable Energy Recommendations"
        description="  Based on your current appliance usage of 820 kWh/month, we recommend a
        10.2 kW solar system that would cover 95% of your energy needs. Combined
        with wind and biomass solutions, you could achieve 100% renewable energy
        coverage."
      />

      <div className="flex flex-wrap gap-3">
        <CommonButton className="" to="../../solar-energy">
          View Solar Analysis
        </CommonButton>
        <CommonButton variant="outline" className="" to="../../analysis">
          View Full Energy Report
        </CommonButton>
      </div>
    </CommonBorderWrapper>
  );
};

export default RenewableEnergy;
