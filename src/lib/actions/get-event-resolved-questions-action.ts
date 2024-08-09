"use server";

import { z } from "zod";
import { getEventResolvedQuestions } from "../server/get-event-resolved-questions";
import { eventPublicIdSchema } from "../validations/event-schemas";
import {
  questionIdSchema,
  questionOrderBySchema,
} from "../validations/question-schemas";
import { actionClient } from "./safe-action";

export const getEventResolvedQuestionsAction = actionClient
  .schema(
    z
      .object({
        cursor: questionIdSchema.optional(),
        orderBy: questionOrderBySchema.optional(),
        questionId: questionIdSchema.optional(),
      })
      .merge(eventPublicIdSchema)
  )
  .action(
    async ({
      parsedInput: { eventSlug, ownerId, cursor, orderBy, questionId },
    }) =>
      getEventResolvedQuestions({
        ownerId,
        eventSlug,
        cursor,
        orderBy,
        ...(questionId ? { filters: { questionId } } : {}),
      })
  );
