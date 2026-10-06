export interface SubBuilding {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export interface BuildingType {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  subBuildings: SubBuilding[];
}

export interface GetAllBuildingTypesResponse {
  status: number;
  message: string;
  data: BuildingType[];
}

export interface GetSingleBuildingTypeResponse {
  status: number;
  message: string;
  data: BuildingType;
}
