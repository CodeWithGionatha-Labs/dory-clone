"use server";

import routes from "@/config/routes";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { redirect } from "next/navigation";
import slugify from "slugify";
import { prisma } from "../prisma/client";
import { createEventSchema } from "../validations/event-schemas";
import { actionClient } from "./safe-action";

export const createEventAction = actionClient
  .schema(createEventSchema)
  .action(async ({ parsedInput: { title, shortDescription } }) => {
    const user = await getKindeServerSession().getUser();

    if (!user) {
      throw new Error("Not authenticated");
    }

    const eventSlug = slugify(title);

    await prisma.event.create({
      data: {
        displayName: title,
        shortDescription,
        slug: eventSlug,
        ownerId: user.id,
        // add the owner as the first participant of the event
        participants: {
          create: {
            userId: user.id,
          },
        },
      },
    });

    redirect(
      routes.event({
        eventSlug,
        ownerId: user.id,
      })
    );
  });
