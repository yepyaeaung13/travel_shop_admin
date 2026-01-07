import {z} from "zod/v4";

// Category Variant Groups
export const categoryVariantGroupSchema = z.object({
  id: z.number(),
  name: z.string(),
});

// Category Main Schema
export const categorySchema = z.object({
  id: z.number().optional(),
  name: z.string().nonempty({error: "Name is required"}).max(255, {
    error: "Name must be less than 255 characters",
  }),
  description: z.string().optional(),
  image: z.string().optional(),
  parentId: z.number().nullable().optional(),
  status: z.boolean().default(false),
  productsCount: z.number().default(20),
  children: z.array(z.number()),
  variations: z.array(categoryVariantGroupSchema),
  deleted: z.boolean().default(false),
  subCategories: z.string(),
});

// Response Schema
export const getCategoriesResponseSchema = z.object({
  status: z.boolean(),
  message: z.string(),
  data: z.array(categorySchema),
  meta: z.object({
    limit: z.number(),
    page: z.number(),
    total: z.number(),
  }),
});

export const createCategoryResponseSchema = z.object({
  status: z.boolean(),
  data: categorySchema,
  message: z.string(),
});

export const categoryFormSchema = z.object({
  id: z.string().optional(),
  name: z
    .string()
    .min(1, {message: "Name is required"})
    .max(255, {message: "Name must be < 255 chars"}),
  imageUrl: z.string().optional(),
  description: z.string().optional(),
  status: z.boolean(),
  variantGroupIds: z.array(z.number()).optional(),
});

export const updateCategorySchema = z.object({
  categoryId: z.number(),
  name: z.string().min(1, {message: "Name is required"}).max(255, {
    message: "Name must be < 255 chars",
  }),
  description: z.string().optional(),
  status: z.boolean(),
  parentId: z.null(),
  variantGroupIds: z.array(z.number()).optional(),
});

export type CategoryFormType = z.infer<typeof categoryFormSchema>;
export type UpdateCategoryType = z.infer<typeof updateCategorySchema>;
// Export Types
export type CategorySchemaType = z.infer<typeof categorySchema>;
export type CategoryVariantGroup = z.infer<typeof categoryVariantGroupSchema>;
export type GetCategoriesResponseType = z.infer<
  typeof getCategoriesResponseSchema
>;
export type CreateCategoryResponseType = z.infer<
  typeof createCategoryResponseSchema
>;
