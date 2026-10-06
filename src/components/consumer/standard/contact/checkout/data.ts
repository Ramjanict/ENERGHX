import { OrderSummaryData, PaymentOption } from "./types";

export const PAYMENT_OPTIONS: PaymentOption[] = [
  {
    id: "payInFull",
    title: "Pay in Full",
    amountLabel: "$34,657",
    description: "One-time payment, no interest",
  },
  {
    id: "financing",
    title: "Financing (120 months)",
    amountLabel: "$389/mo",
    description: "3.9% APR, subject to credit approval",
  },
  {
    id: "lease",
    title: "Solar Lease (20 years)",
    amountLabel: "$275/mo",
    description: "Zero down, option to purchase after lease term",
  },
];

export const ORDER_SUMMARY: OrderSummaryData = {
  lineItems: [
    { id: "solar", label: "Solar System", amount: 16320 },
    { id: "wind", label: "Wind Turbine", amount: 16700 },
    { id: "biomass", label: "Biomass Boiler", amount: 25300 },
  ],
  subtotal: 58320,
  taxCreditsAndIncentives: 23663,
  includedBenefits: [
    "25-year warranty included",
    "Professional installation",
    "Annual maintenance",
  ],
};

export const NET_TOTAL = 34657;
