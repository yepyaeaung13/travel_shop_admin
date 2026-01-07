import { z } from "zod/v4";

export const VariantOptionSchema = z.object({
    id: z.string().optional(),
    name: z.string(),
    variantValues: z.array(
        z.object({
            id: z.number().optional(),
            value: z.string(),
        }),
    ),
});

export const VariantOptionCreateFormSchema = z.object({
    variantOptions: z
        .array(
            z.object({
                id: z.string().optional(),
                name: z.string().min(1, "Name is required"),
                variantValues: z
                    .array(
                        z.object({
                            id: z.number().optional(),
                            value: z.string().min(1, "Value is required"),
                        }),
                    )
                    .min(1, "At least one value is required"),
            }),
        )
        .min(0, "At least one variant option is required"),
});

export const VariantOptionPayloadSchema = z.object({
    name: z.string().min(1, "Name is required"),
    id: z.string().optional(),
    variantValues: z
        .array(
            z.object({
                id: z.number().optional(),
                value: z.string().min(1, "Value is required"),
            }),
        )
        .min(1, "At least one value is required"),
});

export const VariantOptionResponseSchema = z.object({
    status: z.boolean(),
    data: z.object({
        id: z.string(),
        name: z.string(),
        variantValues: z.array(
            z.object({
                id: z.string(),
                value: z.string(),
            }),
        ),
    }),
    message: z.string(),
});

export type VariantOptionType = z.infer<typeof VariantOptionSchema>;
export type VariantOptionPayloadType = z.infer<typeof VariantOptionPayloadSchema>;
export type VariantOptionCreateFormType = z.infer<
    typeof VariantOptionCreateFormSchema
>;
export type VariantOptionResponseType = z.infer<
    typeof VariantOptionResponseSchema
>;