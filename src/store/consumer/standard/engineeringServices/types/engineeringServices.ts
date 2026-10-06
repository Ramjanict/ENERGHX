export type EngineeringServicesStatus =
  | "DRAFT"
  | "IN_PROGRESS"
  | "COMPLETED"
  | "FAILED";

/** Catalog item from GET /workflows/engineering-services */
export interface EngineeringServiceCatalogItem {
  id: string;
  key: string;
  title: string;
  description: string;
  duration: string;
  startingCost: number;
  currency: string;
  active: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

/** Slimmer shape returned inside the consumer workflow selection */
export interface EngineeringServiceSelectedItem {
  id: string;
  key: string;
  title: string;
  duration: string;
  startingCost: number;
  currency: string;
}

export interface EngineeringServicesSelection {
  status: EngineeringServicesStatus | string;
  selectedServiceKeys: string[];
  selectedServices: EngineeringServiceSelectedItem[];
  totalSelectedServices: number;
  totalEstimatedStartingCost: number;
  currency: string;
  helpChoosing: unknown | null;
  notes: string | null;
}

// ---------- Catalog ----------
export interface GetEngineeringServicesCatalogResponse {
  engineeringServices: EngineeringServiceCatalogItem[];
  count: number;
}

export interface GetEngineeringServiceByIdResponse {
  engineeringService: EngineeringServiceCatalogItem;
}

export interface CreateEngineeringServicePayload {
  key: string;
  title: string;
  description: string;
  duration: string;
  startingCost: number;
  currency: string;
  active: boolean;
}

export type UpdateEngineeringServicePayload = CreateEngineeringServicePayload;

export interface MutateEngineeringServiceResponse {
  engineeringService: EngineeringServiceCatalogItem;
}

// ---------- Consumer workflow selection ----------
export interface GetConsumerEngineeringServicesResponse {
  engineeringServices: EngineeringServicesSelection;
}

export interface SaveConsumerEngineeringServicesPayload {
  status: EngineeringServicesStatus;
  selectedServiceKeys: string[];
  notes?: string | null;
}

export interface SaveConsumerEngineeringServicesResponse {
  engineeringServices: EngineeringServicesSelection;
}
