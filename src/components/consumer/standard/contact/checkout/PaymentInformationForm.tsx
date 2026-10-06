import CommonButton from "@/common/button/CommonButton";
import { inputClass } from "@/pages/Login";
import { CreditCard } from "lucide-react";
import { PaymentFormData } from "./types";

interface PaymentInformationFormProps {
  formData: PaymentFormData;
  onChange: (data: PaymentFormData) => void;
  onSubmit: () => void;
  isSubmitDisabled: boolean;
  isSubmitting?: boolean;
}

const formatCardNumber = (value: string) => {
  const digitsOnly = value.replace(/\D/g, "").slice(0, 16);
  return digitsOnly.replace(/(\d{4})(?=\d)/g, "$1 ");
};

const formatExpirationDate = (value: string) => {
  const digitsOnly = value.replace(/\D/g, "").slice(0, 4);
  if (digitsOnly.length <= 2) return digitsOnly;
  return `${digitsOnly.slice(0, 2)}/${digitsOnly.slice(2)}`;
};

const PaymentInformationForm: React.FC<PaymentInformationFormProps> = ({
  formData,
  onChange,
  onSubmit,
  isSubmitDisabled,
  isSubmitting = false,
}) => {
  const handleFieldChange = (field: keyof PaymentFormData, value: string) => {
    onChange({ ...formData, [field]: value });
  };

  return (
    <div className="bg-white border border-[#E7E9E8] rounded-2xl p-4 sm:p-6">
      <h2 className="text-xl font-bold text-[#112518] mb-6">
        Payment Information
      </h2>

      <div className="space-y-5">
        <div>
          <label className={inputClass.label}>Card Number</label>
          <div className="relative">
            <CreditCard className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              inputMode="numeric"
              placeholder="1234 5678 9012 3456"
              value={formData.cardNumber}
              onChange={(e) =>
                handleFieldChange(
                  "cardNumber",
                  formatCardNumber(e.target.value),
                )
              }
              className={`${inputClass.input} pl-10`}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className={inputClass.label}>Expiration Date</label>
            <input
              type="text"
              inputMode="numeric"
              placeholder="MM/YY"
              value={formData.expirationDate}
              onChange={(e) =>
                handleFieldChange(
                  "expirationDate",
                  formatExpirationDate(e.target.value),
                )
              }
              className={`${inputClass.input}`}
            />
          </div>
          <div>
            <label className={inputClass.label}>CVV</label>
            <input
              type="text"
              inputMode="numeric"
              placeholder="123"
              maxLength={4}
              value={formData.cvv}
              onChange={(e) =>
                handleFieldChange(
                  "cvv",
                  e.target.value.replace(/\D/g, "").slice(0, 4),
                )
              }
              className={`${inputClass.input}`}
            />
          </div>
        </div>

        <div>
          <label className={inputClass.label}>Cardholder Name</label>
          <input
            type="text"
            placeholder="Full name on card"
            value={formData.cardholderName}
            onChange={(e) =>
              handleFieldChange("cardholderName", e.target.value)
            }
            className={`${inputClass.input}`}
          />
        </div>

        <CommonButton
          className="w-full py-3.5 text-base"
          onClick={onSubmit}
          disabled={isSubmitDisabled}
          isLoading={isSubmitting}
          loadingText="Processing..."
        >
          Complete Purchase
        </CommonButton>
      </div>
    </div>
  );
};

export default PaymentInformationForm;
