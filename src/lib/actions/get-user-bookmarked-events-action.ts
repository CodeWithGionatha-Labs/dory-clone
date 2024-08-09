"use server";

import { z } from "zod";
import { getUserBookmarkedEvents } from "../server/get-user-bookmarked-events";
import { eventIdSchema } from "../validations/event-schemas";
import { actionClient } from "./safe-action";

export const getUserBookmarkedEventsAction = actionClient
  .schema(z.object({ cursor: eventIdSchema.optional() }))
  .action(async ({ parsedInput: { cursor } }) =>
    getUserBookmarkedEvents({ cursor })
  );
