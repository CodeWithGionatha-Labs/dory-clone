"use server";

import { z } from "zod";
import { getEventClosedPolls } from "../server/get-event-closed-polls";
import { eventPublicIdSchema } from "../validations/event-schemas";
import { pollIdSchema } from "../validations/poll-schemas";
import { actionClient } from "./safe-action";

export const getEventClosedPollsAction = actionClient
  .schema(
    z
      .object({
        cursor: pollIdSchema.optional(),
        pollId: pollIdSchema.optional(),
      })
      .merge(eventPublicIdSchema)
  )
  .action(async ({ parsedInput: { cursor, ownerId, eventSlug, pollId } }) =>
    getEventClosedPolls({
      ownerId,
      eventSlug,
      cursor,
      ...(pollId ? { filters: { pollId } } : {}),
    })
  );
