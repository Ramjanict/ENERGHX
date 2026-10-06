import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function generateRandomId(): string {
  return Math.random().toString(36).substring(2, 10);
}

export function calculatePercentage(completed: number, total: number): number {
  if (total === 0) return 0;
  return Math.round((completed / total) * 100);
}

const WORD_EXTENSIONS_REGEX = /\.(docx|doc|dotx|dot)($|\?)/i;
const WORD_MIME_TYPES = [
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/msword",
  "application/vnd.ms-word.document.macroenabled.12",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.template",
];

const PDF_EXTENSION_REGEX = /\.pdf($|\?)/i;
const PDF_MIME_TYPE = "application/pdf";

export function isWordDocument(
  fileNameOrUrl?: string | null,
  mimeType?: string | null,
): boolean {
  if (mimeType && WORD_MIME_TYPES.includes(mimeType.toLowerCase())) {
    return true;
  }
  if (fileNameOrUrl && WORD_EXTENSIONS_REGEX.test(fileNameOrUrl)) {
    return true;
  }
  return false;
}

export function isPdfDocument(
  fileNameOrUrl?: string | null,
  mimeType?: string | null,
): boolean {
  if (mimeType && mimeType.toLowerCase().includes(PDF_MIME_TYPE)) {
    return true;
  }
  if (fileNameOrUrl && PDF_EXTENSION_REGEX.test(fileNameOrUrl)) {
    return true;
  }
  return false;
}

export function getDocumentFormatLabel(
  fileNameOrUrl?: string | null,
  mimeType?: string | null,
): "Word" | "PDF" | "Document" {
  if (isWordDocument(fileNameOrUrl, mimeType)) return "Word";
  if (isPdfDocument(fileNameOrUrl, mimeType)) return "PDF";
  return "Document";
}

export async function openOrDownloadDocument(
  url?: string | null,
  fileName?: string | null,
  mimeType?: string | null,
): Promise<void> {
  if (!url) return;

  const isWord = isWordDocument(fileName || url, mimeType);
  const targetFileName =
    fileName ||
    url.split("/").pop()?.split("?")[0] ||
    (isWord ? "document.docx" : "document.pdf");

  if (isWord) {
    try {
      // Attempt blob download to bypass browser cross-origin download restrictions
      const response = await fetch(url);
      if (response.ok) {
        const blob = await response.blob();
        const blobUrl = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = blobUrl;
        link.download = targetFileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        setTimeout(() => window.URL.revokeObjectURL(blobUrl), 60_000);
        return;
      }
    } catch {
      // If CORS restricts direct fetch, open with Office Online Viewer
    }

    // Fallback: Open with Microsoft Office Online Viewer so browser doesn't try to load PDF plugin
    const officeViewerUrl = `https://view.officeapps.live.com/op/view.aspx?src=${encodeURIComponent(url)}`;
    window.open(officeViewerUrl, "_blank", "noopener,noreferrer");
  } else {
    window.open(url, "_blank", "noopener,noreferrer");
  }
}

/**
 * Safely extracts a primitive number from any value (primitive number, numeric string,
 * or nested backend object like { amount: 100 }, { value: 100 }, { total: 100 }, etc.).
 */
export function parseNumericValue(val: unknown, fallback: number = 0): number {
  if (val === null || val === undefined) return fallback;
  if (typeof val === "number") return isNaN(val) ? fallback : val;
  if (typeof val === "string") {
    const cleaned = val.replace(/[^0-9.-]+/g, "");
    if (!cleaned) return fallback;
    const parsed = parseFloat(cleaned);
    return isNaN(parsed) ? fallback : parsed;
  }
  if (typeof val === "object") {
    const obj = val as Record<string, unknown>;
    const priorityKeys = [
      "amount",
      "value",
      "total",
      "cost",
      "price",
      "net",
      "annualSavings",
      "systemCost",
      "savings",
      "raw",
      "number",
      "val",
      "kwh",
      "kw",
    ];
    for (const key of priorityKeys) {
      if (key in obj && obj[key] !== undefined && obj[key] !== null) {
        const parsed = parseNumericValue(obj[key], NaN);
        if (!isNaN(parsed)) return parsed;
      }
    }
    for (const key of Object.keys(obj)) {
      const parsed = parseNumericValue(obj[key], NaN);
      if (!isNaN(parsed)) return parsed;
    }
  }
  return fallback;
}

/**
 * Safely formats any value into a currency string ($12,345).
 * Never returns "$[object Object]" or NaN.
 */
export function formatCurrency(val: unknown, fallback = "$0"): string {
  if (val === null || val === undefined) return fallback;
  const num = parseNumericValue(val, NaN);
  if (isNaN(num)) return fallback;
  return `$${num.toLocaleString()}`;
}

/**
 * Safely formats any value into a localized number string (12,345).
 * Never returns "[object Object]" or NaN.
 */
export function formatNumber(val: unknown, fallback = "0"): string {
  if (val === null || val === undefined) return fallback;
  const num = parseNumericValue(val, NaN);
  if (isNaN(num)) return fallback;
  return num.toLocaleString();
}


