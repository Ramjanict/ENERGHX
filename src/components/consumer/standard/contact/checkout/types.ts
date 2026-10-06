export type PaymentMethod = "payInFull" | "financing" | "lease";

export interface PaymentOption {
  id: PaymentMethod;
  title: string;
  amountLabel: string;
  description: string;
}

export interface OrderLineItem {
  id: string;
  label: string;
  amount: number;
}

export interface OrderSummaryData {
  lineItems: OrderLineItem[];
  subtotal: number;
  taxCreditsAndIncentives: number;
  includedBenefits: string[];
}

export interface PaymentFormData {
  cardNumber: string;
  expirationDate: string;
  cvv: string;
  cardholderName: string;
}
