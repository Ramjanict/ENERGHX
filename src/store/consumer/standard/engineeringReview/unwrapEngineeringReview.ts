import type { StandardPlanCard } from "@/store/consumer/standard/Simulations/types/dashboard";
import type {
  EngineeringReview,
  EngineeringReviewApprovalStatus,
  EngineeringReviewFinalSummaryMetrics,
  EngineeringReviewMetric,
  EngineeringReviewStatusItem,
  EngineeringReviewSummary,
  GetEngineeringReviewResponse,
  GetEngineeringReviewStatusResponse,
} from "./types/engineeringReview";

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const DEFAULT_METRIC: EngineeringReviewMetric = { value: null, unit: null };

const DEFAULT_HERO: EngineeringReview["hero"] = {
  title: "Engineering Review & Approval",
  subtitle:
    "Final technical validation and engineering sign-off before proposal generation",
  status: "PENDING",
};

const DEFAULT_NEXT_ACTION = { type: null, target: null };

const DEFAULT_APPROVAL_STATUS: EngineeringReviewApprovalStatus = {
  status: "PENDING",
  label: "Pending",
  approvalTimestamp: null,
  reviewedBy: null,
  associateId: null,
  reasons: [],
  offendingSections: [],
  nextAction: DEFAULT_NEXT_ACTION,
};

const DEFAULT_SUMMARY: EngineeringReviewSummary = {
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

const REVIEW_PROGRESS_LABELS: Record<string, string> = {
  technical: "Technical Review",
  financial: "Financial Review",
  sustainability: "Sustainability Review",
  compliance: "Compliance Review",
};

const APPROVAL_MATRIX_LABELS: Record<string, string> = {
  "technical-design": "Technical Design",
  "financial-feasibility": "Financial Feasibility",
  "utility-compatibility": "Utility Compatibility",
  "renewable-integration": "Renewable Integration",
  "environmental-compliance": "Environmental Compliance",
};

const SUMMARY_CARD_DEFS: Array<{
  key: keyof EngineeringReviewFinalSummaryMetrics;
  label: string;
  subtext: string | null;
  defaultUnit: string | null;
}> = [
  {
    key: "totalSystemCapacity",
    label: "Total System Capacity",
    subtext: null,
    defaultUnit: "kW",
  },
  {
    key: "expectedEnergyOffset",
    label: "Expected Energy Offset",
    subtext: null,
    defaultUnit: "%",
  },
  {
    key: "annualSavings",
    label: "Annual Savings",
    subtext: null,
    defaultUnit: "$",
  },
  {
    key: "carbonReduction",
    label: "Carbon Reduction",
    subtext: "tons",
    defaultUnit: null,
  },
  {
    key: "estimatedPayback",
    label: "Estimated Payback",
    subtext: null,
    defaultUnit: "years",
  },
];

const DEFAULT_SUMMARY_METRICS: EngineeringReviewFinalSummaryMetrics = {
  totalSystemCapacity: DEFAULT_METRIC,
  expectedEnergyOffset: DEFAULT_METRIC,
  annualSavings: DEFAULT_METRIC,
  carbonReduction: DEFAULT_METRIC,
  estimatedPayback: DEFAULT_METRIC,
};

const DEFAULT_REVIEW_PROGRESS: EngineeringReviewStatusItem[] = [
  { key: "technical", label: "Technical Review", status: "Pending" },
  { key: "financial", label: "Financial Review", status: "Pending" },
  { key: "sustainability", label: "Sustainability Review", status: "Pending" },
  { key: "compliance", label: "Compliance Review", status: "Pending" },
];

const DEFAULT_APPROVAL_MATRIX: EngineeringReviewStatusItem[] = [
  { key: "technical-design", label: "Technical Design", status: "Pending" },
  {
    key: "financial-feasibility",
    label: "Financial Feasibility",
    status: "Pending",
  },
  {
    key: "utility-compatibility",
    label: "Utility Compatibility",
    status: "Pending",
  },
  {
    key: "renewable-integration",
    label: "Renewable Integration",
    status: "Pending",
  },
  {
    key: "environmental-compliance",
    label: "Environmental Compliance",
    status: "Pending",
  },
];

const humanizeKey = (key: string, labels: Record<string, string>) =>
  labels[key] ??
  key
    .split(/[-_]/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");

const humanizeStatus = (status: string) =>
  status
    .split(/[\s_-]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join(" ");

const unwrapEnvelope = (raw: unknown): Record<string, unknown> => {
  let current = raw;

  for (let i = 0; i < 3; i++) {
    if (!isRecord(current)) return {};

    const hasPayload =
      "reviewProgress" in current ||
      "engineeringApprovalMatrix" in current ||
      "finalEngineeringSummary" in current ||
      "approvalStatus" in current ||
      "engineeringReview" in current ||
      "status" in current ||
      "workflow" in current;

    if (hasPayload) return current;

    if (isRecord(current.data)) {
      current = current.data;
      continue;
    }

    break;
  }

  return isRecord(current) ? current : {};
};

const asMetric = (value: unknown): EngineeringReviewMetric => {
  if (!isRecord(value)) return DEFAULT_METRIC;
  return {
    value: typeof value.value === "number" ? value.value : null,
    unit: typeof value.unit === "string" ? value.unit : null,
  };
};

const moneyUnit = (unit: string | null) =>
  unit === "USD" || unit === "$" ? "$" : unit;

const asStringList = (value: unknown): string[] =>
  Array.isArray(value)
    ? value.filter((item): item is string => typeof item === "string")
    : [];

const asStatusItems = (
  value: unknown,
  labels: Record<string, string>,
  defaults: EngineeringReviewStatusItem[],
): EngineeringReviewStatusItem[] => {
  if (!Array.isArray(value) || value.length === 0) return defaults;

  const items = value
    .filter(isRecord)
    .map((item) => {
      const key = String(item.key ?? "");
      const label =
        typeof item.label === "string" && item.label.trim()
          ? item.label
          : humanizeKey(key, labels);
      return {
        key,
        label,
        status: String(item.status ?? "Pending"),
      };
    })
    .filter((item) => item.key || item.label);

  if (items.length === 0) return defaults;

  const byKey = new Map(items.map((item) => [item.key, item]));
  const merged = defaults.map((item) => byKey.get(item.key) ?? item);
  const extras = items.filter(
    (item) => !defaults.some((fallback) => fallback.key === item.key),
  );
  return [...merged, ...extras];
};

const asFinalSummaryMetrics = (
  value: unknown,
): EngineeringReviewFinalSummaryMetrics => {
  const source = isRecord(value) ? value : {};
  return {
    totalSystemCapacity: asMetric(source.totalSystemCapacity),
    expectedEnergyOffset: asMetric(source.expectedEnergyOffset),
    annualSavings: asMetric(source.annualSavings),
    carbonReduction: asMetric(source.carbonReduction),
    estimatedPayback: asMetric(source.estimatedPayback),
  };
};

const hasNamedFinalSummaryMetrics = (value: unknown) =>
  isRecord(value) &&
  SUMMARY_CARD_DEFS.some((def) => isRecord(value[def.key]));

const resolveFinalSummaryMetrics = (
  source: Record<string, unknown>,
): EngineeringReviewFinalSummaryMetrics => {
  if (hasNamedFinalSummaryMetrics(source.finalEngineeringSummary)) {
    return asFinalSummaryMetrics(source.finalEngineeringSummary);
  }
  if (hasNamedFinalSummaryMetrics(source.finalEngineeringSummaryMetrics)) {
    return asFinalSummaryMetrics(source.finalEngineeringSummaryMetrics);
  }
  return DEFAULT_SUMMARY_METRICS;
};

const metricsToCards = (
  metrics: EngineeringReviewFinalSummaryMetrics,
): StandardPlanCard[] =>
  SUMMARY_CARD_DEFS.map((def) => {
    const metric = metrics[def.key];
    const unit = moneyUnit(metric.unit) ?? def.defaultUnit;
    const isCarbon = def.key === "carbonReduction";
    return {
      label: def.label,
      value: metric.value,
      unit: isCarbon ? null : unit,
      subtext: isCarbon
        ? metric.unit ?? def.subtext
        : def.subtext,
    };
  });

const asApprovalStatus = (
  value: unknown,
): EngineeringReviewApprovalStatus => {
  if (!isRecord(value)) return DEFAULT_APPROVAL_STATUS;

  const status =
    typeof value.status === "string" && value.status.trim()
      ? value.status
      : DEFAULT_APPROVAL_STATUS.status;

  const nextAction = isRecord(value.nextAction)
    ? {
        type:
          typeof value.nextAction.type === "string"
            ? value.nextAction.type
            : null,
        target:
          typeof value.nextAction.target === "string"
            ? value.nextAction.target
            : null,
      }
    : DEFAULT_NEXT_ACTION;

  return {
    status,
    label:
      typeof value.label === "string" && value.label.trim()
        ? value.label
        : humanizeStatus(status),
    approvalTimestamp:
      typeof value.approvalTimestamp === "string"
        ? value.approvalTimestamp
        : null,
    reviewedBy:
      value.reviewedBy === null || value.reviewedBy === undefined
        ? null
        : String(value.reviewedBy),
    associateId:
      value.associateId === null || value.associateId === undefined
        ? null
        : String(value.associateId),
    reasons: asStringList(value.reasons),
    offendingSections: asStringList(value.offendingSections),
    nextAction,
  };
};

const looksLikeEngineeringReview = (value: Record<string, unknown>) =>
  "reviewProgress" in value ||
  "engineeringApprovalMatrix" in value ||
  "finalEngineeringSummary" in value ||
  "approvalStatus" in value;

export const normalizeEngineeringReview = (
  raw: EngineeringReview | Record<string, unknown> | null | undefined,
): EngineeringReview => {
  const source = isRecord(raw) ? raw : {};
  const heroSource = isRecord(source.hero) ? source.hero : {};
  const metrics = resolveFinalSummaryMetrics(source);
  const approvalStatus = asApprovalStatus(source.approvalStatus);
  const status =
    typeof heroSource.status === "string" && heroSource.status.trim()
      ? heroSource.status
      : approvalStatus.status;

  return {
    hero: {
      title:
        typeof heroSource.title === "string" && heroSource.title.trim()
          ? heroSource.title
          : DEFAULT_HERO.title,
      subtitle:
        typeof heroSource.subtitle === "string" && heroSource.subtitle.trim()
          ? heroSource.subtitle
          : DEFAULT_HERO.subtitle,
      status,
    },
    reviewProgress: asStatusItems(
      source.reviewProgress,
      REVIEW_PROGRESS_LABELS,
      DEFAULT_REVIEW_PROGRESS,
    ),
    engineeringApprovalMatrix: asStatusItems(
      source.engineeringApprovalMatrix,
      APPROVAL_MATRIX_LABELS,
      DEFAULT_APPROVAL_MATRIX,
    ),
    finalEngineeringSummary: {
      cards: metricsToCards(metrics),
    },
    finalEngineeringSummaryMetrics: metrics,
    approvalStatus,
    summary: {
      ...DEFAULT_SUMMARY,
      totalSystemCapacityKw: metrics.totalSystemCapacity.value,
      expectedEnergyOffsetPercent: metrics.expectedEnergyOffset.value,
      annualSavings: metrics.annualSavings.value,
      carbonReductionTonsYear: metrics.carbonReduction.value,
      projectedPaybackYears: metrics.estimatedPayback.value,
    },
  };
};

export const unwrapEngineeringReviewResponse = (
  response: unknown,
): GetEngineeringReviewResponse => {
  const payload = unwrapEnvelope(response);
  const nested =
    payload.engineeringReview ?? payload.engineering_review ?? payload.data;
  const reviewSource = isRecord(nested)
    ? nested
    : looksLikeEngineeringReview(payload)
      ? payload
      : null;

  return {
    workflow: (payload.workflow ??
      null) as GetEngineeringReviewResponse["workflow"],
    step: (payload.step ?? null) as GetEngineeringReviewResponse["step"],
    engineeringReview: reviewSource
      ? normalizeEngineeringReview(reviewSource)
      : normalizeEngineeringReview(null),
  };
};

export const unwrapEngineeringReviewStatusResponse = (
  response: unknown,
): GetEngineeringReviewStatusResponse => {
  const payload = unwrapEnvelope(response);
  const nested = isRecord(payload.data) ? payload.data : payload;
  const statusSource =
    isRecord(nested.approvalStatus) ? nested.approvalStatus : nested;
  return asApprovalStatus(statusSource);
};

export const DEFAULT_ENGINEERING_SUMMARY_METRICS = DEFAULT_SUMMARY_METRICS;
