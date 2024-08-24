"use client";

import {
  useTogglePin,
  useToggleResolved,
  useUpdateQuestionBody,
} from "@/hooks/useQuestion";
import { QuestionDetail } from "@/lib/prisma/validators/question-validators";
import { defaultDateFormatter } from "@/lib/utils/date-utils";
import { cn } from "@/lib/utils/ui-utils";
import { question as questionValidator } from "@/lib/validations/constants";
import { questionBodySchema } from "@/lib/validations/question-schemas";
import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";
import { CheckCircle, Pin } from "lucide-react";
import { useRef, useState } from "react";
import { QuestionVoteButton } from "./buttons/QuestionVoteButton";
import { QuestionOptionsMenu } from "./menu/QuestionOptionsMenu";
import { TextAreaWithCounter } from "./TextAreaWithCounter";
import { Button } from "./ui/button";
import { UserAvatar } from "./UserAvatar";

type Props = {
  question: QuestionDetail;
};

export const Question = ({ question }: Props) => {
  const { user } = useKindeBrowserClient();

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [isEditing, setIsEditing] = useState(false);

  const { author, createdAt } = question;
  const isAuthor = author.id === user?.id;
  const isAdmin = question.event.ownerId === user?.id;

  const { isPinned, togglePin } = useTogglePin({
    questionId: question.id,
    isPinned: question.isPinned,
  });

  const { isResolved, toggleResolved } = useToggleResolved({
    questionId: question.id,
    isResolved: question.isResolved,
  });

  const {
    body,
    updateBody,
    isExecuting: isUpdatingBody,
  } = useUpdateQuestionBody({
    questionId: question.id,
    body: question.body,
  });

  const handleBodyChange = () => {
    const rawBodyValue = textareaRef.current?.value;

    const parsedBody = questionBodySchema.safeParse(rawBodyValue);

    if (parsedBody.success) {
      const newBody = parsedBody.data;

      setIsEditing(false);

      updateBody(newBody);
    }
  };

  return (
    <div
      className={cn(
        "border rounded-xl drop-shadow-md bg-white p-4 lg:p-6",
        isResolved && "border-green-400 bg-green-50"
      )}
    >
      <div className="flex items-center gap-x-5">
        {/* Vote button */}
        {!isEditing && (
          <QuestionVoteButton
            ownerId={question.event.ownerId}
            eventSlug={question.event.slug}
            upvotes={question.upvotes}
            questionId={question.id}
            totalVotes={question._count.upvotes}
            isResolved={isResolved}
          />
        )}

        <div className="flex-1 grow-1">
          {/* Header */}
          <div className="flex items-center gap-x-2">
            <span className="inline-flex items-center gap-x-2">
              <UserAvatar
                className="w-5 h-5"
                displayName={author.displayName}
                color={author.color}
              />
              <span className="text-sm text-slate-600">
                {author.displayName}
              </span>
            </span>

            <time className="text-slate-400  text-xs">
              {defaultDateFormatter.format(createdAt)}
            </time>

            {isPinned && (
              <Pin
                size={20}
                className="inline-block ml-2 fill-yellow-300 -rotate-45"
              />
            )}

            {isResolved && (
              <CheckCircle className="stroke-green-500" size={20} />
            )}

            {!isResolved && (
              <QuestionOptionsMenu
                questionId={question.id}
                isEditing={isEditing}
                isAdmin={isAdmin}
                isAuthor={isAuthor}
                isPinned={isPinned}
                isResolved={isResolved}
                toggleEditingMode={() => setIsEditing(true)}
                onPinChange={togglePin}
                onResolveChange={toggleResolved}
                className="text-slate-600 ml-auto"
              />
            )}
          </div>

          {/* Question body or editor */}
          {!isEditing && (
            <p className="mt-5 ml-3 whitespace-pre-wrap text-sm">{body}</p>
          )}

          {isEditing && (
            <form
              onSubmit={(evt) => {
                evt.preventDefault();

                handleBodyChange();
              }}
            >
              <TextAreaWithCounter
                ref={textareaRef}
                className="mt-3 min-h-24"
                defaultValue={body}
                maxLength={questionValidator.maxLength}
                autoFocus
              />

              <div className="flex gap-x-2 -mt-2 justify-end">
                <Button onClick={() => setIsEditing(false)} variant={"ghost"}>
                  Cancel
                </Button>

                <Button disabled={isUpdatingBody} type="submit">
                  Save
                </Button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
