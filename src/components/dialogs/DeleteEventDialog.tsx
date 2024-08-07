import { cn } from "@/lib/utils/ui-utils";
import { Event } from "@prisma/client";
import { AlertDialogProps } from "@radix-ui/react-alert-dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../ui/alert-dialog";
import { buttonVariants } from "../ui/button";

type Props = {
  eventId: Event["id"];
} & AlertDialogProps;

export const DeleteEventDialog = ({ eventId, ...dialogProps }: Props) => {
  // TODO
  const isFieldDisabled = false;

  return (
    <AlertDialog {...dialogProps}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete all your
            event&apos;s questions and polls and related data.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel
            disabled={isFieldDisabled}
            className={cn(buttonVariants({ variant: "ghost" }))}
          >
            Cancel
          </AlertDialogCancel>

          {/* TODO */}
          <AlertDialogAction
            disabled={isFieldDisabled}
            onClick={undefined} //TODO
            className={cn(buttonVariants({ variant: "destructive" }))}
          >
            Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
