"use client";

import { DeletePollDialog } from "@/components/dialogs/DeletePollDialog";
import { useIsParticipantView } from "@/hooks/useIsParticipantView";
import { PollDetail } from "@/lib/prisma/validators/poll-validators";
import { PropsWithClassName } from "@/lib/utils/ui-utils";
import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";
import { EllipsisVertical, Trash } from "lucide-react";
import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

type Props = PropsWithClassName<{
  poll: PollDetail;
}>;

export const PollOptionsMenu = ({ poll, className }: Props) => {
  const { user } = useKindeBrowserClient();

  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

  const isAdmin = poll.event.ownerId === user?.id;
  const isParticipantView = useIsParticipantView();

  if (isParticipantView || !isAdmin) {
    return null;
  }

  return (
    <>
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <button className={className}>
            <EllipsisVertical size={20} />
          </button>
        </DropdownMenuTrigger>

        <DropdownMenuContent className="p-2 space-y-1">
          <DropdownMenuItem
            onSelect={() => setOpenDeleteDialog(true)}
            className="text-sm text-destructive"
          >
            <Trash className="w-4 h-4 mr-2" />
            <span>Delete Poll</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Dialogs */}
      <DeletePollDialog
        pollId={poll.id}
        open={openDeleteDialog}
        onOpenChange={setOpenDeleteDialog}
        onSuccess={() => setOpenDeleteDialog(false)}
      />
    </>
  );
};
