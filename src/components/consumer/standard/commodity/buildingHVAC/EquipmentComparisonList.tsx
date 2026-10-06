import CommonHeader from "@/common/header/CommonHeader";
import { cn } from "@/lib/utils";
import { HvacRecommendedEquipment } from "@/store/consumer/standard/designs/designPost/types/hvac";
import { Check, Thermometer } from "lucide-react";
import React from "react";

interface EquipmentComparisonListProps {
  recommended: HvacRecommendedEquipment;
  selectedProductIds: string[];
  categoryLabels: Record<string, string>;
  onSelect: (productId: string) => void;
  onViewDetails: (productId: string) => void;
  className?: string;
}

const humanizeSlug = (slug: string) =>
  slug
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");

const EquipmentComparisonList: React.FC<EquipmentComparisonListProps> = ({
  recommended,
  selectedProductIds,
  categoryLabels,
  onSelect,
  onViewDetails,
  className = "",
}) => {
  return (
    <div
      className={cn(
        "bg-white border border-[#E5E7EB] rounded-2xl overflow-hidden",
        className,
      )}
    >
      <div className="px-6 pt-5 pb-4">
        <CommonHeader size="xl">{recommended.label}</CommonHeader>
        <CommonHeader size="sm" className="mt-1">
          {recommended.subLabel}
        </CommonHeader>
      </div>

      <div className="divide-y divide-[#E5E7EB]">
        {recommended.items.map((item) => {
          const productId = String(item.product_id);
          const isSelected = selectedProductIds.includes(productId);
          const capacityTon = item.specs.rated_capacity_ton;

          return (
            <div
              key={productId}
              className={cn(
                "flex flex-col lg:flex-row lg:items-center justify-between gap-4 px-6 py-4 transition-colors",
                isSelected && "bg-[#EAF7E6]/50",
              )}
            >
              <div className="flex items-center gap-4 min-w-0">
                <div className="w-10 h-10 shrink-0 rounded-lg bg-[#E0F2FE] lg:flex items-center justify-center hidden">
                  <Thermometer className="w-5 h-5 text-[#0EA5E9]" />
                </div>

                <div className="min-w-0">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                    <CommonHeader size="md" className="truncate">
                      {item.name}
                    </CommonHeader>
                    <span className="text-xs font-medium px-2.5 py-0.5 rounded-full bg-[#E0F2FE] text-[#0369A1] w-fit">
                      {item.technology ??
                        categoryLabels[item.category] ??
                        humanizeSlug(item.category)}
                    </span>
                    {item.efficiency_class && (
                      <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-[#EAF7E6] text-[#15803D] w-fit">
                        {item.efficiency_class}
                      </span>
                    )}
                  </div>

                  <div className="mt-1 flex flex-col sm:flex-row sm:items-center sm:gap-4">
                    <p className="text-sm text-[#758179] mt-1">
                      Capacity:{" "}
                      <span className="font-semibold text-[#112518]">
                        {capacityTon
                          ? `${capacityTon} Ton`
                          : item.output_spec}
                      </span>
                    </p>
                    {item.specs.cop_rated !== null &&
                      item.specs.cop_rated !== undefined && (
                        <p className="text-sm text-[#758179] mt-1">
                          COP:{" "}
                          <span className="font-semibold text-[#112518]">
                            {item.specs.cop_rated}
                          </span>
                        </p>
                      )}
                    <p className="text-sm text-[#758179] mt-1">
                      Est. Cost:{" "}
                      <span className="font-semibold text-[#15803D]">
                        {item.price
                          ? `$${item.price.amount.toLocaleString()}`
                          : "On request"}
                      </span>
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => onViewDetails(productId)}
                  className="px-4 py-2 text-sm font-medium rounded-lg border border-[#E5E7EB] text-[#374151] hover:bg-gray-50 transition-colors cursor-pointer w-full sm:w-auto"
                >
                  Details
                </button>

                {isSelected ? (
                  <button
                    type="button"
                    disabled
                    className="flex items-center justify-center gap-1.5 px-4 py-2 text-sm font-semibold rounded-lg bg-[#16A34A] text-white cursor-pointer w-full sm:w-auto"
                  >
                    <Check className="w-4 h-4" />
                    Selected
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => onSelect(productId)}
                    className="px-4 py-2 text-sm font-semibold rounded-lg border border-[#16A34A] text-[#16A34A] hover:bg-[#EAF7E6]/60 transition-colors cursor-pointer w-full sm:w-auto"
                  >
                    Select Equipment
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default EquipmentComparisonList;
