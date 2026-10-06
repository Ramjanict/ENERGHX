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
import { useComputeEvDesignMutation } from "@/store/consumer/standard/designs/designPost/designPostApi";
import {
  EvSiteParametersFormValues,
  toSolveEvDesignPayload,
} from "@/store/consumer/standard/designs/ev/schema/siteParametersSchema";
import {
  EvProduct,
  SolveEvDesignResponse,
} from "@/store/consumer/standard/designs/ev/types/evDesign";
import { ArrowLeft, Car } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import ColorSearch from "../solar/ColorSearch";
import EquipmentCard, { CatalogEquipment } from "../solar/EquipmentCard";
import SelectedEquipmentSummary from "../solar/SelectedEquipmentSummary";
import EvProductDetailsModal from "./EvProductDetailsModal";
import EvSiteParametersForm from "./EvSiteParametersForm";
import EvSystemResults from "./EvSystemResults";

const EV_DESIGN_KEY = "ev_tech";

const FALLBACK_TABS = [
  { key: "ev-chargers", label: "EV Chargers" },
  { key: "dc-fast-chargers", label: "DC Fast Chargers" },
  { key: "charging-stations", label: "Charging Stations" },
  { key: "charging-management", label: "Charging Management" },
  { key: "ev-accessories", label: "EV Accessories" },
  { key: "electric-vehicles", label: "Electric Vehicles" },
];

const DEFAULT_PARAMETERS: EvSiteParametersFormValues = {
  annualLoadKwh: 120000,
  gridConnectionKw: 400,
  existingPeakDemandKw: 80,
  vehicleCount: 20,
  averageDailyDistance: 120,
  consumptionKwhPer100: 18,
  targetUptimePercent: 97,
  energyRate: 0.15,
  demandChargePerKw: 12,
  sizingMode: "size-to-fleet",
  distanceUnit: "km",
};

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1593941707882-a5bba14938c7?w=400&h=300&fit=crop";

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

/** Solve response still returns legacy snake_case product rows. */
const mapRecommendedProductToEquipment = (p: EvProduct): CatalogEquipment => ({
  id: String(p.product_id),
  brand: p.manufacturer,
  model: p.name,
  imageUrl: FALLBACK_IMAGE,
  outputSpec: p.output_spec,
  technology: p.technology,
  additionalSpec: p.additional,
  efficiencyRating: p.efficiency_class,
  warrantyYears: p.warranty_years,
  rating: p.rating,
  price: p.price?.amount ?? null,
});

interface EvChargingInfrastructureProps {
  isUtilityConnected: boolean;
  onRequestPermission: () => void;
  onBackToEngineeringServices: () => void;
  onContinueToBatteryStorage: () => void;
  onRunAnalysis: (
    items: { equipment: CatalogEquipment; quantity: number }[],
    parameters: EvSiteParametersFormValues,
  ) => void;
}

const EvChargingInfrastructure: React.FC<EvChargingInfrastructureProps> = ({
  onBackToEngineeringServices,
  onContinueToBatteryStorage,
  onRunAnalysis,
}) => {
  const [siteParameters, setSiteParameters] =
    useState<EvSiteParametersFormValues>(DEFAULT_PARAMETERS);
  const [isSiteParamsValid, setIsSiteParamsValid] = useState(true);
  const [activeTab, setActiveTab] = useState<string>("ev-chargers");
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearch = useDebounce(searchQuery, 500);
  const [selectedItems, setSelectedItems] = useState<
    Record<string, { equipment: CatalogEquipment; quantity: number }>
  >({});
  const [designResult, setDesignResult] = useState<
    SolveEvDesignResponse["data"] | null
  >(null);
  const [viewingProductId, setViewingProductId] = useState<string | null>(null);

  const estInstallation = 518;

  const { data: categoriesData } = useGetDesignProductCategoriesQuery({
    design: EV_DESIGN_KEY,
    per_page: 100,
  });

  const tabs = useMemo(() => {
    const evCategories = (categoriesData?.data ?? [])
      .filter((category) => category.active)
      .sort((a, b) => a.sortOrder - b.sortOrder)
      .map((category) => ({
        key: category.key,
        label: category.name,
      }));

    return evCategories.length > 0 ? evCategories : FALLBACK_TABS;
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
    design: EV_DESIGN_KEY,
    category: activeTab,
    search: debouncedSearch || undefined,
    per_page: 20,
  });

  const isLoadingProducts = isFetching && !!debouncedSearch;
  const filteredEquipment = useMemo(
    () => (productsData?.data ?? []).map(mapProductToEquipment),
    [productsData],
  );

  const [computeEvDesign, { isLoading: isSolving }] =
    useComputeEvDesignMutation();

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
      const res = await computeEvDesign(
        toSolveEvDesignPayload(items, siteParameters),
      ).unwrap();

      setDesignResult(res.data);
      onRunAnalysis(Object.values(selectedItems), siteParameters);
    } catch (err) {
      console.error("Failed to solve EV design:", err);
    }
  };

  const { data: viewingProduct } = useGetDesignProductByIdQuery(
    viewingProductId ?? "",
    { skip: viewingProductId === null },
  );

  const handleSelectRecommended = (productId: string | number) => {
    const recommended = designResult?.results.recommendedEquipment.items.find(
      (item) => String(item.product_id) === String(productId),
    );
    if (recommended) handleAdd(mapRecommendedProductToEquipment(recommended));
  };

  return (
    <div className="space-y-6">
      <Welcome
        title="EV Charging Infrastructure Design & Equipment Configuration"
        description="Design and size EV charging systems for residential and commercial buildings."
        Icons={Car}
        iconBg="bg-[#DCFCE7]"
        iconColor="text-[#16A34A]"
        className="border border-[rgba(22,163,74,0.20)]! bg-[linear-gradient(90deg,_rgba(22,163,74,0.08)_0%,_rgba(34,197,94,0.08)_100%)]!"
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

      <EvSiteParametersForm
        parameters={siteParameters}
        onChange={setSiteParameters}
        onValidityChange={setIsSiteParamsValid}
      />

      <div className="bg-white border border-[#E7E9E8] rounded-2xl ">
        <div className="px-6 py-5">
          <SectionHeader
            size="xl"
            title="Recommended Equipment & Components"
            description="Select products from each category to configure your EV charging
          infrastructure."
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
              buttonLabel="Run EV Infrastructure Analysis"
              isLoading={isSolving}
              disabled={!isSiteParamsValid}
            />
          )}
        </div>
      </div>

      {designResult && (
        <EvSystemResults
          results={designResult}
          selectedProductIds={Object.keys(selectedItems)}
          categoryLabels={categoryLabels}
          onSelectProduct={handleSelectRecommended}
          onViewProductDetails={(productId) =>
            setViewingProductId(String(productId))
          }
        />
      )}

      {viewingProductId !== null && viewingProduct && (
        <EvProductDetailsModal
          product={viewingProduct}
          isSelected={!!selectedItems[viewingProductId]}
          onClose={() => setViewingProductId(null)}
          onAddToDesign={() => {
            handleAdd(mapProductToEquipment(viewingProduct));
            setViewingProductId(null);
          }}
        />
      )}

      <div className="flex flex-col sm:flex-row gap-3 sm:items-center justify-between">
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

export default EvChargingInfrastructure;
