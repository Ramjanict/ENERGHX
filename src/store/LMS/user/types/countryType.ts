export type State = {
  name: string;
  id: string;
  created_at: string;
  updated_at: string;
};

export type Country = {
  name: string;
  states: State[];
  code: string;
  id: string;
};

export type CountriesResponse = {
  status: number;
  message: string;
  data: Country[];
};

export interface StatesResponse {
  status: number;
  message: string;
  data: State[];
}

interface Commodity {
  name: string;
  id: string;
  createdAt: string;
  updatedAt: string;
}

export interface CommoditiesResponse {
  status: number;
  message: string;
  data: Commodity[];
}

// all users UtilitiesResponse
interface ServiceState {
  name: string;
  id: string;
  country: string;
  created_at: string;
  updated_at: string;
}

interface Utility {
  name: string;
  id: string;
  commodity: Commodity;
  termsAndConditionFilePath: string | null;
  priceComparisonFilePath: string | null;
  country_id: string;
  states: ServiceState[];
  createdAt: string;
  updatedAt: string;
}

export interface UtilitiesResponse {
  status: number;
  message: string;
  data: Utility[];
}
