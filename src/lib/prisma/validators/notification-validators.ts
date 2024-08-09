import { Prisma } from "@prisma/client";

export const notificationDetail =
  Prisma.validator<Prisma.NotificationDefaultArgs>()({
    include: {
      event: {
        select: {
          slug: true,
          ownerId: true,
        },
      },
    },
  });

export type NotificationDetail = Prisma.NotificationGetPayload<
  typeof notificationDetail
>;
