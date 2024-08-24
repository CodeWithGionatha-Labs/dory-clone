"use client";

import { useIsParticipantView } from "@/hooks/useIsParticipantView";
import { useLivePoll } from "@/hooks/usePoll";
import { PollDetail } from "@/lib/prisma/validators/poll-validators";
import { getOptionVotesAsPercentage } from "@/lib/utils/poll-util";
import { cn, PropsWithClassName } from "@/lib/utils/ui-utils";
import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";
import { PollOption } from "@prisma/client";
import { Circle, CircleCheckBig, Dot, OctagonPause, Users } from "lucide-react";
import { useState } from "react";
import { ClosePollDialog } from "./dialogs/ClosePollDialog";
import { PollOptionsMenu } from "./menu/PollOptionsMenu";
import PollVotersTooltip from "./tooltips/PollVotersTooltip";
import { Button } from "./ui/button";

type Props = PropsWithClassName<{
  poll: PollDetail;
}>;

export const LivePoll = ({ poll: initialPoll, className }: Props) => {
  const { user } = useKindeBrowserClient();

  const [openCloseDialog, setOpenCloseDialog] = useState(false);

  const { poll, votedOptionIndex, voteOption } = useLivePoll({
    poll: initialPoll,
  });

  const { isLive, options } = poll;
  const totalVotes = poll._count.votes;
  const voters = poll.votes.map((voter) => voter.author);

  const isAdmin = poll.event.ownerId === user?.id;
  const isParticipantView = useIsParticipantView();

  const showEndButton = isAdmin && !isParticipantView;

  return (
    <>
      <div className={cn("border rounded-lg p-4", className)}>
        <div className="flex items-center gap-x-5">
          {/* Live badge */}
          <div className="inline-flex items-center px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
            <Dot className="w-4 h-4 animate-pulse fill-green-500" />
            <span className="font-medium">Live</span>
          </div>

          {/* End button */}
          {showEndButton && (
            <Button
              size="sm"
              variant="destructive"
              onClick={() => setOpenCloseDialog(true)}
            >
              <OctagonPause className="w-4 h-4 mr-2" />
              <span>End</span>
            </Button>
          )}

          {/* Voter avatars list */}
          <div className="inline-flex items-center gap-x-3 ml-auto">
            <PollVotersTooltip pollTotalVotes={totalVotes} voters={voters} />

            <PollOptionsMenu poll={poll} />
          </div>
        </div>

        {/* Poll body */}
        <p className="font-bold mt-4">{poll.body}</p>

        {/* Poll options */}
        <div role="list" className="space-y-3 mt-4">
          {options.map((option) => (
            <PollOptionItem
              key={option.id}
              option={option}
              isVoted={option.index === votedOptionIndex}
              totalPollVotes={totalVotes}
              isPollClosed={false}
              onVoteChange={() => voteOption(option.index)}
            />
          ))}
        </div>

        {/* Total votes */}
        <p className="text-slate-400 text-sm mt-5 ml-3">
          <Users className="inline-block mr-1" />
          {totalVotes} total votes
        </p>
      </div>

      {/* Dialogs */}
      <ClosePollDialog
        pollId={poll.id}
        open={openCloseDialog}
        onOpenChange={setOpenCloseDialog}
        onSuccess={() => setOpenCloseDialog(false)}
      />
    </>
  );
};

export const ClosedPoll = ({ poll, className }: Props) => {
  const { user } = useKindeBrowserClient();

  const { options } = poll;

  const totalVotes = poll._count.votes;
  const voters = poll.votes.map((vote) => vote.author);

  const votedOptionIndex = poll.options.find((option) =>
    option.votes.some((vote) => vote.authorId === user?.id)
  )?.index;

  return (
    <div className={cn("border rounded-lg p-4", className)}>
      <div className="flex items-center gap-x-5">
        {/* Closed badge */}
        <span className="ml-2 px-3 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
          Closed
        </span>

        {/* Voter avatars list */}
        <div className="inline-flex items-center gap-x-3 ml-auto">
          <PollVotersTooltip pollTotalVotes={totalVotes} voters={voters} />

          <PollOptionsMenu poll={poll} />
        </div>
      </div>

      {/* Poll body */}
      <p className="font-bold mt-4">{poll.body}</p>

      {/* Poll options */}
      <div role="list" className="space-y-3 mt-4">
        {options.map((option) => (
          <PollOptionItem
            key={option.id}
            option={option}
            isVoted={option.index === votedOptionIndex}
            totalPollVotes={totalVotes}
            isPollClosed={true}
          />
        ))}
      </div>

      {/* Total votes */}
      <p className="text-slate-400 text-sm mt-5 ml-3">
        <Users className="inline-block mr-1" />
        {totalVotes} total votes
      </p>
    </div>
  );
};

const PollOptionItem = ({
  option,
  totalPollVotes,
  isVoted,
  isPollClosed,
  onVoteChange: handleVoteChange,
}: {
  option: PollDetail["options"][number];
  isVoted: boolean;
  totalPollVotes: number;
  isPollClosed: boolean;
  onVoteChange?: (optionId: PollOption["id"]) => void;
}) => {
  const percentage = getOptionVotesAsPercentage({
    optionVotes: option._count.votes,
    totalVotes: totalPollVotes,
  });

  return (
    <button
      role="listitem"
      onClick={() => handleVoteChange?.(option.id)}
      disabled={isPollClosed}
      className={cn(
        "relative text-sm flex w-full justify-between border p-4 rounded-sm disabled:cursor-not-allowed disabled:opacity-70",
        isVoted && "ring-blue-300 ring-2 ring-opacity-80"
      )}
    >
      <div className="inline-flex items-center gap-x-2">
        {isVoted ? (
          <CircleCheckBig className="stroke-blue-700" size={20} />
        ) : (
          <Circle className="stroke-gray-500" size={20} />
        )}
        <p className="font-medium">{option.body}</p>
      </div>

      <p>{option._count.votes} votes</p>

      {/* Overlay of the amount of votes */}
      <div
        aria-hidden
        className="absolute inset-0 bg-blue-300/30 rounded-sm transition-all duration-300"
        style={{ width: `${percentage}%` }}
      />
    </button>
  );
};
