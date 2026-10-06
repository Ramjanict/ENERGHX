import { useCallback, useRef, useState } from "react";
import {
  downloadPdfFromElement,
  PdfExportOptions,
} from "./downloadPdfFromElement";

export interface UsePdfExportResult<T extends HTMLElement> {
  targetRef: React.RefObject<T | null>;
  exportPdf: (overrideOptions?: PdfExportOptions) => Promise<void>;
  isExporting: boolean;
  error: Error | null;
}

export function usePdfExport<T extends HTMLElement = HTMLDivElement>(
  defaultOptions?: PdfExportOptions,
): UsePdfExportResult<T> {
  const targetRef = useRef<T>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const exportPdf = useCallback(
    async (overrideOptions?: PdfExportOptions) => {
      if (!targetRef.current) {
        const err = new Error(
          "usePdfExport: targetRef is not attached to any element yet.",
        );
        setError(err);
        throw err;
      }
      setIsExporting(true);
      setError(null);
      try {
        await downloadPdfFromElement(targetRef.current, {
          ...defaultOptions,
          ...overrideOptions,
        });
      } catch (err) {
        setError(err as Error);
        throw err;
      } finally {
        setIsExporting(false);
      }
    },
    [defaultOptions],
  );

  return { targetRef, exportPdf, isExporting, error };
}
