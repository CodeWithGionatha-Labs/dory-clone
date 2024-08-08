import { Prisma } from "@prisma/client";

export const pollDetail = Prisma.validator<Prisma.PollDefaultArgs>()({
  include: {
    event: {
      select: {
        id: true,
        slug: true,
        ownerId: true,
      },
    },
    options: {
      select: {
        id: true,
        index: true,
        body: true,
        votes: true,
        _count: {
          select: {
            votes: true,
          },
        },
      },
      orderBy: {
        index: "asc",
      },
    },
    votes: {
      select: {
        author: {
          select: {
            id: true,
            color: true,
            displayName: true,
          },
        },
      },
    },
    _count: {
      select: {
        votes: true,
      },
    },
  },
});

export type PollDetail = Prisma.PollGetPayload<typeof pollDetail>;
