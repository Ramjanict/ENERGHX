import { baseAPI } from "@/store/baseApi/baseApi";
import {
  GetResValidationResponse,
  GetResValidationSummaryResponse,
} from "./types/resValidation";
import {
  unwrapResValidationResponse,
  unwrapResValidationSummaryResponse,
} from "./unwrapResValidation";

export const resValidationApi = baseAPI.injectEndpoints({
  endpoints: (build) => ({
    getResValidation: build.query<GetResValidationResponse, void>({
      query: () => ({
        url: "/workflows/consumer/standard/res-validation",
        method: "GET",
      }),
      transformResponse: (response: unknown) =>
        unwrapResValidationResponse(response),
      providesTags: ["ResValidation"],
    }),
    getResValidationSummary: build.query<GetResValidationSummaryResponse, void>(
      {
        query: () => ({
          url: "/workflows/consumer/standard/res-validation/summary",
          method: "GET",
        }),
        transformResponse: (response: unknown) =>
          unwrapResValidationSummaryResponse(response),
        providesTags: ["ResValidation"],
      },
    ),
  }),
});

export const {
  useGetResValidationQuery,
  useGetResValidationSummaryQuery,
} = resValidationApi;
