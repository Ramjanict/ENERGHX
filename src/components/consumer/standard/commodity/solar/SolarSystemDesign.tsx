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
import { useComputeSolarDesignMutation } from "@/store/consumer/standard/designs/designPost/designPostApi";
import {
  SiteParametersFormValues,
  siteParametersDefaultValues,
  toSolveSolarDesignPayload,
} from "@/store/consumer/standard/designs/solar/schema/siteParametersSchema";
import { SolveSolarDesignData } from "@/store/consumer/standard/designs/solar/types/solarDesign";
import { ArrowLeft, Sun } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import ColorSearch from "./ColorSearch";
import EquipmentCard, { CatalogEquipment } from "./EquipmentCard";
import ProductDetailsModal from "./ProductDetailsModal";
import SelectedEquipmentSummary from "./SelectedEquipmentSummary";
import SiteParametersForm from "./SiteParametersForm";
import SolarSystemResults from "./SolarSystemResults";

const SOLAR_DESIGN_KEY = "solar";

const FALLBACK_TABS = [
  { key: "solar-pv-modules", label: "Solar PV Modules" },
  { key: "inverters", label: "Inverters" },
  { key: "mounting-systems", label: "Mounting Systems" },
  { key: "monitoring-devices", label: "Monitoring Devices" },
  { key: "solar-accessories", label: "Solar Accessories" },
];

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1509391366360-2e959784a276?w=400&h=300&fit=crop";

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

interface SolarSystemDesignProps {
  isUtilityConnected: boolean;
  onRequestPermission: () => void;
  onBackToCommoditySetup: () => void;
  onContinueToWindSizing: () => void;
  onGenerateDesign: (
    items: { equipment: CatalogEquipment; quantity: number }[],
    parameters: SiteParametersFormValues,
  ) => void;
}

const SolarSystemDesign: React.FC<SolarSystemDesignProps> = ({
  onBackToCommoditySetup,
  onContinueToWindSizing,
  onGenerateDesign,
}) => {
  const [siteParameters, setSiteParameters] =
    useState<SiteParametersFormValues>(siteParametersDefaultValues);
  const [isSiteParamsValid, setIsSiteParamsValid] = useState(true);
  const [activeTab, setActiveTab] = useState<string>("solar-pv-modules");
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearch = useDebounce(searchQuery, 500);
  const [selectedItems, setSelectedItems] = useState<
    Record<string, { equipment: CatalogEquipment; quantity: number }>
  >({});
  const [designResult, setDesignResult] = useState<SolveSolarDesignData | null>(
    null,
  );
  const [viewingProductId, setViewingProductId] = useState<string | null>(null);

  const estInstallation = 52;

  const { data: categoriesData } = useGetDesignProductCategoriesQuery({
    design: SOLAR_DESIGN_KEY,
    per_page: 100,
  });

  const tabs = useMemo(() => {
    const solarCategories = (categoriesData?.data ?? [])
      .filter((category) => category.active)
      .sort((a, b) => a.sortOrder - b.sortOrder)
      .map((category) => ({
        key: category.key,
        label: category.name,
      }));

    return solarCategories.length > 0 ? solarCategories : FALLBACK_TABS;
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
    design: SOLAR_DESIGN_KEY,
    category: activeTab,
    search: debouncedSearch || undefined,
    per_page: 20,
  });

  const isLoadingProducts = isFetching && !!debouncedSearch;
  const filteredEquipment = useMemo(
    () => (productsData?.data ?? []).map(mapProductToEquipment),
    [productsData],
  );

  const [computeSolarDesign, { isLoading: isSolving }] =
    useComputeSolarDesignMutation();

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
      const res = await computeSolarDesign(
        toSolveSolarDesignPayload(items, siteParameters),
      ).unwrap();

      setDesignResult(res.data as unknown as SolveSolarDesignData);
      onGenerateDesign(Object.values(selectedItems), siteParameters);
    } catch (err) {
      console.error("Failed to solve solar design:", err);
    }
  };

  const { data: viewingProduct } = useGetDesignProductByIdQuery(
    viewingProductId ?? "",
    { skip: viewingProductId === null },
  );

  return (
    <div className="space-y-6">
      <Welcome
        title="Professional Solar System Design & Equipment Configuration"
        description="Configure installation deliverables and engineering parameters for the proposed solar energy system."
        Icons={Sun}
        iconBg="bg-[#FEF9C2]"
        iconColor="text-[#D08700]"
        className="border border-[rgba(240,177,0,0.20)]! bg-[linear-gradient(90deg,_rgba(240,177,0,0.10)_0%,_rgba(255,105,0,0.10)_100%)]!"
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

      <SiteParametersForm
        parameters={siteParameters}
        onChange={setSiteParameters}
        onValidityChange={setIsSiteParamsValid}
      />

      <div className="bg-white border border-[#E7E9E8] rounded-2xl ">
        <div className="px-6 py-5">
          <SectionHeader
            size="xl"
            title="Recommended Equipment & Components"
            description="Select products from each category to configure your solar energy
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
              buttonLabel="Generate Solar System Design"
              isLoading={isSolving}
              disabled={!isSiteParamsValid}
            />
          )}
        </div>
      </div>

      {designResult && <SolarSystemResults results={designResult} />}

      {viewingProductId !== null && viewingProduct && (
        <ProductDetailsModal
          product={viewingProduct}
          isSelected={!!selectedItems[viewingProductId]}
          onClose={() => setViewingProductId(null)}
          onAddToDesign={() => {
            handleAdd(mapProductToEquipment(viewingProduct));
            setViewingProductId(null);
          }}
        />
      )}

      <div className="flex flex-col sm:flex-row  sm:items-center justify-between gap-3 w-full">
        <CommonButton
          to="../energy-commodity-setup"
          variant="outline"
          onClick={onBackToCommoditySetup}
        >
          <ArrowLeft className="w-4 h-4 mr-1.5" />
          Back to Commodity Setup
        </CommonButton>

        {designResult && (
          <CommonButton onClick={onContinueToWindSizing} to="../wind-energy">
            Continue to Wind Sizing
          </CommonButton>
        )}
      </div>
    </div>
  );
};

export default SolarSystemDesign;
