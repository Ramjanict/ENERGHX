import { UserTypeName } from "@/store/LMS/user/types/UserAndAssignTypes";

// serve  developer and admin
interface Country {
  name: string;
  country_id: string;
}

interface State {
  name: string;
  state_id: string;
}

export interface LoginData {
  token: string;
  userType: UserTypeName;
  status: string;
  id: string;
  email: string;
  adminId: string;
  lastLogin: string;
  firstname: string;
  lastname: string;
  othername: string;
  country: Country;
  state: State;
  isVerified: boolean;
  level: string;
  sex: string;
  profile_photo: string;
  user_role: string[];
}

export interface ServerDeveloperLoginResponse {
  statusCode: number;
  success: boolean;
  message: string;
  data: LoginData;
}

//consumer

interface ConsumerState {
  name: string;
  id: string;
}

interface ConsumerCountry {
  name: string;
  states: ConsumerState[];
  id: string;
}

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

interface UtilityState {
  id: string;
  createdAt: string;
  state_id: string;
  utility_company_id: string;
  state: {
    state_id: string;
    name: string;
  };
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

interface UserBuildingUtility {
  accountNumber: string;
  unit: string;
  acceptTermsAndConditions: boolean;
  acceptanceDate: string;
  utility: Utility;
  commodity: Commodity;
  createdAt: string;
  updatedAt: string;
}

interface Building {
  user_building_details_id: string;
  building_name: string;
  postalCode: string;
  city: string;
  building_type: BuildingType;
  building_sub_type: BuildingSubType;
  streetAddress: string;
  createdAt: string;
  updatedAt: string;
  noOfOccupants: string;
  user_building_utility: UserBuildingUtility[];
}

interface ConsumerLoginData {
  alternatePhoneNumber: string | null;
  userType: UserTypeName;
  isVerified: boolean;
  buildings: Building[];
  id: string;
  firstname: string;
  lastname: string;
  othername: string;
  email: string;
  phoneNumber: string | null;
  sex: string;
  createdAt: string;
  updatedAt: string;
  userTypeId: string;
  level: string;
  profile_photo: string;
  country: ConsumerCountry;
  token: string;
}

export interface ConsumerLoginResponse {
  status: number;
  message: string;
  data: ConsumerLoginData;
}

export type LoginResponse =
  | ServerDeveloperLoginResponse
  | ConsumerLoginResponse;
