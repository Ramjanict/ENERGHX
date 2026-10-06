import type { UserBuilding, UserBuildingUtility } from "@/store/consumer/basic/building/types/building";
import type { CommoditySetupFormValues } from "@/store/consumer/standard/commoditySetup/schema/commoditySetupSchema";
import type { UseFormReturn } from "react-hook-form";

export const isElectricityCommodity = (name?: string) =>
  /electric/i.test(name ?? "");

export const isGasCommodity = (name?: string) => /gas/i.test(name ?? "");

export const getCommodityUtilities = (
  building: UserBuilding | undefined,
  kind: "electricity" | "gas",
): UserBuildingUtility[] => {
  const utilities = building?.user_building_utility ?? [];
  const filtered = utilities.filter((item) =>
    kind === "electricity"
      ? isElectricityCommodity(item.commodity?.name)
      : isGasCommodity(item.commodity?.name),
  );
  return filtered.length > 0 ? filtered : utilities;
};

export const getUtilityTerritory = (
  utility: UserBuildingUtility | undefined,
  building: UserBuilding | undefined,
) => utility?.utility?.states?.[0]?.state?.name || building?.city || "";

export const toUtilitySelectOptions = (
  utilities: UserBuildingUtility[],
  currentId?: string,
  currentName?: string,
) => {
  const options = utilities.map((item) => ({
    label: item.utility.utility_company_name,
    value: item.utility.utility_company_id,
  }));

  if (currentId && !options.some((option) => option.value === currentId)) {
    options.push({
      label: currentName || currentId,
      value: currentId,
    });
  }

  return options;
};

export const applyBuildingUtilities = (
  form: UseFormReturn<CommoditySetupFormValues>,
  buildings: UserBuilding[],
  buildingId: string,
) => {
  const building = buildings.find(
    (item) => item.user_building_details_id === buildingId,
  );
  const electricity = getCommodityUtilities(building, "electricity")[0];
  const gas = getCommodityUtilities(building, "gas")[0];

  form.setValue("buildingId", buildingId, {
    shouldValidate: false,
    shouldDirty: true,
  });
  if (buildingId) {
    form.clearErrors("buildingId");
  }

  if (electricity) {
    form.setValue(
      "electricity.utilityCompanyId",
      electricity.utility.utility_company_id,
      { shouldValidate: false, shouldDirty: true },
    );
    form.clearErrors("electricity.utilityCompanyId");
    form.setValue(
      "electricity.providerName",
      electricity.utility.utility_company_name,
    );
    form.setValue(
      "electricity.utilityAccountNumber",
      electricity.accountNumber ?? "",
    );
    form.setValue(
      "electricity.serviceTerritory",
      getUtilityTerritory(electricity, building),
    );
  }

  if (gas) {
    form.setValue(
      "naturalGas.utilityCompanyId",
      gas.utility.utility_company_id,
      { shouldValidate: false, shouldDirty: true },
    );
    form.clearErrors("naturalGas.utilityCompanyId");
    form.setValue("naturalGas.providerName", gas.utility.utility_company_name);
    form.setValue("naturalGas.utilityAccountNumber", gas.accountNumber ?? "");
    form.setValue(
      "naturalGas.serviceTerritory",
      getUtilityTerritory(gas, building),
    );
  }
};

export const applySelectedUtility = (
  form: UseFormReturn<CommoditySetupFormValues>,
  building: UserBuilding | undefined,
  kind: "electricity" | "gas",
  utilityCompanyId: string,
) => {
  const utility = getCommodityUtilities(building, kind).find(
    (item) => item.utility.utility_company_id === utilityCompanyId,
  );

  if (kind === "electricity") {
    form.setValue("electricity.utilityCompanyId", utilityCompanyId, {
      shouldValidate: false,
      shouldDirty: true,
    });
    if (utilityCompanyId) {
      form.clearErrors("electricity.utilityCompanyId");
    }
    if (!utility) return;
    form.setValue("electricity.providerName", utility.utility.utility_company_name);
    form.setValue(
      "electricity.utilityAccountNumber",
      utility.accountNumber ?? "",
    );
    form.setValue(
      "electricity.serviceTerritory",
      getUtilityTerritory(utility, building),
    );
    return;
  }

  form.setValue("naturalGas.utilityCompanyId", utilityCompanyId, {
    shouldValidate: false,
    shouldDirty: true,
  });
  if (utilityCompanyId) {
    form.clearErrors("naturalGas.utilityCompanyId");
  }
  if (!utility) return;
  form.setValue("naturalGas.providerName", utility.utility.utility_company_name);
  form.setValue("naturalGas.utilityAccountNumber", utility.accountNumber ?? "");
  form.setValue(
    "naturalGas.serviceTerritory",
    getUtilityTerritory(utility, building),
  );
};
