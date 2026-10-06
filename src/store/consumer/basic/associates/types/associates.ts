export interface Associate {
  associateId: string;
  user_id: string;
  type: string;
  firstname: string;
  lastname: string;
  othername: string;
  fullName: string;
  email: string;
  phoneNumber: string | null;
  profile_photo: string | null;
  serviceTypes: string[];
  serviceType: string;
  experienceYears: number;
  experience: string | null;
  location: string;
  city: string;
  state: string;
  country: string;
  associateCode: string;
  status: string;
  isAssigned: boolean;
}

export interface AssociatePagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface AssociatesData {
  items: Associate[];
  pagination: AssociatePagination;
}

export interface GetAssociatesResponse {
  status: number;
  message: string;
  data: AssociatesData;
}

export type AssociateType = "server" | "developer";

export interface AssignAssociatePayload {
  type: AssociateType;
  associateId: string;
}
export interface GetAssociatesParams {
  type?: AssociateType;
  page?: number;
  limit?: number;
  search?: string;
}
