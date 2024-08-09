"use server";

import { z } from "zod";
import { getEventOpenQuestions } from "../server/get-event-open-questions";
import { eventPublicIdSchema } from "../validations/event-schemas";
import {
  questionIdSchema,
  questionOrderBySchema,
} from "../validations/question-schemas";
import { actionClient } from "./safe-action";

export const getEventOpenQuestionsAction = actionClient
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
      parsedInput: { cursor, ownerId, eventSlug, orderBy, questionId },
    }) =>
      getEventOpenQuestions({
        ownerId,
        eventSlug,
        orderBy,
        cursor,
        ...(questionId ? { filters: { questionId } } : {}),
      })
  );
