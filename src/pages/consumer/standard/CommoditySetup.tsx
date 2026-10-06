import {
  applyBuildingUtilities,
  getCommodityUtilities,
  getUtilityTerritory,
} from "@/components/consumer/standard/commodity/setup/buildingUtilities";
import Setup from "@/components/consumer/standard/commodity/setup/Setup";
import { useGetAllBuildingsQuery } from "@/store/consumer/basic/building/buildingApi";
import {
  useGetCommoditySetupQuery,
  useUploadUtilityBillMutation,
} from "@/store/consumer/standard/commoditySetup/commoditySetupApi";
import {
  commoditySetupFormDefaultValues,
  commoditySetupFormSchema,
  CommoditySetupFormValues,
  extractCommoditySetupPayload,
  payloadToFormValues,
  toCommoditySetupPayload,
} from "@/store/consumer/standard/commoditySetup/schema/commoditySetupSchema";
import { useGetDashboardQuery } from "@/store/consumer/standard/POTENTIALLY OBSOLETE/potentiallyApi";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

const CommoditySetup = () => {
  const navigate = useNavigate();

  const { data: setupData, isLoading: isSetupLoading } =
    useGetCommoditySetupQuery();
  const { data: buildingsData, isLoading: isBuildingsLoading } =
    useGetAllBuildingsQuery();
  const { data: dashboardData, isLoading: isDashboardLoading } =
    useGetDashboardQuery();

  const [uploadUtilityBill, { isLoading: isUploading }] =
    useUploadUtilityBillMutation();

  const [billFile, setBillFile] = useState<File | null>(null);
  const [hydrated, setHydrated] = useState(false);

  const buildings = buildingsData?.data ?? [];
  const utilityBills = setupData?.utilityBills ?? [];

  const form = useForm<CommoditySetupFormValues>({
    resolver: zodResolver(commoditySetupFormSchema),
    defaultValues: commoditySetupFormDefaultValues,
  });

  useEffect(() => {
    if (hydrated) return;
    if (isSetupLoading || isBuildingsLoading || isDashboardLoading) return;

    const payload = extractCommoditySetupPayload(
      setupData?.commoditySetup,
      setupData?.utilityBills,
    );
    const dashboardBuildingId =
      dashboardData?.dashboard?.selectedBuilding?.id ?? "";
    const firstBuildingId = buildings[0]?.user_building_details_id ?? "";
    const defaultBuildingId = dashboardBuildingId || firstBuildingId;

    if (payload) {
      const formValues = payloadToFormValues(payload);
      if (!formValues.buildingId && defaultBuildingId) {
        formValues.buildingId = defaultBuildingId;
        const building = buildings.find(
          (b) => b.user_building_details_id === defaultBuildingId,
        );
        const electricity = getCommodityUtilities(building, "electricity")[0];
        const gas = getCommodityUtilities(building, "gas")[0];
        if (!formValues.electricity.utilityCompanyId && electricity) {
          formValues.electricity.utilityCompanyId =
            electricity.utility.utility_company_id;
          formValues.electricity.providerName =
            electricity.utility.utility_company_name;
          formValues.electricity.utilityAccountNumber =
            formValues.electricity.utilityAccountNumber ||
            electricity.accountNumber ||
            "";
          formValues.electricity.serviceTerritory =
            formValues.electricity.serviceTerritory ||
            getUtilityTerritory(electricity, building);
        }
        if (!formValues.naturalGas.utilityCompanyId && gas) {
          formValues.naturalGas.utilityCompanyId =
            gas.utility.utility_company_id;
          formValues.naturalGas.providerName =
            gas.utility.utility_company_name;
          formValues.naturalGas.utilityAccountNumber =
            formValues.naturalGas.utilityAccountNumber ||
            gas.accountNumber ||
            "";
          formValues.naturalGas.serviceTerritory =
            formValues.naturalGas.serviceTerritory ||
            getUtilityTerritory(gas, building);
        }
      }
      form.reset(formValues);
    } else {
      if (defaultBuildingId) {
        applyBuildingUtilities(form, buildings, defaultBuildingId);
      }
    }

    form.clearErrors();
    setHydrated(true);
  }, [
    buildings,
    dashboardData,
    form,
    hydrated,
    isBuildingsLoading,
    isDashboardLoading,
    isSetupLoading,
    setupData,
  ]);

  const onSubmit = form.handleSubmit(async (values) => {
    const payload = toCommoditySetupPayload(values);

    try {
      if (billFile) {
        await uploadUtilityBill({ metadata: payload, file: billFile }).unwrap();
      }
      navigate("../zev");
    } catch (err) {
      console.error("Failed to save commodity setup", err);
    }
  });

  const isLoading = isSetupLoading || isBuildingsLoading;
  return (
    <div>
      <Setup
        form={form}
        buildings={buildings}
        utilityBills={utilityBills}
        billFile={billFile}
        onBillFileSelect={setBillFile}
        isSaving={isUploading}
        isLoading={isLoading}
        onSubmit={onSubmit}
      />
    </div>
  );
};

export default CommoditySetup;
