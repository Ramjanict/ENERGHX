import { baseAPI } from "@/store/baseApi/baseApi";
import {
  ApproveProposalPayload,
  ApproveProposalResponse,
  GetProposalResponse,
  ProposalPdfResponse,
} from "./types/proposal";

export const proposalApi = baseAPI.injectEndpoints({
  endpoints: (build) => ({
    getProposal: build.query<GetProposalResponse, void>({
      query: () => ({
        url: "/workflows/consumer/standard/proposal",
        method: "GET",
      }),
      providesTags: ["Proposal"],
    }),

    generateProposal: build.mutation<
      GetProposalResponse,
      void | Record<string, unknown>
    >({
      query: (body) => ({
        url: "/workflows/consumer/standard/proposal",
        method: "POST",
        body: body ?? {},
      }),
      invalidatesTags: ["Proposal"],
    }),

    approveProposal: build.mutation<
      ApproveProposalResponse,
      ApproveProposalPayload | void
    >({
      query: (body) => ({
        url: "/workflows/consumer/standard/proposal",
        method: "POST",
        body: body ?? {},
      }),
      invalidatesTags: ["Proposal", "Contract", "Dashboard"],
    }),

    getProposalPdf: build.query<ProposalPdfResponse | Blob, void>({
      query: () => ({
        url: "/workflows/consumer/standard/proposal/pdf",
        method: "GET",
        responseHandler: async (response) => {
          const contentType = response.headers.get("content-type") ?? "";
          if (contentType.includes("application/json")) {
            return response.json();
          }
          return response.blob();
        },
      }),
      providesTags: ["Proposal"],
    }),
  }),
});

export const {
  useGetProposalQuery,
  useGenerateProposalMutation,
  useApproveProposalMutation,
  useLazyGetProposalPdfQuery,
} = proposalApi;
