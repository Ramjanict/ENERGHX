import { z } from "zod";
import type {
  CommoditySetupPayload,
  EnergyPlanType,
} from "../types/commoditySetup";

export type { EnergyPlanType };

const requiredText = (label: string) =>
  z.string().trim().min(1, `${label} is required`);

const requiredNumber = (label: string) =>
  z.coerce
    .number({ invalid_type_error: `${label} must be a number` })
    .min(0, `${label} cannot be negative`);

const positiveNumber = (label: string) =>
  z.coerce
    .number({ invalid_type_error: `${label} must be a number` })
    .positive(`${label} must be greater than 0`);

export const ENERGY_PLAN_TYPES = [
  "FIXED_RATE",
  "TIME_OF_USE",
  "DYNAMIC",
  "GREEN_ENERGY",
] as const satisfies readonly EnergyPlanType[];

export const commoditySetupFormSchema = z.object({
  buildingId: requiredText("Building"),
  electricity: z.object({
    providerName: requiredText("Electricity provider"),
    utilityCompanyId: requiredText("Electricity utility company"),
    utilityAccountNumber: requiredText("Electricity account number"),
    serviceTerritory: requiredText("Electricity service territory"),
    tariffType: requiredText("Electricity tariff type"),
    standardRate: positiveNumber("Standard rate"),
    peakRate: requiredNumber("Peak rate"),
    offPeakRate: requiredNumber("Off-peak rate"),
    monthlyConsumptionKwh: positiveNumber("Monthly consumption"),
    annualConsumptionKwh: positiveNumber("Annual consumption"),
  }),
  naturalGas: z.object({
    providerName: requiredText("Natural gas provider"),
    utilityCompanyId: requiredText("Natural gas utility company"),
    utilityAccountNumber: requiredText("Natural gas account number"),
    serviceTerritory: requiredText("Natural gas service territory"),
    tariffType: requiredText("Natural gas tariff type"),
  }),
  peakUsageWindow: requiredText("Peak usage window"),
  selectedEnergyPlanType: z.enum(ENERGY_PLAN_TYPES),
});

export type CommoditySetupFormValues = z.infer<typeof commoditySetupFormSchema>;

export interface EnergyPlanRates {
  standardRate: number;
  peakRate: number;
  offPeakRate: number;
}

export interface EnergyPlanOption {
  type: EnergyPlanType;
  label: string;
  description: string;
  features: string[];
  rateLabel: (rates: EnergyPlanRates) => string;
}

export const ENERGY_PLANS: EnergyPlanOption[] = [
  {
    type: "FIXED_RATE",
    label: "Fixed Rate",
    description: "Consistent pricing all day",
    features: ["Simple billing", "Predictable costs", "No peak charges"],
    rateLabel: (rates) =>
      Number.isFinite(rates.standardRate)
        ? `$${rates.standardRate}/kWh`
        : "Fixed rate",
  },
  {
    type: "TIME_OF_USE",
    label: "Time-of-Use",
    description: "Variable pricing by time",
    features: [
      "Lower off-peak rates",
      "Higher peak rates",
      "Potential savings",
    ],
    rateLabel: (rates) =>
      Number.isFinite(rates.offPeakRate) && Number.isFinite(rates.peakRate)
        ? `$${rates.offPeakRate}-$${rates.peakRate}/kWh`
        : "Time-of-use",
  },
  {
    type: "DYNAMIC",
    label: "Dynamic Pricing",
    description: "Real-time market rates",
    features: ["Hourly pricing", "Market optimization", "Advanced monitoring"],
    rateLabel: () => "Market-based",
  },
  {
    type: "GREEN_ENERGY",
    label: "Green Energy",
    description: "100% renewable sourcing",
    features: ["100% renewable", "Fixed rate", "Environmental benefits"],
    rateLabel: (rates) =>
      Number.isFinite(rates.standardRate)
        ? `$${rates.standardRate}/kWh`
        : "Green energy",
  },
];

export const commoditySetupFormDefaultValues: CommoditySetupFormValues = {
  buildingId: "",
  electricity: {
    providerName: "",
    utilityCompanyId: "",
    utilityAccountNumber: "",
    serviceTerritory: "",
    tariffType: "",
    standardRate: undefined as unknown as number,
    peakRate: undefined as unknown as number,
    offPeakRate: undefined as unknown as number,
    monthlyConsumptionKwh: undefined as unknown as number,
    annualConsumptionKwh: undefined as unknown as number,
  },
  naturalGas: {
    providerName: "",
    utilityCompanyId: "",
    utilityAccountNumber: "",
    serviceTerritory: "",
    tariffType: "",
  },
  peakUsageWindow: "",
  selectedEnergyPlanType: "TIME_OF_USE",
};

export const getEnergyPlan = (
  type: EnergyPlanType | string | undefined,
): EnergyPlanOption =>
  ENERGY_PLANS.find((plan) => plan.type === type) ?? ENERGY_PLANS[1];

export const toCommoditySetupPayload = (
  values: CommoditySetupFormValues,
): CommoditySetupPayload => {
  const plan = getEnergyPlan(values.selectedEnergyPlanType);
  const monthlyUsageKwh = Number(values.electricity.monthlyConsumptionKwh);
  const currentRate = Number(values.electricity.standardRate);
  const rates: EnergyPlanRates = {
    standardRate: currentRate,
    peakRate: Number(values.electricity.peakRate),
    offPeakRate: Number(values.electricity.offPeakRate),
  };

  return {
    buildingId: values.buildingId,
    status: "COMPLETED",
    electricity: {
      providerName: values.electricity.providerName,
      utilityCompanyId: values.electricity.utilityCompanyId,
      utilityAccountNumber: values.electricity.utilityAccountNumber,
      serviceTerritory: values.electricity.serviceTerritory,
      tariffType: values.electricity.tariffType,
      standardRate: rates.standardRate,
      peakRate: rates.peakRate,
      offPeakRate: rates.offPeakRate,
      monthlyConsumptionKwh: monthlyUsageKwh,
      annualConsumptionKwh: Number(values.electricity.annualConsumptionKwh),
    },
    naturalGas: {
      providerName: values.naturalGas.providerName,
      utilityCompanyId: values.naturalGas.utilityCompanyId,
      utilityAccountNumber: values.naturalGas.utilityAccountNumber,
      serviceTerritory: values.naturalGas.serviceTerritory,
      tariffType: values.naturalGas.tariffType,
    },
    historicalUsageSummary: {
      monthlyUsageKwh,
      peakUsageWindow: values.peakUsageWindow,
      currentRate,
      monthlyCost: Number((monthlyUsageKwh * currentRate).toFixed(2)),
    },
    selectedEnergyPlan: {
      type: plan.type,
      label: plan.label,
      rateLabel: plan.rateLabel(rates),
    },
  };
};

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null;

const isEnergyPlanType = (value: unknown): value is EnergyPlanType =>
  ENERGY_PLAN_TYPES.includes(value as EnergyPlanType);

export const isCommoditySetupPayload = (
  value: unknown,
): value is CommoditySetupPayload => {
  if (!isRecord(value)) return false;
  return (
    typeof value.buildingId === "string" &&
    value.buildingId.length > 0 &&
    isRecord(value.electricity)
  );
};

export const extractCommoditySetupPayload = (
  commoditySetup: unknown,
  utilityBills: Array<{ payload?: unknown; createdAt?: string }> = [],
): CommoditySetupPayload | null => {
  if (isCommoditySetupPayload(commoditySetup)) return commoditySetup;

  if (isRecord(commoditySetup) && isCommoditySetupPayload(commoditySetup.payload)) {
    return commoditySetup.payload;
  }

  const latestBill = [...utilityBills].sort((a, b) => {
    const aTime = a.createdAt ? new Date(a.createdAt).getTime() : 0;
    const bTime = b.createdAt ? new Date(b.createdAt).getTime() : 0;
    return bTime - aTime;
  })[0];

  if (isCommoditySetupPayload(latestBill?.payload)) return latestBill.payload;

  return null;
};

export const payloadToFormValues = (
  payload: CommoditySetupPayload,
): CommoditySetupFormValues => {
  const planType = isEnergyPlanType(payload.selectedEnergyPlan?.type)
    ? payload.selectedEnergyPlan.type
    : getEnergyPlan(payload.selectedEnergyPlan?.type).type;

  return {
    buildingId: payload.buildingId ?? "",
    electricity: {
      providerName: payload.electricity?.providerName ?? "",
      utilityCompanyId: payload.electricity?.utilityCompanyId ?? "",
      utilityAccountNumber: payload.electricity?.utilityAccountNumber ?? "",
      serviceTerritory: payload.electricity?.serviceTerritory ?? "",
      tariffType: payload.electricity?.tariffType ?? "",
      standardRate: payload.electricity?.standardRate,
      peakRate: payload.electricity?.peakRate,
      offPeakRate: payload.electricity?.offPeakRate,
      monthlyConsumptionKwh: payload.electricity?.monthlyConsumptionKwh,
      annualConsumptionKwh: payload.electricity?.annualConsumptionKwh,
    },
    naturalGas: {
      providerName: payload.naturalGas?.providerName ?? "",
      utilityCompanyId: payload.naturalGas?.utilityCompanyId ?? "",
      utilityAccountNumber: payload.naturalGas?.utilityAccountNumber ?? "",
      serviceTerritory: payload.naturalGas?.serviceTerritory ?? "",
      tariffType: payload.naturalGas?.tariffType ?? "",
    },
    peakUsageWindow: payload.historicalUsageSummary?.peakUsageWindow ?? "",
    selectedEnergyPlanType: planType,
  };
};
