import { Event, Poll, User } from "@prisma/client";
import { cache } from "react";
import "server-only";
import { prisma } from "../prisma/client";
import { pollDetail } from "../prisma/validators/poll-validators";

type Params = {
  ownerId: User["id"];
  eventSlug: Event["slug"];
  cursor?: Poll["id"];
  filters?: {
    pollId?: Poll["id"];
  };
};

export const getEventClosedPolls = cache(
  async ({ ownerId, eventSlug, cursor, filters }: Params) => {
    return await prisma.poll.findMany({
      where: {
        event: {
          ownerId,
          slug: eventSlug,
        },
        isLive: false,
        ...(filters?.pollId ? { id: filters.pollId } : {}),
      },
      ...pollDetail,
      orderBy: {
        createdAt: "desc",
      },
      take: 10,
      skip: cursor ? 1 : 0,
      ...(cursor ? { cursor: { id: cursor } } : {}),
    });
  }
);
