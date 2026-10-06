/**
 * Reusable HTML → PDF export utility.
 *
 * Built on html2pdf.js (which itself wraps html2canvas + jsPDF).
 * html2canvas rasterizes the live DOM node — including Tailwind
 * classes, gradients, rounded corners, and colored badges — into
 * a canvas, and jsPDF packs that into a paginated, downloadable PDF.
 *
 * Install:
 *   npm install html2pdf.js
 *
 * The import is dynamic so html2pdf.js (and its jsPDF/html2canvas
 * dependencies) are code-split out of your main bundle and only
 * loaded when someone actually exports a PDF.
 */

export type PdfPageFormat = "a4" | "letter" | "legal";
export type PdfOrientation = "portrait" | "landscape";

export interface PdfExportOptions {
  /** Downloaded file name, e.g. "invoice-1004.pdf" */
  filename?: string;
  /** Page format. Default "a4". */
  format?: PdfPageFormat;
  /** Page orientation. Default "portrait". */
  orientation?: PdfOrientation;
  /** Render scale — higher is sharper but produces a larger file. Default 2. */
  scale?: number;
  /** Page margin in inches, applied to all sides. Default 0.4. */
  margin?: number;
  /** JPEG compression quality (0–1). Default 0.98. */
  quality?: number;
}

const DEFAULTS: Required<PdfExportOptions> = {
  filename: "document.pdf",
  format: "a4",
  orientation: "portrait",
  scale: 2,
  margin: 0.4,
  quality: 0.98,
};

// Physical page dimensions in inches.
const PAGE_SIZES_IN: Record<PdfPageFormat, [number, number]> = {
  a4: [8.27, 11.69],
  letter: [8.5, 11],
  legal: [8.5, 14],
};

/**
 * Renders `element` to a PDF and triggers a browser download.
 *
 * Uses html2canvas-pro (NOT html2canvas / html2pdf.js) because Tailwind CSS
 * v4's default palette is defined with the `oklch()` color function, which
 * the original html2canvas cannot parse — it throws
 * "Attempting to parse an unsupported color function 'oklch'" and the
 * export silently fails. html2canvas-pro is a maintained fork that
 * supports oklch/oklab/lch/lab/color-mix().
 *
 * @example
 * const ref = useRef<HTMLDivElement>(null);
 * await downloadPdfFromElement(ref.current!, { filename: "report.pdf" });
 */
export async function downloadPdfFromElement(
  element: HTMLElement,
  options: PdfExportOptions = {},
): Promise<void> {
  if (!element) {
    throw new Error("downloadPdfFromElement: no element was provided.");
  }

  const opts = { ...DEFAULTS, ...options };

  // Dynamic imports keep these dependencies out of the initial bundle.
  const [{ default: html2canvas }, { default: jsPDF }] = await Promise.all([
    import("html2canvas-pro"),
    import("jspdf"),
  ]);

  const canvas = await html2canvas(element, {
    scale: opts.scale,
    useCORS: true, // allow cross-origin images (logos, avatars, etc.)
    backgroundColor: "#ffffff",
    // Prevents the capture being offset if the page itself is scrolled.
    scrollY: -window.scrollY,
  });

  let [pageWidthIn, pageHeightIn] = PAGE_SIZES_IN[opts.format];
  if (opts.orientation === "landscape") {
    [pageWidthIn, pageHeightIn] = [pageHeightIn, pageWidthIn];
  }

  const pdf = new jsPDF({
    unit: "in",
    format: opts.format,
    orientation: opts.orientation,
  });

  const contentWidthIn = pageWidthIn - opts.margin * 2;
  const contentHeightIn = pageHeightIn - opts.margin * 2;

  // How many source canvas pixels fit on one PDF page, at this scale.
  const pxPerIn = canvas.width / contentWidthIn;
  const pageHeightPx = Math.floor(contentHeightIn * pxPerIn);

  let renderedHeightPx = 0;
  let isFirstPage = true;

  while (renderedHeightPx < canvas.height) {
    if (!isFirstPage) pdf.addPage();
    isFirstPage = false;

    const sliceHeightPx = Math.min(
      pageHeightPx,
      canvas.height - renderedHeightPx,
    );

    // Slice this page's chunk out of the full canvas onto its own canvas.
    const pageCanvas = document.createElement("canvas");
    pageCanvas.width = canvas.width;
    pageCanvas.height = sliceHeightPx;
    const ctx = pageCanvas.getContext("2d");
    if (!ctx)
      throw new Error(
        "downloadPdfFromElement: could not get 2D canvas context.",
      );
    ctx.drawImage(
      canvas,
      0,
      renderedHeightPx,
      canvas.width,
      sliceHeightPx,
      0,
      0,
      canvas.width,
      sliceHeightPx,
    );

    const sliceImgData = pageCanvas.toDataURL("image/jpeg", opts.quality);
    const sliceHeightIn = sliceHeightPx / pxPerIn;

    pdf.addImage(
      sliceImgData,
      "JPEG",
      opts.margin,
      opts.margin,
      contentWidthIn,
      sliceHeightIn,
    );

    renderedHeightPx += sliceHeightPx;
  }

  pdf.save(opts.filename);
}
