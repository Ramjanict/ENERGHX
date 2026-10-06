import ContractDocumentsReview from "@/components/consumer/standard/contact/report/ContractDocumentsReview";
import { AcknowledgementState } from "@/components/consumer/standard/contact/report/types";
import {
  useGetContractDocumentsQuery,
  useLazyGetContractDocumentByIdQuery,
  useReviewContractDocumentMutation,
  useSubmitContractAcknowledgementMutation,
} from "@/store/consumer/standard/contract/contractApi";
import {
  mapAcknowledgementState,
  mapRequiredDocuments,
  mapReviewedIds,
  mapSelectionCriteria,
} from "@/store/consumer/standard/contract/mapContractUi";
import { openOrDownloadDocument } from "@/lib/utils";
import { useMemo } from "react";
import { useNavigate } from "react-router-dom";

const ContractDocuments = () => {
  const navigate = useNavigate();
  const { data, isLoading } = useGetContractDocumentsQuery();
  const [reviewDocument, { isLoading: isReviewing }] =
    useReviewContractDocumentMutation();
  const [submitAcknowledgement, { isLoading: isExecuting }] =
    useSubmitContractAcknowledgementMutation();
  const [fetchDocumentDetail] = useLazyGetContractDocumentByIdQuery();

  const documents = useMemo(() => mapRequiredDocuments(data), [data]);
  const selectionCriteria = useMemo(() => mapSelectionCriteria(data), [data]);
  const reviewedIds = useMemo(() => mapReviewedIds(data), [data]);
  const acknowledgement = useMemo(() => mapAcknowledgementState(data), [data]);

  const handleReviewDocument = async (
    documentId: string,
    signatoryInfo: {
      fullName: string;
      email: string;
      date: string;
    },
    signature: { type: "draw" | "type" | "upload"; value: string },
  ) => {
    const defaultName = "Authorized Reviewer";
    const defaultEmail = "reviewer@energhx.com";
    const today = new Date().toISOString().split("T")[0];

    await reviewDocument({
      documentId,
      body: {
        status: "REVIEWED",
        signatory: {
          fullLegalName: signatoryInfo.fullName?.trim() || defaultName,
          email: signatoryInfo.email?.trim() || defaultEmail,
          date: signatoryInfo.date || today,
        },
        signature: signature.value
          ? signature
          : { type: "type", value: signatoryInfo.fullName?.trim() || defaultName },
      },
    }).unwrap();
  };

  const handleDownloadDocument = async (doc: {
    id: string;
    title?: string;
    fileName?: string;
    mimeType?: string;
    downloadUrl?: string;
  }) => {
    if (doc.downloadUrl) {
      await openOrDownloadDocument(
        doc.downloadUrl,
        doc.fileName || doc.title,
        doc.mimeType,
      );
      return;
    }

    try {
      const detail = await fetchDocumentDetail(doc.id).unwrap();
      const url = detail.file?.downloadUrl;
      if (url) {
        await openOrDownloadDocument(
          url,
          detail.file?.fileName || doc.fileName || doc.title,
          detail.file?.mimeType || doc.mimeType,
        );
      }
    } catch (err) {
      console.error("Failed to download document:", err);
    }
  };

  const handleExecuteContract = async (
    acknowledgementState: AcknowledgementState,
  ) => {
    try {
      const res = await submitAcknowledgement({
        acknowledgement: true,
        checks: {
          reviewedRequiredDocuments: acknowledgementState.reviewedAllDocuments,
          acknowledgedDisclosures:
            acknowledgementState.acknowledgedDisclosures,
          agreedToExecution: acknowledgementState.agreedToProceed,
        },
      }).unwrap();

      const payload = res as {
        success?: boolean;
        status?: string;
        executionUnlocked?: boolean;
        error?: string;
        isError?: boolean;
      };

      if (
        payload?.success === false ||
        payload?.status === "BLOCKED" ||
        payload?.status === "FAILED" ||
        payload?.isError === true ||
        payload?.executionUnlocked === false
      ) {
        console.warn("Progression to contract blocked by backend:", payload);
        return;
      }

      navigate("../contract-process");
    } catch (err) {
      console.error("Failed to execute contract acknowledgement:", err);
    }
  };

  return (
    <ContractDocumentsReview
      loading={isLoading}
      selectionCriteria={selectionCriteria}
      documents={documents}
      initialReviewedIds={reviewedIds}
      initialAcknowledgement={acknowledgement}
      isReviewing={isReviewing}
      isExecuting={isExecuting}
      onReviewDocument={handleReviewDocument}
      onDownloadDocument={handleDownloadDocument}
      onBackToProposal={() => navigate("../project-proposal")}
      onExecuteContract={handleExecuteContract}
    />
  );
};

export default ContractDocuments;
