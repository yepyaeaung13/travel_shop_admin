import { ProductStatus, TaxType, ProductSortOption } from "./product.enums";
import { PaginationInfo } from "../shared/pagination.types";

export interface Product {
    id: number;
    name: string;
    quantity: number;
    sellingPrice: number;
    status: ProductStatus;
    mainCategory: {
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
    sort?: ProductSortOption;
    page?: number;
    limit?: number;
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

// Product Details Types
export interface ImageUrl {
    url: string;
    isMain: boolean;
}

export interface TaxInfo {
    taxType: TaxType;
    taxAmount?: number;
    taxPercent?: number;
}

export interface PromoteInfo {
    promoteStatus: boolean;
    discountType?: "PERCENTAGE" | "AMOUNT";
    discountValue?: number;
    promotePercent?: number;
    promoteAmount?: number;
    startDate?: string;
    endDate?: string;
}

export interface VariantCombination {
    id: number;
    name: string;
    sku: string;
    purchasePrice: number;
    sellingPrice: number;
    quantity: number;
    combination?: Record<string, string>;
    weightValue?: number;
    weightUnit?: string;
    sizeValue?: string;
    sizeUnit?: string;
}

export interface VariantValue {
    id: string;
    value: string;
}

export interface VariantOption {
    id: number;
    name: string;
    values: VariantValue[];
}