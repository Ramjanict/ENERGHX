import React from "react";

interface SpecRowProps {
  label: string;
  value: string;
  valueClass?: string;
  showBorder?: boolean;
}

const SpecRow: React.FC<SpecRowProps> = ({
  label,
  value,
  valueClass = "text-foreground",
  showBorder = true,
}) => {
  return (
    <div
      className={`flex items-center justify-between py-3 ${
        showBorder ? "border-b border-[#F3F4F6] last:border-b-0" : ""
      }`}
    >
      <span className="text-sm text-[#4A5565]">{label}</span>
      <span className={`text-sm font-bold ${valueClass}`}>{value}</span>
    </div>
  );
};

export default SpecRow;
