import CommonButton from "@/common/button/CommonButton";
import CommonHeader from "@/common/header/CommonHeader";
import React from "react";
import Counter from "../Counter";

interface VehicleCardProps {
  emoji?: string;
  name: string;
  battery: string;
  range: string;
  charging: string;
  quantity: number;
  onQuantityChange: (value: number) => void;
  min?: number;
  max?: number;
  className?: string;
}

const VehicleCard: React.FC<VehicleCardProps> = ({
  emoji = "🚗",
  name,
  battery,
  range,
  charging,
  quantity,
  onQuantityChange,
  min = 0,
  max = Infinity,
  className,
}) => {
  const isAdded = quantity > 0;

  return (
    <div
      className={`bg-[#EAF7E6]/30 rounded-xl border border-[#E7E9E8]  p-6 flex flex-col items-center transition-colors  ${className ?? ""}`}
    >
      <span className="text-6xl mb-3">{emoji}</span>

      <div className=" flex justify-start w-full">
        <CommonHeader className="font-bold! ">{name}</CommonHeader>
      </div>

      <div className="w-full space-y-2 mb-4">
        <div className="flex items-center justify-between">
          <CommonHeader size="sm">Battery:</CommonHeader>
          <CommonHeader size="sm" className="font-bold! text-[#112518]!">
            {battery}
          </CommonHeader>
        </div>
        <div className="flex items-center justify-between">
          <CommonHeader size="sm">Range:</CommonHeader>
          <CommonHeader size="sm" className="font-bold! text-primary!">
            {range}
          </CommonHeader>
        </div>
        <div className="flex items-center justify-between">
          <CommonHeader size="sm">Charging:</CommonHeader>
          <CommonHeader size="sm" className="font-bold! text-[#112518]!">
            {charging}
          </CommonHeader>
        </div>
      </div>

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
          onClick={() => onQuantityChange(1)}
          className="w-full"
        >
          Add Vehicle
        </CommonButton>
      )}
    </div>
  );
};

export default VehicleCard;
