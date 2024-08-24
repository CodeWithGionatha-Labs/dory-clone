import "server-only";

import { Event, Question, User } from "@prisma/client";
import { cache } from "react";
import { prisma } from "../prisma/client";
import {
  questionDetail,
  questionsOrderBy,
} from "../prisma/validators/question-validators";
import { QuestionsOrderBy } from "../utils/question-utils";

type Params = {
  ownerId: User["id"];
  eventSlug: Event["slug"];
  orderBy?: QuestionsOrderBy;
  cursor?: Question["id"];
  filters?: {
    questionId?: Question["id"];
  };
};

export const getEventResolvedQuestions = cache(
  async ({
    ownerId,
    eventSlug,
    orderBy = "most-popular",
    cursor,
    filters,
  }: Params) => {
    return await prisma.question.findMany({
      where: {
        event: {
          ownerId,
          slug: eventSlug,
        },
        isResolved: true,
        ...(filters?.questionId ? { id: filters.questionId } : {}),
      },
      ...questionDetail,
      orderBy: [{ isPinned: "desc" }, { ...questionsOrderBy(orderBy) }],
      take: 10,
      skip: cursor ? 1 : 0,
      ...(cursor ? { cursor: { id: cursor } } : {}),
    });
  }
);
