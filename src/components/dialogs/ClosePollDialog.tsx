import { cn } from "@/lib/utils/ui-utils";
import { Poll } from "@prisma/client";
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
  pollId: Poll["id"];
  onSuccess?: () => void;
} & AlertDialogProps;

export const ClosePollDialog = ({
  pollId,
  onSuccess: handleSuccess,
  ...dialogProps
}: Props) => {
  // TODO implement server action
  const isExecuting = false;
  const isFieldDisabled = isExecuting;

  const handleClose = (evt: React.MouseEvent) => {
    evt.preventDefault();

    // TODO implement server action
  };

  return (
    <AlertDialog {...dialogProps}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. The poll cannot be reopened
            afterwards.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel
            disabled={isFieldDisabled}
            className={cn(buttonVariants({ variant: "ghost" }))}
          >
            Cancel
          </AlertDialogCancel>

          <AlertDialogAction
            disabled={isFieldDisabled}
            onClick={handleClose}
            className={cn(buttonVariants({ variant: "destructive" }))}
          >
            {isExecuting ? "Closing..." : "Close"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
