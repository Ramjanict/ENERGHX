import { DocumentSelectionCriteria, RequiredDocument } from "./types";

export const DOCUMENT_SELECTION_CRITERIA: DocumentSelectionCriteria = {
  utilityProvider: "Metro Power Company",
  jurisdiction: "Lagos State",
  energyCommodity: "Electricity",
  engineeringServices: "Solar + Wind",
};

export const REQUIRED_DOCUMENTS: RequiredDocument[] = [
  {
    id: "service-agreement",
    title: "Service Agreement",
    description:
      "Grid connection terms, metering arrangements, net metering credit schedule, and utility service obligations as mandated by the utility provider.",
    isRequired: true,
    source: "Metro Power Company",
    pageCount: 12,
    lastUpdated: "June 2026",
    iconBg: "bg-blue-50",
    iconColor: "text-blue-600",
    sourceColor: "text-blue-600",
    sections: [
      { order: 1, title: "Terms & Conditions", sectionLabel: "Section 1" },
      { order: 2, title: "Obligations & Rights", sectionLabel: "Section 2" },
      { order: 3, title: "Regulatory Compliance", sectionLabel: "Section 3" },
      { order: 4, title: "Signatures & Execution", sectionLabel: "Section 4" },
    ],
  },
  {
    id: "disclosure-statement",
    title: "Disclosure Statement",
    description:
      "Jurisdictional disclosure requirements, consumer rights, cancellation policy, and applicable state-level energy regulations for Lagos State.",
    isRequired: true,
    source: "Lagos State Regulatory Authority",
    pageCount: 8,
    lastUpdated: "May 2026",
    iconBg: "bg-purple-50",
    iconColor: "text-purple-600",
    sourceColor: "text-blue-600",
    sections: [
      { order: 1, title: "Consumer Rights", sectionLabel: "Section 1" },
      { order: 2, title: "Cancellation Policy", sectionLabel: "Section 2" },
      { order: 3, title: "Regulatory Disclosures", sectionLabel: "Section 3" },
      { order: 4, title: "Signatures & Execution", sectionLabel: "Section 4" },
    ],
  },
  {
    id: "price-comparison",
    title: "Price Comparison Document",
    description:
      "Comparative rate analysis between current grid tariff and proposed renewable energy system pricing, including time-of-use breakdown for electricity commodity.",
    isRequired: true,
    source: "Electricity Commodity Regulation",
    pageCount: 5,
    lastUpdated: "June 2026",
    iconBg: "bg-amber-50",
    iconColor: "text-amber-600",
    sourceColor: "text-blue-600",
    sections: [
      { order: 1, title: "Current Tariff Analysis", sectionLabel: "Section 1" },
      { order: 2, title: "Proposed Pricing", sectionLabel: "Section 2" },
      { order: 3, title: "Time-of-Use Breakdown", sectionLabel: "Section 3" },
      { order: 4, title: "Signatures & Execution", sectionLabel: "Section 4" },
    ],
  },
  {
    id: "associate-contract",
    title: "Associate Contract",
    description:
      "Engineering service agreement covering Solar PV and Wind system design, installation oversight, commissioning, performance warranty, and ongoing O&M terms.",
    isRequired: true,
    source: "EnerghxPLUS Engineering Services",
    pageCount: 18,
    lastUpdated: "June 2026",
    iconBg: "bg-[#F0FDF4]",
    iconColor: "text-[#00A63E]",
    sourceColor: "text-blue-600",
    sections: [
      { order: 1, title: "Current Tariff Analysis", sectionLabel: "Section 1" },
      { order: 2, title: "Proposed Pricing", sectionLabel: "Section 2" },
      { order: 3, title: "Time-of-Use Breakdown", sectionLabel: "Section 3" },
      { order: 4, title: "Signatures & Execution", sectionLabel: "Section 4" },
    ],
  },
];
