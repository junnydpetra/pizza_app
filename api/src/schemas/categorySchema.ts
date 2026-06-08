import { z } from "zod";

export const categorySchema = z.object({
    body: z.object({
        name: z
            .string({ message: "Category name must be a text!" })
            .min(2, { message: "Category name must have at least 2 characters!" }),
    })
});