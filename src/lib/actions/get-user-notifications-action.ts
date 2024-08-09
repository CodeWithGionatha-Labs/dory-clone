"use server";

import { z } from "zod";
import { getUserNotifications } from "../server/get-user-notifications";
import { notificationIdSchema } from "../validations/notification-schemas";
import { actionClient } from "./safe-action";

export const getUserNotificationsAction = actionClient
  .schema(
    z.object({
      cursor: notificationIdSchema.optional(),
    })
  )
  .action(async ({ parsedInput: { cursor } }) =>
    getUserNotifications({ cursor })
  );
