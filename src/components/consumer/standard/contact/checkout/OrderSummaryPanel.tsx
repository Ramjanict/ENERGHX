import CommonBorderWrapper from "@/common/button/CommonBorderWrapper";
import SectionHeader from "@/common/header/SectionHeader";
import { CheckCircle2 } from "lucide-react";
import { OrderSummaryData, PaymentOption } from "./types";

interface OrderSummaryPanelProps {
  data: OrderSummaryData;
  selectedOption: PaymentOption;
}

const OrderSummaryPanel: React.FC<OrderSummaryPanelProps> = ({
  data,
  selectedOption,
}) => {
  const netTotal = data.subtotal - data.taxCreditsAndIncentives;

  const isRecurring = selectedOption.id !== "payInFull";
  const totalLabel = isRecurring
    ? selectedOption.amountLabel
    : `$${netTotal.toLocaleString()}`;

  return (
    <CommonBorderWrapper isShadow>
      <SectionHeader size="xl" title="Order Summary" />
      <div className="space-y-3">
        {data.lineItems.length === 0 ? (
          <div className="flex items-center justify-between">
            <p className="text-[#758179]">No items</p>
            <p className="font-semibold text-[#112518]">$0</p>
          </div>
        ) : (
          data.lineItems.map((item) => (
            <div key={item.id} className="flex items-center justify-between">
              <p className="text-[#758179]">{item.label}</p>
              <p className="font-semibold text-[#112518]">
                ${item.amount.toLocaleString()}
              </p>
            </div>
          ))
        )}
      </div>

      <div className="border-t border-[#E7E9E8] pt-3 space-y-3">
        <div className="flex items-center justify-between">
          <p className="text-[#758179]">Subtotal</p>
          <p className="font-semibold text-[#112518]">
            ${data.subtotal.toLocaleString()}
          </p>
        </div>
        <div className="flex items-center justify-between">
          <p className="text-primary">Tax Credits & Incentives</p>
          <p className="font-semibold text-primary">
            -${data.taxCreditsAndIncentives.toLocaleString()}
          </p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between bg-primary rounded-xl p-3 sm:p-5">
        <p className="text-white font-medium text-lg">
          {isRecurring ? "Monthly Payment" : "Total"}
        </p>
        <p className="text-white font-extrabold text-xl sm:text-2xl ">
          {totalLabel}
        </p>
      </div>

      <div className="space-y-2 pt-1">
        {data.includedBenefits.map((benefit) => (
          <div key={benefit} className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
            <p className="text-sm text-[#758179]">{benefit}</p>
          </div>
        ))}
      </div>
    </CommonBorderWrapper>
  );
};

export default OrderSummaryPanel;
