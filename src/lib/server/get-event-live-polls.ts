import { Event, User } from "@prisma/client";
import { cache } from "react";
import "server-only";
import { prisma } from "../prisma/client";
import { pollDetail } from "../prisma/validators/poll-validators";

type Params = {
  ownerId: User["id"];
  eventSlug: Event["slug"];
};

export const getEventLivePolls = cache(
  async ({ eventSlug, ownerId }: Params) => {
    return await prisma.poll.findMany({
      where: {
        event: {
          ownerId,
          slug: eventSlug,
        },
        isLive: true,
      },
      ...pollDetail,
      orderBy: {
        createdAt: "desc",
      },
    });
  }
);
