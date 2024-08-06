import "server-only";

import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { Event } from "@prisma/client";
import { cache } from "react";
import { prisma } from "../prisma/client";
import { eventDetail } from "../prisma/validators/event-validators";

type Params = {
  cursor?: Event["id"];
};

export const getUserBookmarkedEvents = cache(
  async ({ cursor }: Params = {}) => {
    const user = await getKindeServerSession().getUser();

    if (!user || !user.id) {
      throw new Error("Not authenticated!");
    }

    const userWithBookmarks = await prisma.user.findUnique({
      where: { id: user.id },
      select: {
        bookmarks: {
          ...eventDetail,
          orderBy: {
            createdAt: "desc",
          },
          take: 20,
          skip: cursor ? 1 : 0,
          ...(cursor ? { cursor: { id: cursor } } : {}),
        },
      },
    });

    if (!userWithBookmarks) {
      throw new Error("User not found!");
    }

    return userWithBookmarks.bookmarks;
  }
);
