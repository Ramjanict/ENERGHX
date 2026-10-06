import type {
  ResValidationChecklistItem,
  ResValidationRiskItem,
  StandardPlanCard,
} from "@/store/consumer/standard/Simulations/types/dashboard";
import type {
  GetResValidationResponse,
  GetResValidationSummaryResponse,
  ResValidation,
  ResValidationMetric,
  ResValidationRenewableSystemSummaryMetrics,
  ResValidationSummary,
} from "./types/resValidation";

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const DEFAULT_HERO: ResValidation["hero"] = {
  title: "Renewable Energy System (RES) Sequence Validation",
  subtitle:
    "Validate all renewable energy sizing and engineering calculations before proposal generation",
  status: "PENDING",
};

const DEFAULT_METRIC: ResValidationMetric = { value: null, unit: null };

const DEFAULT_SUMMARY_METRICS: ResValidationRenewableSystemSummaryMetrics = {
  solarCapacity: DEFAULT_METRIC,
  windCapacity: DEFAULT_METRIC,
  biomassCapacity: DEFAULT_METRIC,
  hvacCapacity: DEFAULT_METRIC,
  batteryCapacity: DEFAULT_METRIC,
  evCapacity: DEFAULT_METRIC,
  totalAnnualProduction: DEFAULT_METRIC,
  totalProjectCost: DEFAULT_METRIC,
  projectedRoi: DEFAULT_METRIC,
};

const SUMMARY_CARD_DEFS: Array<{
  key: keyof ResValidationRenewableSystemSummaryMetrics;
  label: string;
  subtext: string | null;
  defaultUnit: string | null;
}> = [
  {
    key: "solarCapacity",
    label: "Solar Capacity",
    subtext: "Photovoltaic system",
    defaultUnit: "kW",
  },
  {
    key: "windCapacity",
    label: "Wind Capacity",
    subtext: "Wind turbine system",
    defaultUnit: "kW",
  },
  {
    key: "biomassCapacity",
    label: "Biomass Capacity",
    subtext: "Biomass heating system",
    defaultUnit: "kW",
  },
  {
    key: "hvacCapacity",
    label: "HVAC Capacity",
    subtext: "Heating & cooling",
    defaultUnit: "kW",
  },
  {
    key: "batteryCapacity",
    label: "Battery Capacity",
    subtext: "Energy storage",
    defaultUnit: "kWh",
  },
  {
    key: "evCapacity",
    label: "EV Charging Capacity",
    subtext: "EV infrastructure",
    defaultUnit: "kW",
  },
  {
    key: "totalAnnualProduction",
    label: "Total Annual Production",
    subtext: null,
    defaultUnit: "kWh",
  },
  {
    key: "totalProjectCost",
    label: "Total Project Cost",
    subtext: null,
    defaultUnit: "$",
  },
  {
    key: "projectedRoi",
    label: "Projected ROI",
    subtext: null,
    defaultUnit: "years",
  },
];

const DEFAULT_SUMMARY_CARDS: StandardPlanCard[] = SUMMARY_CARD_DEFS.map(
  (def) => ({
    label: def.label,
    value: null,
    unit: def.defaultUnit,
    subtext: def.subtext,
  }),
);

const DEFAULT_RISKS: ResValidationRiskItem[] = [
  { key: "technical", label: "Technical Risk", status: "Pending" },
  { key: "financial", label: "Financial Risk", status: "Pending" },
  { key: "implementation", label: "Implementation Risk", status: "Pending" },
  { key: "compliance", label: "Compliance Risk", status: "Pending" },
];

const DEFAULT_SUMMARY: ResValidationSummary = {
  generatedDesignCount: 0,
  solarCapacityKw: null,
  windCapacityKw: null,
  biomassCapacityKw: null,
  batteryCapacityKwh: null,
  evChargingCapacityKw: null,
  totalSystemCapacityKw: null,
  totalAnnualProductionKwh: null,
  totalProjectCost: null,
  projectedPaybackYears: null,
  expectedEnergyOffsetPercent: null,
  annualSavings: null,
  carbonReductionTonsYear: null,
  sources: {
    solar: false,
    wind: false,
    biomass: false,
    hvac: false,
    battery: false,
    ev: false,
  },
};

const CHECKLIST_LABELS: Record<string, string> = {
  "solar-sizing": "Solar System Sizing",
  "wind-sizing": "Wind System Sizing",
  "hvac-sizing": "HVAC System Sizing",
  "battery-sizing": "Battery Storage Sizing",
  "ev-sizing": "EV Charging Infrastructure",
  "biomass-sizing": "Biomass System Sizing",
  "energy-commodity": "Energy Commodity Setup",
  "financial-analysis": "Financial Analysis",
  "utility-data": "Utility Data Connection",
};

const humanizeKey = (key: string) =>
  CHECKLIST_LABELS[key] ??
  key
    .split(/[-_]/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");

const looksLikeResValidation = (value: Record<string, unknown>) =>
  "hero" in value ||
  "overallSystemReadiness" in value ||
  "validationChecklist" in value ||
  "renewableSystemSummary" in value ||
  "status" in value;

const unwrapEnvelope = (raw: unknown): Record<string, unknown> => {
  let current = raw;

  for (let i = 0; i < 3; i++) {
    if (!isRecord(current)) return {};

    const nested = current.data;
    const hasPayload =
      "resValidation" in current ||
      "res_validation" in current ||
      "workflow" in current ||
      "step" in current ||
      looksLikeResValidation(current);

    if (hasPayload) return current;

    if (isRecord(nested)) {
      current = nested;
      continue;
    }

    break;
  }

  return isRecord(current) ? current : {};
};

const asMetric = (value: unknown): ResValidationMetric => {
  if (!isRecord(value)) return DEFAULT_METRIC;
  return {
    value: typeof value.value === "number" ? value.value : null,
    unit: typeof value.unit === "string" ? value.unit : null,
  };
};

const moneyUnit = (unit: string | null) =>
  unit === "USD" || unit === "$" ? "$" : unit;

const readinessToCards = (
  readiness: ResValidation["overallSystemReadiness"],
): StandardPlanCard[] => [
  {
    label: "System Readiness Score",
    value: readiness.systemReadinessScore.value,
    unit: readiness.systemReadinessScore.unit ?? "%",
    subtext: "All systems validated",
  },
  {
    label: "Renewable Coverage",
    value: readiness.renewableCoverage.value,
    unit: readiness.renewableCoverage.unit ?? "%",
    subtext: "Energy offset",
  },
  {
    label: "Annual Savings",
    value: readiness.annualSavings.value,
    unit: moneyUnit(readiness.annualSavings.unit) ?? "$",
    subtext: "First year",
  },
  {
    label: "Carbon Reduction",
    value: readiness.carbonReduction.value,
    unit: null,
    subtext: readiness.carbonReduction.unit ?? "tons CO2/year",
  },
];

const asCard = (value: unknown): StandardPlanCard | null => {
  if (!isRecord(value) || typeof value.label !== "string") return null;
  return {
    label: value.label,
    value:
      typeof value.value === "number" || typeof value.value === "string"
        ? value.value
        : null,
    unit: typeof value.unit === "string" ? value.unit : null,
    subtext: typeof value.subtext === "string" ? value.subtext : null,
  };
};

const asCards = (value: unknown): StandardPlanCard[] => {
  const list = Array.isArray(value)
    ? value
    : isRecord(value) && Array.isArray(value.cards)
      ? value.cards
      : [];
  return list.map(asCard).filter((card): card is StandardPlanCard => card !== null);
};

const metricToCardUnit = (unit: string | null, fallback: string | null) =>
  moneyUnit(unit) ?? fallback;

const renewableSummaryMetricsToCards = (
  metrics: ResValidationRenewableSystemSummaryMetrics,
): StandardPlanCard[] =>
  SUMMARY_CARD_DEFS.map((def) => {
    const metric = metrics[def.key];
    return {
      label: def.label,
      value: metric.value,
      unit: metricToCardUnit(metric.unit, def.defaultUnit),
      subtext: def.subtext,
    };
  });

const asRenewableSummaryMetrics = (
  value: unknown,
): ResValidationRenewableSystemSummaryMetrics => {
  const source = isRecord(value) ? value : {};
  return {
    solarCapacity: asMetric(source.solarCapacity),
    windCapacity: asMetric(source.windCapacity),
    biomassCapacity: asMetric(source.biomassCapacity),
    hvacCapacity: asMetric(source.hvacCapacity),
    batteryCapacity: asMetric(source.batteryCapacity),
    evCapacity: asMetric(source.evCapacity),
    totalAnnualProduction: asMetric(source.totalAnnualProduction),
    totalProjectCost: asMetric(source.totalProjectCost),
    projectedRoi: asMetric(source.projectedRoi),
  };
};

const hasNamedSummaryMetrics = (value: unknown) =>
  isRecord(value) &&
  SUMMARY_CARD_DEFS.some((def) => isRecord(value[def.key]));

const asRenewableSystemSummaryCards = (value: unknown): StandardPlanCard[] => {
  if (hasNamedSummaryMetrics(value)) {
    return renewableSummaryMetricsToCards(asRenewableSummaryMetrics(value));
  }
  return mergeCards(asCards(value), DEFAULT_SUMMARY_CARDS);
};

const asChecklist = (value: unknown): ResValidationChecklistItem[] => {
  if (!Array.isArray(value)) return [];
  return value
    .filter(isRecord)
    .map((item) => {
      const key = String(item.key ?? "");
      const label =
        typeof item.label === "string" && item.label.trim()
          ? item.label
          : humanizeKey(key);
      return {
        key,
        label,
        status: String(item.status ?? "Pending"),
        validatedBy:
          item.validatedBy === null || item.validatedBy === undefined
            ? null
            : String(item.validatedBy),
        associateId:
          item.associateId === null || item.associateId === undefined
            ? null
            : String(item.associateId),
        role:
          item.role === null || item.role === undefined
            ? null
            : String(item.role),
      };
    })
    .filter((item) => item.key || item.label);
};

const asRisks = (value: unknown): ResValidationRiskItem[] => {
  if (!Array.isArray(value)) return [];
  return value
    .filter(isRecord)
    .map((item) => ({
      key: String(item.key ?? ""),
      label: String(item.label ?? ""),
      status: String(item.status ?? "Pending"),
    }))
    .filter((item) => item.key || item.label);
};

const mergeCards = (
  apiCards: StandardPlanCard[],
  defaults: StandardPlanCard[],
) => {
  const byLabel = new Map(apiCards.map((card) => [card.label, card]));
  const merged = defaults.map((card) => byLabel.get(card.label) ?? card);
  const extras = apiCards.filter(
    (card) => !defaults.some((fallback) => fallback.label === card.label),
  );
  return [...merged, ...extras];
};

const mergeRisks = (apiRisks: ResValidationRiskItem[]) => {
  if (apiRisks.length === 0) return DEFAULT_RISKS;
  const byKey = new Map(apiRisks.map((item) => [item.key, item]));
  const merged = DEFAULT_RISKS.map((item) => byKey.get(item.key) ?? item);
  const extras = apiRisks.filter(
    (item) => !DEFAULT_RISKS.some((fallback) => fallback.key === item.key),
  );
  return [...merged, ...extras];
};

const asOverallSystemReadiness = (
  value: unknown,
): ResValidation["overallSystemReadiness"] => {
  const source = isRecord(value) ? value : {};

  // New API shape: named metrics with { value, unit }
  if (
    isRecord(source.systemReadinessScore) ||
    isRecord(source.renewableCoverage) ||
    isRecord(source.annualSavings) ||
    isRecord(source.carbonReduction)
  ) {
    const readiness = {
      systemReadinessScore: asMetric(source.systemReadinessScore),
      renewableCoverage: asMetric(source.renewableCoverage),
      annualSavings: asMetric(source.annualSavings),
      carbonReduction: asMetric(source.carbonReduction),
      cards: [] as StandardPlanCard[],
    };
    readiness.cards = readinessToCards(readiness);
    return readiness;
  }

  // Legacy cards array shape
  const cards = mergeCards(asCards(source), readinessToCards({
    systemReadinessScore: DEFAULT_METRIC,
    renewableCoverage: DEFAULT_METRIC,
    annualSavings: DEFAULT_METRIC,
    carbonReduction: DEFAULT_METRIC,
    cards: [],
  }));

  return {
    systemReadinessScore: {
      value:
        typeof cards.find((c) => c.label === "System Readiness Score")?.value ===
        "number"
          ? (cards.find((c) => c.label === "System Readiness Score")
              ?.value as number)
          : null,
      unit: "%",
    },
    renewableCoverage: {
      value:
        typeof cards.find((c) => c.label === "Renewable Coverage")?.value ===
        "number"
          ? (cards.find((c) => c.label === "Renewable Coverage")
              ?.value as number)
          : null,
      unit: "%",
    },
    annualSavings: {
      value:
        typeof cards.find((c) => c.label === "Annual Savings")?.value ===
        "number"
          ? (cards.find((c) => c.label === "Annual Savings")?.value as number)
          : null,
      unit: "$",
    },
    carbonReduction: {
      value:
        typeof cards.find((c) => c.label === "Carbon Reduction")?.value ===
        "number"
          ? (cards.find((c) => c.label === "Carbon Reduction")?.value as number)
          : null,
      unit: "tons CO2/year",
    },
    cards,
  };
};

export const normalizeResValidation = (
  raw: ResValidation | Record<string, unknown> | null | undefined,
): ResValidation => {
  const source = isRecord(raw) ? raw : {};
  const hero = isRecord(source.hero) ? source.hero : {};
  const status =
    typeof source.status === "string" && source.status.trim()
      ? source.status
      : typeof hero.status === "string" && hero.status.trim()
        ? hero.status
        : DEFAULT_HERO.status;

  const overallSystemReadiness = asOverallSystemReadiness(
    source.overallSystemReadiness,
  );

  return {
    status,
    lastComputedOn:
      typeof source.lastComputedOn === "string" ? source.lastComputedOn : null,
    hero: {
      title:
        typeof hero.title === "string" && hero.title.trim()
          ? hero.title
          : DEFAULT_HERO.title,
      subtitle:
        typeof hero.subtitle === "string" && hero.subtitle.trim()
          ? hero.subtitle
          : DEFAULT_HERO.subtitle,
      status,
    },
    overallSystemReadiness,
    validationChecklist: asChecklist(source.validationChecklist),
    renewableSystemSummary: {
      cards: asRenewableSystemSummaryCards(source.renewableSystemSummary),
    },
    riskAssessment: mergeRisks(asRisks(source.riskAssessment)),
    summary: isRecord(source.summary)
      ? (() => {
          const summary = source.summary as unknown as Partial<ResValidationSummary>;
          return {
            ...DEFAULT_SUMMARY,
            ...summary,
            annualSavings:
              typeof summary.annualSavings === "number"
                ? summary.annualSavings
                : overallSystemReadiness.annualSavings.value,
            carbonReductionTonsYear:
              typeof summary.carbonReductionTonsYear === "number"
                ? summary.carbonReductionTonsYear
                : overallSystemReadiness.carbonReduction.value,
          };
        })()
      : {
          ...DEFAULT_SUMMARY,
          annualSavings: overallSystemReadiness.annualSavings.value,
          carbonReductionTonsYear: overallSystemReadiness.carbonReduction.value,
          expectedEnergyOffsetPercent:
            overallSystemReadiness.renewableCoverage.value,
        },
    overrides: (isRecord(source.overrides)
      ? source.overrides
      : {}) as ResValidation["overrides"],
  };
};

export const unwrapResValidationResponse = (
  response: unknown,
): GetResValidationResponse => {
  const payload = unwrapEnvelope(response);
  const nested =
    payload.resValidation ?? payload.res_validation ?? payload.data;
  const resValidationSource = isRecord(nested)
    ? nested
    : looksLikeResValidation(payload)
      ? payload
      : null;

  return {
    workflow: (payload.workflow ??
      null) as GetResValidationResponse["workflow"],
    step: (payload.step ?? null) as GetResValidationResponse["step"],
    resValidation: resValidationSource
      ? normalizeResValidation(resValidationSource)
      : normalizeResValidation(null),
  };
};

export const unwrapResValidationSummaryResponse = (
  response: unknown,
): GetResValidationSummaryResponse => {
  const payload = unwrapEnvelope(response);
  const summarySource = isRecord(payload.renewableSystemSummary)
    ? payload.renewableSystemSummary
    : isRecord(payload.data) && isRecord(payload.data.renewableSystemSummary)
      ? payload.data.renewableSystemSummary
      : payload;

  const metrics = hasNamedSummaryMetrics(summarySource)
    ? asRenewableSummaryMetrics(summarySource)
    : DEFAULT_SUMMARY_METRICS;

  const riskSource =
    payload.riskAssessment ??
    (isRecord(payload.data) ? payload.data.riskAssessment : undefined);

  const lastComputedOn =
    typeof payload.lastComputedOn === "string"
      ? payload.lastComputedOn
      : isRecord(payload.data) && typeof payload.data.lastComputedOn === "string"
        ? payload.data.lastComputedOn
        : null;

  return {
    lastComputedOn,
    metrics,
    renewableSystemSummary: {
      cards: hasNamedSummaryMetrics(summarySource)
        ? renewableSummaryMetricsToCards(metrics)
        : asRenewableSystemSummaryCards(summarySource),
    },
    riskAssessment: mergeRisks(asRisks(riskSource)),
  };
};
