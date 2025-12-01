import { z } from "zod";

export const createTravelSchema = z.object({
  title: z.string().min(3),
  destination: z.string().min(2),
  city: z.string().optional(),
  startDate: z.string(),
  endDate: z.string(),
  budgetMin: z.number().int().optional(),
  budgetMax: z.number().int().optional(),
  travelType: z.enum(["SOLO","FAMILY","FRIENDS","COUPLE"]),
  description: z.string().optional(),
  visibility: z.boolean().optional()
});
export const updateTravelSchema = z.object({
  title: z.string().min(3).optional(),
  destination: z.string().min(2).optional(),
  city: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  budgetMin: z.number().int().optional(),
  budgetMax: z.number().int().optional(),
  travelType: z.enum(["SOLO","FAMILY","FRIENDS","COUPLE"]).optional(),
  description: z.string().optional(),
  visibility: z.boolean().optional()
});