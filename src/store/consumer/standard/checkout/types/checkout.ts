export interface CheckoutPaymentOption {
  key: string;
  amount: number | null;
  billingPeriod: string;
  selected?: boolean;
  termMonths?: number;
  termYears?: number;
  apr?: number;
}

export interface CheckoutOrderItem {
  id?: string;
  key?: string;
  label?: string;
  name?: string;
  title?: string;
  amount?: number | null;
  cost?: number | null;
}

export interface CheckoutOrderSummary {
  items: CheckoutOrderItem[];
  subtotal: number;
  taxCreditsAndIncentives: number;
  total: number;
  currency: string;
}

export interface CheckoutPaymentInfo {
  amount: number;
  amountCents: number;
  currency: string;
  workflowId: string;
  proposalId: string;
}

export interface CheckoutContractReady {
  agreementAccepted: boolean;
  documentsReviewed: boolean;
  checkoutEnabled: boolean;
}

export interface GetCheckoutResponse {
  paymentOptions: CheckoutPaymentOption[];
  orderSummary: CheckoutOrderSummary;
  payment: CheckoutPaymentInfo;
  contractReady: CheckoutContractReady;
}

export interface CreatePaymentCheckoutPayload {
  workflowId: string;
  proposalId: string;
}

export interface CreatePaymentCheckoutResponse {
  id?: string;
  url?: string;
  checkoutUrl?: string;
  checkoutSessionId?: string;
  sessionId?: string;
  sessionUrl?: string;
  data?: {
    id?: string;
    url?: string;
    checkoutUrl?: string;
    checkoutSessionId?: string;
    sessionId?: string;
  };
}

export interface GetOrderConfirmationResponse {
  status: string;
  confirmed: boolean;
  orderId: string;
  checkoutSessionId: string | null;
  paymentStatus: string;
  invoiceUrl: string | null;
  receiptUrl: string | null;
  reportUrl: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface StartOrderConfirmationPayload {
  status: "CHECKOUT_STARTED" | "ORDER_CONFIRMED" | string;
  paymentStatus: "PENDING" | "SUCCESS" | "FAILED" | string;
  checkoutSessionId: string;
  invoiceUrl: string | null;
  receiptUrl: string | null;
  reportUrl: string | null;
}

export type StartOrderConfirmationResponse = GetOrderConfirmationResponse;
