import CommonBorderWrapper from "@/common/button/CommonBorderWrapper";
import SectionHeader from "@/common/header/SectionHeader";
import { TimelinePhase } from "./types";

interface ImplementationTimelineSectionProps {
  phases: TimelinePhase[];
  totalDuration: string;
}

const ImplementationTimelineSection: React.FC<
  ImplementationTimelineSectionProps
> = ({ phases, totalDuration }) => {
  return (
    <CommonBorderWrapper isShadow>
      <SectionHeader size="xl" title="Implementation Timeline" />

      <div className="space-y-4">
        {phases.map((phase) => (
          <div key={phase.id} className="flex items-start gap-3">
            <span className="w-7 h-7 rounded-full bg-primary text-white text-sm font-bold flex items-center justify-center shrink-0">
              {phase.order}
            </span>
            <div>
              <SectionHeader
                size="lg"
                title={phase.title}
                description={phase.durationLabel}
              />
            </div>
          </div>
        ))}

        <div className="bg-[#EAF7E6]/30 rounded-xl px-5 py-4">
          <p className="font-medium text-[#112518]">
            Total Project Duration: {totalDuration}
          </p>
        </div>
      </div>
    </CommonBorderWrapper>
  );
};

export default ImplementationTimelineSection;
