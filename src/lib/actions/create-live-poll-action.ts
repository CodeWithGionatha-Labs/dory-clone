"use server";

import routes from "@/config/routes";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { revalidatePath } from "next/cache";
import { prisma } from "../prisma/client";
import { createLivePollSchema } from "../validations/poll-schemas";
import { actionClient, CustomError } from "./safe-action";

export const createLivePollAction = actionClient
  .schema(createLivePollSchema)
  .action(async ({ parsedInput: { body, eventId, options } }) => {
    const user = await getKindeServerSession().getUser();

    if (!user) {
      throw new Error("Not authenticated");
    }

    // find the event
    const event = await prisma.event.findUnique({
      where: { id: eventId },
      select: {
        ownerId: true,
        slug: true,
        _count: {
          select: {
            polls: {
              where: { isLive: true },
            },
          },
        },
      },
    });

    if (!event) {
      throw new CustomError("Event not found!");
    }

    // only the event owner can create a new poll
    if (event.ownerId !== user.id) {
      throw new CustomError(
        "You do not have the permission to create a poll for this event."
      );
    }

    // only one live poll is allowed per event
    if (event._count.polls > 0) {
      throw new CustomError(
        "There is already a live poll active for this event."
      );
    }

    // create the poll
    await prisma.poll.create({
      data: {
        body,
        isLive: true,
        event: {
          connect: {
            id: eventId,
          },
        },
        options: {
          createMany: {
            data: options.map((option, index) => ({
              body: option,
              index,
            })),
          },
        },
      },
    });

    revalidatePath(
      routes.eventPolls({
        eventSlug: event.slug,
        ownerId: event.ownerId,
      })
    );
  });
