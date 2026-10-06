import CommonBorderWrapper from "@/common/button/CommonBorderWrapper";
import CommonButton from "@/common/button/CommonButton";
import CommonHeader from "@/common/header/CommonHeader";
import SectionHeader from "@/common/header/SectionHeader";

interface ServiceSummaryProps {
  serviceCount: number;
  totalAmount: number;
  currency?: string;
  onContinue: () => void;
  isSaving?: boolean;
}

const formatTotal = (amount: number, currency: string) => {
  try {
    return new Intl.NumberFormat(undefined, {
      style: "currency",
      currency,
      maximumFractionDigits: 0,
    }).format(amount);
  } catch {
    return `$${amount.toLocaleString()}`;
  }
};

const ServiceSummary: React.FC<ServiceSummaryProps> = ({
  serviceCount,
  totalAmount,
  currency = "USD",
  onContinue,
  isSaving = false,
}) => {
  return (
    <CommonBorderWrapper isShadow>
      <div className="flex flex-col sm:flex-row gap-3 justify-between items-start">
        <SectionHeader
          size="lg"
          title="Service Summary"
          description={`${serviceCount} service(s) selected`}
        />

        <div className="text-right space-y-1">
          <p className="text-sm font-medium text-[#758179]">
            Total Estimated Starting Cost
          </p>

          <CommonHeader size="4xl" className="text-primary!">
            {formatTotal(totalAmount, currency)}
          </CommonHeader>
        </div>
      </div>

      <CommonButton
        disabled={serviceCount === 0 || isSaving}
        isLoading={isSaving}
        loadingText="Saving..."
        className="w-full"
        onClick={onContinue}
      >
        Continue to Professional Design and Sizing
      </CommonButton>
    </CommonBorderWrapper>
  );
};

export default ServiceSummary;
