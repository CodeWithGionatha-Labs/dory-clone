import { PropsWithClassName } from "@/lib/utils/ui-utils";
import { User } from "@prisma/client";
import { Avatar, AvatarFallback } from "../ui/avatar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import { UserAvatar } from "../UserAvatar";

type Props = PropsWithClassName<{
  voters: Pick<User, "displayName" | "color">[];
  pollTotalVotes: number;
}>;

const PollVotersTooltip = ({ voters, pollTotalVotes, className }: Props) => {
  const votersToDisplay = voters.slice(0, 5);

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger className={className}>
          <div className="flex -space-x-4">
            {votersToDisplay.map((voter, index) => (
              <UserAvatar
                key={index}
                displayName={voter.displayName}
                color={voter.color}
                className="w-8 h-8 ring-2 ring-white"
              />
            ))}

            {voters.length > 5 && (
              <Avatar className="w-8 h-8 ring-2 ring-white">
                <AvatarFallback className="text-black text-sm bg-gray-200">
                  +{voters.length - 5}
                </AvatarFallback>
              </Avatar>
            )}
          </div>
        </TooltipTrigger>

        <TooltipContent className="bg-black text-white text-sm">
          {pollTotalVotes} participants have voted this poll!
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default PollVotersTooltip;
