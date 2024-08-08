"use server";

import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { prisma } from "../prisma/client";
import { votePollOptionSchema } from "../validations/poll-schemas";
import { actionClient } from "./safe-action";

export const votePollOptionAction = actionClient
  .schema(votePollOptionSchema)
  .action(async ({ parsedInput: { pollId, optionIndex } }) => {
    const user = await getKindeServerSession().getUser();

    if (!user) {
      throw new Error("Not authenticated!");
    }

    // find poll
    const poll = await prisma.poll.findUnique({
      where: { id: pollId },
      include: {
        options: true,
        event: {
          select: {
            slug: true,
            ownerId: true,
          },
        },
        votes: {
          where: { authorId: user.id },
        },
      },
    });

    if (!poll) {
      throw new Error("Poll not found!");
    }

    // a poll which is not live cannot be voted anymore
    if (!poll.isLive) {
      return;
    }

    const previousUserVote = poll.votes.find(
      (vote) => vote.authorId === user.id
    );

    // we're trying to vote the same option twice
    if (previousUserVote?.pollOptionId === poll.options[optionIndex].id) {
      return;
    }

    if (previousUserVote) {
      await prisma.$transaction([
        // delete the previous vote
        prisma.pollVote.delete({
          where: {
            authorId_pollId: {
              pollId,
              authorId: user.id,
            },
          },
        }),
        // create the new vote
        prisma.pollVote.create({
          data: {
            authorId: user.id,
            pollId,
            pollOptionId: poll.options[optionIndex].id,
          },
        }),
      ]);

      return true;
    }

    // first time the user is voting, just create a new vote and add as participants if needed
    await prisma.$transaction([
      // create vote
      prisma.pollVote.create({
        data: {
          authorId: user.id,
          pollId,
          pollOptionId: poll.options[optionIndex].id,
        },
      }),
      // add the user as participant if it isn't already
      prisma.eventParticipant.upsert({
        where: {
          eventId_userId: {
            eventId: poll.eventId,
            userId: user.id,
          },
        },
        update: {},
        create: {
          eventId: poll.eventId,
          userId: user.id,
        },
      }),
    ]);

    return true;
  });
