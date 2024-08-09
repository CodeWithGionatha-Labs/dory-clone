"use server";

import { getUserNotifications } from "../server/get-user-notifications";
import { actionClient } from "./safe-action";

export const getUserUnseenNotificationsAction = actionClient.action(async () =>
  getUserNotifications({ unseenOnly: true })
);
