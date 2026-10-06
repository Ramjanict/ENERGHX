import CommonButton from "@/common/button/CommonButton";
import { DesignProduct } from "@/store/consumer/standard/designs/designCatalog/types/designCatalog";
import {
  BatteryCharging,
  CheckCircle2,
  Globe2,
  Info,
  ShieldCheck,
  Star,
  Wrench,
  X,
  Zap,
} from "lucide-react";

interface BatteryProductDetailsModalProps {
  product: DesignProduct;
  isSelected: boolean;
  onClose: () => void;
  onAddToDesign: () => void;
}

const NOT_AVAILABLE = "—";

interface SpecRow {
  label: string;
  value: string;
}

const formatSpecLabel = (key: string) =>
  key
    .replace(/_/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());

const formatSpecValue = (
  raw: string | number | boolean | string[] | number[] | null | undefined,
): string | null => {
  if (raw === null || raw === undefined || raw === "") return null;
  if (Array.isArray(raw)) return raw.join(", ");
  if (typeof raw === "boolean") return raw ? "Yes" : "No";
  return String(raw);
};

const BatteryProductDetailsModal: React.FC<BatteryProductDetailsModalProps> = ({
  product,
  isSelected,
  onClose,
  onAddToDesign,
}) => {
  const specRows = Object.entries(product.specs ?? {})
    .map(([key, raw]) => {
      const value = formatSpecValue(raw);
      return value ? { label: formatSpecLabel(key), value } : null;
    })
    .filter((row): row is SpecRow => row !== null);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-start sm:items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl w-full max-w-2xl my-8">
        <div className="flex items-center justify-between px-6 py-5 border-b border-[#E7E9E8]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-[#F3E8FF] flex items-center justify-center">
              <BatteryCharging className="w-5 h-5 text-[#9810FA]" />
            </div>
            <div>
              <h2 className="font-bold text-[#112518] text-lg">
                {product.name}
              </h2>
              <p className="text-sm text-[#758179]">
                {product.manufacturer} · {product.outputSpec ?? NOT_AVAILABLE}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="px-6 py-5 space-y-6 max-h-[70vh] overflow-y-auto">
          {product.notes && (
            <div className="flex items-start gap-3 bg-blue-50 rounded-xl px-4 py-3.5">
              <Info className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
              <p className="text-sm text-blue-900">{product.notes}</p>
            </div>
          )}

          <div>
            <h3 className="font-bold text-[#112518] mb-1.5">
              Product Overview
            </h3>
            <p className="text-sm text-[#758179]">
              {product.category.name} {product.energyRole} product manufactured
              by {product.manufacturer}
              {product.outputSpec ? `, rated at ${product.outputSpec}` : ""}
              {product.warrantyYears !== null &&
                ` and backed by a ${product.warrantyYears}-year warranty`}
              .
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-[#EAF7E6]/30 rounded-xl px-4 py-3">
              <p className="text-xs text-[#758179]">Price</p>
              <p className="font-bold text-[#112518]">
                {product.priceAmount !== null
                  ? `$${product.priceAmount.toLocaleString()} ${product.priceCurrency ?? ""}`.trim()
                  : "On request"}
              </p>
            </div>
            <div className="bg-[#EAF7E6]/30 rounded-xl px-4 py-3">
              <p className="text-xs text-[#758179]">Efficiency Class</p>
              <p className="font-bold text-[#112518]">
                {product.efficiencyClass ?? NOT_AVAILABLE}
              </p>
            </div>
            <div className="bg-[#EAF7E6]/30 rounded-xl px-4 py-3">
              <p className="text-xs text-[#758179]">Warranty</p>
              <p className="font-bold text-[#112518]">
                {product.warrantyYears === null
                  ? NOT_AVAILABLE
                  : `${product.warrantyYears} years`}
              </p>
            </div>
            <div className="bg-[#EAF7E6]/30 rounded-xl px-4 py-3">
              <p className="text-xs text-[#758179]">Rating</p>
              {product.rating === null ? (
                <p className="font-bold text-[#112518]">{NOT_AVAILABLE}</p>
              ) : (
                <div className="flex items-center gap-0.5 mt-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`w-3.5 h-3.5 ${
                        i < Math.round(product.rating ?? 0)
                          ? "fill-amber-400 text-[#FDC700]"
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>

          {specRows.length > 0 && (
            <div className="border border-[#E7E9E8] rounded-xl">
              <div className="flex items-center gap-2 px-4 py-3 border-b border-[#E7E9E8]">
                <span className="w-6 h-6 rounded-full bg-[#EAF7E6] text-primary flex items-center justify-center">
                  <Zap className="w-3.5 h-3.5" />
                </span>
                <h3 className="font-bold text-[#112518]">
                  Technical Specifications
                </h3>
              </div>
              <div className="divide-y divide-[#E7E9E8]">
                {specRows.map((row) => (
                  <div
                    key={`${row.label}-${row.value}`}
                    className="flex items-start justify-between gap-4 px-4 py-3"
                  >
                    <span className="text-sm text-[#758179] shrink-0">
                      {row.label}
                    </span>
                    <span className="text-sm font-medium text-[#112518] text-right">
                      {row.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="border border-[#E7E9E8] rounded-xl">
            <div className="flex items-center gap-2 px-4 py-3 border-b border-[#E7E9E8]">
              <span className="w-6 h-6 rounded-full bg-[#EAF7E6] text-primary flex items-center justify-center">
                <Wrench className="w-3.5 h-3.5" />
              </span>
              <h3 className="font-bold text-[#112518]">
                Installation & Origin
              </h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4">
              <div className="flex items-start gap-2">
                <Globe2 className="w-4 h-4 text-[#758179] mt-0.5 shrink-0" />
                <div>
                  <p className="text-xs text-[#758179]">Country of Origin</p>
                  <p className="text-sm font-medium text-[#112518]">
                    {product.countryOfOrigin ?? NOT_AVAILABLE}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Wrench className="w-4 h-4 text-[#758179] mt-0.5 shrink-0" />
                <div>
                  <p className="text-xs text-[#758179]">Installation Types</p>
                  <p className="text-sm font-medium text-[#112518]">
                    {product.installationTypes ?? NOT_AVAILABLE}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 text-[#758179] mt-0.5 shrink-0" />
                <div>
                  <p className="text-xs text-[#758179]">Market Status</p>
                  <p className="text-sm font-medium text-[#112518]">
                    {product.marketStatus ?? NOT_AVAILABLE}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between px-6 py-5 border-t border-[#E7E9E8]">
          <CommonButton variant="outline" onClick={onClose}>
            Close
          </CommonButton>
          <CommonButton onClick={onAddToDesign} disabled={isSelected}>
            <CheckCircle2 className="w-4 h-4 mr-1.5" />
            {isSelected ? "Added to Design" : "Add to Design"}
          </CommonButton>
        </div>
      </div>
    </div>
  );
};

export default BatteryProductDetailsModal;
