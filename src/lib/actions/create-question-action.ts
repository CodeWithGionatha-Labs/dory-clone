"use server";

import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { prisma } from "../prisma/client";
import { questionDetail } from "../prisma/validators/question-validators";
import { createQuestionSchema } from "../validations/question-schemas";
import { actionClient } from "./safe-action";

export const createQuestionAction = actionClient
  .schema(createQuestionSchema)
  .action(async ({ parsedInput: { body, ownerId, eventSlug } }) => {
    const user = await getKindeServerSession().getUser();

    if (!user) {
      throw new Error("Not authenticated!");
    }

    // find the event
    const event = await prisma.event.findUnique({
      where: {
        slug_ownerId: {
          ownerId,
          slug: eventSlug,
        },
      },
    });

    if (!event) {
      throw new Error("Event not found!");
    }

    // create the question & add the author as a participant to the event
    // if it's not already in
    const [newQuestion] = await prisma.$transaction([
      // create question
      prisma.question.create({
        data: {
          body,
          authorId: user.id,
          eventId: event.id,
          // send a notification to the event owner, to notify him about a new question
          ...(event.ownerId !== user.id
            ? {
                notifications: {
                  create: {
                    type: "NEW_QUESTION",
                    userId: event.ownerId,
                    eventId: event.id,
                  },
                },
              }
            : {}),
        },
        ...questionDetail,
      }),
      // add user as participant, only if it is not already in
      prisma.eventParticipant.upsert({
        where: {
          eventId_userId: {
            eventId: event.id,
            userId: user.id,
          },
        },
        create: {
          eventId: event.id,
          userId: user.id,
        },
        update: {},
      }),
    ]);

    return newQuestion;
  });
