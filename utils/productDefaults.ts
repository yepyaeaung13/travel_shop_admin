import {discountType, ProductStatus} from "@/types/product";

export const productDefaultValues = {
  name: "",
  description: "",
  categoryId: undefined,
  subCategoryId: undefined,
  buyingPriceMMK: 0,
  sellingPriceMMK: 0,
  sellingPriceCNY: 0,
  sellingPriceUSD: 0,
  images: [],
  promoteType: discountType.PERCENTAGE,
  promoteValue: 0,
  variants: [],
  sku: "",
  stock: 0,
  status: ProductStatus.ACTIVE,
};