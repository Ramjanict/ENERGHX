import {
  ContractDocument,
  FinancialBreakdownLine,
  ProjectedSavings,
  ProjectSummarySystem,
  TimelinePhase,
} from "./types";

export const PROJECT_SUMMARY_SYSTEMS: ProjectSummarySystem[] = [
  { id: "solar", label: "Solar System", capacity: "10.2 kW", cost: 16320 },
  { id: "wind", label: "Wind Turbine", capacity: "6.5 kW", cost: 16700 },
  { id: "biomass", label: "Biomass Boiler", capacity: "30 kW", cost: 25300 },
];

export const TOTAL_PROJECT_COST = 58320;

export const FINANCIAL_BREAKDOWN: FinancialBreakdownLine[] = [
  {
    id: "system-cost",
    label: "Total System Cost",
    amount: 58320,
    isDeduction: false,
  },
  {
    id: "federal-tax-credit",
    label: "Federal Tax Credit (26%)",
    amount: 15163,
    isDeduction: true,
  },
  {
    id: "state-rebates",
    label: "State Rebates",
    amount: 5000,
    isDeduction: true,
  },
  {
    id: "utility-incentives",
    label: "Utility Incentives",
    amount: 3500,
    isDeduction: true,
  },
];

export const NET_INVESTMENT = 34657;

export const PROJECTED_SAVINGS: ProjectedSavings = {
  annualSavings: 6080,
  paybackYears: 5.7,
  twentyFiveYearSavings: 152000,
};

export const CONTRACT_DOCUMENTS: ContractDocument[] = [
  {
    id: "project-proposal",
    icon: "file",
    title: "Project Proposal",
    description: "Detailed system specifications and timeline",
  },
  {
    id: "service-agreement",
    icon: "file",
    title: "Service Agreement",
    description: "Terms and conditions of service",
  },
  {
    id: "warranty-information",
    icon: "shield",
    title: "Warranty Information",
    description: "25-year performance warranty",
  },
  {
    id: "disclosure-statements",
    icon: "file",
    title: "Disclosure Statements",
    description: "Legal disclosures and notices",
  },
];

export const TIMELINE_PHASES: TimelinePhase[] = [
  {
    id: "contract-permits",
    order: 1,
    title: "Contract Signing & Permits",
    durationLabel: "2-3 weeks",
  },
  {
    id: "equipment-procurement",
    order: 2,
    title: "Equipment Procurement",
    durationLabel: "4-6 weeks",
  },
  {
    id: "installation",
    order: 3,
    title: "Installation",
    durationLabel: "3-4 weeks",
  },
  {
    id: "inspection-activation",
    order: 4,
    title: "Inspection & Activation",
    durationLabel: "1-2 weeks",
  },
];

export const TOTAL_PROJECT_DURATION = "10-15 weeks";
