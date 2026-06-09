import { z } from "zod";

export const createOrderSchema = z.object({
    body: z.object({
        table: z
            .number({ message: "A table number is required!" })
            .int({ message: "Table number must be a integer!" })
            .positive({ message: "Table number must be positive!" }),
        name: z.string().optional(),
    }),
});