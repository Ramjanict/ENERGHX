import { baseAPI } from "@/store/baseApi/baseApi";
import {
  ExecuteContractPayload,
  ExecuteContractResponse,
  GetContractDocumentDetailResponse,
  GetContractDocumentsResponse,
  GetContractResponse,
  ReviewContractDocumentPayload,
  ReviewContractDocumentResponse,
  SubmitContractAcknowledgementPayload,
  SubmitContractAcknowledgementResponse,
} from "./types/contract";

export const contractApi = baseAPI.injectEndpoints({
  endpoints: (build) => ({
    getContract: build.query<GetContractResponse, void>({
      query: () => ({
        url: "/workflows/consumer/standard/contract",
        method: "GET",
      }),
      providesTags: ["Contract"],
    }),

    getContractDocuments: build.query<GetContractDocumentsResponse, void>({
      query: () => ({
        url: "/workflows/consumer/standard/contract/documents",
        method: "GET",
      }),
      providesTags: ["ContractDocuments"],
    }),

    getContractDocumentById: build.query<
      GetContractDocumentDetailResponse,
      string
    >({
      query: (documentId) => ({
        url: `/workflows/consumer/standard/contract/documents/${documentId}`,
        method: "GET",
      }),
      providesTags: (_result, _error, documentId) => [
        { type: "ContractDocuments", id: documentId },
      ],
    }),

    reviewContractDocument: build.mutation<
      ReviewContractDocumentResponse,
      { documentId: string; body: ReviewContractDocumentPayload }
    >({
      query: ({ documentId, body }) => ({
        url: `/workflows/consumer/standard/contract/documents/${documentId}/review`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["ContractDocuments", "Contract"],
    }),

    submitContractAcknowledgement: build.mutation<
      SubmitContractAcknowledgementResponse,
      SubmitContractAcknowledgementPayload
    >({
      query: (body) => ({
        url: "/workflows/consumer/standard/contract",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Contract", "ContractDocuments", "Dashboard"],
    }),

    executeContract: build.mutation<
      ExecuteContractResponse,
      ExecuteContractPayload
    >({
      query: (body) => ({
        url: "/workflows/consumer/standard/contract",
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["Contract", "ContractDocuments", "Dashboard"],
    }),
  }),
});

export const {
  useGetContractQuery,
  useGetContractDocumentsQuery,
  useGetContractDocumentByIdQuery,
  useLazyGetContractDocumentByIdQuery,
  useReviewContractDocumentMutation,
  useSubmitContractAcknowledgementMutation,
  useExecuteContractMutation,
} = contractApi;
