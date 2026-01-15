import { create } from "zustand";

export enum PromoteType {
  PERCENT = "PERCENT",
  AMOUNT = "AMOUNT",
}

export enum ProductStatusType {
  ACTIVE = "active",
  INACTIVE = "inactive",
}

export type ProductImage = {
  url: string;
  file?: File;
  isMain: boolean;
};

export type VariantItem = {
  name: string;
  buyingPrice: number;
  sellingPrice: number;
  stock: number;
  sku: string;
};

export type ProductVariant = {
  name: string;
  values: string[];
};

export type GroupedVariant = {
  name: string; // "Small"
  variantItems: VariantItem[];
};

export type CreateProductState = {
  // fields
  name: string;
  description: string | null;

  buyingPriceMMK: number;
  sellingPriceMMK: number;
  sellingPriceCNY: number;
  sellingPriceUSD: number;

  promoteType: PromoteType;
  promoteValue: number;
  isPromote: boolean;

  stock: number;
  sku: string;
  status: ProductStatusType;

  mainCategoryId: number | null;
  subCategoryId: number | null;

  images: ProductImage[];
  variants: GroupedVariant[];
  productVarints: ProductVariant[];

  // actions
  setField: <K extends keyof CreateProductState>(
    key: K,
    value: CreateProductState[K]
  ) => void;

  addImage: (image: ProductImage) => void;
  removeImage: (index: number) => void;

  addVariant: (variant: GroupedVariant[]) => void;
  removeVariantItem: (parentIndexNo: number, index: number) => void;
  updateVariantItem: (parentIndexNo: number, index: number, variant: VariantItem) => void;

  addProductVariant: (variant: ProductVariant) => void;
  updateProductVariant: (indexNo: number, variant: ProductVariant) => void;
  removeProductVariant: (index: number) => void;

  reset: () => void;
};

const initialState = {
  name: "",
  description: null,

  buyingPriceMMK: 0,
  sellingPriceMMK: 0,
  sellingPriceCNY: 0,
  sellingPriceUSD: 0,

  promoteType: PromoteType.PERCENT,
  promoteValue: 0,
  isPromote: false,

  stock: 0,
  sku: "",
  status: ProductStatusType.ACTIVE,

  mainCategoryId: null,
  subCategoryId: null,

  images: [],
  variants: [],
  productVarints: [],
};

export const useCreateProductStore = create<CreateProductState>((set) => ({
  ...initialState,

  setField: (key, value) =>
    set(() => ({
      [key]: value,
    })),

  addImage: (image) =>
    set((state) => ({
      images: [...state.images, image],
    })),

  removeImage: (index) =>
    set((state) => ({
      images: state.images.filter((_, i) => i !== index),
    })),

  addVariant: (variants) =>
    set((state) => ({
      variants,
    })),

  removeVariantItem: (parentIndex: number, itemIndex: number) =>
  set((state) => ({
    variants: state.variants.map((group, gIndex) =>
      gIndex !== parentIndex
        ? group
        : {
            ...group,
            variantItems: group.variantItems.filter(
              (_, i) => i !== itemIndex
            ),
          }
    ),
  })),

  updateVariantItem: (
    parentIndexNo: number,
    indexNo: number,
    variant: VariantItem
  ) =>
    set((state) => ({
      variants: state.variants.map((group, groupIndex) => {
        if (groupIndex !== parentIndexNo) return group;

        return {
          ...group,
          variantItems: group.variantItems.map((item, itemIndex) =>
            itemIndex === indexNo ? variant : item
          ),
        };
      }),
    })),

  addProductVariant: (variant) =>
    set((state) => ({
      productVarints: [...state.productVarints, variant],
    })),

  updateProductVariant: (indexNo: number, variant: ProductVariant) =>
    set((state) => ({
      productVarints: state.productVarints.map((v, idx) =>
        idx === indexNo ? variant : v
      ),
    })),

  removeProductVariant: (index) =>
    set((state) => ({
      productVarints: state.productVarints.filter((_, i) => i !== index),
    })),

  reset: () => set(initialState),
}));
