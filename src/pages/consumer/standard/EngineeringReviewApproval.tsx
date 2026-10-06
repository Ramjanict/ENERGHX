import ReviewApproval from "@/components/consumer/standard/validation/engineering/ReviewApproval";
import {
  useGetEngineeringReviewQuery,
  useGetEngineeringReviewStatusQuery,
} from "@/store/consumer/standard/engineeringReview/engineeringReviewApi";
import { normalizeEngineeringReview } from "@/store/consumer/standard/engineeringReview/unwrapEngineeringReview";
import { useGenerateProposalMutation } from "@/store/consumer/standard/proposal/proposalApi";
import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const EngineeringReviewApproval = () => {
  const navigate = useNavigate();
  const { data, isLoading } = useGetEngineeringReviewQuery();
  const { data: statusData, isLoading: isStatusLoading } =
    useGetEngineeringReviewStatusQuery();
  const [generateProposal, { isLoading: isGenerating }] =
    useGenerateProposalMutation();

  const engineeringReview = useMemo(() => {
    // transformResponse already normalizes; only fall back if missing
    const base = data?.engineeringReview ?? normalizeEngineeringReview(null);
    if (!statusData) return base;

    return {
      ...base,
      hero: {
        ...base.hero,
        status: statusData.status || base.hero.status,
      },
      approvalStatus: statusData,
    };
  }, [data, statusData]);

  const handleGenerateFinalProposal = async () => {
    try {
      const res = await generateProposal().unwrap();
      const payload = res as any;
      if (
        payload?.status === "BLOCKED" ||
        payload?.success === false ||
        payload?.isError === true
      ) {
        toast.error(
          payload?.message ||
            `Status: BLOCKED - Required step: ${payload?.requiredStep || "engineering-review"}`,
        );
        return;
      }
      navigate("../project-proposal");
    } catch (err: any) {
      console.log("Proposal generation error:", err);
      toast.error(err?.data?.message || "Failed to generate proposal");
    }
  };

  const loading = isLoading || isStatusLoading || isGenerating;
  return (
    <ReviewApproval
      engineeringReview={engineeringReview}
      onBackToValidation={() => navigate("../res-sequence-validation")}
      onGenerateFinalProposal={handleGenerateFinalProposal}
      loading={loading}
    />
  );
};

export default EngineeringReviewApproval;
