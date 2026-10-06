// html2pdf.js ships no official type definitions.
// This is a minimal shim covering the chainable API surface we use.
declare module "html2pdf.js" {
  interface Html2PdfOptions {
    margin?: number | [number, number, number, number];
    filename?: string;
    image?: { type?: string; quality?: number };
    html2canvas?: {
      scale?: number;
      useCORS?: boolean;
      backgroundColor?: string | null;
      scrollY?: number;
      [key: string]: unknown;
    };
    jsPDF?: {
      unit?: string;
      format?: string | number[];
      orientation?: "portrait" | "landscape";
      [key: string]: unknown;
    };
    pagebreak?: {
      mode?: string[];
      before?: string[];
      after?: string[];
      avoid?: string[];
    };
  }

  interface Html2PdfInstance {
    set(options: Html2PdfOptions): Html2PdfInstance;
    from(element: HTMLElement | string): Html2PdfInstance;
    save(filename?: string): Promise<void>;
    outputPdf(type?: string): Promise<unknown>;
    toPdf(): Html2PdfInstance;
    get(type: string): Promise<unknown>;
  }

  function html2pdf(): Html2PdfInstance;
  export default html2pdf;
}
