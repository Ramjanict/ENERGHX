export interface DocumentSelectionCriteria {
  utilityProvider: string;
  jurisdiction: string;
  energyCommodity: string;
  engineeringServices: string;
}

export interface DocumentSection {
  order: number;
  title: string;
  sectionLabel: string;
}

export interface RequiredDocument {
  id: string;
  title: string;
  description: string;
  isRequired: boolean;
  source: string;
  pageCount: number;
  lastUpdated: string;
  sourceColor: string;
  sections: DocumentSection[];
  iconBg: string;
  iconColor: string;
  reviewed?: boolean;
  requiresSignature?: boolean;
  signatureCompleted?: boolean;
  status?: string;
  fileName?: string;
  mimeType?: string;
  downloadUrl?: string;
}

export type SignatureMethod = "draw" | "type" | "upload";

export interface SignatoryInfo {
  fullName: string;
  email: string;
  date: string;
}

export interface DocumentReviewState {
  documentId: string;
  reviewed: boolean;
  signatoryInfo?: SignatoryInfo;
  signatureDataUrl?: string;
}

export interface AcknowledgementState {
  reviewedAllDocuments: boolean;
  acknowledgedDisclosures: boolean;
  agreedToProceed: boolean;
}
