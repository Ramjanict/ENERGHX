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
import { useComputeBiomassDesignMutation } from "@/store/consumer/standard/designs/designPost/designPostApi";
import { SolveBiomassDesignData } from "@/store/consumer/standard/designs/designPost/types/biomass";
import { BiomassSiteParametersFormValues } from "@/store/consumer/standard/designs/biomass/schema/siteParametersSchema";
import { ArrowLeft, Leaf } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import ColorSearch from "../solar/ColorSearch";
import EquipmentCard, { CatalogEquipment } from "../solar/EquipmentCard";
import SelectedEquipmentSummary from "../solar/SelectedEquipmentSummary";
import BiomassProductDetailsModal from "./BiomassProductDetailsModal";
import BiomassSiteParametersForm from "./BiomassSiteParametersForm";
import BiomassSystemResults from "./BiomassSystemResults";

const BIOMASS_DESIGN_KEY = "biomass";

const FALLBACK_TABS = [
  { key: "boilers", label: "Boilers" },
  { key: "biogas-generator-kits", label: "Biogas Generator Kits" },
  { key: "biomass-conversion-systems", label: "Biomass Conversion Systems" },
  { key: "feedstock-equipment", label: "Feedstock Equipment" },
  { key: "biomass-accessories", label: "Biomass Accessories" },
];

const DEFAULT_PARAMETERS: BiomassSiteParametersFormValues = {
  locationLabel: "Lagos, Nigeria",
  currency: "USD",
  feedstockAvailability: "Excellent",
  feedstock: "Cattle dung",
  environmentTemperatureC: 28,
  slurryFeedstockKg: 1,
  slurryWaterKg: 3,
  heatingSeasonMonths: 5,
  heatingDemandKwhPerYear: 37500,
  annualLoadKwh: 17053,
  usageProfile: "intermittent",
  fuelCostPerTonne: 280,
  energyDensityKwhPerKg: 4.8,
  moistureContentPct: 8,
  tariffRatePerKwhThermal: 0.13,
  incumbentFuel: "Heating oil",
  horizonYears: 20,
  savingsBasis: "gross",
  storageMonths: 3,
};

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=400&h=300&fit=crop";

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

interface BiomassSystemDesignProps {
  isUtilityConnected: boolean;
  onRequestPermission: () => void;
  onBackToWindSizing: () => void;
  onContinueToValidation: () => void;
  onGenerateDesign: (
    items: { equipment: CatalogEquipment; quantity: number }[],
    parameters: BiomassSiteParametersFormValues,
  ) => void;
}

const BiomassSystemDesign: React.FC<BiomassSystemDesignProps> = ({
  onBackToWindSizing,
  onContinueToValidation,
  onGenerateDesign,
}) => {
  const [siteParameters, setSiteParameters] =
    useState<BiomassSiteParametersFormValues>(DEFAULT_PARAMETERS);
  const [isSiteParamsValid, setIsSiteParamsValid] = useState(true);
  const [activeTab, setActiveTab] = useState<string>("boilers");
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearch = useDebounce(searchQuery, 500);
  const [selectedItems, setSelectedItems] = useState<
    Record<string, { equipment: CatalogEquipment; quantity: number }>
  >({});
  const [designResult, setDesignResult] =
    useState<SolveBiomassDesignData | null>(null);
  const [viewingProductId, setViewingProductId] = useState<string | null>(null);

  const estInstallation = 3600;

  const { data: categoriesData } = useGetDesignProductCategoriesQuery({
    design: BIOMASS_DESIGN_KEY,
    per_page: 100,
  });

  const tabs = useMemo(() => {
    const biomassCategories = (categoriesData?.data ?? [])
      .filter((category) => category.active)
      .sort((a, b) => a.sortOrder - b.sortOrder)
      .map((category) => ({
        key: category.key,
        label: category.name,
      }));

    return biomassCategories.length > 0 ? biomassCategories : FALLBACK_TABS;
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
    design: BIOMASS_DESIGN_KEY,
    category: activeTab,
    search: debouncedSearch || undefined,
    per_page: 20,
  });

  const isLoadingProducts = isFetching && !!debouncedSearch;
  const filteredEquipment = useMemo(
    () => (productsData?.data ?? []).map(mapProductToEquipment),
    [productsData],
  );

  const [computeBiomassDesign, { isLoading: isSolving }] =
    useComputeBiomassDesignMutation();

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
      const res = await computeBiomassDesign({
        items,
        context: {
          feedstock_availability: siteParameters.feedstockAvailability,
          feedstock: siteParameters.feedstock,
          environment_temperature_c: siteParameters.environmentTemperatureC,
          slurry_mixture_ratio: {
            feedstock_kg: siteParameters.slurryFeedstockKg,
            water_kg: siteParameters.slurryWaterKg,
          },
        },
        demand: {
          heating_demand_kwh_yr: siteParameters.heatingDemandKwhPerYear,
          annual_load_kwh: siteParameters.annualLoadKwh,
          usage_profile: siteParameters.usageProfile,
        },
        fuel: {
          cost_per_tonne: siteParameters.fuelCostPerTonne,
          currency: siteParameters.currency,
          energy_density_kwh_kg: siteParameters.energyDensityKwhPerKg,
          moisture_content_pct: siteParameters.moistureContentPct,
        },
        tariff: {
          rate_per_kwh_thermal: siteParameters.tariffRatePerKwhThermal,
          incumbent_fuel: siteParameters.incumbentFuel,
          currency: siteParameters.currency,
        },
        options: {
          horizon_years: siteParameters.horizonYears,
          savings_basis: siteParameters.savingsBasis,
          storage_months: siteParameters.storageMonths,
        },
      }).unwrap();

      setDesignResult(res.data);
      onGenerateDesign(Object.values(selectedItems), siteParameters);
    } catch (err) {
      console.error("Failed to solve biomass design:", err);
    }
  };

  const { data: viewingProduct } = useGetDesignProductByIdQuery(
    viewingProductId ?? "",
    { skip: viewingProductId === null },
  );

  return (
    <div className="space-y-6">
      <Welcome
        title="Professional Biomass System Design & Equipment Configuration"
        description="Configure installation deliverables and engineering parameters for the proposed biomass energy system."
        Icons={Leaf}
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

      <BiomassSiteParametersForm
        parameters={siteParameters}
        onChange={setSiteParameters}
        onValidityChange={setIsSiteParamsValid}
      />

      <div className="bg-white border border-[#E7E9E8] rounded-2xl ">
        <div className="px-6 py-5">
          <SectionHeader
            size="xl"
            title="Recommended Equipment & Components"
            description="Select products from each category to configure your biomass energy
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
              buttonLabel="Generate Biomass System Design"
              isLoading={isSolving}
              disabled={!isSiteParamsValid}
            />
          )}
        </div>
      </div>

      {designResult && <BiomassSystemResults results={designResult} />}

      {viewingProductId !== null && viewingProduct && (
        <BiomassProductDetailsModal
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
          to="../wind-energy"
          variant="outline"
          onClick={onBackToWindSizing}
        >
          <ArrowLeft className="w-4 h-4 mr-1.5" />
          Back to Wind Sizing
        </CommonButton>

        {designResult && (
          <CommonButton
            to="../res-sequence-validation"
            variant="primary"
            onClick={onContinueToValidation}
          >
            Next: System Validation
          </CommonButton>
        )}
      </div>
    </div>
  );
};

export default BiomassSystemDesign;
