import { baseAPI } from "@/store/baseApi/baseApi";
import {
  GetCommoditySetupResponse,
  PutCommoditySetupPayload,
  UploadUtilityBillPayload,
  UploadUtilityBillResponse,
} from "./types/commoditySetup";

export const commoditySetupApi = baseAPI.injectEndpoints({
  endpoints: (build) => ({
    getCommoditySetup: build.query<GetCommoditySetupResponse, void>({
      query: () => ({
        url: "/workflows/consumer/standard/commodity-setup",
        method: "GET",
      }),
      providesTags: ["CommoditySetup"],
    }),

    updateCommoditySetup: build.mutation<any, PutCommoditySetupPayload>({
      query: (body) => ({
        url: "/workflows/consumer/standard/commodity-setup",
        method: "PUT",
        body,
      }),
      invalidatesTags: ["CommoditySetup", "Dashboard"],
    }),

    uploadUtilityBill: build.mutation<
      UploadUtilityBillResponse,
      UploadUtilityBillPayload
    >({
      query: ({ metadata, file }) => {
        const formData = new FormData();
        formData.append("metadata", JSON.stringify(metadata));
        formData.append("file", file);

        return {
          url: "/workflows/consumer/standard/commodity-setup/bills",
          method: "POST",
          body: formData,
        };
      },
      invalidatesTags: ["CommoditySetup", "Dashboard"],
    }),
  }),
});

export const {
  useGetCommoditySetupQuery,
  useUpdateCommoditySetupMutation,
  useUploadUtilityBillMutation,
} = commoditySetupApi;
