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

export const addItemSchema = z.object({
    body: z.object({
        order_id: z
            .string({ message: "Order must be a string!" })
            .min(1, "Order ID is required!"),
        product_id: z
            .string({ message: "Product name must be a string!" })
            .min(1, "Product ID is required!"),
        amount: z
            .number()
            .int("Amount must be a integer!")
            .positive("Amount must be positive!"),
    }),
});

export const removeItemSchema = z.object({
    query: z.object({
        item_id: z
            .string({ message: "Item ID is required!" })
            .min(1, "Order ID is required!"),
    }),
});

export const detailOrderSchema = z.object({
    query: z.object({
        order_id: z
            .string({ message: "Order ID is required!" })
            .min(1, "Order ID is required!"),
    }),
});

export const sendOrderSchema = z.object({
    body: z.object({
        order_id: z
            .string({ message: "Order ID is required!" })
            .min(1, "Order ID is required!"),
        name: z
            .string({ message: "Name must be a text!" })
    }),
});

export const finishOrderSchema = z.object({
    body: z.object({
        order_id: z
            .string({ message: "Order ID is required!" })
            .min(1, "Order ID is required!")
    }),
});

export const deleteOrderSchema = z.object({
    query: z.object({
        order_id: z
            .string({ message: "Order ID is required!" })
    }),
});