export interface ApplianceCategory {
  category_id: string | null;
  name: string;
  key: string;
}

export interface AppliancePagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface ApplianceFilters {
  search: string | null;
  category: string | null;
  categoryId: string | null;
}

export interface AddAppliancePayload {
  typeId: string;
  applianceId: string;
  powerRating: string;
  noOfAppliances: string;
  latentHeat: string;
  sensibleHeat: string;
  roomId: string;
}

export interface ApplianceManufacturer {
  manufacturer_id: string;
  name: string;
  location_id: string;
  website: string | null;
}

export interface Appliance {
  appliance_id: string;
  applianceId: string;
  typeId: string;
  name: string;
  min_consumption: string;
  max_consumption: string;
  powerRating: string;
  latentHeat: string;
  sensibleHeat: string;
  add_appliance_payload: AddAppliancePayload;
  image_url: string | null;
  voltage: string | null;
  energy_rating: string | null;
  category_id: string;
  category_key: string;
  category_name: string;
  category: ApplianceCategory;
  manufacturer_id: string;
  manufacturer_name: string;
  manufacturer: ApplianceManufacturer;
}

export interface ApplianceTypesData {
  appliances: Appliance[];
  categories: ApplianceCategory[];
  pagination: AppliancePagination;
  filters: ApplianceFilters;
}

export interface GetApplianceCategoryResponse {
  status: number;
  message: string;
  data: ApplianceTypesData;
}

export interface ApplianceParams {
  search?: string | null;
  q?: string | null;
  category?: string | null;
  categoryKey?: string | null;
  categoryId?: string | null;
  page?: number;
  limit?: number;
}

// report appliance
export interface ApplianceReportResponse {
  status: number;
  message: string;
  data: BuildingApplianceReport;
}

export interface BuildingApplianceReport {
  buildingId: string;
  roomCount: number;
  summary: Summary;
  energyUsageByCategory: EnergyUsageByCategory[];
  dailyEnergyUsageByRoom: DailyEnergyUsageByRoom[];
  inventory: RoomInventory[];
  insights: Insights;
  renewableEnergyRecommendation: RenewableEnergyRecommendation;
  rooms: Room[];
}

export interface Summary {
  totalAppliances: number;
  roomCount: number;
  dailyUsageKwh: number;
  monthlyUsageKwh: number;
  monthlyCost: number;
  tariffRate: number;
  tariffRateSource: string;
  currency: string;
}

export interface EnergyUsageByCategory {
  category: string;
  category_key: string;
  monthlyUsageKwh: number;
  dailyUsageKwh: number;
  percentage: number;
}

export interface DailyEnergyUsageByRoom {
  roomId: string;
  roomName: string;
  dailyUsageKwh: number;
  monthlyUsageKwh: number;
}

export interface ApiAppliance {
  id: string;
  name: string;
  category: string;
  category_key: string;
  powerRating: number;
  powerRatingUnit: string;
  quantity: number;
  dailyUsageKwh: number;
  monthlyUsageKwh: number;
  source: string;
}

export interface HighConsumptionAppliance extends ApiAppliance {
  roomId: string;
  roomName: string;
}

export interface RoomInventory {
  roomId: string;
  roomName: string;
  title: string;
  totalAppliances: number;
  dailyUsageKwh: number;
  monthlyUsageKwh: number;
  appliances: ApiAppliance[];
}

export interface OptimizationOpportunity {
  title: string;
  description: string;
}

export interface AnnualProjections {
  annualConsumptionKwh: number;
  annualCost: number;
  potentialSavings: number;
  potentialSavingsBasis: string;
}

export interface Insights {
  highConsumptionAppliances: HighConsumptionAppliance[];
  optimizationOpportunities: OptimizationOpportunity[];
  annualProjections: AnnualProjections;
}

export interface RenewableEnergyAction {
  label: string;
  endpoint: string;
}

export interface RenewableEnergyRecommendation {
  message: string;
  recommendedSolarSystemKw: number;
  actions: RenewableEnergyAction[];
}

export interface Room {
  roomId: string;
  title: string;
  lightBulbCount: number;
  acCount: number;
  customApplianceCount: number;
  totalAssignedAppliances: number;
  appliances: unknown[];
  lightBulbs: unknown[];
  airConditioners: unknown[];
}
