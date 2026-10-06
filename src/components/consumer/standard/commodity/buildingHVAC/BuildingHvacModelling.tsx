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
import { useComputeHvacDesignMutation } from "@/store/consumer/standard/designs/designPost/designPostApi";
import {
  HvacRecommendedEquipmentItem,
  SolveHvacDesignData,
} from "@/store/consumer/standard/designs/designPost/types/hvac";
import { buildCoolingLoadProfile } from "@/store/consumer/standard/designs/hvac/coolingLoadProfile";
import { HvacSiteParametersFormValues } from "@/store/consumer/standard/designs/hvac/schema/siteParametersSchema";
import { ArrowLeft, Thermometer } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import ColorSearch from "../solar/ColorSearch";
import EquipmentCard, { CatalogEquipment } from "../solar/EquipmentCard";
import SelectedEquipmentSummary from "../solar/SelectedEquipmentSummary";
import HvacProductDetailsModal from "./HvacProductDetailsModal";
import HvacSiteParametersForm from "./HvacSiteParametersForm";
import HvacSystemResults from "./HvacSystemResults";

const HVAC_DESIGN_KEY = "hvac";

const FALLBACK_TABS = [
  { key: "heat-pumps", label: "Heat Pumps" },
  { key: "air-conditioners", label: "Air Conditioners" },
  { key: "air-handling-units", label: "Air Handling Units" },
  { key: "ventilation-systems", label: "Ventilation Systems" },
  { key: "thermostats-controls", label: "Thermostats & Controls" },
  { key: "hvac-accessories", label: "HVAC Accessories" },
];

const DEFAULT_PARAMETERS: HvacSiteParametersFormValues = {
  annualLoadKwh: 48600,
  peakCoolingLoadKw: 12.4,
  baseCoolingLoadKw: 3,
  peakHour: 12,
  electricityTariffRate: 0.15,
  currency: "USD",
  horizonYears: 20,
  sizingMode: "size-to-load",
};

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1631545806609-4ba5d1b0d0d5?w=400&h=300&fit=crop";

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

const mapRecommendedToEquipment = (
  item: HvacRecommendedEquipmentItem,
): CatalogEquipment => ({
  id: String(item.product_id),
  brand: item.manufacturer,
  model: item.name,
  imageUrl: FALLBACK_IMAGE,
  outputSpec: item.output_spec,
  technology: item.technology,
  additionalSpec: item.additional,
  efficiencyRating: item.efficiency_class,
  warrantyYears: item.warranty_years,
  rating: item.rating,
  price: item.price?.amount ?? null,
});

interface BuildingHvacModellingProps {
  isUtilityConnected: boolean;
  onRequestPermission: () => void;
  onBackToEngineeringServices: () => void;
  onContinueToBatteryStorage: () => void;
  onGenerateConfiguration: (
    items: { equipment: CatalogEquipment; quantity: number }[],
    parameters: HvacSiteParametersFormValues,
  ) => void;
}

const BuildingHvacModelling: React.FC<BuildingHvacModellingProps> = ({
  onBackToEngineeringServices,
  onContinueToBatteryStorage,
  onGenerateConfiguration,
}) => {
  const [siteParameters, setSiteParameters] =
    useState<HvacSiteParametersFormValues>(DEFAULT_PARAMETERS);
  const [isSiteParamsValid, setIsSiteParamsValid] = useState(true);
  const [activeTab, setActiveTab] = useState<string>("heat-pumps");
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearch = useDebounce(searchQuery, 500);
  const [selectedItems, setSelectedItems] = useState<
    Record<string, { equipment: CatalogEquipment; quantity: number }>
  >({});
  const [designResult, setDesignResult] = useState<SolveHvacDesignData | null>(
    null,
  );
  const [viewingProductId, setViewingProductId] = useState<string | null>(null);

  const estInstallation = 2400;

  const { data: categoriesData } = useGetDesignProductCategoriesQuery({
    design: HVAC_DESIGN_KEY,
    per_page: 100,
  });

  const tabs = useMemo(() => {
    const hvacCategories = (categoriesData?.data ?? [])
      .filter((category) => category.active)
      .sort((a, b) => a.sortOrder - b.sortOrder)
      .map((category) => ({
        key: category.key,
        label: category.name,
      }));

    return hvacCategories.length > 0 ? hvacCategories : FALLBACK_TABS;
  }, [categoriesData]);

  useEffect(() => {
    if (tabs.length > 0 && !tabs.some((tab) => tab.key === activeTab)) {
      setActiveTab(tabs[0].key);
    }
  }, [tabs, activeTab]);

  const categoryLabels = useMemo(
    () =>
      Object.fromEntries(tabs.map((tab) => [tab.key, tab.label])) as Record<
        string,
        string
      >,
    [tabs],
  );

  const {
    data: productsData,
    isLoading,
    isFetching,
  } = useGetDesignProductsQuery({
    design: HVAC_DESIGN_KEY,
    category: activeTab,
    search: debouncedSearch || undefined,
    per_page: 20,
  });

  const isLoadingProducts = isFetching && !!debouncedSearch;
  const filteredEquipment = useMemo(
    () => (productsData?.data ?? []).map(mapProductToEquipment),
    [productsData],
  );

  const [computeHvacDesign, { isLoading: isSolving }] =
    useComputeHvacDesignMutation();

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
      const res = await computeHvacDesign({
        items,
        user: {
          annual_load_kwh: siteParameters.annualLoadKwh,
          tenant_id: "abc-123",
        },
        building: {
          cooling_load_profile_kw: buildCoolingLoadProfile({
            peakCoolingLoadKw: siteParameters.peakCoolingLoadKw,
            baseCoolingLoadKw: siteParameters.baseCoolingLoadKw,
            peakHour: siteParameters.peakHour,
          }),
        },
        finance: {
          electricity_tariff_rate: siteParameters.electricityTariffRate,
          currency: siteParameters.currency,
        },
        options: {
          horizon_years: siteParameters.horizonYears,
          sizing_mode: siteParameters.sizingMode,
        },
      }).unwrap();

      setDesignResult(res.data);
      onGenerateConfiguration(Object.values(selectedItems), siteParameters);
    } catch (err) {
      console.error("Failed to solve HVAC design:", err);
    }
  };

  const handleSelectRecommended = (productId: string) => {
    const recommended = designResult?.results.recommendedEquipment.items.find(
      (item) => String(item.product_id) === productId,
    );
    if (recommended) handleAdd(mapRecommendedToEquipment(recommended));
  };

  return (
    <div className="space-y-6">
      <Welcome
        title="Building HVAC Modelling & Equipment Configuration"
        description="Analyse cooling and heating loads and configure recommended HVAC equipment."
        Icons={Thermometer}
        iconBg="bg-[#DBEAFE]"
        iconColor="text-[#1D4ED8]"
        className="border border-[rgba(29,78,216,0.20)]! bg-[linear-gradient(90deg,_rgba(29,78,216,0.08)_0%,_rgba(59,130,246,0.08)_100%)]!"
        size="3xl"
      />

      <Welcome
        title="Utility Data Connection"
        description="Connect your utility provider to automatically import electricity and gas consumption data."
        variant="secondary"
        isConnected
        actions={
          <CommonButton variant="primaryBlue" className="">
            Request Permission
          </CommonButton>
        }
      />

      <HvacSiteParametersForm
        parameters={siteParameters}
        onChange={setSiteParameters}
        onValidityChange={setIsSiteParamsValid}
      />

      <div className="bg-white border border-[#E7E9E8] rounded-2xl ">
        <div className="px-6 py-5">
          <SectionHeader
            size="xl"
            title="Recommended Equipment & Components"
            description="Select products from each category to configure your HVAC system."
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
              buttonLabel="Generate HVAC System Design"
              isLoading={isSolving}
              disabled={!isSiteParamsValid}
            />
          )}
        </div>
      </div>

      {designResult && (
        <HvacSystemResults
          results={designResult}
          selectedProductIds={Object.keys(selectedItems)}
          categoryLabels={categoryLabels}
          onSelectProduct={handleSelectRecommended}
          onViewProductDetails={setViewingProductId}
        />
      )}

      {viewingProductId !== null && viewingProduct && (
        <HvacProductDetailsModal
          product={viewingProduct}
          isSelected={!!selectedItems[viewingProductId]}
          onClose={() => setViewingProductId(null)}
          onAddToDesign={() => {
            handleAdd(mapProductToEquipment(viewingProduct));
            setViewingProductId(null);
          }}
        />
      )}

      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
        <CommonButton
          to="../engineering-services"
          variant="outline"
          onClick={onBackToEngineeringServices}
        >
          <ArrowLeft className="w-4 h-4 mr-1.5" />
          Back to Engineering Services
        </CommonButton>

        {designResult && (
          <CommonButton
            to="../battery-storage"
            onClick={onContinueToBatteryStorage}
          >
            Continue to Battery Storage
          </CommonButton>
        )}
      </div>
    </div>
  );
};

export default BuildingHvacModelling;
