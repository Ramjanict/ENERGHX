import { baseAPI } from "@/store/baseApi/baseApi";
import {
  CreateAuditPayload,
  EnergyAuditHistoryResponse,
  EnergyAuditResponse,
  GetEnergyAuditHistoryParams,
} from "./types/analysis";

export interface SendEnergyAuditReportPayload {
  file: File;
  email: string;
}

export interface SendEnergyAuditReportResponse {
  message: string;
}

export const analysisApi = baseAPI.injectEndpoints({
  endpoints: (build) => ({
    getEnergyAuditHistory: build.query<
      EnergyAuditHistoryResponse,
      GetEnergyAuditHistoryParams | void
    >({
      query: (params) => ({
        url: `/energy-audits/history`,
        method: "GET",
        params: {
          page: params?.page ?? 1,
          pageSize: params?.pageSize ?? 10,
        },
      }),
      transformResponse: (response: any): EnergyAuditHistoryResponse => {
        if (response?.items && response?.pagination) {
          return {
            items: response.items,
            pagination: response.pagination,
          };
        }
        if (response?.data?.items && response?.data?.pagination) {
          return {
            items: response.data.items,
            pagination: response.data.pagination,
          };
        }
        if (Array.isArray(response?.data)) {
          return {
            items: response.data,
            pagination: {
              page: 1,
              pageSize: response.data.length,
              total: response.data.length,
              pageCount: 1,
            },
          };
        }
        if (Array.isArray(response?.items)) {
          return {
            items: response.items,
            pagination: response?.pagination ?? {
              page: 1,
              pageSize: response.items.length,
              total: response.items.length,
              pageCount: 1,
            },
          };
        }
        return {
          items: [],
          pagination: { page: 1, pageSize: 10, total: 0, pageCount: 0 },
        };
      },
      providesTags: ["Audit"],
    }),

    startAudit: build.mutation<EnergyAuditResponse, CreateAuditPayload>({
      query: (audit) => ({
        url: `/analysis/v3/energy/audit`,
        method: "POST",
        body: audit,
      }),
      invalidatesTags: ["Audit"],
    }),

    sendEnergyAuditReport: build.mutation<
      SendEnergyAuditReportResponse,
      SendEnergyAuditReportPayload
    >({
      query: ({ file, email }) => {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("email", email);

        return {
          url: `/analysis/energy/audit/report`,
          method: "POST",
          body: formData,
        };
      },
    }),
  }),
});

export const {
  useGetEnergyAuditHistoryQuery,
  useStartAuditMutation,
  useSendEnergyAuditReportMutation,
} = analysisApi;
