import CommonBorderWrapper from "@/common/button/CommonBorderWrapper";
import SectionHeader from "@/common/header/SectionHeader";
import { ProjectSummarySystem } from "./types";

interface ProjectSummarySectionProps {
  systems: ProjectSummarySystem[];
  totalCost: number;
}

const ProjectSummarySection: React.FC<ProjectSummarySectionProps> = ({
  systems,
  totalCost,
}) => {
  return (
    <CommonBorderWrapper isShadow>
      <SectionHeader size="xl" title="Project Summary" />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {systems.map((system) => (
          <div
            key={system.id}
            className="bg-[#EAF7E6]/30 rounded-xl p-5 border border-[#E5E7EB]"
          >
            <SectionHeader
              direction="col-reverse"
              title={system.capacity}
              description={system.label}
            />
            <p className="text-primary font-semibold">
              ${system.cost.toLocaleString()}
            </p>
          </div>
        ))}
      </div>

      <div className="flex flex-col sm:flex-row gap-3 sm:items-center justify-between bg-[#EAF7E6]/50 rounded-xl px-5 py-5 border border-[#E5E7EB]  ">
        <div>
          <p className="text-[#112518] font-medium">Total Project Cost</p>
          <p className="text-sm text-[#758179]">
            Before tax credits and incentives
          </p>
        </div>
        <p className="text-2xl font-extrabold text-[#112518]">
          ${totalCost.toLocaleString()}
        </p>
      </div>
    </CommonBorderWrapper>
  );
};

export default ProjectSummarySection;
