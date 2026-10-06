export interface DesignSolveItem {
  product_id: string;
  quantity: number;
}

export interface DesignSolveEnvelope<T> {
  status: number;
  message: string;
  data: T;
}

/** Used until a live solve response is captured. */
export type PendingSolveData = Record<string, unknown>;

export type PendingSolveResponse = DesignSolveEnvelope<PendingSolveData>;

export type DesignProductSpecs = Record<
  string,
  string | number | boolean | string[] | number[] | null | undefined
>;
