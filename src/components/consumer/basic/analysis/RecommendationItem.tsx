import SectionHeader from "@/common/header/SectionHeader";
import React from "react";

interface RecommendationItemProps {
  index: number;
  title: string;
  description: string;
}

const RecommendationItem: React.FC<RecommendationItemProps> = ({
  index,
  title,
  description,
}) => {
  return (
    <div className="flex gap-3">
      <span className="shrink-0 w-6 h-6 rounded-full bg-primary text-white text-xs font-bold flex items-center justify-center mt-0.5">
        {index}
      </span>
      <div>
        <SectionHeader size="md" title={title} description={description} />
      </div>
    </div>
  );
};

export default RecommendationItem;
