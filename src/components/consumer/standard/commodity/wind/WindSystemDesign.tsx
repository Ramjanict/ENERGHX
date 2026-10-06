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
import { useComputeWindDesignMutation } from "@/store/consumer/standard/designs/designPost/designPostApi";
import {
  toSolveWindDesignPayload,
  windSiteParametersDefaultValues,
  WindSiteParametersFormValues,
} from "@/store/consumer/standard/designs/wind/schema/siteParametersSchema";
import { SolveWindDesignData } from "@/store/consumer/standard/designs/wind/types/windDesign";
import { ArrowLeft, Wind } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import ColorSearch from "../solar/ColorSearch";
import EquipmentCard, { CatalogEquipment } from "../solar/EquipmentCard";
import SelectedEquipmentSummary from "../solar/SelectedEquipmentSummary";
import WindProductDetailsModal from "./WindProductDetailsModal";
import WindSiteParametersForm from "./WindSiteParametersForm";
import WindSystemResults from "./WindSystemResults";

const WIND_DESIGN_KEY = "wind";

const FALLBACK_TABS = [
  { key: "wind-turbines", label: "Wind Turbines" },
  { key: "inverters", label: "Inverters" },
  { key: "controllers", label: "Controllers" },
  { key: "monitoring-systems", label: "Monitoring Systems" },
  { key: "wind-accessories", label: "Wind Accessories" },
];

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1466611653911-95081537e5b7?w=400&h=300&fit=crop";

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

interface WindSystemDesignProps {
  isUtilityConnected: boolean;
  onRequestPermission: () => void;
  onBackToSolarSizing: () => void;
  onContinueToBiomassSizing: () => void;
  onGenerateDesign: (
    items: { equipment: CatalogEquipment; quantity: number }[],
    parameters: WindSiteParametersFormValues,
  ) => void;
}

const WindSystemDesign: React.FC<WindSystemDesignProps> = ({
  onRequestPermission,
  onBackToSolarSizing,
  onContinueToBiomassSizing,
  onGenerateDesign,
}) => {
  const [siteParameters, setSiteParameters] =
    useState<WindSiteParametersFormValues>(windSiteParametersDefaultValues);
  const [isSiteParamsValid, setIsSiteParamsValid] = useState(true);
  const [activeTab, setActiveTab] = useState<string>("wind-turbines");
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearch = useDebounce(searchQuery, 500);
  const [selectedItems, setSelectedItems] = useState<
    Record<string, { equipment: CatalogEquipment; quantity: number }>
  >({});
  const [designResult, setDesignResult] = useState<SolveWindDesignData | null>(
    null,
  );
  const [viewingProductId, setViewingProductId] = useState<string | null>(null);

  const estInstallation = 13500;

  const { data: categoriesData } = useGetDesignProductCategoriesQuery({
    design: WIND_DESIGN_KEY,
    per_page: 100,
  });

  const tabs = useMemo(() => {
    const windCategories = (categoriesData?.data ?? [])
      .filter((category) => category.active)
      .sort((a, b) => a.sortOrder - b.sortOrder)
      .map((category) => ({
        key: category.key,
        label: category.name,
      }));

    return windCategories.length > 0 ? windCategories : FALLBACK_TABS;
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
    design: WIND_DESIGN_KEY,
    category: activeTab,
    search: debouncedSearch || undefined,
    per_page: 20,
  });

  const isLoadingProducts = isFetching && !!debouncedSearch;
  const filteredEquipment = useMemo(
    () => (productsData?.data ?? []).map(mapProductToEquipment),
    [productsData],
  );

  const [computeWindDesign, { isLoading: isSolving }] =
    useComputeWindDesignMutation();

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
      const res = await computeWindDesign(
        toSolveWindDesignPayload(items, siteParameters),
      ).unwrap();

      setDesignResult(res.data as unknown as SolveWindDesignData);
      onGenerateDesign(Object.values(selectedItems), siteParameters);
    } catch (err) {
      console.error("Failed to solve wind design:", err);
    }
  };

  const { data: viewingProduct } = useGetDesignProductByIdQuery(
    viewingProductId ?? "",
    { skip: viewingProductId === null },
  );

  return (
    <div className="space-y-6">
      <Welcome
        title="Professional Wind System Design & Equipment Configuration"
        description="Configure installation deliverables and engineering parameters for the proposed wind energy system."
        Icons={Wind}
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
          <CommonButton
            variant="primaryBlue"
            className=""
            onClick={onRequestPermission}
          >
            Request Permission
          </CommonButton>
        }
      />

      <WindSiteParametersForm
        parameters={siteParameters}
        onChange={setSiteParameters}
        onValidityChange={setIsSiteParamsValid}
      />

      <div className="bg-white border border-[#E7E9E8] rounded-2xl ">
        <div className="px-6 py-5">
          <SectionHeader
            size="xl"
            title="Recommended Equipment & Components"
            description="Select products from each category to configure your wind energy
          system."
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
              buttonLabel="Generate Wind System Design"
              isLoading={isSolving}
              disabled={!isSiteParamsValid}
            />
          )}
        </div>
      </div>

      {designResult && <WindSystemResults results={designResult} />}

      {viewingProductId !== null && viewingProduct && (
        <WindProductDetailsModal
          product={viewingProduct}
          isSelected={!!selectedItems[viewingProductId]}
          onClose={() => setViewingProductId(null)}
          onAddToDesign={() => {
            handleAdd(mapProductToEquipment(viewingProduct));
            setViewingProductId(null);
          }}
        />
      )}

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <CommonButton
          to="../solar-energy"
          variant="outline"
          onClick={onBackToSolarSizing}
        >
          <ArrowLeft className="w-4 h-4 mr-1.5" />
          Back to Solar Sizing
        </CommonButton>

        {designResult && (
          <CommonButton
            onClick={onContinueToBiomassSizing}
            to="../biomass-energy"
          >
            Continue to Biomass Sizing
          </CommonButton>
        )}
      </div>
    </div>
  );
};

export default WindSystemDesign;
