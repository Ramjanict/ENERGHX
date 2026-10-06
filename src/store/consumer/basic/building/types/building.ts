export interface CreateBuildingCommodityPayload {
  type: string;
  utilityCompany: {
    id: string;
    accountNumber: string;
    country: string;
    state: string;
    units: string;
    alternatePhoneNumber: string;
  };
}

export interface CreateBuildingPayload {
  building_name: string;
  streetAddress: string;
  streetNumber: string;
  type: string;
  subBuilding: string;
  postalCode: string;
  city: string;
  numberOfOccupants: string;
  commodities: CreateBuildingCommodityPayload[];
}

// get all building
export interface BuildingTypeRef {
  building_type_id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export interface BuildingSubTypeRef {
  building_sub_type_id: string;
  name: string;
  building_type_id: string;
  createdAt: string;
  updatedAt: string;
}

export interface UtilityStateRef {
  id: string;
  createdAt: string;
  state_id: string;
  utility_company_id: string;
  state: {
    state_id: string;
    name: string;
  };
}

export interface UtilityCompanyRef {
  utility_company_id: string;
  utility_company_name: string;
  country_id: string;
  states: UtilityStateRef[];
}

export interface CommodityRef {
  commodity_id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export interface UserBuildingUtility {
  accountNumber: string;
  unit: string;
  acceptTermsAndConditions: boolean;
  acceptanceDate: string;
  utility: UtilityCompanyRef;
  commodity: CommodityRef;
  createdAt: string;
  updatedAt: string;
}

export interface BuildingCardSummary {
  rooms: number;
  evs: number;
  energy_usage: number;
  type: string;
  sub_type: string;
}

export interface UserBuilding {
  user_building_details_id: string;
  building_name: string;
  postalCode: string;
  city: string;
  building_type: BuildingTypeRef;
  building_sub_type: BuildingSubTypeRef;
  streetAddress: string;
  createdAt: string;
  updatedAt: string;
  noOfOccupants: string;
  user_building_utility: UserBuildingUtility[];

  building_type_name: string;
  building_sub_type_name: string;
  type: string;
  sub_type: string;
  rooms_count: number;
  room_count: number;
  evs_count: number;
  ev_count: number;
  energy_usage: number;
  energyUsage: number;
  card_summary: BuildingCardSummary;
}

export interface GetAllUserBuildingsResponse {
  status: number;
  message: string;
  data: UserBuilding[];
}

// building details

interface BuildingType {
  building_type_id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

interface BuildingSubType {
  building_sub_type_id: string;
  name: string;
  building_type_id: string;
  createdAt: string;
  updatedAt: string;
}

interface State {
  state_id: string;
  name: string;
}

interface UtilityState {
  id: string;
  createdAt: string;
  state_id: string;
  utility_company_id: string;
  state: State;
}

interface Utility {
  utility_company_id: string;
  utility_company_name: string;
  country_id: string;
  states: UtilityState[];
}

interface Commodity {
  commodity_id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

interface UserBuildingUtilityref {
  accountNumber: string;
  unit: string;
  acceptTermsAndConditions: boolean;
  acceptanceDate: string;
  utility: Utility;
  commodity: Commodity;
  createdAt: string;
  updatedAt: string;
}

export interface Room {
  id: string;
  title: string;
  construction: string;
  construction_subtype: string;
  percentage_glass: string;
  wall_type: string;
  city: string;
  month: string;
  percentage_MDDB: string;
  LSM: number;
  north_wall_area: number;
  east_wall_area: number;
  south_wall_area: number;
  west_wall_area: number;
  roof_type: string;
  roof_area: number;
  north_fenestration_area_shaded: number;
  north_fenestration_area_sunlit: number;
  east_fenestration_area_shaded: number;
  east_fenestration_area_sunlit: number;
  south_fenestration_area_shaded: number;
  south_fenestration_area_sunlit: number;
  west_fenestration_area_shaded: number;
  west_fenestration_area_sunlit: number;
  indoor_shading: string;
  u_value_window: number;
  beam_solar_heat_gain_coefficient: number;
  diffuse_solar_heat_gain_coefficient: number;
  beam_indoor_solar_attenuation_coefficient: number;
  diffuse_indoor_solar_attenuation_coefficient: number;
  lighting_type: string;
  number_lighting: number;
  lighting_rating: number;
  activity_type: string;
  activity_location: string;
  velocity_type: string;
  occupant_capacity: number;
  start_hour: string;
  end_hour: string;
  percentage_MDHR: string;
  infiltration_rate: number;
  fenestration_area: number;
  floor_area: number;
  createdAt: string;
  updatedAt: string;
  user_building_details_id: string;
  windows: any[]; // Define specific type if needed
  lightBulbs: any[]; // Define specific type if needed
  Acs: any[]; // Define specific type if needed
  otherAppliances: any[]; // Define specific type if needed
  estimated_usage: number;
  estimated_usage_unit: string;
}

export interface BuildingData {
  user_building_details_id: string;
  user_id: string;
  building_name: string;
  postalCode: string;
  city: string;
  building_type: BuildingType;
  building_sub_type: BuildingSubType;
  streetAddress: string;
  createdAt: string;
  updatedAt: string;
  noOfOccupants: string;
  user_building_utility: UserBuildingUtilityref[];
  evs: any[];
  rooms: Room[];
  roof: null;
  walls: any[];
  building_estimated_usage: number;
}

export interface BuildingDetailsResponse {
  status: number;
  message: string;
  data: BuildingData;
}
