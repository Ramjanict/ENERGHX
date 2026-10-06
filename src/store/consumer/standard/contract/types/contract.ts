export interface ContractFileMeta {
  s3Bucket: string;
  s3Key: string;
  fileName: string;
  mimeType: string;
  fileSize: number;
  checksum: string;
  downloadUrl?: string;
  expiresInSeconds?: number;
}

export interface ContractProjectSystem {
  id?: string;
  key?: string;
  label?: string;
  name?: string;
  title?: string;
  capacity?: string | number | null;
  capacityKw?: number | null;
  cost?: number | null;
  systemCost?: number | null;
}

export interface ContractProjectSummary {
  systems: ContractProjectSystem[];
  totalProjectCost: number;
  currency: string;
}

export interface ContractFinancialBreakdown {
  totalSystemCost: number;
  federalTaxCredit: number;
  federalTaxCreditRate: number;
  stateRebates: number;
  utilityIncentives: number;
  netInvestment: number;
  currency: string;
}

export interface ContractProjectedSavings {
  annualSavings: number | null;
  paybackPeriodYears: number | null;
  cumulativeSavings25Year: number | null;
  currency: string;
}

export interface ContractListDocument {
  id: string;
  title: string;
  description: string | null;
  file: ContractFileMeta;
  required: boolean;
  reviewed: boolean;
  requiresSignature: boolean;
  signatureCompleted: boolean;
}

export interface ContractTimelineStep {
  step: number;
  title: string;
  estimatedDuration: string;
}

export interface ContractAgreement {
  accepted: boolean;
}

export interface ContractCheckout {
  enabled: boolean;
  amount: number;
  amountCents: number;
  currency: string;
}

export interface GetContractResponse {
  projectSummary: ContractProjectSummary;
  financialBreakdown: ContractFinancialBreakdown;
  projectedSavings: ContractProjectedSavings;
  contractDocuments: ContractListDocument[];
  implementationTimeline: ContractTimelineStep[];
  agreement: ContractAgreement;
  checkout: ContractCheckout;
}

export interface ContractSelectionCriteria {
  utilityCompanyId: string | null;
  utilityProvider: string | null;
  commodityId: string | null;
  energyCommodity: string | null;
  countryId: string | null;
  stateId: string | null;
  jurisdiction: string | null;
  engineeringServices: string[];
  engineeringServiceKeys: string[];
}

export interface ContractDocumentSection {
  order?: number;
  title?: string;
  sectionLabel?: string;
  label?: string;
}

export interface ContractSignatureField {
  key?: string;
  label?: string;
  required?: boolean;
}

export interface ContractRequiredDocument {
  id: string;
  packageItemId: string;
  documentType: string;
  title: string;
  description: string | null;
  source: string | null;
  version: string | null;
  file: ContractFileMeta;
  required: boolean;
  sortOrder: number;
  totalPages: number | null;
  lastUpdated: string | null;
  sections: ContractDocumentSection[];
  requiresSignature: boolean;
  signatureFields: ContractSignatureField[];
  reviewed: boolean;
  status: string;
  signatureCompleted: boolean;
}

export interface ContractReviewStatus {
  reviewedCount: number;
  requiredCount: number;
  signedCount: number;
  signatureRequiredCount: number;
  allReviewed: boolean;
  allSigned: boolean;
}

export interface ContractAcknowledgementCheck {
  key: string;
  checked: boolean;
}

export interface ContractAcknowledgement {
  enabled: boolean;
  accepted: boolean;
  checklist: ContractAcknowledgementCheck[];
}

export interface GetContractDocumentsResponse {
  selectionCriteria: ContractSelectionCriteria;
  requiredDocuments: ContractRequiredDocument[];
  reviewStatus: ContractReviewStatus;
  acknowledgement: ContractAcknowledgement;
  executionUnlocked: boolean;
}

export interface ContractSignatoryInformation {
  fullLegalName: string | null;
  email: string | null;
  date: string | null;
}

export interface GetContractDocumentDetailResponse
  extends ContractRequiredDocument {
  signatoryInformation: ContractSignatoryInformation;
  digitalSignature: unknown | null;
}

export interface ReviewContractDocumentPayload {
  status: "REVIEWED" | "NOT_REVIEWED";
  signatory: {
    fullLegalName: string;
    email: string;
    date: string;
  };
  signature: {
    type: "draw" | "type" | "upload";
    value: string;
  };
}

export interface SubmitContractAcknowledgementPayload {
  acknowledgement: boolean;
  checks: {
    reviewedRequiredDocuments: boolean;
    acknowledgedDisclosures: boolean;
    agreedToExecution: boolean;
  };
}

export interface ExecuteContractPayload {
  status: "EXECUTED" | "IN_PROGRESS" | "PENDING";
  acknowledgement: boolean;
}

export type SubmitContractAcknowledgementResponse = GetContractResponse;
export type ExecuteContractResponse = GetContractResponse;
export type ReviewContractDocumentResponse = GetContractDocumentsResponse;
