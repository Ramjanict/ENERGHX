import CommonBorderWrapper from "@/common/button/CommonBorderWrapper";
import SectionHeader from "@/common/header/SectionHeader";
import { Calendar } from "lucide-react";
import { TimelinePhase } from "./types";

interface ProjectTimelineListProps {
  phases: TimelinePhase[];
}

const ProjectTimelineList: React.FC<ProjectTimelineListProps> = ({
  phases,
}) => {
  const totalWeeks = phases.reduce((sum, p) => sum + p.durationWeeks, 0);
  const totalMonths = (totalWeeks / 4).toFixed(1);

  return (
    <CommonBorderWrapper isShadow>
      <SectionHeader size="xl" title="Project Timeline" />

      <div className="space-y-3">
        {phases.map((phase) => (
          <div
            key={phase.id}
            className="flex flex-col sm:flex-row sm:items-center gap-3 border border-[#E5E7EB] justify-between bg-[#EAF7E6]/30 rounded-xl px-5 py-4"
          >
            <div className="flex items-center gap-4">
              <span
                className={`w-7 h-7 rounded-full text-sm font-bold flex items-center justify-center shrink-0 ${
                  phase.order === 1
                    ? "bg-primary text-white"
                    : "bg-gray-200 text-[#112518]"
                }`}
              >
                {phase.order}
              </span>
              <div>
                <p className="font-bold text-[#112518]">{phase.title}</p>
                <p className="text-sm text-[#758179]">{phase.durationLabel}</p>
              </div>
            </div>
            <div className="flex items-center gap-1.5 text-[#758179] shrink-0">
              <Calendar className="w-4 h-4" />
              <span className="text-sm font-medium">
                {phase.durationWeeks}w
              </span>
            </div>
          </div>
        ))}

        <div className="flex flex-col sm:flex-row gap-3 sm:items-center justify-between bg-[#EAF7E6]/50 rounded-xl px-5 py-4 border border-[#E5E7EB]">
          <p className="font-bold text-[#112518]">Total Project Duration</p>
          <p className="font-bold text-primary text-lg">
            {totalWeeks} weeks (~{totalMonths} months)
          </p>
        </div>
      </div>
    </CommonBorderWrapper>
  );
};

export default ProjectTimelineList;
