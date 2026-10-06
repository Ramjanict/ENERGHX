import ProjectProposal from "@/components/consumer/standard/contact/proposal/ProjectProposal";
import { openOrDownloadDocument } from "@/lib/utils";
import { toast } from "react-toastify";

import {
  buildApproveProposalPayload,
  mapCostSummary,
  mapCumulativeSavings,
  mapEngineeringServices,
  mapProposalTimeline,
  mapProposalTopStats,
  mapRecommendedSystems,
  mapSavingsForecast,
  mapSavingsForecastSummary,
} from "@/store/consumer/standard/proposal/mapProposalUi";
import {
  useApproveProposalMutation,
  useGetProposalQuery,
  useLazyGetProposalPdfQuery,
} from "@/store/consumer/standard/proposal/proposalApi";
import { useNavigate } from "react-router-dom";

const openPdfResult = (result: unknown) => {
  if (!result) return;

  if (result instanceof Blob) {
    const url = URL.createObjectURL(result);
    window.open(url, "_blank", "noopener,noreferrer");
    window.setTimeout(() => URL.revokeObjectURL(url), 60_000);
    return;
  }

  if (typeof result === "object") {
    const payload = result as {
      url?: string;
      downloadUrl?: string;
      fileName?: string;
      mimeType?: string;
    };
    const url = payload.downloadUrl || payload.url;
    if (url) {
      openOrDownloadDocument(
        url,
        payload.fileName || "project-proposal",
        payload.mimeType,
      );
    }
  }
};

const ProjectProposalContract = () => {
  const navigate = useNavigate();
  const { data, isLoading } = useGetProposalQuery();
  const [approveProposal, { isLoading: isApproving }] =
    useApproveProposalMutation();
  const [fetchProposalPdf, { isFetching: isDownloading }] =
    useLazyGetProposalPdfQuery();

  const isBlocked =
    data?.status === "BLOCKED" ||
    (Boolean(data?.requiredStep) &&
      data?.requiredStep !== "proposal" &&
      data?.requiredStep !== "contract");

  const requiredStep =
    data?.requiredStep || (isBlocked ? "engineering-review" : undefined);

  const handleApprove = async () => {
    if (isBlocked) {
      toast.error(
        data?.message ||
          `Status: BLOCKED - Required step: ${requiredStep || "engineering-review"} must be completed first.`,
      );
      return;
    }

    try {
      const res = await approveProposal(
        buildApproveProposalPayload(data),
      ).unwrap();
      const payload = res as {
        success?: boolean;
        status?: string;
        message?: string;
        requiredStep?: string;
        error?: string;
        isError?: boolean;
      };
      if (
        payload?.success === false ||
        payload?.status === "BLOCKED" ||
        payload?.status === "FAILED" ||
        payload?.isError === true
      ) {
        console.warn("Proposal approval blocked by backend:", payload);
        toast.error(
          payload?.message ||
            `Status: BLOCKED - Required step: ${payload?.requiredStep || "engineering-review"}`,
        );
        return;
      }
      navigate("../contract-documents");
    } catch (err: any) {
      console.error("Failed to approve proposal:", err);
      toast.error(err?.data?.message || "Failed to approve proposal");
    }
  };

  const handleDownloadPdf = async () => {
    if (isBlocked) {
      toast.error(
        "Engineering review must be approved before proposal PDF generation",
      );
      return;
    }

    try {
      const result = await fetchProposalPdf().unwrap();
      openPdfResult(result);
    } catch (err: any) {
      console.error("Failed to download proposal PDF:", err);
      toast.error(
        err?.data?.message ||
          err?.message ||
          "Failed to download proposal PDF",
      );
    }
  };

  return (
    <div>
      <ProjectProposal
        loading={isLoading}
        isBlocked={isBlocked}
        requiredStep={requiredStep}
        onGoToRequiredStep={
          requiredStep === "engineering-review" || isBlocked
            ? () => navigate("../engineering-review")
            : undefined
        }
        topStats={mapProposalTopStats(data)}
        systems={mapRecommendedSystems(data)}
        engineeringServices={mapEngineeringServices(data)}
        timelinePhases={mapProposalTimeline(data)}
        savingsForecast={mapSavingsForecast(data)}
        cumulativeSavings={mapCumulativeSavings(data)}
        savingsSummary={mapSavingsForecastSummary(data)}
        costSummary={mapCostSummary(data)}
        isApproving={isApproving}
        isDownloading={isDownloading}
        onBackToSystemSizing={() => navigate("../solar-energy")}
        onDownloadProposalPdf={handleDownloadPdf}
        onApproveAndContinue={handleApprove}
      />
    </div>
  );
};

export default ProjectProposalContract;
