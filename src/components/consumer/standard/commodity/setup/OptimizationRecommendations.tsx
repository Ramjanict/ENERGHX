import CommonBorderWrapper from "@/common/button/CommonBorderWrapper";
import SectionHeader from "@/common/header/SectionHeader";
import { ZevRecommendation } from "@/store/consumer/standard/Simulations/types/zev/zev";
import { useNavigate } from "react-router-dom";
import RecommendationCard from "../zev/RecommendationCard";

interface Props {
  recommendations: ZevRecommendation[] | null | undefined;
}

interface VariantTheme {
  wrapperClassName: string;
  borderClassName: string;
  footerClassName: string;
}

const VARIANT_THEMES: Record<string, VariantTheme> = {
  success: {
    wrapperClassName: "bg-green-50",
    borderClassName: "border-green-100",
    footerClassName: "text-[#00A63E]",
  },
  info: {
    wrapperClassName: "bg-blue-50",
    borderClassName: "border-blue-100",
    footerClassName: "text-[#155DFC]",
  },
  warning: {
    wrapperClassName: "bg-amber-50",
    borderClassName: "border-amber-100",
    footerClassName: "text-[#B45309]",
  },
};

const DEFAULT_THEME: VariantTheme = {
  wrapperClassName: "bg-gray-50",
  borderClassName: "border-[#E7E9E8]",
  footerClassName: "text-[#112518]",
};

const OptimizationRecommendations: React.FC<Props> = ({ recommendations }) => {
  const navigate = useNavigate();
  const items = recommendations ?? [];

  const handleAction = (recommendation: ZevRecommendation) => {
    if (recommendation.action.type === "navigate") {
      navigate(recommendation.action.link);
    }
  };

  return (
    <CommonBorderWrapper isShadow>
      <SectionHeader size="xl" title="Optimization Recommendations" />

      {items.length === 0 ? (
        <p className="text-sm text-[#758179] py-6 text-center">
          No optimization recommendations yet. Run the simulation to generate
          them.
        </p>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {items.map((recommendation) => {
            const theme =
              VARIANT_THEMES[recommendation.variant] ?? DEFAULT_THEME;

            return (
              <RecommendationCard
                key={recommendation.id}
                title={recommendation.heading}
                description={recommendation.body}
                footer={recommendation.action.text}
                onFooterClick={() => handleAction(recommendation)}
                footerClassName={theme.footerClassName}
                wrapperClassName={theme.wrapperClassName}
                borderClassName={theme.borderClassName}
              />
            );
          })}
        </div>
      )}
    </CommonBorderWrapper>
  );
};

export default OptimizationRecommendations;
