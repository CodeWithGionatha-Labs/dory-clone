"use server";

import { z } from "zod";
import { getUserEvents } from "../server/get-user-events";
import { eventIdSchema } from "../validations/event-schemas";
import { actionClient } from "./safe-action";

export const getUserEventsAction = actionClient
  .schema(z.object({ cursor: eventIdSchema.optional() }))
  .action(async ({ parsedInput: { cursor } }) => getUserEvents({ cursor }));
