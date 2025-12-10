import { z } from "zod";

export const BookSchema = z.object({
  title: z.string().min(3, "Judul minimal 3 huruf"),
  slug: z.string().min(3, "Slug minimal 3 huruf"),
  content: z.string().optional(),
});
