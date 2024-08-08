"use client";

import { QuestionDetail } from "@/lib/prisma/validators/question-validator";
import { QuestionsOrderBy } from "@/lib/utils/question-utils";
import { cn, PropsWithClassName } from "@/lib/utils/ui-utils";
import { Event, User } from "@prisma/client";
import { useState } from "react";
import { NoContent } from "./Illustrations";
import { Question } from "./Question";
import { CreateQuestionForm } from "./forms/CreateQuestionForm";

type Props = PropsWithClassName<{
  initialQuestions: QuestionDetail[];
  ownerId: User["id"];
  eventSlug: Event["slug"];
  orderBy: QuestionsOrderBy;
  questionId?: QuestionDetail["id"];
}>;

export const OpenQuestionsList = ({
  initialQuestions,
  ownerId,
  eventSlug,
  orderBy,
  className,
  questionId,
}: Props) => {
  const [questions, setQuestions] = useState(initialQuestions);

  // TODO infinite scrolling

  const hasFilters = !!questionId;

  return (
    <div className={cn("space-y-8 pb-10", className)}>
      {!hasFilters && (
        <CreateQuestionForm
          key={Date.now()}
          ownerId={ownerId}
          eventSlug={eventSlug}
          onSuccess={(newQuestion) => setQuestions([newQuestion, ...questions])}
        />
      )}

      {questions.length === 0 ? (
        <NoContent>
          <span className="tracking-tight font-light mt-3">
            No questions has been asked yet.
          </span>
        </NoContent>
      ) : (
        questions.map((question) => (
          <Question key={question.id} question={question} />
        ))
      )}
    </div>
  );
};

export const ResolvedQuestionsList = ({
  initialQuestions,
  ownerId,
  eventSlug,
  orderBy,
  className,
  questionId,
}: Props) => {
  // TODO infinite scrolling

  return (
    <div className={cn("space-y-8 pb-10", className)}>
      {initialQuestions.length === 0 ? (
        <NoContent>
          <span className="tracking-tight font-light mt-3">
            No questions has been resolved yet.
          </span>
        </NoContent>
      ) : (
        initialQuestions.map((question) => (
          <Question key={question.id} question={question} />
        ))
      )}
    </div>
  );
};
