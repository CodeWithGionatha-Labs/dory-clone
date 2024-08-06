import "server-only";

import { User } from "@prisma/client";
import { prisma } from "../prisma/client";

export const getUserInfo = async (userId: User["id"]) => {
  return prisma.user.findUnique({
    where: { id: userId },
    include: {
      _count: {
        select: {
          events: true,
          questions: true,
          participations: true,
          bookmarks: true,
        },
      },
    },
  });
};
