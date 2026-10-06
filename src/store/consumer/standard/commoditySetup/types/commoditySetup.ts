export type CommoditySetupStatus =
  | "DRAFT"
  | "IN_PROGRESS"
  | "COMPLETED"
  | "FAILED";

export type EnergyPlanType =
  | "FIXED_RATE"
  | "TIME_OF_USE"
  | "DYNAMIC"
  | "GREEN_ENERGY";

export interface ElectricitySetup {
  providerName: string;
  utilityCompanyId: string;
  utilityAccountNumber: string;
  serviceTerritory: string;
  tariffType: string;
  standardRate: number;
  peakRate: number;
  offPeakRate: number;
  monthlyConsumptionKwh: number;
  annualConsumptionKwh: number;
}

export interface NaturalGasSetup {
  providerName: string;
  utilityCompanyId: string;
  utilityAccountNumber: string;
  serviceTerritory: string;
  tariffType: string;
}

export interface HistoricalUsageSummary {
  monthlyUsageKwh: number;
  peakUsageWindow: string;
  currentRate: number;
  monthlyCost: number;
}

export interface SelectedEnergyPlan {
  type: EnergyPlanType | string;
  label: string;
  rateLabel: string;
}

/** Body sent as the `metadata` JSON field on POST /bills. */
export interface CommoditySetupPayload {
  buildingId: string;
  status: CommoditySetupStatus | string;
  electricity: ElectricitySetup;
  naturalGas: NaturalGasSetup;
  historicalUsageSummary: HistoricalUsageSummary;
  selectedEnergyPlan: SelectedEnergyPlan;
}

export interface UtilityBill {
  id: string;
  workflowId: string;
  userId: string;
  buildingId: string;
  fileUrl: string;
  fileName: string;
  mimeType: string;
  fileSize: number;
  providerType: string | null;
  providerName: string | null;
  billPeriodStart: string | null;
  billPeriodEnd: string | null;
  notes: string | null;
  payload: CommoditySetupPayload | null;
  createdAt: string;
  updatedAt: string;
}

export interface ProviderPayload {
  utilityCompanyId: string;
  commodityId: string;
  providerName: string;
  serviceTerritory: string;
  website?: string;
}

export interface EnergyPlanDescription {
  title: string;
  list: string[];
}

export interface EnergyPlanItem {
  type: string;
  label: string;
  rate: string;
  description: EnergyPlanDescription;
}

export interface HistoricalUsageSummaryData {
  monthlyUsageKwh: number;
  peakUsageWindow: string;
  currentRate: number;
  monthlyCost: number;
}

export interface PutCommoditySetupPayload {
  status: "COMPLETED" | string;
  electricityProvider: ProviderPayload;
  gasProvider: ProviderPayload;
}

/**
 * GET may return the payload directly, an empty object, or a workflow-step
 * wrapper with a nested `payload`.
 */
export type CommoditySetupRecord =
  | CommoditySetupPayload
  | (Partial<CommoditySetupPayload> & {
      payload?: CommoditySetupPayload | null;
    })
  | Record<string, never>;

export interface GetCommoditySetupResponse {
  commoditySetup?: CommoditySetupRecord;
  utilityBills?: UtilityBill[];
  historicalUsageSummary?: HistoricalUsageSummaryData;
  energyPlan?: EnergyPlanItem[];
  electricityProvider?: ProviderPayload;
  gasProvider?: ProviderPayload;
  status?: string;
}

export interface UploadUtilityBillPayload {
  metadata: CommoditySetupPayload;
  file: File;
}

export interface UploadUtilityBillResponse {
  message: string;
  bill: UtilityBill;
}
