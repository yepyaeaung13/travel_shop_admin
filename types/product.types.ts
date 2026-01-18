import { PaginationInfo } from "./shared/pagination.types";


export enum ProductStatus {
  ACTIVE = "active",
  INACTIVE = "inactive",
}

export enum ProductSortOption {
  NEWEST = "newest",
  OLDEST = "oldest",
  PRICE_LOW_HIGH = "priceLowHigh",
  PRICE_HIGH_LOW = "priceHighLow",
}
export enum discountType {
  PERCENTAGE = "PERCENT",
  AMOUNT = "AMOUNT",
}

export interface Product {
  id: number;
  name: string;
  imageUrl: string;
  sellingPriceMMK: number;
  stock: number;
  status: ProductStatus;
  mainCategory: {
    id: number;
    name: string;
  };
  subCategory: {
    id: number;
    name: string;
  };
}

// Request/Response Interfaces
export interface ProductsResponse {
  data: Product[];
  pagination: PaginationInfo;
}

export interface GetProductsParams {
  sortBy: ProductSortOption;
  page: number;
  limit: number;
  searchText?: string;
}

export interface MetaType {
  limit: number;
  page: number;
  total: number;
}

export interface GetProductsResponse {
  status: boolean;
  message: string;
  data: Product[];
  meta: MetaType;
}

export interface GetProductByIdResponse {
  status: boolean;
  message: string;
  data: Product;
}
