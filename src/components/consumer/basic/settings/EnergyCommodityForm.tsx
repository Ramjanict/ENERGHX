import CloseButton from "@/common/button/CloseButton";
import CommonBorderWrapper from "@/common/button/CommonBorderWrapper";
import CommonButton from "@/common/button/CommonButton";
import CommonSelect from "@/common/button/CommonSelect";
import SectionHeader from "@/common/header/SectionHeader";
import BMiniCard from "@/components/consumer/basic/building/card/BMiniCard";
import { inputClass } from "@/pages/Login";
import { useGetAllBuildingsQuery } from "@/store/consumer/basic/building/buildingApi";
import {
  useGetCommoditySetupQuery,
  useUpdateCommoditySetupMutation,
} from "@/store/consumer/standard/commoditySetup/commoditySetupApi";
import {
  EnergyPlanItem,
  ProviderPayload,
  PutCommoditySetupPayload,
} from "@/store/consumer/standard/commoditySetup/types/commoditySetup";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Building2,
  CheckCircle2,
  DollarSign,
  Flame,
  Globe,
  MapPin,
  Plus,
  Sparkles,
  TrendingUp,
  Zap,
} from "lucide-react";
import React, { useEffect, useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { z } from "zod";

interface ProviderOption extends ProviderPayload {
  id: string;
  label: string;
  type: "electricity" | "gas";
}

const DEFAULT_ELECTRICITY_PROVIDERS: ProviderOption[] = [
  {
    id: "demo-electricity",
    label: "Demo Electricity Provider (Lagos)",
    type: "electricity",
    utilityCompanyId: "c4ee6036-75ad-43f1-b1fb-e292b51ca0be",
    commodityId: "cbdfa157-5316-48fc-94f5-c402d01797b3",
    providerName: "Demo Electricity Provider",
    serviceTerritory: "Lagos",
    website: "https://example.com",
  },
  {
    id: "ekedc",
    label: "EKEDC (Eko Electricity Distribution)",
    type: "electricity",
    utilityCompanyId: "c4ee6036-75ad-43f1-b1fb-e292b51ca0be",
    commodityId: "cbdfa157-5316-48fc-94f5-c402d01797b3",
    providerName: "EKEDC",
    serviceTerritory: "Lagos",
    website: "https://ekedp.com",
  },
  {
    id: "coned",
    label: "ConEdison",
    type: "electricity",
    utilityCompanyId: "c4ee6036-75ad-43f1-b1fb-e292b51ca0be",
    commodityId: "cbdfa157-5316-48fc-94f5-c402d01797b3",
    providerName: "ConEdison",
    serviceTerritory: "New York",
    website: "https://coned.com",
  },
  {
    id: "national-grid",
    label: "National Grid",
    type: "electricity",
    utilityCompanyId: "c4ee6036-75ad-43f1-b1fb-e292b51ca0be",
    commodityId: "cbdfa157-5316-48fc-94f5-c402d01797b3",
    providerName: "National Grid",
    serviceTerritory: "Massachusetts",
    website: "https://nationalgridus.com",
  },
];

const DEFAULT_GAS_PROVIDERS: ProviderOption[] = [
  {
    id: "demo-gas",
    label: "Demo Gas Provider (Lagos)",
    type: "gas",
    utilityCompanyId: "aae98e42-6c48-4c34-9147-ff4e954bb601",
    commodityId: "d0f25159-37db-4baa-8ddb-44ce3971ff6e",
    providerName: "Demo Gas Provider",
    serviceTerritory: "Lagos",
    website: "https://example.com",
  },
  {
    id: "ngc",
    label: "Nigerian Gas Company",
    type: "gas",
    utilityCompanyId: "aae98e42-6c48-4c34-9147-ff4e954bb601",
    commodityId: "d0f25159-37db-4baa-8ddb-44ce3971ff6e",
    providerName: "Nigerian Gas Company",
    serviceTerritory: "Lagos",
    website: "https://example.com",
  },
  {
    id: "seplat",
    label: "SEPLAT Energy",
    type: "gas",
    utilityCompanyId: "aae98e42-6c48-4c34-9147-ff4e954bb601",
    commodityId: "d0f25159-37db-4baa-8ddb-44ce3971ff6e",
    providerName: "SEPLAT",
    serviceTerritory: "Lagos",
    website: "https://seplatenergy.com",
  },
  {
    id: "oando",
    label: "Oando Gas & Power",
    type: "gas",
    utilityCompanyId: "aae98e42-6c48-4c34-9147-ff4e954bb601",
    commodityId: "d0f25159-37db-4baa-8ddb-44ce3971ff6e",
    providerName: "Oando Gas",
    serviceTerritory: "Lagos",
    website: "https://oandoplc.com",
  },
];

const formSchema = z.object({
  buildingId: z.string().optional(),
  electricityProviderId: z
    .string()
    .nonempty("Please select an electricity provider"),
  gasProviderId: z.string().nonempty("Please select a gas provider"),
  selectedPlanType: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

const EnergyCommodityForm: React.FC = () => {
  const { data: commoditySetupData, isLoading: isSetupLoading } =
    useGetCommoditySetupQuery();
  const { data: buildingsData, isLoading: isBuildingsLoading } =
    useGetAllBuildingsQuery();

  const [updateCommoditySetup, { isLoading: isUpdating }] =
    useUpdateCommoditySetupMutation();

  const [customProviders, setCustomProviders] = useState<ProviderOption[]>([]);
  const [isCustomModalOpen, setIsCustomModalOpen] = useState(false);

  // Custom provider modal state
  const [customName, setCustomName] = useState("");
  const [customType, setCustomType] = useState<"electricity" | "gas">(
    "electricity",
  );
  const [customTerritory, setCustomTerritory] = useState("Lagos");
  const [customWebsite, setCustomWebsite] = useState("https://example.com");

  const buildings = buildingsData?.data ?? [];

  const {
    handleSubmit,
    control,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      buildingId: "",
      electricityProviderId: "",
      gasProviderId: "",
      selectedPlanType: "fixed-rate",
    },
  });

  const selectedBuildingId = watch("buildingId");
  const selectedElectricityId = watch("electricityProviderId");
  const selectedGasId = watch("gasProviderId");
  const selectedPlanType = watch("selectedPlanType");

  const activeBuilding = useMemo(() => {
    if (selectedBuildingId) {
      return (
        buildings.find((b) => b.user_building_details_id === selectedBuildingId) ??
        buildings[0]
      );
    }
    return buildings[0];
  }, [buildings, selectedBuildingId]);

  // Extract utilities from user buildings
  const buildingUtilities = useMemo(() => {
    const electricityList: ProviderOption[] = [];
    const gasList: ProviderOption[] = [];

    buildings.forEach((b) => {
      (b.user_building_utility ?? []).forEach((u) => {
        const isElec = u.commodity?.name?.toLowerCase().includes("electric");
        const isGas = u.commodity?.name?.toLowerCase().includes("gas");
        const stateName = u.utility?.states?.[0]?.state?.name || b.city || "Lagos";

        const option: ProviderOption = {
          id: `building-util-${u.utility?.utility_company_id}-${u.commodity?.commodity_id}`,
          label: `${u.utility?.utility_company_name || "Utility"} (${b.building_name})`,
          type: isGas ? "gas" : "electricity",
          utilityCompanyId:
            u.utility?.utility_company_id || "c4ee6036-75ad-43f1-b1fb-e292b51ca0be",
          commodityId:
            u.commodity?.commodity_id || "cbdfa157-5316-48fc-94f5-c402d01797b3",
          providerName: u.utility?.utility_company_name || "Building Utility",
          serviceTerritory: stateName,
          website: "https://example.com",
        };

        if (isElec) {
          electricityList.push(option);
        } else if (isGas) {
          gasList.push(option);
        } else {
          electricityList.push(option);
        }
      });
    });

    return { electricityList, gasList };
  }, [buildings]);

  // Merge available providers
  const allElectricityProviders = useMemo(() => {
    const list = [
      ...buildingUtilities.electricityList,
      ...customProviders.filter((p) => p.type === "electricity"),
      ...DEFAULT_ELECTRICITY_PROVIDERS,
    ];
    // Deduplicate by providerName or id
    const seen = new Set<string>();
    return list.filter((item) => {
      if (seen.has(item.label)) return false;
      seen.add(item.label);
      return true;
    });
  }, [buildingUtilities.electricityList, customProviders]);

  const allGasProviders = useMemo(() => {
    const list = [
      ...buildingUtilities.gasList,
      ...customProviders.filter((p) => p.type === "gas"),
      ...DEFAULT_GAS_PROVIDERS,
    ];
    const seen = new Set<string>();
    return list.filter((item) => {
      if (seen.has(item.label)) return false;
      seen.add(item.label);
      return true;
    });
  }, [buildingUtilities.gasList, customProviders]);

  // Initialize form defaults when data loads
  useEffect(() => {
    if (activeBuilding?.user_building_details_id && !selectedBuildingId) {
      setValue("buildingId", activeBuilding.user_building_details_id);
    }

    if (!selectedElectricityId && allElectricityProviders.length > 0) {
      // If setupData has an electricityProvider matching
      const fromApi = commoditySetupData?.electricityProvider;
      const match = allElectricityProviders.find(
        (p) =>
          p.providerName === fromApi?.providerName ||
          p.utilityCompanyId === fromApi?.utilityCompanyId,
      );
      setValue("electricityProviderId", match ? match.id : allElectricityProviders[0].id);
    }

    if (!selectedGasId && allGasProviders.length > 0) {
      const fromApi = commoditySetupData?.gasProvider;
      const match = allGasProviders.find(
        (p) =>
          p.providerName === fromApi?.providerName ||
          p.utilityCompanyId === fromApi?.utilityCompanyId,
      );
      setValue("gasProviderId", match ? match.id : allGasProviders[0].id);
    }
  }, [
    activeBuilding,
    allElectricityProviders,
    allGasProviders,
    commoditySetupData,
    selectedBuildingId,
    selectedElectricityId,
    selectedGasId,
    setValue,
  ]);

  const handleAddCustomProvider = () => {
    if (!customName.trim()) {
      toast.error("Please enter a provider name");
      return;
    }

    const newProvider: ProviderOption = {
      id: `custom-${Date.now()}`,
      label: `${customName.trim()} (${customTerritory || "Custom"})`,
      type: customType,
      utilityCompanyId:
        customType === "electricity"
          ? "c4ee6036-75ad-43f1-b1fb-e292b51ca0be"
          : "aae98e42-6c48-4c34-9147-ff4e954bb601",
      commodityId:
        customType === "electricity"
          ? "cbdfa157-5316-48fc-94f5-c402d01797b3"
          : "d0f25159-37db-4baa-8ddb-44ce3971ff6e",
      providerName: customName.trim(),
      serviceTerritory: customTerritory || "Lagos",
      website: customWebsite || "https://example.com",
    };

    setCustomProviders((prev) => [newProvider, ...prev]);

    if (customType === "electricity") {
      setValue("electricityProviderId", newProvider.id, { shouldValidate: true });
    } else {
      setValue("gasProviderId", newProvider.id, { shouldValidate: true });
    }

    toast.success(`Added ${newProvider.providerName} to ${customType} providers!`);
    setIsCustomModalOpen(false);
    setCustomName("");
  };

  const onSubmit = async (formData: FormData) => {
    const elecOption = allElectricityProviders.find(
      (p) => p.id === formData.electricityProviderId,
    ) ?? allElectricityProviders[0];

    const gasOption = allGasProviders.find(
      (p) => p.id === formData.gasProviderId,
    ) ?? allGasProviders[0];

    if (!elecOption || !gasOption) {
      toast.error("Please select both an electricity and gas provider.");
      return;
    }

    const payload: PutCommoditySetupPayload = {
      status: "COMPLETED",
      electricityProvider: {
        utilityCompanyId: elecOption.utilityCompanyId,
        commodityId: elecOption.commodityId,
        providerName: elecOption.providerName,
        serviceTerritory: elecOption.serviceTerritory || "Lagos",
        website: elecOption.website || "https://example.com",
      },
      gasProvider: {
        utilityCompanyId: gasOption.utilityCompanyId,
        commodityId: gasOption.commodityId,
        providerName: gasOption.providerName,
        serviceTerritory: gasOption.serviceTerritory || "Lagos",
        website: gasOption.website || "https://example.com",
      },
    };

    try {
      await updateCommoditySetup(payload).unwrap();
      toast.success("Energy commodity configuration saved successfully!");
    } catch (err: any) {
      console.error("Failed to update commodity setup:", err);
      toast.error(err?.data?.message || "Failed to save commodity info. Please try again.");
    }
  };

  const electricitySelectItems = allElectricityProviders.map((p) => ({
    label: p.label,
    value: p.id,
  }));

  const gasSelectItems = allGasProviders.map((p) => ({
    label: p.label,
    value: p.id,
  }));

  const buildingSelectItems = buildings.map((b) => ({
    label: `${b.building_name} (${b.city || "Building"})`,
    value: b.user_building_details_id,
  }));

  // Historical Usage Summary from GET endpoint
  const historicalUsage =
    commoditySetupData?.historicalUsageSummary ?? {
      monthlyUsageKwh: 1118.46,
      peakUsageWindow: "6-9 PM",
      currentRate: 0.15,
      monthlyCost: 167.77,
    };

  // Energy Plans from GET endpoint
  const energyPlans: EnergyPlanItem[] =
    commoditySetupData?.energyPlan ?? [
      {
        type: "fixed-rate",
        label: "Fixed Rate",
        rate: "$0.15/kWh",
        description: {
          title: "Consistent pricing all day",
          list: [
            "simple billing",
            "predictable costs",
            "no peak changes",
          ],
        },
      },
      {
        type: "time-of-use",
        label: "Time-of-Use",
        rate: "$0.08-$0.22/kWh",
        description: {
          title: "Variable pricing by time",
          list: [
            "lower off-peak rates",
            "flexible schedule savings",
            "smart meter enabled",
          ],
        },
      },
      {
        type: "dynamic-pricing",
        label: "Dynamic Pricing",
        rate: "Market-based",
        description: {
          title: "Real time market rates",
          list: [
            "wholesale index rates",
            "demand response benefits",
            "battery storage optimized",
          ],
        },
      },
      {
        type: "green-energy",
        label: "Green Energy",
        rate: "$0.16/kWh",
        description: {
          title: "100% renewable sourcing",
          list: [
            "certified clean energy",
            "zero carbon impact",
            "RECs certificates included",
          ],
        },
      },
    ];

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Header */}
      <div>
        <SectionHeader
          size="xl"
          title="Energy Commodity Information"
          description="Configure your energy provider and rate information"
        />
      </div>

      {/* Building Selector if multiple buildings exist */}
      {buildingSelectItems.length > 1 && (
        <div className="max-w-md">
          <label className={inputClass.label}>Active Building</label>
          <Controller
            control={control}
            name="buildingId"
            render={({ field }) => (
              <CommonSelect
                value={field.value}
                onValueChange={field.onChange}
                item={buildingSelectItems}
                placeholder="Select Building"
                className="w-full"
              />
            )}
          />
        </div>
      )}

      {/* Provider Selectors Grid (Matches media_1789014677812.png) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <label className={inputClass.label}>Electricity Provider</label>
          <Controller
            control={control}
            name="electricityProviderId"
            render={({ field }) => (
              <CommonSelect
                value={field.value}
                onValueChange={field.onChange}
                item={electricitySelectItems}
                placeholder="Select Provider"
                className="w-full"
              />
            )}
          />
          {errors.electricityProviderId && (
            <p className={inputClass.error}>
              {errors.electricityProviderId.message}
            </p>
          )}
        </div>

        <div>
          <label className={inputClass.label}>Gas Provider</label>
          <Controller
            control={control}
            name="gasProviderId"
            render={({ field }) => (
              <CommonSelect
                value={field.value}
                onValueChange={field.onChange}
                item={gasSelectItems}
                placeholder="Select Provider"
                className="w-full"
              />
            )}
          />
          {errors.gasProviderId && (
            <p className={inputClass.error}>
              {errors.gasProviderId.message}
            </p>
          )}
        </div>
      </div>

      {/* Action Buttons (Matches media_1789014677812.png) */}
      <div className="flex flex-wrap gap-3">
        <CommonButton
          type="button"
          variant="outline"
          onClick={() => setIsCustomModalOpen(true)}
        >
          <Plus className="w-4 h-4 mr-1.5" />
          Add Custom Provider
        </CommonButton>
        <CommonButton
          type="submit"
          disabled={isUpdating}
          isLoading={isUpdating}
          loadingText="Saving Commodity Info..."
        >
          Save Commodity Info
        </CommonButton>
      </div>

      {/* Historical Usage Summary Section */}
      <CommonBorderWrapper isShadow className="space-y-4">
        <div className="flex items-center justify-between">
          <SectionHeader
            size="lg"
            title="Historical Usage Summary"
            description="Verified baseline consumption and tariff metrics from your utility connection"
          />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <BMiniCard
            icon={Zap}
            iconColorClassName="text-green-600"
            iconBgClassName="bg-green-600/10"
            label="Monthly Usage"
            value={`${historicalUsage.monthlyUsageKwh.toLocaleString()} kWh`}
            des="Average monthly baseline"
          />
          <BMiniCard
            icon={TrendingUp}
            iconColorClassName="text-amber-600"
            iconBgClassName="bg-amber-600/10"
            label="Peak Usage Window"
            value={historicalUsage.peakUsageWindow}
            des="High tariff interval"
          />
          <BMiniCard
            icon={DollarSign}
            iconColorClassName="text-blue-600"
            iconBgClassName="bg-blue-600/10"
            label="Current Rate"
            value={`$${historicalUsage.currentRate.toFixed(2)} / kWh`}
            des="Effective standard tariff"
          />
          <BMiniCard
            icon={DollarSign}
            iconColorClassName="text-green-600"
            iconBgClassName="bg-green-600/10"
            label="Monthly Cost"
            value={`$${historicalUsage.monthlyCost.toFixed(2)}`}
            valueClass="text-green-600"
            des="Estimated monthly bill"
          />
        </div>
      </CommonBorderWrapper>

      {/* Energy Plan Options Section */}
      {energyPlans.length > 0 && (
        <CommonBorderWrapper isShadow className="space-y-4">
          <div className="flex items-center justify-between">
            <SectionHeader
              size="lg"
              title="Available Energy Plans"
              description="Review available utility rate structures and select your preferred pricing model"
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {energyPlans.map((plan) => {
              const isSelected = selectedPlanType === plan.type;

              return (
                <div
                  key={plan.type}
                  onClick={() => setValue("selectedPlanType", plan.type)}
                  className={`p-5 rounded-xl border-2 transition-all cursor-pointer flex flex-col justify-between ${
                    isSelected
                      ? "border-[#2DAD00] bg-[#2DAD00]/5 shadow-sm"
                      : "border-gray-200 bg-white hover:border-gray-300"
                  }`}
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-gray-900 text-base">
                        {plan.label}
                      </h4>
                      {isSelected && (
                        <CheckCircle2 className="w-5 h-5 text-[#2DAD00]" />
                      )}
                    </div>
                    <p className="text-sm font-bold text-primary">{plan.rate}</p>
                    <p className="text-xs text-gray-600 font-medium">
                      {plan.description?.title}
                    </p>

                    {plan.description?.list?.length > 0 && (
                      <ul className="space-y-1 pt-2 border-t border-gray-100">
                        {plan.description.list.map((item, idx) => (
                          <li
                            key={idx}
                            className="text-xs text-gray-500 flex items-center gap-1.5"
                          >
                            <span className="w-1.5 h-1.5 rounded-full bg-[#2DAD00]" />
                            <span className="capitalize">{item}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>

                  <div className="pt-4 mt-2">
                    <span
                      className={`text-xs font-semibold block text-center py-1.5 rounded-lg ${
                        isSelected
                          ? "bg-[#2DAD00] text-white"
                          : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {isSelected ? "Selected Plan" : "Select Plan"}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </CommonBorderWrapper>
      )}

      {/* Add Custom Provider Modal */}
      {isCustomModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 sm:p-8 w-full max-w-lg shadow-xl space-y-6">
            <div className="flex items-center justify-between border-b border-gray-100 pb-4">
              <SectionHeader
                size="lg"
                title="Add Custom Energy Provider"
                description="Enter custom utility provider details for this commodity"
              />
              <CloseButton onClick={() => setIsCustomModalOpen(false)} />
            </div>

            <div className="space-y-4">
              <div>
                <label className={inputClass.label}>
                  Provider Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Demo Electricity Provider"
                  value={customName}
                  onChange={(e) => setCustomName(e.target.value)}
                  className={inputClass.input}
                />
              </div>

              <div>
                <label className={inputClass.label}>
                  Commodity Type <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setCustomType("electricity")}
                    className={`flex items-center justify-center gap-2 p-3 rounded-xl border font-semibold text-sm cursor-pointer transition-all ${
                      customType === "electricity"
                        ? "border-[#2DAD00] bg-[#2DAD00]/10 text-[#2DAD00]"
                        : "border-gray-200 bg-white text-gray-700"
                    }`}
                  >
                    <Zap className="w-4 h-4" />
                    Electricity
                  </button>
                  <button
                    type="button"
                    onClick={() => setCustomType("gas")}
                    className={`flex items-center justify-center gap-2 p-3 rounded-xl border font-semibold text-sm cursor-pointer transition-all ${
                      customType === "gas"
                        ? "border-[#2DAD00] bg-[#2DAD00]/10 text-[#2DAD00]"
                        : "border-gray-200 bg-white text-gray-700"
                    }`}
                  >
                    <Flame className="w-4 h-4" />
                    Natural Gas
                  </button>
                </div>
              </div>

              <div>
                <label className={inputClass.label}>Service Territory</label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="e.g. Lagos"
                    value={customTerritory}
                    onChange={(e) => setCustomTerritory(e.target.value)}
                    className={inputClass.input}
                  />
                  <MapPin className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              <div>
                <label className={inputClass.label}>Website (Optional)</label>
                <div className="relative">
                  <input
                    type="url"
                    placeholder="https://example.com"
                    value={customWebsite}
                    onChange={(e) => setCustomWebsite(e.target.value)}
                    className={inputClass.input}
                  />
                  <Globe className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2" />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
              <CommonButton
                variant="outline"
                type="button"
                onClick={() => setIsCustomModalOpen(false)}
              >
                Cancel
              </CommonButton>
              <CommonButton type="button" onClick={handleAddCustomProvider}>
                Add Provider
              </CommonButton>
            </div>
          </div>
        </div>
      )}
    </form>
  );
};

export default EnergyCommodityForm;
