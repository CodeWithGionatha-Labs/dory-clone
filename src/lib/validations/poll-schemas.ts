import { z } from "zod";
import { poll } from "./constants";

export const pollIdSchema = z.string().cuid();

export const votePollOptionSchema = z.object({
  pollId: pollIdSchema,
  optionIndex: z
    .number()
    .min(0)
    .max(poll.options.maxCount - 1),
});

export const getPollSchema = z.object({ pollId: pollIdSchema });

export type VotePollSchema = z.infer<typeof votePollOptionSchema>;
export type GetPollSchema = z.infer<typeof getPollSchema>;
