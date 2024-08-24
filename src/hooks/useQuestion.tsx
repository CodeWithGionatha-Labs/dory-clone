import { toast } from "@/components/ui/use-toast";
import { updateQuestionAction } from "@/lib/actions/update-question-action";
import { voteQuestionAction } from "@/lib/actions/vote-question-action";
import { QuestionDetail } from "@/lib/prisma/validators/question-validators";
import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";
import { Question } from "@prisma/client";
import debounce from "lodash.debounce";
import { useAction } from "next-safe-action/hooks";
import { useCallback, useEffect, useRef, useState } from "react";

export const useTogglePin = ({
  questionId,
  isPinned: initialIsPinned,
}: {
  questionId: Question["id"];
  isPinned: boolean;
}) => {
  const [isPinned, setIsPinned] = useState(initialIsPinned);

  const { execute, isExecuting } = useAction(updateQuestionAction, {
    onSuccess: () => console.log("success pin!"),
    onError: (error) => {
      console.error(error);

      toast({
        title: "Something went wrong",
        description: "Failed to pin the question!",
        variant: "destructive",
      });

      // revert the optimistic update
      setIsPinned((prevIsPinned) => !prevIsPinned);
    },
  });

  const togglePin = () => {
    // optimistic update (client)
    setIsPinned((prev) => !prev);

    execute({ questionId, isPinned: !isPinned });
  };

  return { isPinned, togglePin, isExecuting };
};

export const useToggleResolved = ({
  questionId,
  isResolved: initialIsResolved,
}: {
  questionId: Question["id"];
  isResolved: boolean;
}) => {
  const [isResolved, setIsResolved] = useState(initialIsResolved);

  const { execute, isExecuting } = useAction(updateQuestionAction, {
    onSuccess: () => console.log("success resolve!"),
    onError: (error) => {
      console.error(error);

      toast({
        title: "Something went wrong",
        description: "Failed to resolve the question!",
        variant: "destructive",
      });

      // revert the optimistic update
      setIsResolved((prevIsResolved) => !prevIsResolved);
    },
  });

  const toggleResolved = () => {
    // optimistic update (client)
    setIsResolved((prev) => !prev);

    execute({ questionId, isResolved: !isResolved });
  };

  return { isResolved, toggleResolved };
};

export const useVote = ({
  questionId,
  upvotes,
  totalVotes: initialTotalVotes,
}: {
  questionId: Question["id"];
  upvotes: QuestionDetail["upvotes"];
  totalVotes: number;
}) => {
  const { user } = useKindeBrowserClient();

  const [{ isUpvoted, totalVotes }, setClientState] = useState({
    isUpvoted: upvotes.some((upvote) => upvote.authorId === user?.id),
    totalVotes: initialTotalVotes,
  });

  const { execute } = useAction(voteQuestionAction, {
    onError: (error) => {
      console.error(error);

      // revert the optimistic update
      toggleClientVote();
    },
    onSuccess: () => console.log("success voting!"),
  });

  // to avoid stale client state
  useEffect(() => {
    setClientState((prev) => ({
      ...prev,
      isUpvoted: upvotes.some((upvote) => upvote.authorId === user?.id),
    }));
  }, [user, upvotes]);

  const toggleClientVote = () => {
    setClientState((prev) => ({
      isUpvoted: !prev.isUpvoted,
      totalVotes: prev.isUpvoted ? prev.totalVotes - 1 : prev.totalVotes + 1,
    }));
  };

  const handleVote = () => {
    // optimistic update (client)
    toggleClientVote();

    performVote();
  };

  const performVote = useCallback(
    debounce(
      () => {
        execute({ questionId });
      },
      1000,
      { leading: false, trailing: true }
    ),
    [questionId]
  );

  return { isUpvoted, totalVotes, handleVote };
};

export const useUpdateQuestionBody = ({
  questionId,
  body: initialBody,
}: {
  questionId: Question["id"];
  body: Question["body"];
}) => {
  const lastValidBody = useRef(initialBody);
  const [body, setBody] = useState(initialBody);

  const { execute, isExecuting } = useAction(updateQuestionAction, {
    onSuccess: ({ input }) => {
      console.log("success body update!");

      lastValidBody.current = input.body!;
    },
    onError: (error) => {
      console.error(error);

      toast({
        title: "Something went wrong",
        description: "Failed to update the question body!",
        variant: "destructive",
      });

      // revert the optimistic update
      setBody(lastValidBody.current);
    },
  });

  const updateBody = (newBody: string) => {
    // optimistic update (client)
    setBody(newBody);

    execute({ questionId, body: newBody });
  };

  return { body, updateBody, isExecuting };
};
