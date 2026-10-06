import { Check } from "lucide-react";

interface CheckboxRowProps {
  checked: boolean;
  disabled?: boolean;
  label: string;
  onChange: () => void;
}

const CheckboxRow: React.FC<CheckboxRowProps> = ({
  checked,
  disabled,
  label,
  onChange,
}) => (
  <button
    type="button"
    disabled={disabled}
    onClick={onChange}
    className={`w-full flex items-center gap-3 border border-[#E7E9E8] rounded-xl px-5 py-4 text-left transition-colors ${
      disabled
        ? "opacity-50 cursor-not-allowed"
        : "hover:bg-[#EAF7E6]/20 cursor-pointer"
    }`}
  >
    <span
      className={`w-5 h-5 rounded border shrink-0 flex items-center justify-center ${
        checked ? "bg-primary border-primary" : "bg-white border-gray-300"
      }`}
    >
      {checked && <Check className="w-3.5 h-3.5 text-white" />}
    </span>
    <span className="text-[#112518]">{label}</span>
  </button>
);

export default CheckboxRow;
