import { deletePollAction } from "@/lib/actions/delete-poll-action";
import { cn } from "@/lib/utils/ui-utils";
import { Poll } from "@prisma/client";
import { AlertDialogProps } from "@radix-ui/react-alert-dialog";
import { useAction } from "next-safe-action/hooks";
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
import { toast } from "../ui/use-toast";

type Props = {
  pollId: Poll["id"];
  onSuccess?: () => void;
} & AlertDialogProps;

export const DeletePollDialog = ({
  pollId,
  onSuccess: handleSuccess,
  ...dialogProps
}: Props) => {
  const { execute, isExecuting } = useAction(deletePollAction, {
    onError: (err) => {
      console.error(err);

      toast({
        title: "Something went wrong.",
        description: "Failed to delete the poll.",
        variant: "destructive",
      });
    },
    onSuccess: () => {
      handleSuccess?.();

      toast({
        title: "Your poll has been deleted!",
        duration: 3000,
      });
    },
  });

  const handleDelete = (evt: React.MouseEvent) => {
    evt.preventDefault();

    execute({ pollId });
  };

  const isFieldDisabled = isExecuting;

  return (
    <AlertDialog {...dialogProps}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete your poll
            adn all its votes from the event.
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
            onClick={handleDelete}
            className={cn(buttonVariants({ variant: "destructive" }))}
          >
            {isExecuting ? "Deleting..." : "Continue"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
