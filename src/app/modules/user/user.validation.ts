import { z } from "zod";

 const createTouristValidationSchema = z.object({
  password: z.string(), // required password for user
  tourist: z.object({
    fullName: z.string().nonempty("Full name is required"),
    email: z.string().nonempty("Email is required"),
    bio: z.string().optional(),
    profileImage: z.any().optional(), // optional file upload
    interests: z.array(z.string()).optional(),
    visitedCountries: z.array(z.string()).optional(),
    currentLocation: z.string().optional(),
  }),
});

export const UserValidation = {
  createTouristValidationSchema,
};
