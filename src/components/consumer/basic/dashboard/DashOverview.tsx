import CommonButton from "@/common/button/CommonButton";
import FeatureCard from "@/components/consumer/basic/dashboard/FeatureCard";
import { FaArrowRightLong } from "react-icons/fa6";

import CommonBorderWrapper from "@/common/button/CommonBorderWrapper";
import SectionHeader from "@/common/header/SectionHeader";
import { FaArrowTrendUp } from "react-icons/fa6";
import { LuFileSearch, LuFileText } from "react-icons/lu";
import { TbAlertCircle } from "react-icons/tb";

const DashOverview = () => {
  return (
    <CommonBorderWrapper isShadow className="">
      <SectionHeader
        title="Audit Microservice Overview"
        description="Our comprehensive audit system analyzes your building's energy performance and provides actionable insights for optimization."
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 ">
        <FeatureCard
          icon={<LuFileSearch className="w-full h-full" />}
          iconBgClassName="bg-primary-green/12"
          iconColorClassName="text-primary-green"
          title="System Analysis"
          description="Deep analysis of your building's energy consumption patterns and infrastructure"
        />
        <FeatureCard
          icon={<FaArrowTrendUp className="w-full h-full" />}
          iconBgClassName="bg-[#3B82F6]/12"
          iconColorClassName="text-[#3B82F6]"
          title="Performance Check"
          description="Evaluate efficiency metrics and identify areas of energy waste"
        />
        <FeatureCard
          icon={<TbAlertCircle className="w-full h-full" />}
          iconBgClassName="bg-[#F59E0B]/12"
          iconColorClassName="text-[#F59E0B]"
          title="Issue Detection"
          description="Identify critical issues affecting your building's energy performance"
        />
        <FeatureCard
          icon={<LuFileText className="w-full h-full" />}
          iconBgClassName="bg-[#8B5CF6]/12"
          iconColorClassName="text-[#8B5CF6]"
          title="Report Generation"
          description="Detailed reports with recommendations and renewable energy options"
        />
      </div>

      <div className="flex justify-center">
        <CommonButton
          size="xl"
          shape="rounded"
          rightIcon={<FaArrowRightLong className="w-4 h-4" />}
          to="../analysis"
        >
          Start Your Audit Now
        </CommonButton>
      </div>
    </CommonBorderWrapper>
  );
};

export default DashOverview;
