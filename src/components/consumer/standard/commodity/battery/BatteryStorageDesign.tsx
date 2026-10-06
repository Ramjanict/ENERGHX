import CommonButton from "@/common/button/CommonButton";
import StandardTabs from "@/common/button/StandardTabs";
import Separator from "@/common/form/Separator";
import SectionHeader from "@/common/header/SectionHeader";
import Spinner from "@/common/loading/Spinner";
import useDebounce from "@/common/useDebounce";
import Welcome from "@/components/consumer/basic/dashboard/Welcome";
import {
  useGetDesignProductByIdQuery,
  useGetDesignProductCategoriesQuery,
  useGetDesignProductsQuery,
} from "@/store/consumer/standard/designs/designCatalog/designCatalogApi";
import { DesignProduct } from "@/store/consumer/standard/designs/designCatalog/types/designCatalog";
import { useComputeBatteryDesignMutation } from "@/store/consumer/standard/designs/designPost/designPostApi";
import {
  BatterySiteParametersFormValues,
  DEFAULT_BATTERY_LOAD_PROFILE,
  toSolveBatteryDesignPayload,
} from "@/store/consumer/standard/designs/battery/schema/siteParametersSchema";
import { SolveBatteryDesignResponse } from "@/store/consumer/standard/designs/battery/types/batteryDesign";
import { ArrowLeft, BatteryCharging } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import ColorSearch from "../solar/ColorSearch";
import EquipmentCard, { CatalogEquipment } from "../solar/EquipmentCard";
import SelectedEquipmentSummary from "../solar/SelectedEquipmentSummary";
import BatteryProductDetailsModal from "./BatteryProductDetailsModal";
import BatterySiteParametersForm from "./BatterySiteParametersForm";
import BatterySystemResults from "./BatterySystemResults";

const BATTERY_DESIGN_KEY = "battery_storage";

const FALLBACK_TABS = [
  { key: "battery-systems", label: "Battery Systems" },
  { key: "inverters", label: "Inverters" },
  { key: "charge-controllers", label: "Charge Controllers" },
  { key: "monitoring-systems", label: "Monitoring Systems" },
  { key: "battery-accessories", label: "Battery Accessories" },
];

const DEFAULT_PARAMETERS: BatterySiteParametersFormValues = {
  annualLoadKwh: 48600,
  peakDemandKw: 14.2,
  loadProfile: [...DEFAULT_BATTERY_LOAD_PROFILE],
  backupLoadsKw: 9,
  targetBackupHours: 9,
  importRate: 0.15,
  exportRate: 0.05,
  demandChargePerKw: 12.5,
  touWindows: [{ start: "23:00", end: "07:00", rate: 0.08 }],
  sizingMode: "as-selected",
  optimizeFor: "self_sufficiency",
};

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1620714223084-8fcacc6dfd8d?w=400&h=300&fit=crop";

const mapProductToEquipment = (p: DesignProduct): CatalogEquipment => ({
  id: p.id,
  brand: p.manufacturer,
  model: p.name,
  imageUrl: p.imageUrls[0] || FALLBACK_IMAGE,
  outputSpec: p.outputSpec ?? "",
  technology: p.technology,
  additionalSpec: p.additional,
  efficiencyRating: p.efficiencyClass,
  warrantyYears: p.warrantyYears,
  rating: p.rating,
  price: p.priceAmount,
});

interface BatteryStorageDesignProps {
  isUtilityConnected: boolean;
  onRequestPermission: () => void;
  onBackToHvacModelling: () => void;
  onContinueToEvCharging: () => void;
  onGenerateDesign: (
    items: { equipment: CatalogEquipment; quantity: number }[],
    parameters: BatterySiteParametersFormValues,
  ) => void;
}

const BatteryStorageDesign: React.FC<BatteryStorageDesignProps> = ({
  onBackToHvacModelling,
  onContinueToEvCharging,
  onGenerateDesign,
}) => {
  const [siteParameters, setSiteParameters] =
    useState<BatterySiteParametersFormValues>(DEFAULT_PARAMETERS);
  const [isSiteParamsValid, setIsSiteParamsValid] = useState(true);
  const [activeTab, setActiveTab] = useState<string>("battery-systems");
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearch = useDebounce(searchQuery, 500);
  const [selectedItems, setSelectedItems] = useState<
    Record<string, { equipment: CatalogEquipment; quantity: number }>
  >({});
  const [designResult, setDesignResult] = useState<
    SolveBatteryDesignResponse["data"] | null
  >(null);
  const [viewingProductId, setViewingProductId] = useState<string | null>(null);

  const estInstallation = 3200;

  const { data: categoriesData } = useGetDesignProductCategoriesQuery({
    design: BATTERY_DESIGN_KEY,
    per_page: 100,
  });

  const tabs = useMemo(() => {
    const batteryCategories = (categoriesData?.data ?? [])
      .filter((category) => category.active)
      .sort((a, b) => a.sortOrder - b.sortOrder)
      .map((category) => ({
        key: category.key,
        label: category.name,
      }));

    return batteryCategories.length > 0 ? batteryCategories : FALLBACK_TABS;
  }, [categoriesData]);

  useEffect(() => {
    if (tabs.length > 0 && !tabs.some((tab) => tab.key === activeTab)) {
      setActiveTab(tabs[0].key);
    }
  }, [tabs, activeTab]);

  const {
    data: productsData,
    isLoading,
    isFetching,
  } = useGetDesignProductsQuery({
    design: BATTERY_DESIGN_KEY,
    category: activeTab,
    search: debouncedSearch || undefined,
    per_page: 20,
  });

  const isLoadingProducts = isFetching && !!debouncedSearch;
  const filteredEquipment = useMemo(
    () => (productsData?.data ?? []).map(mapProductToEquipment),
    [productsData],
  );

  const [computeBatteryDesign, { isLoading: isSolving }] =
    useComputeBatteryDesignMutation();

  const { data: viewingProduct } = useGetDesignProductByIdQuery(
    viewingProductId ?? "",
    { skip: viewingProductId === null },
  );

  const handleAdd = (equipment: CatalogEquipment) => {
    setSelectedItems((prev) => ({
      ...prev,
      [equipment.id]: { equipment, quantity: 1 },
    }));
  };

  const handleQuantityChange = (equipmentId: string, quantity: number) => {
    setSelectedItems((prev) => ({
      ...prev,
      [equipmentId]: { ...prev[equipmentId], quantity },
    }));
  };

  const handleTabChange = (key: string) => {
    setActiveTab(key);
    setSearchQuery("");
  };

  const handleGenerateDesign = async () => {
    if (!isSiteParamsValid) return;

    const items = Object.values(selectedItems).map((item) => ({
      product_id: item.equipment.id,
      quantity: item.quantity,
    }));

    try {
      const res = await computeBatteryDesign(
        toSolveBatteryDesignPayload(items, siteParameters),
      ).unwrap();

      setDesignResult(res.data);
      onGenerateDesign(Object.values(selectedItems), siteParameters);
    } catch (err) {
      console.error("Failed to solve battery design:", err);
    }
  };

  return (
    <div className="space-y-6">
      <Welcome
        title="Battery Storage Design & Equipment Configuration"
        description="Design battery storage systems for renewable energy integration."
        Icons={BatteryCharging}
        iconBg="bg-[#F3E8FF]"
        iconColor="text-[#9810FA]"
        className="border border-[rgba(152,16,250,0.20)]! bg-[linear-gradient(90deg,_rgba(152,16,250,0.08)_0%,_rgba(192,38,211,0.08)_100%)]!"
        size="3xl"
      />

      <Welcome
        title="Utility Data Connection Required"
        description="Connect your utility provider to automatically import electricity and gas consumption data."
        variant="secondary"
        isConnected
        actions={
          <CommonButton variant="primaryBlue" className="">
            Request Permission
          </CommonButton>
        }
      />

      <BatterySiteParametersForm
        parameters={siteParameters}
        onChange={setSiteParameters}
        onValidityChange={setIsSiteParamsValid}
      />

      <div className="bg-white border border-[#E7E9E8] rounded-2xl ">
        <div className="px-6 py-5">
          <SectionHeader
            size="xl"
            title="Recommended Equipment & Components"
            description="Select products from each category to configure your battery storage system."
          />
        </div>
        <Separator />
        <div className="px-6 py-5 space-y-4 w-full">
          <div className="w-full overflow-x-auto no-scrollbar">
            <StandardTabs
              tabs={tabs}
              activeTab={activeTab}
              onChange={(key) => handleTabChange(key as string)}
            />
          </div>
          <div className=" gap-4 w-full">
            <ColorSearch
              className="w-full!"
              isLoading={isLoadingProducts}
              value={searchQuery}
              onChange={setSearchQuery}
            />
          </div>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-10">
            <Spinner size="xl" text="Product loading..." />
          </div>
        ) : filteredEquipment.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 py-5 px-6">
            {filteredEquipment.map((equipment) => {
              const selected = selectedItems[equipment.id];
              return (
                <EquipmentCard
                  key={equipment.id}
                  equipment={equipment}
                  isSelected={!!selected}
                  quantity={selected?.quantity ?? 1}
                  onAdd={() => handleAdd(equipment)}
                  onQuantityChange={(qty) =>
                    handleQuantityChange(equipment.id, qty)
                  }
                  onViewDetails={() => setViewingProductId(equipment.id)}
                />
              );
            })}
          </div>
        ) : (
          <p className="text-[#758179] text-sm py-8 text-center">
            {searchQuery
              ? `No products match "${searchQuery}" in this category.`
              : "No products available in this category yet."}
          </p>
        )}

        <div className="px-6 py-5">
          {Object.keys(selectedItems).length > 0 && (
            <SelectedEquipmentSummary
              items={Object.values(selectedItems)}
              estInstallation={estInstallation}
              onGenerateDesign={handleGenerateDesign}
              buttonLabel="Generate Battery System Design"
              isLoading={isSolving}
              disabled={!isSiteParamsValid}
            />
          )}
        </div>
      </div>

      {designResult && <BatterySystemResults results={designResult} />}

      {viewingProductId !== null && viewingProduct && (
        <BatteryProductDetailsModal
          product={viewingProduct}
          isSelected={!!selectedItems[viewingProductId]}
          onClose={() => setViewingProductId(null)}
          onAddToDesign={() => {
            handleAdd(mapProductToEquipment(viewingProduct));
            setViewingProductId(null);
          }}
        />
      )}

      <div className="flex sm:items-center flex-col sm:flex-row gap-3 justify-between">
        <CommonButton
          to="../hvac-modelling"
          variant="outline"
          onClick={onBackToHvacModelling}
        >
          <ArrowLeft className="w-4 h-4 mr-1.5" />
          Back to HVAC Modelling
        </CommonButton>

        {designResult && (
          <CommonButton
            to="../ev-charging"
            variant="primary"
            onClick={onContinueToEvCharging}
          >
            Continue to EV Charging
          </CommonButton>
        )}
      </div>
    </div>
  );
};

export default BatteryStorageDesign;
