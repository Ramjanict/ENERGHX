import CommonBorderWrapper from "@/common/button/CommonBorderWrapper";
import SectionHeader from "@/common/header/SectionHeader";
import BMiniCard from "@/components/consumer/basic/building/card/BMiniCard";
import { CheckCircle2, DollarSign } from "lucide-react";
import { ProjectedSavings } from "./types";

interface ProjectedSavingsSectionProps {
  savings: ProjectedSavings;
}

const formatMoney = (value: number | null) =>
  value === null || value === undefined ? "--" : `$${value.toLocaleString()}`;

const formatYears = (value: number | null) =>
  value === null || value === undefined ? "--" : `${value} years`;

const ProjectedSavingsSection: React.FC<ProjectedSavingsSectionProps> = ({
  savings,
}) => {
  return (
    <CommonBorderWrapper isShadow>
      <SectionHeader size="xl" title="Projected Savings" />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:grid-cols-3">
        <BMiniCard
          layout="stacked"
          icon={DollarSign}
          label="Annual Savings"
          value={formatMoney(savings.annualSavings)}
          bgClassName="bg-[#EAF7E6]/30"
          iconColorClassName="text-primary"
          iconBgClassName="bg-transparent"
          className="flex flex-col items-center justify-center gap-1"
          iconClassName="mx-auto"
          valueClass="text-primary! font-bold!"
        />

        <BMiniCard
          layout="stacked"
          icon={CheckCircle2}
          label="Payback Period"
          value={formatYears(savings.paybackYears)}
          bgClassName="bg-[#EAF7E6]/30"
          iconColorClassName="text-primary"
          iconBgClassName="bg-transparent"
          className="flex flex-col items-center justify-center gap-1 "
          iconClassName="mx-auto"
          valueClass="text-[#112518]"
        />

        <BMiniCard
          layout="stacked"
          icon={DollarSign}
          label="25-Year Savings"
          value={formatMoney(savings.twentyFiveYearSavings)}
          bgClassName="bg-[#EAF7E6]/30"
          iconColorClassName="text-primary"
          iconBgClassName="bg-transparent"
          className="flex flex-col items-center justify-center gap-1"
          iconClassName="mx-auto"
          valueClass="text-primary! font-bold!"
        />
      </div>
    </CommonBorderWrapper>
  );
};

export default ProjectedSavingsSection;
