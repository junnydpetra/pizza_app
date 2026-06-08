import { z } from "zod";

export const createUserSchema = z.object({
    body: z.object({
        name: z
            .string({ message: "The name must be a text!" })
            .min(3, { message: "The name must have at least 3 characters!" }),
        email: z.email({ message: "The email address must be a valid email address!"}),
        password: z
            .string({ message: "A password is required!" })
            .min(6, { message: "The password must have at least 6 characters!"})
    })
})

export const authUserSchema = z.object({
    body: z.object({
        email: z.email({ message: "The email address must be a valid email address!"}),
        password: z
            .string({ message: "A password is required!" })
            .min(6, { message: "The password must have at least 6 characters!"})
    })
})