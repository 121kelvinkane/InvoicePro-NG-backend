const { z } = require("zod");

const signUpSchema = z.object({
    fullName: z
        .string()
        .trim()
        .min(3, "Full name must be at least 3 characters.")
        .max(100, "Full name cannot exceed 100 characters.")
        .transform((name) => name.replace(/\s+/g, " ")),

    email: z
        .string()
        .trim()
        .email("Please enter a valid email address.")
        .transform((email) => email.toLowerCase()),

    password: z
        .string()
        .min(8, "Password must be at least 8 characters.")
        .max(100, "Password cannot exceed 100 characters."),
});

const signInSchema = z.object({
    email: z
        .string()
        .trim()
        .toLowerCase()
        .email("Please enter a valid email address."),

    password: z
        .string()
        .min(1, "Password is required."),
});

module.exports = {
    signUpSchema,
    signInSchema,
};