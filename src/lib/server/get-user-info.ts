import "server-only";

import { User } from "@prisma/client";
import { prisma } from "../prisma/client";

export const getUserInfo = async (userId: User["id"]) => {
  return prisma.user.findUnique({
    where: { id: userId },
  });
};
