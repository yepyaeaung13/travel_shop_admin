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

export type Variant = {
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
  variants: Variant[];
  productVarints: ProductVariant[];

  // actions
  setField: <K extends keyof CreateProductState>(
    key: K,
    value: CreateProductState[K]
  ) => void;

  addImage: (image: ProductImage) => void;
  removeImage: (index: number) => void;

  addVariant: (variant: Variant) => void;
  removeVariant: (index: number) => void;

  addProductVariant: (variant: ProductVariant) => void;
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

  addVariant: (variant) =>
    set((state) => ({
      variants: [...state.variants, variant],
    })),

  removeVariant: (index) =>
    set((state) => ({
      variants: state.variants.filter((_, i) => i !== index),
    })),

  addProductVariant: (variant) =>
    set((state) => ({
      productVarints: [...state.productVarints, variant],
    })),

  removeProductVariant: (index) =>
    set((state) => ({
      productVarints: state.productVarints.filter((_, i) => i !== index),
    })),

  reset: () => set(initialState),
}));
