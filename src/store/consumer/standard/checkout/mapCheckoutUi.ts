import {
  NET_TOTAL,
  ORDER_SUMMARY,
  PAYMENT_OPTIONS,
} from "@/components/consumer/standard/contact/checkout/data";
import {
  OrderSummaryData,
  PaymentMethod,
  PaymentOption,
} from "@/components/consumer/standard/contact/checkout/types";
import {
  CheckoutPaymentOption,
  CreatePaymentCheckoutResponse,
  GetCheckoutResponse,
} from "./types/checkout";

const OPTION_META: Record<
  string,
  {
    id: PaymentMethod;
    title: string;
    fallbackAmountLabel: string;
    fallbackDescription: string;
  }
> = {
  "pay-in-full": {
    id: "payInFull",
    title: "Pay in Full",
    fallbackAmountLabel: PAYMENT_OPTIONS[0].amountLabel,
    fallbackDescription: "One-time payment, no interest",
  },
  financing: {
    id: "financing",
    title: "Financing",
    fallbackAmountLabel: PAYMENT_OPTIONS[1].amountLabel,
    fallbackDescription: PAYMENT_OPTIONS[1].description,
  },
  "solar-lease": {
    id: "lease",
    title: "Solar Lease",
    fallbackAmountLabel: PAYMENT_OPTIONS[2].amountLabel,
    fallbackDescription: PAYMENT_OPTIONS[2].description,
  },
};

const formatMoney = (amount: number | null | undefined) => {
  if (amount === null || amount === undefined) return null;
  return `$${amount.toLocaleString()}`;
};

const formatOptionAmountLabel = (option: CheckoutPaymentOption) => {
  const money = formatMoney(option.amount);
  if (option.billingPeriod === "month") {
    return money ? `${money}/mo` : null;
  }
  return money;
};

const formatOptionDescription = (option: CheckoutPaymentOption) => {
  if (option.key === "financing") {
    const months = option.termMonths ? `${option.termMonths} months` : null;
    const apr =
      typeof option.apr === "number" ? `${option.apr}% APR` : null;
    const parts = [apr, "subject to credit approval"].filter(Boolean);
    return {
      title: months ? `Financing (${months})` : "Financing",
      description: parts.join(", "),
    };
  }

  if (option.key === "solar-lease") {
    const years = option.termYears ? `${option.termYears} years` : null;
    return {
      title: years ? `Solar Lease (${years})` : "Solar Lease",
      description: "Zero down, option to purchase after lease term",
    };
  }

  return {
    title: "Pay in Full",
    description: "One-time payment, no interest",
  };
};

export const mapPaymentOptions = (
  data?: GetCheckoutResponse | null,
): PaymentOption[] => {
  if (!data?.paymentOptions) return PAYMENT_OPTIONS;

  return data.paymentOptions.map((option, index) => {
    const meta = OPTION_META[option.key] ?? {
      id: (["payInFull", "financing", "lease"] as const)[index % 3],
      title: option.key,
      fallbackAmountLabel: PAYMENT_OPTIONS[index % PAYMENT_OPTIONS.length].amountLabel,
      fallbackDescription:
        PAYMENT_OPTIONS[index % PAYMENT_OPTIONS.length].description,
    };
    const copy = formatOptionDescription(option);
    const amountLabel =
      formatOptionAmountLabel(option) ?? meta.fallbackAmountLabel;

    return {
      id: meta.id,
      title: copy.title || meta.title,
      amountLabel,
      description: copy.description || meta.fallbackDescription,
    };
  });
};

export const mapSelectedPaymentMethod = (
  data?: GetCheckoutResponse | null,
): PaymentMethod => {
  const selected = data?.paymentOptions?.find((option) => option.selected);
  if (!selected) return "payInFull";
  return OPTION_META[selected.key]?.id ?? "payInFull";
};

export const mapOrderSummary = (
  data?: GetCheckoutResponse | null,
): OrderSummaryData => {
  if (!data?.orderSummary) return ORDER_SUMMARY;

  const summary = data.orderSummary;
  const lineItems = (summary.items ?? []).map((item, index) => ({
    id: item.id || item.key || `item-${index + 1}`,
    label: item.label || item.name || item.title || `Item ${index + 1}`,
    amount: item.amount ?? item.cost ?? 0,
  }));

  return {
    lineItems,
    subtotal: summary.subtotal ?? 0,
    taxCreditsAndIncentives: summary.taxCreditsAndIncentives ?? 0,
    includedBenefits: ORDER_SUMMARY.includedBenefits,
  };
};

export const mapCheckoutNetTotal = (data?: GetCheckoutResponse | null) => {
  if (!data?.orderSummary && !data?.payment) return NET_TOTAL;
  if (typeof data.orderSummary?.total === "number") return data.orderSummary.total;
  if (typeof data.payment?.amount === "number") return data.payment.amount;
  const summary = data.orderSummary;
  if (!summary) return 0;
  return (summary.subtotal ?? 0) - (summary.taxCreditsAndIncentives ?? 0);
};

export const extractCheckoutSession = (
  response: CreatePaymentCheckoutResponse | undefined,
) => {
  const nested = response?.data;
  const url =
    response?.url ||
    response?.checkoutUrl ||
    response?.sessionUrl ||
    nested?.url ||
    nested?.checkoutUrl ||
    (typeof response?.checkoutSessionId === "string" &&
    response.checkoutSessionId.startsWith("http")
      ? response.checkoutSessionId
      : undefined) ||
    (typeof nested?.checkoutSessionId === "string" &&
    nested.checkoutSessionId.startsWith("http")
      ? nested.checkoutSessionId
      : undefined);

  const sessionId =
    response?.checkoutSessionId ||
    response?.sessionId ||
    response?.id ||
    nested?.checkoutSessionId ||
    nested?.sessionId ||
    nested?.id ||
    url ||
    "";

  return { url, sessionId };
};
