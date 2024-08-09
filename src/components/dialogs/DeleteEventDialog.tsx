import { deleteEventAction } from "@/lib/actions/delete-event-action";
import { cn } from "@/lib/utils/ui-utils";
import { Event } from "@prisma/client";
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
  eventId: Event["id"];
  onSuccess?: () => void;
} & AlertDialogProps;

export const DeleteEventDialog = ({
  eventId,
  onSuccess: handleSuccess,
  ...dialogProps
}: Props) => {
  const { execute, isExecuting } = useAction(deleteEventAction, {
    onError: (e) => {
      console.error(e);

      toast({
        title: "Something went wrong.",
        description: "Failed to delete the event.",
        variant: "destructive",
      });
    },
    onSuccess: () => {
      handleSuccess?.();

      toast({
        title: "Your event has been deleted!",
        duration: 3000,
      });
    },
  });

  const handleDelete = (evt: React.MouseEvent) => {
    evt.preventDefault();

    execute({ eventId });
  };

  const isFieldDisabled = isExecuting;

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

          <AlertDialogAction
            disabled={isFieldDisabled}
            onClick={handleDelete}
            className={cn(buttonVariants({ variant: "destructive" }))}
          >
            {isExecuting ? "Deleting..." : "Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
