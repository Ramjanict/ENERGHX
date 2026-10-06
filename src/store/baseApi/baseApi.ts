import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { toast } from "react-toastify";
import { RootState } from "../store";

// Original baseQueryAPI
const baseQueryAPI = fetchBaseQuery({
  baseUrl: import.meta.env.VITE_API_URL,
  // credentials: "include", // sends the httpOnly refresh-token cookie
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).auth.token;
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
    return headers;
  },
});

const baseQueryWithToasts: typeof baseQueryAPI = async (
  args,
  api,
  extraOptions: any,
) => {
  const result = await baseQueryAPI(args, api, extraOptions);

  const method =
    typeof args === "object" && "method" in args ? args.method : "GET";

  if (method !== "GET") {
    if (
      result?.data &&
      typeof result.data === "object"
    ) {
      const dataObj = result.data as {
        message?: string;
        success?: boolean;
        status?: string;
        requiredStep?: string;
        error?: string;
        isError?: boolean;
        executionUnlocked?: boolean;
      };
      const isBlocked = dataObj.status === "BLOCKED";
      const isBlockedOrError =
        dataObj.success === false ||
        isBlocked ||
        dataObj.status === "ERROR" ||
        dataObj.status === "FAILED" ||
        dataObj.isError === true;

      let message = dataObj.message || (dataObj.success === false ? dataObj.error : undefined);
      if (!message && isBlocked) {
        message = dataObj.requiredStep
          ? `Status: BLOCKED - Required step: ${dataObj.requiredStep}`
          : "Status: BLOCKED - Action blocked by server.";
      }

      if (message && !extraOptions?.silent) {
        if (isBlockedOrError) {
          toast.error(message);
        } else if (method === "DELETE") {
          toast.warning(message);
        } else {
          toast.success(message);
        }
      }
    }
  } else if (result?.data && typeof result.data === "object") {
    const dataObj = result.data as {
      message?: string;
      status?: string;
      requiredStep?: string;
    };
    if (dataObj.status === "BLOCKED" && !extraOptions?.silent) {
      const message =
        dataObj.message ||
        (dataObj.requiredStep
          ? `Status: BLOCKED - Required step: ${dataObj.requiredStep}`
          : "Status: BLOCKED");
      toast.error(message);
    }
  }

  if (result?.error && !extraOptions?.silent) {
    const errorData = result.error.data as {
      message?: string;
      error?: string;
    };
    const isSessionExpired =
      result.error.status === 401 && errorData?.error === "Unauthorized";

    const shouldToastError =
      method !== "GET" ||
      result.error.status === 400 ||
      extraOptions?.showErrorToast;

    if (!isSessionExpired && shouldToastError) {
      toast.error(
        errorData?.message || "Something went wrong. Please try again.",
      );
    }
  }

  return result;
};

export const baseAPI = createApi({
  reducerPath: "baseAPI",
  baseQuery: baseQueryWithToasts,
  tagTypes: [
    "Program",
    "Course",
    "Content",
    "Module",
    "BasicContent",
    "Quiz",
    "Review",
    "Payment",
    "Admin",
    "Country",
    "State",
    "User",
    "Buildings",
    "Room",
    "EV",
    "BuildingTypes",
    "SubBuildingsTypes",
    "Progress",
    "Appliance",
    "Associates",
    "Audit",
    "ZevSimulation",
    "NzebSimulation",
    "Dashboard",
    "FVMSimulation",

    // standard
    "SolarCategories",
    "SolarProducts",
    "SolarProductDetail",
    "WindCategories",
    "WindProducts",
    "WindProductDetail",
    "BiomassCategories",
    "BiomassProducts",
    "BiomassProductDetail",
    "EvCategories",
    "EvProducts",
    "EvProductDetail",
    "HvacCategories",
    "HvacProducts",
    "HvacProductDetail",
    "BatteryCategories",
    "BatteryProducts",
    "BatteryProductDetail",
    "EngineeringServicesCatalog",
    "ConsumerEngineeringServices",
    "DesignCatalogs",
    "DesignProductCategories",
    "DesignProducts",
    "CommoditySetup",
    "ResValidation",
    "EngineeringReview",
    "Contract",
    "ContractDocuments",
    "Proposal",
    "Checkout",
    "OrderConfirmation",
  ],

  endpoints: () => ({}),
});
