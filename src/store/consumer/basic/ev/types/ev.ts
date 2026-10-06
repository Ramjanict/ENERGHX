export interface AddVehiclePayload {
  buildingId: string;
  chargerModel: string;
  powerRating: string;
  chargingHours: string;
  name: string;
  noOfEvs: string;
  title: string;
  "battery-manufacturer": string;
  "battery-class": string;
  "battery-model": string;
  "battery-length": number;
  "battery-diameter": number;
  "battery-height": number;
  "battery-width": number;
  "battery-thickness": number;
  "battery-mass": number;
  "battery-capacity": number;
  "battery-voltage": number;
  "battery-peak-C-rate": number;
  "battery-continous-C-rate": number;
  "average-energy-consumption": number;
  "vehicle-range": number;
  "nominal-voltage": number;
}

export interface ElectricVehicle {
  electric_vehicle_catalog_id: string;
  vehicleId: string;
  title: string;
  manufacturer: string;
  manufacturer_key: string;
  model: string;
  battery_capacity: number;
  battery_capacity_label: string;
  vehicle_range: number;
  vehicle_range_label: string;
  charging_level: string;
  icon: string;
  add_vehicle_payload: AddVehiclePayload;
}

export interface EvManufacturer {
  name: string;
  key: string;
}

export interface EvPagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface EvFilters {
  search: string | null;
  manufacturer: string | null;
}

export interface EvDatabaseData {
  vehicles: ElectricVehicle[];
  manufacturers: EvManufacturer[];
  pagination: EvPagination;
  filters: EvFilters;
}

export interface GetEvDatabaseResponse {
  status: number;
  message: string;
  data: EvDatabaseData;
}

export interface EvDatabaseParams {
  search?: string | null;
  manufacturer?: string | null;
  page?: number;
  limit?: number;
}

// user evl ist

export interface EvChargerModelRef {
  id: string;
  name: string;
}

export interface EvChargerBuildingRef {
  user_building_details_id: string;
  building_name: string;
  user_id: string;
}

export interface EvCharger {
  id: string;
  chargerModelId: string;
  name: string;
  power_rating: string;
  charging_hours: string;
  no_of_ev: string;
  user_building_details_id: string;
  title: string;
  battery_manufacturer: string;
  battery_class: string;
  battery_model: string;
  battery_length: number;
  battery_diameter: number;
  battery_height: number;
  battery_width: number;
  battery_thickness: number;
  battery_mass: number;
  battery_capacity: number;
  battery_voltage: number;
  battery_peak_C_rate: number;
  battery_continous_C_rate: number;
  average_energy_consumption: number;
  vehicle_range: number;
  nominal_voltage: number;
  chargerModel: EvChargerModelRef;
  user_building_details: EvChargerBuildingRef;
}

export interface GetEvChargersResponse {
  status: number;
  message: string;
  data: EvCharger[];
}
