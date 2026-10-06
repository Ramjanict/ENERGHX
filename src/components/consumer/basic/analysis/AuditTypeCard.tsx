import { Check } from "lucide-react";
import React from "react";

interface AuditTypeCardProps {
  title: string;
  description: string;
  selected: boolean;
  onClick: () => void;
}

const AuditTypeCard: React.FC<AuditTypeCardProps> = ({
  title,
  description,
  selected,
  onClick,
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`text-left border-2 rounded-2xl p-5 transition-colors ${
        selected
          ? "border-primary bg-[#EAF7E6]"
          : "border-[#E5E7EB] bg-white hover:border-gray-300"
      }`}
    >
      <div className="flex items-center justify-between mb-2">
        <span className="font-bold text-foreground text-lg">{title}</span>
        {selected && (
          <span className="w-5 h-5 rounded-full border-2 border-primary flex items-center justify-center">
            <Check className="w-3 h-3 text-green-500" />
          </span>
        )}
      </div>
      <p className="text-sm text-muted-foreground">{description}</p>
    </button>
  );
};

export default AuditTypeCard;
