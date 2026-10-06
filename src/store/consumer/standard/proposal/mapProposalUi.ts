import {
  COST_SUMMARY,
  CUMULATIVE_SAVINGS,
  ENGINEERING_SERVICES,
  PROPOSAL_TOP_STATS,
  RECOMMENDED_SYSTEMS,
  SAVINGS_FORECAST,
  SAVINGS_FORECAST_SUMMARY,
  TIMELINE_PHASES,
} from "@/components/consumer/standard/contact/proposal/data";
import {
  CostSummary,
  CumulativeSavingsPoint,
  EngineeringServiceItem,
  ProposalTopStats,
  RecommendedSystem,
  SavingsForecastSummary,
  SavingsForecastYear,
  TimelinePhase,
} from "@/components/consumer/standard/contact/proposal/types";
import { parseNumericValue } from "@/lib/utils";
import { GetProposalResponse, ProposalSystem } from "./types/proposal";

const SYSTEM_STYLES: Record<
  string,
  { icon: RecommendedSystem["icon"]; bgClassName: string }
> = {
  solar: {
    icon: "solar",
    bgClassName: "border border-[#FFF085] bg-[#FEFCE8]",
  },
  wind: {
    icon: "wind",
    bgClassName: "bg-[#EFF6FF] border border-[#BEDBFF]",
  },
  biomass: {
    icon: "biomass",
    bgClassName: "bg-[#F0FDF4] border border-[#B9F8CF]",
  },
  battery: {
    icon: "battery",
    bgClassName: "bg-[#FAF5FF] border border-[#E9D4FF]",
  },
};

const inferSystemKey = (system: ProposalSystem, index: number) => {
  const raw = `${system.icon ?? ""} ${system.key ?? ""} ${system.id ?? ""} ${system.title ?? ""} ${system.name ?? ""} ${system.label ?? ""}`.toLowerCase();
  if (raw.includes("solar")) return "solar";
  if (raw.includes("wind")) return "wind";
  if (raw.includes("biomass")) return "biomass";
  if (raw.includes("battery")) return "battery";
  return (["solar", "wind", "biomass", "battery"] as const)[index % 4];
};

const formatSubtitle = (system: ProposalSystem, fallback: string) => {
  if (typeof system.subtitle === "string" && system.subtitle.trim()) {
    return system.subtitle;
  }
  if (typeof system.capacity === "string" && system.capacity.trim()) {
    return system.capacity;
  }
  if (typeof system.capacityKw === "number") {
    return `${system.capacityKw} kW`;
  }
  if (typeof system.capacity === "number") {
    return `${system.capacity} kW`;
  }
  if (typeof system.capacity === "object" && system.capacity !== null) {
    const capObj = system.capacity as Record<string, unknown>;
    const val = parseNumericValue(capObj, NaN);
    const unit = (capObj.unit as string) || "kW";
    if (!isNaN(val)) return `${val} ${unit}`;
  }
  if (typeof system.capacityKw === "object" && system.capacityKw !== null) {
    const val = parseNumericValue(system.capacityKw, NaN);
    if (!isNaN(val)) return `${val} kW`;
  }
  return fallback;
};

export const mapProposalTopStats = (
  data?: GetProposalResponse | null,
): ProposalTopStats => {
  const financial = data?.financialBreakdown;
  const projected = data?.projectedSavings;
  const costSummary = data?.costSummary;
  const hasContractLikePayload = Boolean(
    financial || projected || costSummary || data?.projectSummary,
  );

  if (!data || !hasContractLikePayload) return PROPOSAL_TOP_STATS;

  const totalInvestment = parseNumericValue(
    data.totalInvestment ??
      financial?.totalSystemCost ??
      data.projectSummary?.totalProjectCost ??
      costSummary?.subtotal,
    0,
  );

  const rawTaxCreditRate =
    data.federalTaxCreditRate ??
    financial?.federalTaxCreditRate ??
    costSummary?.federalTaxCreditRate ??
    (costSummary?.federalTaxCreditPct !== undefined
      ? parseNumericValue(costSummary.federalTaxCreditPct, 30) / 100
      : undefined);

  const taxCreditRate = parseNumericValue(
    rawTaxCreditRate,
    PROPOSAL_TOP_STATS.taxCreditPct / 100,
  );

  const taxCredits = parseNumericValue(
    data.taxCredits ??
      financial?.federalTaxCredit ??
      costSummary?.federalTaxCreditAmount,
    0,
  );

  const netProjectCost = parseNumericValue(
    data.netProjectCost ??
      financial?.netInvestment ??
      costSummary?.netProjectInvestment,
    0,
  );

  const annualSavings = parseNumericValue(
    data.annualSavings ?? projected?.annualSavings,
    0,
  );

  return {
    totalInvestment,
    taxCredits,
    taxCreditPct: Math.round(taxCreditRate * 100),
    netProjectCost,
    annualSavings,
  };
};

export const mapRecommendedSystems = (
  data?: GetProposalResponse | null,
): RecommendedSystem[] => {
  if (!data) return RECOMMENDED_SYSTEMS;

  const hasSystemsField =
    data.recommendedSystems !== undefined ||
    data.systems !== undefined ||
    data.projectSummary?.systems !== undefined;

  if (!hasSystemsField) return RECOMMENDED_SYSTEMS;

  const systems =
    data.recommendedSystems ??
    data.systems ??
    data.projectSummary?.systems ??
    [];

  return systems.map((system, index) => {
    const key = inferSystemKey(system, index);
    const style = SYSTEM_STYLES[key];

    const systemCost = parseNumericValue(
      system.systemCost ?? system.cost,
      0,
    );

    const hasGen =
      system.annualGenerationKwh !== undefined &&
      system.annualGenerationKwh !== null;
    const rawGen = hasGen ? parseNumericValue(system.annualGenerationKwh, NaN) : NaN;
    const annualGenerationKwh = isNaN(rawGen) ? null : rawGen;

    const annualSavings = parseNumericValue(
      system.annualSavings,
      0,
    );

    const hasPayback =
      system.paybackYears !== undefined && system.paybackYears !== null;
    const rawPayback = hasPayback ? parseNumericValue(system.paybackYears, NaN) : NaN;
    const paybackYears = isNaN(rawPayback) ? null : rawPayback;

    return {
      id: String(system.id || system.key || key),
      icon: style.icon,
      title:
        system.title ||
        system.name ||
        system.label ||
        "Recommended System",
      subtitle: formatSubtitle(system, "--"),
      systemCost,
      annualGenerationKwh,
      annualSavings,
      paybackYears,
      bgClassName: style.bgClassName,
    };
  });
};

export const mapEngineeringServices = (
  data?: GetProposalResponse | null,
): EngineeringServiceItem[] => {
  const items = data?.engineeringServices;
  if (!items?.length) return ENGINEERING_SERVICES;

  return items.map((item, index) => {
    const fallback = ENGINEERING_SERVICES[index % ENGINEERING_SERVICES.length];
    const cost = parseNumericValue(item.cost ?? fallback?.cost, 0);
    return {
      id: String(item.id || item.key || fallback?.id || `service-${index + 1}`),
      order: parseNumericValue(item.order, index + 1),
      title: item.title || item.name || fallback?.title || `Service ${index + 1}`,
      durationLabel:
        item.durationLabel ||
        (item.duration ? `Duration: ${item.duration}` : null) ||
        fallback?.durationLabel ||
        "Duration: --",
      cost,
    };
  });
};

export const mapProposalTimeline = (
  data?: GetProposalResponse | null,
): TimelinePhase[] => {
  const phases = data?.timeline ?? data?.implementationTimeline;
  if (!phases?.length) return TIMELINE_PHASES;

  return phases.map((phase, index) => {
    const fallback = TIMELINE_PHASES[index % TIMELINE_PHASES.length];
    const duration =
      phase.durationLabel ||
      phase.estimatedDuration ||
      fallback?.durationLabel ||
      "--";
    return {
      id: String(phase.id || phase.key || fallback?.id || `phase-${index + 1}`),
      order: parseNumericValue(phase.order ?? phase.step, index + 1),
      title: phase.title || fallback?.title || `Phase ${index + 1}`,
      durationLabel: duration.startsWith("Estimated")
        ? duration
        : `Estimated duration: ${duration}`,
      durationWeeks: parseNumericValue(phase.durationWeeks ?? fallback?.durationWeeks, 0),
    };
  });
};

export const mapSavingsForecast = (
  data?: GetProposalResponse | null,
): SavingsForecastYear[] => {
  if (!data?.savingsForecast?.length) return SAVINGS_FORECAST;
  return data.savingsForecast.map((item, index) => {
    const fallback = SAVINGS_FORECAST[index % SAVINGS_FORECAST.length];
    return {
      year: item.year || fallback?.year || `Year ${index + 1}`,
      annualSavings: parseNumericValue(item.annualSavings ?? fallback?.annualSavings, 0),
      omCost: parseNumericValue(item.omCost ?? fallback?.omCost, 0),
    };
  });
};

export const mapCumulativeSavings = (
  data?: GetProposalResponse | null,
): CumulativeSavingsPoint[] => {
  if (!data?.cumulativeSavings?.length) return CUMULATIVE_SAVINGS;
  return data.cumulativeSavings.map((item, index) => {
    const fallback = CUMULATIVE_SAVINGS[index % CUMULATIVE_SAVINGS.length];
    return {
      year: item.year || fallback?.year || `Y${index + 1}`,
      cumulativeSavings: parseNumericValue(
        item.cumulativeSavings ?? fallback?.cumulativeSavings,
        0,
      ),
    };
  });
};

export const mapSavingsForecastSummary = (
  data?: GetProposalResponse | null,
): SavingsForecastSummary => {
  const rawPayback =
    data?.paybackYears ?? data?.projectedSavings?.paybackPeriodYears;
  const paybackYears =
    rawPayback !== undefined && rawPayback !== null
      ? parseNumericValue(rawPayback, NaN)
      : NaN;

  const raw25Year =
    data?.twentyFiveYearSavings ??
    data?.cumulativeSavings25Year ??
    data?.projectedSavings?.cumulativeSavings25Year;
  const twentyFiveYearSavings =
    raw25Year !== undefined && raw25Year !== null
      ? parseNumericValue(raw25Year, NaN)
      : NaN;

  const rawNpv = data?.netPresentValue;
  const netPresentValue =
    rawNpv !== undefined && rawNpv !== null
      ? parseNumericValue(rawNpv, NaN)
      : NaN;

  const rawRoi = data?.roi25YearPct;
  const roi25YearPct =
    rawRoi !== undefined && rawRoi !== null
      ? parseNumericValue(rawRoi, NaN)
      : NaN;

  const hasAny =
    (!isNaN(paybackYears) && paybackYears > 0) ||
    (!isNaN(twentyFiveYearSavings) && twentyFiveYearSavings > 0) ||
    (!isNaN(netPresentValue) && netPresentValue > 0) ||
    (!isNaN(roi25YearPct) && roi25YearPct > 0);

  if (!hasAny) return SAVINGS_FORECAST_SUMMARY;

  return {
    paybackYears: !isNaN(paybackYears) ? paybackYears : SAVINGS_FORECAST_SUMMARY.paybackYears,
    twentyFiveYearSavings:
      !isNaN(twentyFiveYearSavings) ? twentyFiveYearSavings : SAVINGS_FORECAST_SUMMARY.twentyFiveYearSavings,
    netPresentValue: !isNaN(netPresentValue) ? netPresentValue : SAVINGS_FORECAST_SUMMARY.netPresentValue,
    roi25YearPct: !isNaN(roi25YearPct) ? roi25YearPct : SAVINGS_FORECAST_SUMMARY.roi25YearPct,
  };
};

export const mapCostSummary = (
  data?: GetProposalResponse | null,
): CostSummary => {
  const summary = data?.costSummary;
  const financial = data?.financialBreakdown;

  if (!summary && !financial) return COST_SUMMARY;

  const rawRate =
    summary?.federalTaxCreditRate ??
    financial?.federalTaxCreditRate ??
    data?.federalTaxCreditRate;
  const federalTaxCreditPct =
    summary?.federalTaxCreditPct !== undefined
      ? parseNumericValue(summary.federalTaxCreditPct, NaN)
      : rawRate !== undefined && rawRate !== null
      ? Math.round(parseNumericValue(rawRate, 0.3) * 100)
      : null;

  const rawRenewable =
    summary?.renewableEnergySystems ??
    financial?.totalSystemCost ??
    data?.projectSummary?.totalProjectCost;
  const renewableEnergySystems =
    rawRenewable !== undefined && rawRenewable !== null
      ? parseNumericValue(rawRenewable, NaN)
      : null;

  const rawEng = summary?.engineeringServices;
  const engineeringServices =
    rawEng !== undefined && rawEng !== null
      ? parseNumericValue(rawEng, NaN)
      : null;

  const rawSubtotal = summary?.subtotal;
  const subtotal =
    rawSubtotal !== undefined && rawSubtotal !== null
      ? parseNumericValue(rawSubtotal, NaN)
      : null;

  const rawTaxCreditAmount =
    summary?.federalTaxCreditAmount ?? financial?.federalTaxCredit;
  const federalTaxCreditAmount =
    rawTaxCreditAmount !== undefined && rawTaxCreditAmount !== null
      ? parseNumericValue(rawTaxCreditAmount, NaN)
      : null;

  const rawNetProject =
    summary?.netProjectInvestment ?? financial?.netInvestment;
  const netProjectInvestment =
    rawNetProject !== undefined && rawNetProject !== null
      ? parseNumericValue(rawNetProject, NaN)
      : null;

  const valuesToCheck = [
    renewableEnergySystems,
    engineeringServices,
    subtotal,
    federalTaxCreditAmount,
    netProjectInvestment,
  ];
  const hasAny = valuesToCheck.some((v) => v !== null && !isNaN(v) && v > 0);

  if (!hasAny) return COST_SUMMARY;

  return {
    renewableEnergySystems:
      renewableEnergySystems !== null && !isNaN(renewableEnergySystems)
        ? renewableEnergySystems
        : COST_SUMMARY.renewableEnergySystems,
    engineeringServices:
      engineeringServices !== null && !isNaN(engineeringServices)
        ? engineeringServices
        : COST_SUMMARY.engineeringServices,
    subtotal:
      subtotal !== null && !isNaN(subtotal)
        ? subtotal
        : COST_SUMMARY.subtotal,
    federalTaxCreditPct:
      federalTaxCreditPct !== null && !isNaN(federalTaxCreditPct)
        ? federalTaxCreditPct
        : COST_SUMMARY.federalTaxCreditPct,
    federalTaxCreditAmount:
      federalTaxCreditAmount !== null && !isNaN(federalTaxCreditAmount)
        ? federalTaxCreditAmount
        : COST_SUMMARY.federalTaxCreditAmount,
    netProjectInvestment:
      netProjectInvestment !== null && !isNaN(netProjectInvestment)
        ? netProjectInvestment
        : COST_SUMMARY.netProjectInvestment,
  };
};

export const buildApproveProposalPayload = (
  data?: GetProposalResponse | null,
) => {
  const costSummary = mapCostSummary(data);
  const financial = data?.financialBreakdown;

  return {
    status: "APPROVED" as const,
    approved: true,
    approvedAt: new Date().toISOString(),
    federalTaxCreditRate:
      data?.federalTaxCreditRate ??
      financial?.federalTaxCreditRate ??
      costSummary.federalTaxCreditPct / 100,
    stateRebates: data?.stateRebates ?? financial?.stateRebates ?? 5000,
    utilityIncentives:
      data?.utilityIncentives ?? financial?.utilityIncentives ?? 3500,
  };
};
