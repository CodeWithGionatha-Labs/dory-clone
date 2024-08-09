"use server";

import routes from "@/config/routes";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { revalidatePath } from "next/cache";
import { prisma } from "../prisma/client";
import { updateEventSchema } from "../validations/event-schemas";
import { actionClient } from "./safe-action";

export const updateEventAction = actionClient
  .schema(updateEventSchema)
  .action(async ({ parsedInput: { eventId, shortDescription } }) => {
    const user = await getKindeServerSession().getUser();

    if (!user) {
      throw new Error("Not authenticated");
    }

    const event = await prisma.event.findUnique({
      where: { id: eventId },
      select: {
        ownerId: true,
        slug: true,
      },
    });

    if (!event) {
      throw new Error("Event not found!");
    }

    // check the permission
    if (event.ownerId !== user.id) {
      throw new Error("Not authorized!");
    }

    // proceed to update the event
    await prisma.event.update({
      where: {
        id: eventId,
      },
      data: {
        shortDescription,
      },
    });

    revalidatePath(
      routes.event({
        ownerId: event.ownerId,
        eventSlug: event.slug,
      })
    );
  });
