import CommonButton from "@/common/button/CommonButton";
import CommonHeader from "@/common/header/CommonHeader";
import React from "react";
import Counter from "../Counter";

interface ApplianceCardProps {
  emoji?: string;
  name: string;
  category: string;
  power: number;
  quantity: number;
  onQuantityChange: (value: number) => void;
  min?: number;
  max?: number;
  className?: string;
}

const ApplianceCard: React.FC<ApplianceCardProps> = ({
  emoji = "🔌",
  name,
  category,
  power,
  quantity,
  onQuantityChange,
  min = 0,
  max = Infinity,
  className,
}) => {
  const isAdded = quantity > 0;

  return (
    <div
      className={`bg-[#EAF7E6]/30 rounded-xl border border-[#E7E9E8]  p-6 flex flex-col gap-2 items-center transition-colors  ${className ?? ""}`}
    >
      <div className="text-4xl ">{emoji}</div>
      <CommonHeader className="font-bold! ">{name}</CommonHeader>

      <CommonHeader size="sm">{category}</CommonHeader>
      <CommonHeader size="sm">Power: {power}W</CommonHeader>

      {isAdded ? (
        <Counter
          value={quantity}
          onChange={onQuantityChange}
          min={min}
          max={max}
          className="w-full justify-between"
        />
      ) : (
        <CommonButton
          size="sm"
          className="w-full text-xs"
          onClick={() => onQuantityChange(1)}
        >
          Add Appliance
        </CommonButton>
      )}
    </div>
  );
};

export default ApplianceCard;
