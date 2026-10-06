import CommonBorderWrapper from "@/common/button/CommonBorderWrapper";
import CommonHeader from "@/common/header/CommonHeader";
import SectionHeader from "@/common/header/SectionHeader";
import JourneyStep from "@/components/consumer/basic/dashboard/JourneyStep";

import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ArrowDivider from "./ArrowDivider";

const Journey = () => {
  return (
    <div className="space-y-8">
      <SectionHeader
        title="User Journey by Plan"
        description="Understand your step-by-step journey based on your subscription plan
        "
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <CommonBorderWrapper className="border-2! border-[#F3F4F6]! bg-white! space-y-6">
          <CommonHeader size="2xl" className="font-bold!">
            <div className="w-2.5 h-2.5 rounded-full bg-green-500" />
            Basic Plan Journey
          </CommonHeader>

          <CardContent className="space-y-4">
            <JourneyStep
              num={1}
              title="Audit Microservice"
              desc="Start your journey with a comprehensive building audit"
              items={[
                "Submit building's details and basic information",
                "Receive automated audit assessment",
                "Review energy consumption patterns",
              ]}
            />

            <ArrowDivider />

            <JourneyStep
              num={2}
              title="Renewable Energy Selection"
              desc="Choose your renewable energy solution"
              items={[
                "Access Solar, Wind, or Biomass service",
                "View basic recommendations",
                "Review cost estimates",
              ]}
            />
            <ArrowDivider />
            <JourneyStep
              num={3}
              title="Implementation Report"
              desc="Get your implementation roadmap"
              items={[
                "Download basic implementation guide",
                "Review equipment specifications",
                "Access installation guidelines",
              ]}
            />
          </CardContent>
        </CommonBorderWrapper>

        <CommonBorderWrapper className="border-2! border-[#F3F4F6]! bg-white! ">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-blue-500" />
              <CardTitle className="text-base">Standard Plan Journey</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <JourneyStep
              num={1}
              title="Advanced Audit"
              desc="Comprehensive audit with detailed analysis"
              color="bg-blue-500"
              items={[
                "Submit complete building data",
                "AI-powered analysis and recommendations",
                "Detailed energy consumption breakdown",
                "Cost-benefit analysis",
              ]}
            />
            <ArrowDivider arrowColor="blue" />
            <JourneyStep
              num={2}
              title="Multi-Service Access"
              desc="Access all three renewable energy microservices"
              color="bg-blue-500"
              items={[
                "Compare Solar, Wind and Biomass options",
                "Hybrid solution recommendations",
                "Advanced ROI calculations",
                "Environmental impact assessment",
              ]}
            />
            <ArrowDivider arrowColor="blue" />
            <JourneyStep
              num={3}
              title="Custom Implementation Plan"
              desc="Tailored implementation strategy"
              color="bg-blue-500"
              items={[
                "Detailed project timeline",
                "Budget breakdown and financing options",
                "Contractor recommendations",
                "Ongoing support and monitoring",
              ]}
            />
            <ArrowDivider arrowColor="blue" />
            <JourneyStep
              num={4}
              title="Monitoring & Optimization"
              desc="Continuous performance tracking"
              color="bg-blue-500"
              items={[
                "Real-time energy monitoring",
                "Performance optimization suggestions",
                "Quarterly reports and analysis",
              ]}
            />
          </CardContent>
        </CommonBorderWrapper>
      </div>
    </div>
  );
};

export default Journey;
