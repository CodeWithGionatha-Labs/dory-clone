import { z } from "zod";
import { poll } from "./constants";
import { eventIdSchema } from "./event-schemas";

export const pollIdSchema = z.string().cuid();

export const votePollOptionSchema = z.object({
  pollId: pollIdSchema,
  optionIndex: z
    .number()
    .min(0)
    .max(poll.options.maxCount - 1),
});

export const getPollSchema = z.object({ pollId: pollIdSchema });

export const createLivePollSchema = z.object({
  eventId: eventIdSchema,
  body: z
    .string()
    .min(poll.body.minLength, {
      message: `Poll body must have at least ${poll.body.minLength} characters`,
    })
    .max(poll.body.maxLength, {
      message: `Poll body must not exceed ${poll.body.maxLength} characters`,
    }),
  options: z.array(
    z
      .string()
      .min(poll.options.minLength, {
        message: `Poll option must have at least ${poll.options.minLength} characters`,
      })
      .max(poll.options.maxLength, {
        message: `Poll option must not exceed ${poll.options.maxLength} characters`,
      })
  ),
});

export type VotePollSchema = z.infer<typeof votePollOptionSchema>;
export type CreateLivePollSchema = z.infer<typeof createLivePollSchema>;
export type GetPollSchema = z.infer<typeof getPollSchema>;
