import CommonBorderWrapper from "@/common/button/CommonBorderWrapper";
import CommonButton from "@/common/button/CommonButton";
import SectionHeader from "@/common/header/SectionHeader";
import BMiniCard from "@/components/consumer/basic/building/card/BMiniCard";
import Welcome from "@/components/consumer/basic/dashboard/Welcome";
import AdvancedEngineeringModules from "@/components/consumer/standard/SDashboard/AdvancedEngineeringModules";
import DeveloperAssignmentSection from "@/components/consumer/standard/SDashboard/DeveloperAssignmentSection";
import ImplementationWorkflow from "@/components/consumer/standard/SDashboard/ImplementationWorkflow";
import RenewableEngineeringSizing from "@/components/consumer/standard/SDashboard/RenewableEngineeringSizing";
import SavingsImpactCards from "@/components/consumer/standard/SDashboard/SavingsImpactCards";
import {
  useGetDashboardQuery,
  useUtilityPermissionsMutation,
} from "@/store/consumer/standard/POTENTIALLY OBSOLETE/potentiallyApi";

const SDashboard = () => {
  const { data, isLoading } = useGetDashboardQuery();

  const [utilityPermissions, { isLoading: isUtilityLoading }] =
    useUtilityPermissionsMutation();

  const handleUtilityPermission = async () => {
    try {
      if (!data) return;
      await utilityPermissions({
        status: "COMPLETED",
        completed: true,
        authorized: true,
        utilityId: data?.id ?? "",
        commodityId: data?.userId ?? "",
        consentGiven: true,
        signedAt: Date.now().toString(),
      }).unwrap();
    } catch (err) {
      console.error("Failed to start audit:", err);
    }
  };

  const planStatus = data?.standardPlanStatus;
  const building = planStatus?.building;
  const metrics = planStatus?.metrics;

  return (
    <div className="space-y-4 md:space-y-6 lg:space-y-12">
      <Welcome
        title="Standard Plan Dashboard"
        description="Professional energy engineering and sustainability planning platform"
        variant="secondary"
        actions={
          <>
            <CommonButton variant="primaryBlue" size="lg">
              Add Services
            </CommonButton>

            <CommonButton variant="outlineBlue">
              View Basic Analysis
            </CommonButton>
          </>
        }
      />

      <DeveloperAssignmentSection />

      <CommonBorderWrapper isShadow>
        <div className="flex items-start flex-col sm:flex-row justify-between gap-3 ">
          <div>
            <SectionHeader
              title="Standard Plan Status"
              description={
                building?.name
                  ? `Building: ${building.name} • ${building.location}`
                  : "Building: Main Office Complex • Lagos, Nigeria"
              }
            />
          </div>
          <CommonButton className="bg-[#2DAD001A]/50! text-[#2DAD00]!">
            {planStatus?.status ?? "Active"}
          </CommonButton>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-4">
          <BMiniCard
            label="Energy Score"
            value={
              metrics?.energyScore?.value != null
                ? `${metrics.energyScore.value}`
                : "92"
            }
            valueClass="text-green-600"
            des={
              metrics?.energyScore?.outOf != null
                ? `out of ${metrics.energyScore.outOf}`
                : "out of 100"
            }
            className=" border-[#2DAD00]/20! bg-[linear-gradient(135deg,_rgba(45,173,0,0.10)_0%,_rgba(45,173,0,0.05)_100%)]"
          />
          <BMiniCard
            label="ZER Index"
            value={
              metrics?.zerIndex?.value != null
                ? `${metrics.zerIndex.value}${metrics.zerIndex.unit ?? "%"}`
                : "95%"
            }
            valueClass="text-blue-600"
            des="renewable coverage"
            className=" border-[#155DFC]/20 bg-[linear-gradient(135deg,_rgba(21,93,252,0.10)_0%,_rgba(21,93,252,0.05)_100%)]"
          />
          <BMiniCard
            label="Monthly Usage"
            value={
              metrics?.monthlyUsage?.value != null
                ? metrics.monthlyUsage.value.toLocaleString()
                : "1,950"
            }
            des={`${metrics?.monthlyUsage?.unit ?? "kWh"} average`}
            className="bg-[#EAF7E6]/50"
          />
          <BMiniCard
            label="Annual Savings"
            value={
              metrics?.annualSavings?.value != null
                ? `$${metrics.annualSavings.value.toLocaleString()}`
                : "$8,920"
            }
            valueClass="text-green-600"
            des="first year"
            className="bg-[linear-gradient(135deg,_rgba(0,166,62,0.10)_0%,_rgba(0,166,62,0.05)_100%)] border-[#00A63E]/20! "
          />
          <BMiniCard
            label="Payback Period"
            value={
              metrics?.paybackPeriod?.value != null
                ? `${metrics.paybackPeriod.value}`
                : "9.8"
            }
            des={`${metrics?.paybackPeriod?.unit ?? "years"}`}
            className="bg-[#EAF7E6]/50"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <BMiniCard
            label="EUI"
            value={
              metrics?.eui?.value != null ? `${metrics.eui.value}` : "42.3"
            }
            des={`${metrics?.eui?.unit ?? "kBtu/ft²/yr"}`}
            className="bg-[#EAF7E6]/50"
          />
          <BMiniCard
            label="Efficiency Rating"
            value={metrics?.efficiencyRating?.value ?? "A+"}
            valueClass="text-green-600"
            des="Top 5% performance"
            className="bg-[#EAF7E6]/50"
          />
          <BMiniCard
            label="CO₂ Reduction"
            value={
              metrics?.co2Reduction?.value != null
                ? `${metrics.co2Reduction.value}`
                : "22.1"
            }
            des={`${metrics?.co2Reduction?.unit ?? "tons/year"}`}
            className="bg-[#EAF7E6]/50"
          />
          <BMiniCard
            label="System Capacity"
            value={
              metrics?.systemCapacity?.value != null
                ? `${metrics.systemCapacity.value}`
                : "52.5"
            }
            des={`${metrics?.systemCapacity?.unit ?? "kW total"}`}
            className="bg-[#EAF7E6]/50"
          />
        </div>
      </CommonBorderWrapper>
      <Welcome
        title="Utility Data Connection Required"
        description=" Connect your utility provider to automatically import electricity and
        gas consumption data."
        variant="secondary"
        isConnected
        actions={
          <>
            <CommonButton
              onClick={handleUtilityPermission}
              variant="primaryBlue"
              size="lg"
              isLoading={isUtilityLoading}
              loadingText="Loading..."
            >
              Request Permission
            </CommonButton>
          </>
        }
      />
      <AdvancedEngineeringModules
        advancedEngineeringModules={data?.advancedEngineeringModules}
      />

      <RenewableEngineeringSizing
        data={data?.renewableEngineeringSizing}
        status={data?.renewableEngineeringSizing?.status}
      />
      <ImplementationWorkflow workflowData={data?.implementationWorkflow} />
      <SavingsImpactCards
        potentialAdditionalSavings={
          data?.implementationWorkflow?.potentialAdditionalSavings
        }
        enhancedCo2Reduction={
          data?.implementationWorkflow?.enhancedCo2Reduction
        }
      />
    </div>
  );
};

export default SDashboard;
