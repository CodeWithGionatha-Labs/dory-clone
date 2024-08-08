"use client";

import { useIsParticipantView } from "@/hooks/useIsParticipantView";
import { EventDetail } from "@/lib/prisma/validators/event-validators";
import {
  RegisterLink,
  useKindeBrowserClient,
} from "@kinde-oss/kinde-auth-nextjs";
import debounce from "lodash.debounce";
import { Bookmark, BookmarkCheck } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { Button } from "../ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import { toast } from "../ui/use-toast";

type Props = {
  event: EventDetail;
};

export const BookmarkEventButton = ({ event }: Props) => {
  const { user } = useKindeBrowserClient();

  const isParticipantView = useIsParticipantView();

  const [isBookmarked, setIsBookmarked] = useState(false);

  useEffect(() => {
    setIsBookmarked(
      event.bookmarkedBy.some((bookmarkUser) => bookmarkUser.id === user?.id)
    );
  }, [event.bookmarkedBy, user?.id]);

  const handleBookmark = () => {
    // optimistic update
    toggleClientBookmark();

    performBookmark();
  };

  const toggleClientBookmark = () => {
    const wasBookmarked = isBookmarked;

    setIsBookmarked((prev) => !prev);

    toast({
      description: wasBookmarked
        ? "Event removed from bookmarks!"
        : "Event added to bookmarks!",
    });
  };

  const performBookmark = useCallback(
    debounce(
      () => {
        //TODO implement me
        console.log("bookmark performed!");
      },
      1000,
      { leading: false, trailing: true }
    ),
    [event.id]
  );

  if (isParticipantView) {
    return null;
  }

  if (!user) {
    return (
      <RegisterLink>
        <Button variant={"outline"} className="rounded-full">
          <Bookmark className="w-4 h-4" />
        </Button>
      </RegisterLink>
    );
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            onClick={handleBookmark}
            variant={"outline"}
            className="rounded-full"
          >
            {isBookmarked ? (
              <BookmarkCheck className="w-4 h-4" />
            ) : (
              <Bookmark className="w-4 h-4" />
            )}
          </Button>
        </TooltipTrigger>

        <TooltipContent className="bg-black text-white text-sm">
          {isBookmarked ? "Remove from bookmarks" : "Add to bookmarks"}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
