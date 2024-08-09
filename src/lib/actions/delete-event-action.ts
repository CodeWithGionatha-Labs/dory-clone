"use server";

import routes from "@/config/routes";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { redirect } from "next/navigation";
import { prisma } from "../prisma/client";
import { deleteEventSchema } from "../validations/event-schemas";
import { actionClient } from "./safe-action";

export const deleteEventAction = actionClient
  .schema(deleteEventSchema)
  .action(async ({ parsedInput: { eventId } }) => {
    const user = await getKindeServerSession().getUser();

    if (!user) {
      throw new Error("Not authenticated");
    }

    const event = await prisma.event.findUnique({
      where: { id: eventId },
      select: {
        ownerId: true,
      },
    });

    if (!event) {
      throw new Error("Event not found!");
    }

    // check the permission
    if (event.ownerId !== user.id) {
      throw new Error("Not authorized!");
    }

    // proceed to delete
    await prisma.event.delete({
      where: {
        id: eventId,
      },
    });

    redirect(routes.dashboard);
  });
