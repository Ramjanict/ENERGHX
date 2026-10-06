import {
  DesignProductSpecs,
  DesignSolveEnvelope,
  DesignSolveItem,
} from "./shared";

export interface SolveBiomassSlurryMixtureRatio {
  feedstock_kg: number;
  water_kg: number;
}

export interface SolveBiomassContext {
  feedstock_availability: string;
  feedstock: string;
  environment_temperature_c: number;
  slurry_mixture_ratio: SolveBiomassSlurryMixtureRatio;
}

export interface SolveBiomassDemand {
  heating_demand_kwh_yr: number;
  annual_load_kwh: number;
  usage_profile: string;
}

export interface SolveBiomassFuel {
  cost_per_tonne: number;
  currency: string;
  energy_density_kwh_kg: number;
  moisture_content_pct: number;
}

export interface SolveBiomassTariff {
  rate_per_kwh_thermal: number;
  incumbent_fuel: string;
  currency?: string;
}

export interface SolveBiomassOptions {
  horizon_years: number;
  savings_basis: "gross" | "net" | string;
  storage_months: number;
}

export interface SolveBiomassDesignPayload {
  items: DesignSolveItem[];
  context: SolveBiomassContext;
  demand: SolveBiomassDemand;
  fuel: SolveBiomassFuel;
  tariff: SolveBiomassTariff;
  options: SolveBiomassOptions;
}

export interface BiomassMetric {
  value: number;
  unit: string;
  sub_label: string;
}

export interface BiomassSizing {
  recommended_capacity: BiomassMetric;
  annual_output: BiomassMetric;
  energy_coverage: BiomassMetric | null;
}

export interface BiomassSystemConfiguration {
  system_type: string;
  output_kind: string;
  efficiency_pct: number;
  feedstock_type: string;
  feed_rate_kg_h: number | null;
  storage_capacity_tonnes: number | null;
  name: string;
  manufacturer: string;
  category: string;
  energy_role: string;
  output_spec: string | null;
  technology: string | null;
  additional: string | null;
  efficiency_class: string | null;
  warranty_years: number | null;
  rating: number | null;
  country_of_origin: string | null;
  installation_types: string | null;
  market_status: string | null;
  notes: string | null;
  image_urls: string[];
  specs: DesignProductSpecs;
}

export interface BiomassFeedstockAnalysis {
  feedstock_type: string;
  annual_consumption_tonnes: number;
  cost_per_tonne: number;
  energy_density_kwh_kg: number;
  moisture_content_pct: number;
  local_availability: string;
}

export interface BiomassTechnicalSpecifications {
  system_configuration: BiomassSystemConfiguration;
  feedstock_analysis: BiomassFeedstockAnalysis;
}

export interface BiomassSpaceRequirements {
  plant_room: BiomassMetric;
  feedstock_storage: BiomassMetric;
  total_space: BiomassMetric;
}

export interface BiomassFinancialAnalysis {
  currency: string;
  equipment_cost: number;
  installation_cost: number;
  total_investment: number;
  payback_period_years: number;
  annual_fuel_cost: number;
  annual_savings: number;
  lifetime_savings: number;
  horizon_years: number;
  savings_basis: string;
}

export interface BiomassEnvironmentalBenefit {
  title: string;
  value: string;
  note: string;
}

export interface BiomassUnavailableField {
  path: string;
  requires: string[];
  message: string;
}

export type BiomassAssumptions = Record<string, string | number | boolean>;

export interface SolveBiomassDesignData {
  success: boolean;
  pathway: string;
  sizing: BiomassSizing;
  technical_specifications: BiomassTechnicalSpecifications;
  space_requirements: BiomassSpaceRequirements;
  financial_analysis: BiomassFinancialAnalysis;
  environmental_benefits: BiomassEnvironmentalBenefit[];
  integration_notes: string[];
  unavailable: BiomassUnavailableField[];
  assumptions: BiomassAssumptions;
}

export type SolveBiomassDesignResponse =
  DesignSolveEnvelope<SolveBiomassDesignData>;
