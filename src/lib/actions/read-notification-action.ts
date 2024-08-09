"use server";

import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { z } from "zod";
import { prisma } from "../prisma/client";
import { notificationIdSchema } from "../validations/notification-schemas";
import { actionClient } from "./safe-action";

export const readNotificationAction = actionClient
  .schema(
    z.object({
      notificationId: notificationIdSchema,
    })
  )
  .action(async ({ parsedInput: { notificationId } }) => {
    const user = await getKindeServerSession().getUser();

    if (!user) {
      throw new Error("Not authenticated");
    }

    await prisma.notification.update({
      where: {
        id: notificationId,
        AND: {
          userId: user.id,
        },
      },
      data: {
        read: true,
      },
    });
  });
