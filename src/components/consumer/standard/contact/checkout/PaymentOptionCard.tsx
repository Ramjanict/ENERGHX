import { PaymentOption } from "./types";

interface PaymentOptionCardProps {
  option: PaymentOption;
  isSelected: boolean;
  onSelect: () => void;
}

const PaymentOptionCard: React.FC<PaymentOptionCardProps> = ({
  option,
  isSelected,
  onSelect,
}) => {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={`w-full text-left rounded-2xl border-2 p-4 sm:p-6 transition-colors cursor-pointer ${
        isSelected ? "border-primary" : "border-[#E7E9E8] hover:border-gray-300"
      }`}
    >
      <div className="flex items-start justify-between mb-3">
        <h3 className="font-bold text-[#112518] text-lg">{option.title}</h3>
        <span
          className={`w-5 h-5 rounded-full border-2 shrink-0 flex items-center justify-center ${
            isSelected ? "border-primary" : "border-gray-300"
          }`}
        >
          {isSelected && (
            <span className="w-2.5 h-2.5 rounded-full bg-primary" />
          )}
        </span>
      </div>

      <p className=" text-xl sm:text-3xl font-extrabold text-primary mb-2">
        {option.amountLabel}
      </p>

      <p className="text-sm text-[#758179]">{option.description}</p>
    </button>
  );
};

export default PaymentOptionCard;
