import CommonBorderWrapper from "@/common/button/CommonBorderWrapper";
import CommonButton from "@/common/button/CommonButton";
import SectionHeader from "@/common/header/SectionHeader";
import Spinner from "@/common/loading/Spinner";
import { useEffect, useState } from "react";
import { ORDER_SUMMARY, PAYMENT_OPTIONS } from "./data";
import OrderSummaryPanel from "./OrderSummaryPanel";
import PaymentOptionCard from "./PaymentOptionCard";
import {
  OrderSummaryData,
  PaymentMethod,
  PaymentOption,
} from "./types";

interface CheckoutProps {
  paymentOptions?: PaymentOption[];
  orderSummary?: OrderSummaryData;
  initialSelectedMethod?: PaymentMethod;
  checkoutEnabled?: boolean;
  isSubmitting?: boolean;
  loading?: boolean;
  onCompletePurchase: (method: PaymentMethod) => void;
}

const Checkout: React.FC<CheckoutProps> = ({
  paymentOptions = PAYMENT_OPTIONS,
  orderSummary = ORDER_SUMMARY,
  initialSelectedMethod = "payInFull",
  checkoutEnabled = true,
  isSubmitting = false,
  loading = false,
  onCompletePurchase,
}) => {
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>(
    initialSelectedMethod,
  );

  useEffect(() => {
    setSelectedMethod(initialSelectedMethod);
  }, [initialSelectedMethod]);

  const selectedOption =
    paymentOptions.find((opt) => opt.id === selectedMethod) ??
    paymentOptions[0] ??
    PAYMENT_OPTIONS[0];

  const handleSubmit = () => {
    if (!checkoutEnabled || isSubmitting) return;
    onCompletePurchase(selectedMethod);
  };

  return (
    <div className="space-y-6">
      <SectionHeader
        title="Checkout"
        description="Complete your renewable energy system purchase"
      />

      {loading ? (
        <Spinner size="xl" text="Loading checkout..." />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          <div className="lg:col-span-2 space-y-6">
            <CommonBorderWrapper isShadow>
              <SectionHeader size="xl" title="Payment Options" />

              <div className="space-y-4">
                {paymentOptions.map((option) => (
                  <PaymentOptionCard
                    key={option.id}
                    option={option}
                    isSelected={selectedMethod === option.id}
                    onSelect={() => setSelectedMethod(option.id)}
                  />
                ))}
              </div>
            </CommonBorderWrapper>

            <CommonButton
              className="w-full py-3.5 text-base"
              onClick={handleSubmit}
              disabled={!checkoutEnabled}
              isLoading={isSubmitting}
              loadingText="Redirecting to Stripe..."
            >
              Complete Purchase
            </CommonButton>
          </div>

          <div className="lg:col-span-1">
            <OrderSummaryPanel
              data={orderSummary}
              selectedOption={selectedOption}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Checkout;
