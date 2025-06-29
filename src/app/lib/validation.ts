import { url } from "inspector";
import z, { object, string } from "zod";

// Define the schema for the login request payload.
export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

// Define the schema for the signup request payload. This schema extends the login schema by adding a confirmPassword field.
export const signupSchema = loginSchema
  .extend({
    name: z.string().min(2, "Name must be at least 2 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

// Define the schema for the sign-in request payload. This schema extends the signup schema by adding a password field.
export const signInSchema = object({
  email: string({ required_error: "Email is required" })
    .min(1, "Email is required")
    .email("Invalid email"),
  password: string({ required_error: "Password is required" })
    .min(1, "Password is required")
    .min(8, "Password must be more than 8 characters")
    .max(32, "Password must be less than 32 characters"),
});
// zod schema for post data
export const postSchema = z.object({
  title: z.string().min(1, "Title is required"),
  content: z.string().min(1, "Content is required"),
  status: z.enum(["draft", "published", "archived"]),
  featured: z.boolean().optional(),
  author_id: z.number().int(),
  content_taxonomy: z
    .array(
      z.object({
        taxonomy_id: z.number().int(),
      })
    )
    .optional(),
  url: z.string().optional(),
  description: z.string()
    .min(50, { message: "La descrizione deve contenere almeno 50 caratteri." })
    .max(160, { message: "La descrizione non può superare i 160 caratteri." }).optional(),
});
// zod schema for page data
export const pageDataSchema = z.object({
  title: z.string().min(1).max(100),
  content: z.string().min(10).max(10000),
  status: z.enum(["draft", "published", "archived"]),
  url: z.string().optional(),
  description: z.string()
    .min(50, { message: "La descrizione deve contenere almeno 50 caratteri." })
    .max(160, { message: "La descrizione non può superare i 160 caratteri." }).optional(),
});

// zod schema for taxonomy data
export const taxonomyDataSchema = z.object({
  name: z.string().min(1).max(100),
  type: z.string().min(1).max(100),
  description: z.string().min(1).max(1000),
});
// zod schema for user data
export const userDataSchema = z.object({
  name: z.string().min(1).max(100),
  surname: z.string().min(1).max(100),
  email: z.string().email(),
  role: z.string().optional(),
  lastlogin: z.date().optional(),
});

// zod schema for media data
export const mediaDataSchema = z.object({
  file_name: z.string().min(1).max(100),
  file_path: z.string().min(1).max(1000),
  size: z.number().int(),
  user_id: z.number().int(),
});
