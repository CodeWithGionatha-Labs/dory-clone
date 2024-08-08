import { z } from "zod";
import { event } from "./constants";

export const eventIdSchema = z.string().cuid();

export const eventSlugSchema = z
  .string()
  .min(event.slug.minLength, {
    message: `Event slug must have at least ${event.slug.minLength} characters.`,
  })
  .max(event.slug.maxLength, {
    message: `Event slug must not exceed ${event.slug.maxLength} characters.`,
  });

export const shortDescriptionSchema = z
  .string()
  .min(event.shortDescription.minLength, {
    message: `Event description must have at least ${event.shortDescription.minLength} characters.`,
  })
  .max(event.shortDescription.maxLength, {
    message: `Event description must not exceed ${event.shortDescription.maxLength} characters.`,
  });

export const eventPublicIdSchema = z.object({
  ownerId: z.string().min(35), // kinde user id length
  eventSlug: eventSlugSchema,
});
