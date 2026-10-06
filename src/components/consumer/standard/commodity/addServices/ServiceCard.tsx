import RadioIndicator from "@/common/button/RadioIndicator";
import React from "react";

export interface ServiceCardData {
  key: string;
  title: string;
  description: string;
  duration: string;
  startingCost: number;
  currency: string;
}

interface ServiceCardProps {
  service: ServiceCardData;
  selected: boolean;
  onClick: () => void;
}

const formatStartingCost = (amount: number, currency: string) => {
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

const ServiceCard: React.FC<ServiceCardProps> = ({
  service,
  selected,
  onClick,
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`text-left cursor-pointer border rounded-2xl p-6 transition-colors shadow-[0_1px_3px_0_rgba(0,0,0,0.10),0_1px_2px_-1px_rgba(0,0,0,0.10)]  ${
        selected
          ? "border-primary bg-white"
          : "border-[#E7E9E8] bg-white hover:border-gray-300"
      }`}
    >
      <div className="flex items-start justify-between mb-3">
        <p className="font-bold text-foreground text-lg">{service.title}</p>
        <RadioIndicator
          selected={selected}
          variant="check"
          activeBorderClassName="border-green-500"
          dotClassName="bg-green-500"
          inactiveBorderClassName="border-gray-300"
        />
      </div>

      <p className="text-[#758179] mb-5">{service.description}</p>

      <div className="flex items-end justify-between">
        <div>
          <p className="text-sm text-[#758179] mb-1">Duration</p>
          <p className="font-bold text-foreground">{service.duration}</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-[#758179] mb-1">Starting at</p>
          <p className="text-xl font-bold text-green-600">
            {formatStartingCost(service.startingCost, service.currency)}
          </p>
        </div>
      </div>
    </button>
  );
};

export default ServiceCard;
