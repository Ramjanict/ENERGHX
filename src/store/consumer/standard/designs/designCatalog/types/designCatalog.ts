export interface Pagination {
  page: number;
  per_page: number;
  total: number;
  total_pages: number;
}

export interface PaginatedListResponse<T> extends Pagination {
  data: T[];
  pagination: Pagination;
}

export interface ListQueryParams {
  page?: number;
  per_page?: number;
  search?: string;
}

// ---------- Design catalogs ----------
export interface DesignCatalog {
  id: string;
  key: string;
  name: string;
  description: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export type GetDesignCatalogsParams = ListQueryParams;

export type GetDesignCatalogsResponse = PaginatedListResponse<DesignCatalog>;

export type GetDesignCatalogByIdResponse = DesignCatalog;

// ---------- Product categories ----------
export interface DesignProductCategory {
  id: string;
  key: string;
  name: string;
  description: string;
  sortOrder: number;
  active: boolean;
  designCatalogId: string;
  design: DesignCatalog;
  productCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface GetDesignProductCategoriesParams extends ListQueryParams {
  design?: string;
}

export type GetDesignProductCategoriesResponse =
  PaginatedListResponse<DesignProductCategory>;

export type GetDesignProductCategoryByIdResponse = DesignProductCategory;

// ---------- Products ----------
export interface DesignProductDesignSummary {
  id: string;
  key: string;
  name: string;
}

export interface DesignProductCategorySummary {
  id: string;
  key: string;
  name: string;
  design: DesignProductDesignSummary;
}

export type DesignProductSpecs = Record<
  string,
  string | number | boolean | string[] | number[] | null | undefined
>;

export interface DesignProduct {
  id: string;
  externalProductId: string | null;
  externalCategory: string | null;
  name: string;
  manufacturer: string;
  categoryId: string;
  category: DesignProductCategorySummary;
  energyRole: string;
  outputSpec: string | null;
  technology: string | null;
  additional: string | null;
  efficiencyClass: string | null;
  warrantyYears: number | null;
  rating: number | null;
  priceAmount: number | null;
  priceCurrency: string | null;
  countryOfOrigin: string | null;
  installationTypes: string | null;
  marketStatus: string | null;
  notes: string | null;
  imageUrls: string[];
  specs: DesignProductSpecs;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface GetDesignProductsParams extends ListQueryParams {
  design?: string;
  category?: string;
}

export type GetDesignProductsResponse = PaginatedListResponse<DesignProduct>;

export type GetDesignProductByIdResponse = DesignProduct;
