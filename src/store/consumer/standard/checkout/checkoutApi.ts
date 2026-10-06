import { baseAPI } from "@/store/baseApi/baseApi";
import {
  CreatePaymentCheckoutPayload,
  CreatePaymentCheckoutResponse,
  GetCheckoutResponse,
  GetOrderConfirmationResponse,
  StartOrderConfirmationPayload,
  StartOrderConfirmationResponse,
} from "./types/checkout";

export const checkoutApi = baseAPI.injectEndpoints({
  endpoints: (build) => ({
    getCheckout: build.query<GetCheckoutResponse, void>({
      query: () => ({
        url: "/workflows/consumer/standard/checkout",
        method: "GET",
      }),
      providesTags: ["Checkout"],
    }),

    createPaymentCheckout: build.mutation<
      CreatePaymentCheckoutResponse,
      CreatePaymentCheckoutPayload
    >({
      query: (body) => ({
        url: "/payment/checkout",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Checkout", "OrderConfirmation"],
    }),

    getOrderConfirmation: build.query<GetOrderConfirmationResponse, void>({
      query: () => ({
        url: "/workflows/consumer/standard/order-confirmation",
        method: "GET",
      }),
      providesTags: ["OrderConfirmation"],
    }),

    startOrderConfirmation: build.mutation<
      StartOrderConfirmationResponse,
      StartOrderConfirmationPayload
    >({
      query: (body) => ({
        url: "/workflows/consumer/standard/order-confirmation",
        method: "POST",
        body,
      }),
      invalidatesTags: ["OrderConfirmation", "Checkout", "Dashboard"],
    }),
  }),
});

export const {
  useGetCheckoutQuery,
  useCreatePaymentCheckoutMutation,
  useGetOrderConfirmationQuery,
  useStartOrderConfirmationMutation,
} = checkoutApi;
