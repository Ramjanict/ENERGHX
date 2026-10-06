import CommonButton from "@/common/button/CommonButton";
import BMiniCard from "@/components/consumer/basic/building/card/BMiniCard";
import { Package } from "lucide-react";
import { CatalogEquipment } from "./EquipmentCard";

interface SelectedEquipmentItem<T extends CatalogEquipment> {
  equipment: T;
  quantity: number;
}

interface SelectedEquipmentSummaryProps<T extends CatalogEquipment> {
  items: SelectedEquipmentItem<T>[];
  estInstallation: number;
  onGenerateDesign: () => void;
  buttonLabel?: string;
  isLoading?: boolean;
  disabled?: boolean;
}

function SelectedEquipmentSummary<T extends CatalogEquipment>({
  items,
  estInstallation,
  onGenerateDesign,
  buttonLabel = "Generate System Design",
  isLoading = false,
  disabled = false,
}: SelectedEquipmentSummaryProps<T>) {
  const equipmentCost = items.reduce(
    (sum, item) => sum + (item.equipment.price ?? 0) * item.quantity,
    0,
  );
  const totalCost = equipmentCost + estInstallation;
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className=" rounded-2xl border border-[#E7E9E8] space-y-4 pb-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between  bg-[#EAF7E6]/30 py-4 px-5 gap-3">
        <div className="flex items-start sm:items-center gap-2">
          <Package className="w-5 h-5 text-primary" />
          <h3 className="text-base sm:text-lg font-bold text-[#112518]">
            Selected Equipment Summary
          </h3>
        </div>
        <span className="text-xs font-semibold text-primary bg-primary/10 px-3 py-1 rounded-full w-fit">
          {itemCount} item{itemCount !== 1 ? "s" : ""}
        </span>
      </div>

      <div className=" ">
        {items.map((item) => (
          <div
            key={item.equipment.id}
            className="flex flex-col sm:flex-row sm:items-center gap-3  px-5 border-b border-[#E7E9E8] py-4"
          >
            <div className="flex gap-2">
              <div className="w-9 h-9 bg-[#EAF7E6] rounded-lg flex items-center justify-center shrink-0 mt-1">
                <Package className="w-4 h-4 text-primary" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-[#112518]">
                  {item.equipment.model}
                </p>
                <p className="text-sm text-[#758179]">
                  {item.equipment.brand} · {item.equipment.outputSpec}
                </p>
              </div>
            </div>
            <p className="text-sm text-[#758179]">
              Qty:
              <span className="font-semibold text-[#112518]">
                {item.quantity}
              </span>
            </p>
            <p className="font-semibold text-[#112518] sm:w-20 sm:text-right">
              {item.equipment.price === null
                ? "—"
                : `$${(item.equipment.price * item.quantity).toLocaleString()}`}
            </p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 py-4 px-5 ">
        <BMiniCard
          className="flex  flex-col items-center justify-center bg-white! "
          label="Equipment Cost"
          value={`$${equipmentCost.toLocaleString()}`}
        />

        <BMiniCard
          className="flex  flex-col items-center justify-center bg-white!"
          label="Installation Cost"
          value={`$${estInstallation.toLocaleString()}`}
        />
        <BMiniCard
          className="flex  flex-col items-center justify-center bg-primary/5! "
          label="Total Cost"
          value={`$${totalCost.toLocaleString()}`}
          valueClass="text-primary! font-semibold!"
        />
      </div>
      <div className="px-5 py-4">
        <CommonButton
          isLoading={isLoading}
          loadingText="Generating..."
          disabled={disabled}
          className="w-full"
          onClick={onGenerateDesign}
        >
          {buttonLabel}
        </CommonButton>
      </div>
    </div>
  );
}

export default SelectedEquipmentSummary;
