import { StandardPlanCard } from "@/store/consumer/standard/Simulations/types/dashboard";

export const formatMetricCardValue = (card: StandardPlanCard) => {
  if (card.value === null || card.value === undefined || card.value === "") {
    return "--";
  }

  const formatted =
    typeof card.value === "number"
      ? card.value.toLocaleString()
      : String(card.value);

  if (card.unit === "$") return `$${formatted}`;
  if (card.unit === "%") return `${formatted}%`;
  if (card.unit) return `${formatted} ${card.unit}`;
  return formatted;
};

export const statusToneClass = (status: string) => {
  const normalized = status.toLowerCase().replace(/[\s-]+/g, "_");
  if (
    normalized === "complete" ||
    normalized === "completed" ||
    normalized === "approved" ||
    normalized === "low" ||
    normalized === "passed" ||
    normalized === "ready"
  ) {
    return "text-green-600";
  }
  if (
    normalized === "pending" ||
    normalized === "medium" ||
    normalized === "in_progress" ||
    normalized === "in_review"
  ) {
    return "text-amber-600";
  }
  if (
    normalized === "failed" ||
    normalized === "rejected" ||
    normalized === "high"
  ) {
    return "text-red-600";
  }
  return "text-[#112518]";
};

export const toDatetimeLocalValue = (iso: string | null | undefined) => {
  if (!iso) return "";
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";

  const pad = (value: number) => String(value).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
};

export const formatTimestamp = (iso: string | null | undefined) => {
  if (!iso) return "--";
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "--";
  return date.toLocaleString();
};

export const formatMoneyValue = (
  value: number | null | undefined,
  options?: { prefix?: string; fallback?: string },
) => {
  if (value === null || value === undefined) return options?.fallback ?? "--";
  const prefix = options?.prefix ?? "$";
  const abs = Math.abs(value).toLocaleString();
  return `${value < 0 ? "-" : ""}${prefix}${abs}`;
};

export const formatNullableNumber = (
  value: number | null | undefined,
  suffix = "",
) => {
  if (value === null || value === undefined) return "--";
  return `${value.toLocaleString()}${suffix}`;
};

export const cardNumber = (cards: StandardPlanCard[], label: string) => {
  const value = cards.find((card) => card.label === label)?.value;
  if (value === null || value === undefined || value === "") return undefined;
  const parsed = typeof value === "number" ? value : Number(value);
  return Number.isFinite(parsed) ? parsed : undefined;
};
