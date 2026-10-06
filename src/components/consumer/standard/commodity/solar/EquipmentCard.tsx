import CommonButton from "@/common/button/CommonButton";
import { Eye, Minus, Plus, ShoppingCart, Star } from "lucide-react";

export interface BaseEquipment {
  id: string;
  brand: string;
  model: string;
  imageUrl: string;
  outputSpec: string;
  technology: string;
  additionalSpec: string;
  efficiencyRating: string;
  warrantyYears: number;
  rating: number;
  price: number;
}

/**
 * Loosened shape for API-backed catalogues, where a vendor may not publish a
 * price, rating, warranty or efficiency class for every product.
 */
export interface CatalogEquipment {
  id: string;
  brand: string;
  model: string;
  imageUrl: string;
  outputSpec: string;
  technology: string | null;
  additionalSpec: string | null;
  efficiencyRating: string | null;
  warrantyYears: number | null;
  rating: number | null;
  price: number | null;
}

const NOT_AVAILABLE = "—";
const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1509391366360-2e959784a276?w=400&h=300&fit=crop";

interface EquipmentCardProps<T extends CatalogEquipment> {
  equipment: T;
  isSelected: boolean;
  quantity: number;
  onAdd: () => void;
  onQuantityChange: (qty: number) => void;
  onViewDetails: () => void;
}

function EquipmentCard<T extends CatalogEquipment>({
  equipment,
  isSelected,
  quantity,
  onAdd,
  onQuantityChange,
  onViewDetails,
}: EquipmentCardProps<T>) {
  const unitPrice = equipment.price;
  const lineTotal = unitPrice === null ? null : unitPrice * quantity;

  return (
    <div
      className={`rounded-2xl overflow-hidden border bg-white transition-colors ${
        isSelected
          ? "border-primary border-2 shadow-[0_1px_3px_0_rgba(0,0,0,0.10),0_1px_2px_-1px_rgba(0,0,0,0.10)] "
          : "border-[#E5E7EB]"
      }`}
    >
      <img
        src={equipment.imageUrl?.trim() || FALLBACK_IMAGE}
        alt={`${equipment.brand} ${equipment.model}`}
        className="w-full h-36 object-cover bg-[#F3F4F6]"
        onError={(event) => {
          const img = event.currentTarget;
          if (img.dataset.fallback === "1") return;
          img.dataset.fallback = "1";
          img.src = FALLBACK_IMAGE;
        }}
      />

      <div className="p-4">
        <p className="text-xs font-semibold tracking-wide text-[#758179] uppercase">
          {equipment.brand}
        </p>
        <h3 className="text-base font-bold text-[#112518]  mb-2.5 truncate">
          {equipment.model}
        </h3>

        <div className="space-y-1 text-sm mb-2.5">
          <div className="flex flex-col sm:flex-row justify-between gap-1">
            <h4 className="text-[#758179] shrink-0 font-normal">
              Output / Spec
            </h4>
            <h4 className="font-medium text-[#112518] ">
              {equipment.outputSpec}
            </h4>
          </div>

          <div className="flex flex-col sm:flex-row justify-between gap-1">
            <h4 className="text-[#758179] shrink-0 font-normal">Technology</h4>
            <h4 className="font-medium text-[#112518] ">
              {equipment.technology ?? NOT_AVAILABLE}
            </h4>
          </div>

          <div className="flex flex-col sm:flex-row justify-between gap-1">
            <h4 className="text-[#758179] shrink-0 font-normal">Additional</h4>
            <h4 className="font-medium text-[#112518] ">
              {equipment.additionalSpec ?? NOT_AVAILABLE}
            </h4>
          </div>

          <div className="flex flex-col sm:flex-row justify-between gap-1">
            <h4 className="text-[#758179] shrink-0 font-normal">Efficiency</h4>
            <h4 className="font-medium text-[#112518] ">
              {equipment.efficiencyRating ?? NOT_AVAILABLE}
            </h4>
          </div>

          <div className="flex flex-col sm:flex-row justify-between gap-1">
            <h4 className="text-[#758179] shrink-0 font-normal">Warranty</h4>
            <h4 className="font-medium text-[#112518] ">
              {equipment.warrantyYears === null
                ? NOT_AVAILABLE
                : `${equipment.warrantyYears} years`}
            </h4>
          </div>
        </div>
        {equipment.rating !== null && (
          <div className="flex items-center gap-0.5 mb-2.5">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={`w-3.5 h-3.5 ${
                  i < Math.round(equipment.rating ?? 0)
                    ? "fill-amber-400 text-[#FDC700]"
                    : "text-gray-300"
                }`}
              />
            ))}
          </div>
        )}

        <div className="border-t border-gray-100 pt-2.5">
          <p className="text-xl font-bold text-[#112518]  mb-2.5">
            {unitPrice === null
              ? "Price on request"
              : `$${unitPrice.toLocaleString()}`}
          </p>

          {isSelected ? (
            <>
              <div className="flex items-center justify-between border border-gray-200 rounded-full px-3 py-1.5">
                <button
                  type="button"
                  onClick={() => onQuantityChange(Math.max(1, quantity - 1))}
                  className="text-gray-500 hover:text-gray-700 cursor-pointer disabled:text-gray-300 disabled:cursor-not-allowed transition-colors"
                  aria-label="Decrease quantity"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="font-medium text-sm">{quantity}</span>
                <button
                  type="button"
                  onClick={() => onQuantityChange(quantity + 1)}
                  className="text-gray-500 hover:text-gray-700 cursor-pointer disabled:text-gray-300 disabled:cursor-not-allowed transition-colors"
                  aria-label="Increase quantity"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
              <p className="text-center text-green-600 font-semibold text-sm mt-1.5">
                {lineTotal === null
                  ? NOT_AVAILABLE
                  : `$${lineTotal.toLocaleString()}`}
              </p>
            </>
          ) : (
            <div className="flex flex-col sm:flex-row gap-1.5">
              <CommonButton
                variant="outline"
                className="flex-1 text-sm px-2"
                onClick={onViewDetails}
              >
                <Eye className="w-3.5 h-3.5 mr-1" />
                Details
              </CommonButton>
              <CommonButton
                className="flex-1 text-sm px-2 bg-green-600 hover:bg-green-700"
                onClick={onAdd}
              >
                <ShoppingCart className="w-3.5 h-3.5 mr-1" />
                Add
              </CommonButton>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default EquipmentCard;
