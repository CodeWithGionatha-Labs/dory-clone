import { Prisma } from "@prisma/client";

export const eventDetail = Prisma.validator<Prisma.EventDefaultArgs>()({
  include: {
    owner: {
      select: {
        id: true,
        displayName: true,
        color: true,
      },
    },
    bookmarkedBy: true,
    _count: {
      select: {
        polls: true,
        questions: true,
        participants: true,
      },
    },
  },
});

export type EventDetail = Prisma.EventGetPayload<typeof eventDetail>;
