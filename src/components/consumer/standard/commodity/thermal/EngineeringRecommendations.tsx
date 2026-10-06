import CommonBorderWrapper from "@/common/button/CommonBorderWrapper";
import CommonHeader from "@/common/header/CommonHeader";
import { FvmRecommendation } from "@/store/consumer/standard/Simulations/types/fvm/fvm";
import React from "react";
import RecommendationCard from "../zev/RecommendationCard";

interface Props {
  recommendations: FvmRecommendation[] | null | undefined;
}

const THEMES = [
  {
    wrapperClassName: "bg-orange-50",
    borderClassName: "border-orange-100",
    badgeClassName: "bg-orange-500",
    footerClassName: "text-orange-600",
  },
  {
    wrapperClassName: "bg-blue-50",
    borderClassName: "border-blue-100",
    badgeClassName: "bg-blue-600",
    footerClassName: "text-blue-600",
  },
];

const EngineeringRecommendations: React.FC<Props> = ({ recommendations }) => {
  const items = recommendations ?? [];

  return (
    <CommonBorderWrapper isShadow>
      <CommonHeader size="xl">Engineering Recommendations</CommonHeader>

      {items.length === 0 ? (
        <p className="text-sm text-[#758179] py-6 text-center">
          No engineering recommendations yet. Run the simulation to generate
          them.
        </p>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {items.map((rec, index) => {
            const theme = THEMES[index % THEMES.length];
            const footer = rec.estimatedSavings
              ? `Est. Savings: ${rec.estimatedSavings}`
              : rec.comfortImprovement
                ? `Comfort Improvement: ${rec.comfortImprovement}`
                : undefined;

            return (
              <RecommendationCard
                key={`${rec.title}-${index}`}
                number={index + 1}
                title={rec.title}
                description={rec.description}
                footer={footer}
                wrapperClassName={theme.wrapperClassName}
                borderClassName={theme.borderClassName}
                badgeClassName={theme.badgeClassName}
                footerClassName={theme.footerClassName}
              />
            );
          })}
        </div>
      )}
    </CommonBorderWrapper>
  );
};

export default EngineeringRecommendations;
