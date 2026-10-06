import {
  CostSummary,
  CumulativeSavingsPoint,
  EngineeringServiceItem,
  ProposalTopStats,
  RecommendedSystem,
  SavingsForecastSummary,
  SavingsForecastYear,
  TimelinePhase,
} from "./types";

export const PROPOSAL_TOP_STATS: ProposalTopStats = {
  totalInvestment: 140500,
  taxCredits: 42150,
  taxCreditPct: 30,
  netProjectCost: 114350,
  annualSavings: 8920,
};

export const RECOMMENDED_SYSTEMS: RecommendedSystem[] = [
  {
    id: "solar",
    icon: "solar",
    title: "Solar PV Array",
    subtitle: "12.5 kW • 35 panels",
    systemCost: 28500,
    annualGenerationKwh: 16200,
    annualSavings: 2430,
    paybackYears: 8.2,
    bgClassName: "border border-[#FFF085] bg-[#FEFCE8]",
  },
  {
    id: "wind",
    icon: "wind",
    title: "Wind Turbine System",
    subtitle: "10 kW • 2 turbines",
    systemCost: 42000,
    annualGenerationKwh: 12800,
    annualSavings: 1920,
    paybackYears: 12.5,
    bgClassName: "bg-[#EFF6FF] border border-[#BEDBFF]",
  },
  {
    id: "biomass",
    icon: "biomass",
    title: "Biomass Energy System",
    subtitle: "30 kW • 1 generator",
    systemCost: 52000,
    annualGenerationKwh: 52000,
    annualSavings: 3120,
    paybackYears: 11.8,
    bgClassName: "bg-[#F0FDF4] border border-[#B9F8CF]",
  },
  {
    id: "battery",
    icon: "battery",
    title: "Battery Storage",
    subtitle: "30 kWh • Lithium-Ion",
    systemCost: 18000,
    annualGenerationKwh: null,
    annualSavings: 1450,
    paybackYears: 8.9,
    bgClassName: "bg-[#FAF5FF] border border-[#E9D4FF]",
  },
];

export const ENGINEERING_SERVICES: EngineeringServiceItem[] = [
  {
    id: "solar-design",
    order: 1,
    title: "Solar System Design",
    durationLabel: "Duration: 2-3 weeks",
    cost: 2500,
  },
  {
    id: "wind-assessment",
    order: 2,
    title: "Wind Resource Assessment",
    durationLabel: "Duration: 3-4 weeks",
    cost: 3200,
  },
  {
    id: "biomass-feasibility",
    order: 3,
    title: "Biomass Feasibility Study",
    durationLabel: "Duration: 2-3 weeks",
    cost: 2800,
  },
  {
    id: "building-energy-modeling",
    order: 4,
    title: "Building Energy Modeling",
    durationLabel: "Duration: 4-5 weeks",
    cost: 4500,
  },
  {
    id: "battery-storage-design",
    order: 5,
    title: "Battery Storage Design",
    durationLabel: "Duration: 2-3 weeks",
    cost: 3000,
  },
];

export const TIMELINE_PHASES: TimelinePhase[] = [
  {
    id: "engineering-design",
    order: 1,
    title: "Engineering Design",
    durationLabel: "Estimated duration: 6 weeks",
    durationWeeks: 6,
  },
  {
    id: "permitting-approvals",
    order: 2,
    title: "Permitting & Approvals",
    durationLabel: "Estimated duration: 8 weeks",
    durationWeeks: 8,
  },
  {
    id: "equipment-procurement",
    order: 3,
    title: "Equipment Procurement",
    durationLabel: "Estimated duration: 4 weeks",
    durationWeeks: 4,
  },
  {
    id: "installation-testing",
    order: 4,
    title: "Installation & Testing",
    durationLabel: "Estimated duration: 10 weeks",
    durationWeeks: 10,
  },
  {
    id: "commissioning",
    order: 5,
    title: "Commissioning",
    durationLabel: "Estimated duration: 2 weeks",
    durationWeeks: 2,
  },
];

export const SAVINGS_FORECAST: SavingsForecastYear[] = [
  { year: "Year 1", annualSavings: 8920, omCost: 4200 },
  { year: "Year 3", annualSavings: 9450, omCost: 4400 },
  { year: "Year 5", annualSavings: 10100, omCost: 4600 },
  { year: "Year 10", annualSavings: 12300, omCost: 5100 },
  { year: "Year 15", annualSavings: 13600, omCost: 5500 },
  { year: "Year 20", annualSavings: 15200, omCost: 6100 },
  { year: "Year 25", annualSavings: 16900, omCost: 6700 },
];

export const CUMULATIVE_SAVINGS: CumulativeSavingsPoint[] = [
  { year: "Y1", cumulativeSavings: 8920 },
  { year: "Y3", cumulativeSavings: 27820 },
  { year: "Y5", cumulativeSavings: 47870 },
  { year: "Y10", cumulativeSavings: 106500 },
  { year: "Y15", cumulativeSavings: 141200 },
  { year: "Y20", cumulativeSavings: 178500 },
  { year: "Y25", cumulativeSavings: 208000 },
];

export const SAVINGS_FORECAST_SUMMARY: SavingsForecastSummary = {
  paybackYears: 9.8,
  twentyFiveYearSavings: 208000,
  netPresentValue: 92400,
  roi25YearPct: 148,
};

export const COST_SUMMARY: CostSummary = {
  renewableEnergySystems: 140500,
  engineeringServices: 16000,
  subtotal: 156500,
  federalTaxCreditPct: 30,
  federalTaxCreditAmount: 42150,
  netProjectInvestment: 114350,
};
