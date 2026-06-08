import { z } from "zod";

export const productSchema = z.object({
    body: z.object({
        name: z
            .string()
            .min(2, { message: "Product name must have at least 2 characters!" }),
        price: z
            .string()
            .min(1, { message: "Product value is required!" })
            .regex(/^\d+$/),
        description: z
            .string()
            .min(1, { message: "Product description is required!" }),
        category_id: z
            .string({ message: "Product category is required!" }),
    }),
});

export const listProduct = z.object({
    query: z.object({
        disabled: z
            .string()
            .optional(),
    }),
});

export const listProductByCategorySchema = z.object({
    query: z.object({
        category_id: z
            .string({ message: "Category ID is required!" }),
    }),
}); 