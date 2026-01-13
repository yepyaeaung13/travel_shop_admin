import { discountType, ProductStatus } from "@/types/product";
import { z } from "zod";

export const variantSchema = z.object({
  name: z.string().min(1, "Variant name is required."),
  buyingPrice: z.preprocess(
    (val) => (typeof val === "string" ? parseFloat(val) : val),
    z.number().nonnegative("Buying price cannot be negative.")
  ),
  sellingPrice: z.preprocess(
    (val) => (typeof val === "string" ? parseFloat(val) : val),
    z.number().nonnegative("Selling price cannot be negative.")
  ),
  sellingPriceCNY: z
    .preprocess(
      (val) => (typeof val === "string" ? parseFloat(val) : val),
      z.number().nonnegative("Selling price (CNY) cannot be negative.")
    )
    .optional(),
  sellingPriceUSD: z
    .preprocess(
      (val) => (typeof val === "string" ? parseFloat(val) : val),
      z.number().nonnegative("Selling price (USD) cannot be negative.")
    )
    .optional(),
  stock: z.preprocess(
    (val) => (typeof val === "string" ? parseInt(val, 10) : val),
    z.number().int("Stock must be a whole number.").min(0)
  ),
  sku: z.string().min(1, "Variant SKU is required.").max(50),
});

export const CreateProductSchema = z
  .object({
    name: z
      .string()
      .min(1, "Product name is required.")
      .max(255, "Product name must be 255 characters or less."),
    description: z.string().min(1, "Product description is required."),
    buyingPriceMMK: z.preprocess(
      (val) => (typeof val === "string" ? parseFloat(val) : val),
      z.number().nonnegative("Buying price (MMK) cannot be negative.").min(0)
    ),
    sellingPriceMMK: z.preprocess(
      (val) => (typeof val === "string" ? parseFloat(val) : val),
      z.number().nonnegative("Selling price (MMK) cannot be negative.").min(0)
    ),
    sellingPriceCNY: z
      .preprocess(
        (val) => (typeof val === "string" ? parseFloat(val) : val),
        z.number().nonnegative("Selling price (CNY) cannot be negative.")
      )
      .optional(),
    sellingPriceUSD: z
      .preprocess(
        (val) => (typeof val === "string" ? parseFloat(val) : val),
        z.number().nonnegative("Selling price (USD) cannot be negative.")
      )
      .optional(),
    stock: z.preprocess(
      (val) => (typeof val === "string" ? parseInt(val, 10) : val),
      z.number().int("Stock must be a whole number.").optional()
    ),
    sku: z.string().optional(),
    weightAmount: z
      .preprocess(
        (val) => (typeof val === "string" ? parseFloat(val) : val),
        z.number().nonnegative("Weight amount cannot be negative.")
      )
      .optional(),
    promoteType: z
      .enum(discountType, {
        error: "Please select a valid promote type.",
      })
      .optional(),
    promoteValue: z
      .number({
        error: "Promote value must be a number.",
      })
      .nonnegative("Promote value cannot be negative.")
      .optional(),
    status: z.enum(ProductStatus, {
      error: "Please select a valid product status.",
    }),
    categoryId: z
      .number()
      .int("Category ID must be an integer.")
      .positive("Category ID must be a positive number."),
    subCategoryId: z
      .number()
      .optional(),
    images: z
      .array(
        z.object({
          url: z
            .url("Invalid image URL format.")
            .min(1, "Image URL cannot be empty."),
          isMain: z.boolean(),
          file: z.file(),
        })
      )
      .min(1, "At least one product image is required."),
    variants: z.array(variantSchema).min(0, "Variants array is required."),
  })

export type CreateProductPayload = z.infer<typeof CreateProductSchema>;
